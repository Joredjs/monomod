import {
	CipherCCM,
	CipherCCMTypes,
	DecipherCCM,
	createCipheriv,
	createDecipheriv,
	createHash,
	getCipherInfo,
	getCiphers,
	randomBytes,
} from 'crypto';
import {
	ICryptoOptions,
	ICryptoRequest,
	ICryptoResponse,
	domainKeys,
} from '@nxms/core-main/domain';

export class AppServiceCrypto {
	private cryptoOptions: ICryptoOptions = {
		aad: Buffer.from(process.env.CRYPTO_aad || '', 'hex'),
		digestType: 'base64',
		encode: 'utf-8',
		hashType: 'sha256',
		key: { hash: 'x', valor: process.env.CRYPTO_key },
		mode: 'aes-256-ccm',
		tag: new Int32Array(randomBytes(domainKeys.core.crypto.defaultBytes)),
		texto: Buffer.from('x', 'utf-8'),
		vector: {
			hash: 'x',
			size: 0,
		},
	};

	constructor(options?: ICryptoOptions) {
		if (options) {
			this.cryptoOptions = options;
		}
	}

	private getModeInfo() {
		const mymode = getCiphers().filter(
			(modo) => modo === this.cryptoOptions.mode
		)[0] as CipherCCMTypes;
		this.cryptoOptions.mode = mymode;
		this.cryptoOptions.modeInfo = getCipherInfo(this.cryptoOptions.mode);
	}

	private setSize() {
		if (this.cryptoOptions.modeInfo) {
			this.cryptoOptions.key.size = this.cryptoOptions.modeInfo.keyLength;
			this.cryptoOptions.vector.size = this.cryptoOptions.modeInfo.ivLength;
		}
	}

	private setVector() {
		const vectorsize = this.cryptoOptions.vector.size || 0;
		this.cryptoOptions.vector.valor =
			this.cryptoOptions.vector.valor || randomBytes(vectorsize);
	}

	private setCryptoCredentials(attr: keyof ICryptoOptions) {
		if (attr === 'key' || attr === 'vector') {
			const hash = createHash(this.cryptoOptions.hashType)
				.update(String(this.cryptoOptions[attr].valor))
				.digest(this.cryptoOptions.digestType)
				.substring(0, this.cryptoOptions[attr].size);
			this.setHash(attr, hash);
		}
	}

	private setHash(attr: keyof ICryptoOptions = 'key', value = '') {
		if (attr === 'key' || attr === 'vector') {
			this.cryptoOptions[attr].hash = value;
		}
	}

	private setupCrypto(decrypt = false, cryptoReq?: ICryptoRequest) {
		if (decrypt && cryptoReq) {
			this.cryptoOptions.vector.valor = cryptoReq.vector;
			this.cryptoOptions.texto = cryptoReq.texto;
			this.cryptoOptions.tag = cryptoReq.tag;
		}

		// This.setCryptoInfo(options);

		this.getModeInfo();
		this.setSize();
		this.setVector();

		// This.setEncodeType(options);

		this.setCryptoCredentials('key');
		this.setCryptoCredentials('vector');
	}

	encrypt(texto: Buffer): string {
		if (typeof texto !== 'string') {
			texto = Buffer.from(JSON.stringify(texto));
		}

		try {
			this.cryptoOptions.texto = texto;
			this.setupCrypto();
			const cipher: CipherCCM = createCipheriv(
				this.cryptoOptions.mode,
				this.cryptoOptions.key.hash,
				this.cryptoOptions.vector.hash,
				{
					authTagLength: 16,
				}
			);

			cipher.setAAD(this.cryptoOptions.aad, {
				plaintextLength: Buffer.byteLength(this.cryptoOptions.texto),
			});

			const encrypted = cipher.update(
				this.cryptoOptions.texto.toString('utf-8'),
				this.cryptoOptions.encode
			);
			cipher.final(this.cryptoOptions.digestType);

			const tag = cipher.getAuthTag();

			const enc: ICryptoResponse = {
				x0x1: encrypted.toString('base64'),
				x0x2: tag.toString('base64'),
				x0x3: this.cryptoOptions.vector.valor?.toString('base64'),
			};

			return Buffer.from(JSON.stringify(enc), 'utf-8').toString('base64');
		} catch (err) {
			const enc: ICryptoResponse = {
				x0x1: err as string,
				x0x2: 'error al encriptar',
				x0x3: 'undefined',
			};

			console.error('ERROR al encriptar', err);

			return Buffer.from(JSON.stringify(enc), 'utf-8').toString('base64');
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

			this.setupCrypto(true, cryptoReq);
			const decipher: DecipherCCM = createDecipheriv(
				this.cryptoOptions.mode,
				this.cryptoOptions.key.hash,
				this.cryptoOptions.vector.hash,
				{
					authTagLength: 16,
				}
			);

			decipher.setAAD(this.cryptoOptions.aad, {
				plaintextLength: Buffer.byteLength(this.cryptoOptions.texto),
			});

			decipher.setAuthTag(this.cryptoOptions.tag);

			let decrypted = decipher.update(
				this.cryptoOptions.texto,
				// eslint-disable-next-line no-undefined
				undefined,
				this.cryptoOptions.encode
			);
			decrypted += decipher.final(this.cryptoOptions.encode);

			return decrypted;
		} catch (err) {
			console.error('ERROR al desencriptar', err);
			return 'error';
		}
	}
}

