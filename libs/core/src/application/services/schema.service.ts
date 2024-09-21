// TODO: no importar dependencias de ajv  aquí
import Ajv, { JSONSchemaType } from 'ajv';
import {
	IJSONObject,
	ISchema,
	ISchemaClient,
	ISchemaProperties,
	setError,
} from '../../domain';

export class ServiceSchema {
	#schemaClient: ISchemaClient;

	#validator: Ajv;

	constructor(schemaClient: ISchemaClient) {
		this.#schemaClient = schemaClient;
		this.#validator = new this.#schemaClient.Validator(
			this.#schemaClient.defaultOptions
		);
		this.#schemaClient.errors(this.#validator);
	}

	#setSchema(schema: ISchema) {
		const errMessages = {};
		const ifs = [];
		const cloneSchema = JSON.parse(JSON.stringify(schema));
		for (const prop in cloneSchema) {
			if (cloneSchema[prop]) {
				if (cloneSchema[prop].errorMessage) {
					errMessages[prop] = cloneSchema[prop].errorMessage;
				}

				if (
					cloneSchema[prop].if &&
					cloneSchema[prop].then &&
					cloneSchema[prop].else
				) {
					ifs.push({
						else: { properties: { [prop]: cloneSchema[prop].else } },
						if: { properties: cloneSchema[prop].if },
						then: { properties: { [prop]: cloneSchema[prop].then } },
					});

					delete cloneSchema[prop].if;
					delete cloneSchema[prop].then;
					delete cloneSchema[prop].else;
				}
			}
		}

		return { errores: errMessages, ifs, schema: cloneSchema };
	}

	#setProperties(schema: ISchema, keys: string[]) {
		const { errores, ifs, schema: cloneSchema } = this.#setSchema(schema);

		const properties: ISchemaProperties = {
			additionalProperties: false,
			errorMessage: {
				_: 'parámetros no válidos.',
				additionalProperties: 'Verifica la información enviada',
				enum: 'Verifica los valores de la información enviada',
				properties: errores,
				required: 'Debes enviar la información requerida',
				type: 'Verifica el tipo de la información enviada',
			},
			properties: cloneSchema,
			required: keys,
			type: 'object',
		};

		if (ifs.length > 0) {
			properties.allOf = ifs;
		}

		return properties;
	}

	validate(schema: ISchema, keys: string[], params: IJSONObject): boolean {
		const properties = this.#setProperties(schema, keys);

		type MyData = JSONSchemaType<typeof properties>;

		try {
			const validate = this.#validator.compile<MyData>(properties);
			if (!validate(params)) {
				let validateError = '';
				validate.errors.some((error) => {
					if (error.keyword === 'errorMessage' && error.message) {
						validateError = error.message;
						return true;
					}
					return false;
				});

				throw setError({
					detail: validate.errors,
					errType: 'params',
					text: validateError,
				});
			}

			return true;
		} catch (error) {
			throw setError(error);
		}
	}
}
