import {
	ICryptoClient,
	ICryptoOptions,
	ICryptoRequest,
	ICryptoResponse,
	domainKeys,
	setError,
} from '../../domain';
import { CipherCCMTypes } from 'crypto';

export class ServiceCrypto {
	#client: ICryptoClient;

	#cryptoOptions: ICryptoOptions;

	constructor(client: ICryptoClient, options?: ICryptoOptions) {
		this.#client = client;

		this.#cryptoOptions = {
			aad: Buffer.from(process.env.CRYPTO_aad || '', 'hex'),
			digestType: 'base64',
			encode: 'utf-8',
			hashType: 'sha256',
			key: { hash: 'x', valor: process.env.CRYPTO_key },
			mode: 'aes-256-ccm',
			tag: new Int32Array(client.random(domainKeys.core.crypto.defaultBytes)),
			texto: Buffer.from('x', 'utf-8'),
			vector: {
				hash: 'x',
				size: 0,
			},
			...options,
		};
	}

	#getModeInfo(): void {
		const mymode = this.#client
			.getCiphers()
			.find((modo) => modo === this.#cryptoOptions.mode) as CipherCCMTypes;
		this.#cryptoOptions.mode = mymode;
		this.#cryptoOptions.modeInfo = this.#client.getInfo(
			this.#cryptoOptions.mode
		);
	}

	#setSize(): void {
		if (this.#cryptoOptions.modeInfo) {
			this.#cryptoOptions.key.size = this.#cryptoOptions.modeInfo.keyLength;
			this.#cryptoOptions.vector.size = this.#cryptoOptions.modeInfo.ivLength;
		}
	}

	#setVector(): void {
		const vectorsize = this.#cryptoOptions.vector.size || 0;
		this.#cryptoOptions.vector.valor =
			this.#cryptoOptions.vector.valor || this.#client.random(vectorsize);
	}

	#setCryptoCredentials(attr: keyof ICryptoOptions): void {
		if (attr === 'key' || attr === 'vector') {
			const hash = this.#client
				.hash(this.#cryptoOptions.hashType)
				.update(String(this.#cryptoOptions[attr].valor))
				.digest(this.#cryptoOptions.digestType)
				.substring(0, this.#cryptoOptions[attr].size);
			this.#setHash(attr, hash);
		}
	}

	#setHash(attr: keyof ICryptoOptions = 'key', value = ''): void {
		if (attr === 'key' || attr === 'vector') {
			this.#cryptoOptions[attr].hash = value;
		}
	}

	#setupCrypto(decrypt = false, cryptoReq?: ICryptoRequest): void {
		if (decrypt && cryptoReq) {
			this.#cryptoOptions.vector.valor = cryptoReq.vector;
			this.#cryptoOptions.texto = cryptoReq.texto;
			this.#cryptoOptions.tag = cryptoReq.tag;
		}

		this.#getModeInfo();
		this.#setSize();
		this.#setVector();

		this.#setCryptoCredentials('key');
		this.#setCryptoCredentials('vector');
	}

	encrypt(texto: Buffer): string {
		try {
			if (typeof texto !== 'string') {
				texto = Buffer.from(JSON.stringify(texto));
			}

			this.#cryptoOptions.texto = texto;
			this.#setupCrypto();
			const cipher = this.#client.encrypt(
				this.#cryptoOptions.mode,
				this.#cryptoOptions.key.hash,
				this.#cryptoOptions.vector.hash,
				{
					authTagLength: domainKeys.core.crypto.defaultAuthTagLength,
				}
			);

			cipher.setAAD(this.#cryptoOptions.aad, {
				plaintextLength: Buffer.byteLength(this.#cryptoOptions.texto),
			});

			const encrypted = cipher.update(
				this.#cryptoOptions.texto.toString('utf-8'),
				this.#cryptoOptions.encode
			);
			cipher.final(this.#cryptoOptions.digestType);

			const tag = cipher.getAuthTag();

			const enc: ICryptoResponse = {
				x0x1: encrypted.toString('base64'),
				x0x2: tag.toString('base64'),
				x0x3: this.#cryptoOptions.vector.valor?.toString('base64'),
			};

			return Buffer.from(JSON.stringify(enc), 'utf-8').toString('base64');
		} catch (err) {
			/* Const enc: ICryptoResponse = {
			   	x0x1: err as string,
			   	x0x2: 'error al encriptar',
			   	x0x3: 'undefined',
			   }; */

			// Console.error('ERROR al encriptar', err);

			// Return Buffer.from(JSON.stringify(enc), 'utf-8').toString('base64');

			console.error('ERROR al encriptar', err);
			throw setError({
				detail: err,
				errType: 'nocatch',
				text: 'error al encriptar',
			});
		}
	}

	decrypt(encrypted: string): string {
		try {
			const infoEncripted: ICryptoResponse = JSON.parse(
				Buffer.from(encrypted, 'base64').toString('utf8')
			);

			if (!infoEncripted.x0x1 || !infoEncripted.x0x2 || !infoEncripted.x0x3) {
				throw new Error(domainKeys.errores.params.text);
			}

			const cryptoReq: ICryptoRequest = {
				tag: Buffer.from(infoEncripted.x0x2, 'base64'),
				texto: Buffer.from(infoEncripted.x0x1, 'base64'),
				vector: Buffer.from(infoEncripted.x0x3, 'base64'),
			};

			this.#setupCrypto(true, cryptoReq);
			const decipher = this.#client.decrypt(
				this.#cryptoOptions.mode,
				this.#cryptoOptions.key.hash,
				this.#cryptoOptions.vector.hash,
				{
					authTagLength: domainKeys.core.crypto.defaultAuthTagLength,
				}
			);

			decipher.setAAD(this.#cryptoOptions.aad, {
				plaintextLength: Buffer.byteLength(this.#cryptoOptions.texto),
			});

			decipher.setAuthTag(this.#cryptoOptions.tag);

			let decrypted = decipher.update(
				this.#cryptoOptions.texto,
				// eslint-disable-next-line no-undefined
				undefined,
				this.#cryptoOptions.encode
			);
			decrypted += decipher.final(this.#cryptoOptions.encode);

			return decrypted;
		} catch (err) {
			console.error('ERROR al desencriptar', err);
			// Return 'error';
			throw setError({
				detail: err,
				errType: 'nocatch',
				text: 'error al desencriptar',
			});
		}
	}
}
