import * as ajvErrors from 'ajv-errors';
import Ajv, { JSONSchemaType } from 'ajv';
import {
	IErrResponse,
	IJSONObject,
	IOKResponse,
	ISchema,
	ISchemaProperties,
	TResult,
	resultErr,
	resultOk,
} from '@nxms/core-main/domain';

export class AppServiceSchemaValidator {
	// eslint-disable-next-line no-use-before-define
	private static instance: InstanceType<typeof AppServiceSchemaValidator>;

	constructor() {
		this.validator = new Ajv({ allErrors: true, strict: false });
		ajvErrors.default(this.validator, { singleError: true });
	}

	public static getInstance(): InstanceType<typeof AppServiceSchemaValidator> {
		return this.instance || (this.instance = new this());
	}

	private validator: Ajv;

	private setSchema(schema: ISchema) {
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

	private setProperties(schema: ISchema, keys: string[]) {
		const { errores, ifs, schema: cloneSchema } = this.setSchema(schema);

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

	validate(
		schema: ISchema,
		keys: string[],
		params: IJSONObject
	): TResult<IOKResponse<string>, IErrResponse> {
		const properties = this.setProperties(schema, keys);

		type MyData = JSONSchemaType<typeof properties>;

		try {
			const validate = this.validator.compile<MyData>(properties);
			if (!validate(params)) {
				let validateError = '';
				validate.errors.some((error) => {
					if (error.keyword === 'errorMessage' && error.message) {
						validateError = error.message;
						return true;
					}
					return false;
				});

				return resultErr({
					detail: validate.errors,
					errType: 'params',
					text: validateError,
				});
			}

			return resultOk();
		} catch (err) {
			return resultErr({ detail: err, errType: 'params' });
		}
	}
}

