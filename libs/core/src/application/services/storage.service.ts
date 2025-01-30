import { IStorageClient, ITypesStorage, PATTERNS } from '../../domain';
import { Readable } from 'stream';
import { normalizeError } from '../errors';

export class ServiceStorage<TGTStorage extends ITypesStorage> {
	#storage: IStorageClient;

	// TODO: recibir bucketname
	#bucketName = 'aws-bucket-betplay-multimedia';

	#b64template = 'data:image/{{extension}};base64';

	constructor(storage: IStorageClient) {
		this.#storage = storage;
		this.#storage.Client = new storage.Client({ region: 'us-east-1' });
	}

	async upload(name: string, data: string, path?: string): Promise<string> {
		try {
			const matches = data.match(PATTERNS.imagenb64);

			const [base64Data, extension] = matches;
			name = `${name}.${extension}`;

			const [, base64] = base64Data.split(',');

			const buffer = Buffer.from(base64, 'base64');

			const params: TGTStorage['addInput'] = {
				Body: buffer,
				Bucket: this.#bucketName,
				Key: name,
			};

			if (path) {
				params.Key = `${path}/${name}`;
			}

			const response: TGTStorage['addOutput'] = await this.#storage.Client.send(
				new this.#storage.Add(params)
			);

			const okCode = 200;

			if (response.$metadata?.httpStatusCode === okCode && response.ETag) {
				return response.ETag;
			}

			throw normalizeError({
				detail: response,
				errType: 'nocatch',
				text: 'Error al subir objeto al storage',
			});
		} catch (error) {
			throw normalizeError(error);
		}
	}

	async read(name: string, path?: string): Promise<string> {
		try {
			const params: TGTStorage['getInput'] = {
				Bucket: this.#bucketName,
				Key: name,
			};

			if (path && params.Key.indexOf(`${path}/`) === -1) {
				params.Key = `${path}/${name}`;
			}

			const response: TGTStorage['getOutput'] = await this.#storage.Client.send(
				new this.#storage.Get(params)
			);

			const objectData = (await response.Body) as Readable;
			const buffers: Uint8Array[] = [];
			for await (const chunk of objectData) {
				buffers.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
			}
			const buffer = Buffer.concat(buffers);

			const safeBase64 = buffer.toString('base64');

			const extension = name.split('.')[1] || '';
			const tipo = this.#b64template.replace('{{extension}}', extension);

			return `${tipo},${safeBase64}`;
		} catch (error) {
			throw normalizeError(error);
		}
	}

	async list(path?: string) {
		try {
			const params: TGTStorage['listInput'] = {
				Bucket: this.#bucketName,
			};

			if (path) {
				params.Prefix = `${path}/`;
			}

			const response: TGTStorage['listOutput'] =
				await this.#storage.Client.send(new this.#storage.List(params));

			let result = [];
			if (response.Contents) {
				const promises = [];

				const objectKeys = response.Contents?.map((object) => object.Key);

				for (const objectKey of objectKeys) {
					promises.push(this.read(objectKey, path));
				}

				result = await Promise.all(promises);

				return result.map((data, index) => ({
					data,
					name: response.Contents[index].Key,
				}));
			}
			return result;
		} catch (error) {
			throw normalizeError(error);
		}
	}

	async remove(name: string, path?: string) {
		try {
			const params: TGTStorage['removeInput'] = {
				Bucket: this.#bucketName,
				Key: name,
			};

			if (path) {
				params.Key = `${path}/${name}`;
			}

			await this.#storage.Client.send(new this.#storage.Remove(params));
		} catch (error) {
			throw normalizeError(error);
		}
	}
}
