import * as ajvErrors from 'ajv-errors';
import Ajv, { JSONSchemaType } from 'ajv';
import { ISchemaClient, ISchemaProperties } from '@monomod/core/domain';

function normalizeErrors(validator) {
	ajvErrors.default(validator, { singleError: true });
}

export const clientAjv: ISchemaClient = {
	Validator: Ajv,
	defaultOptions: { allErrors: true, strict: false },
	errors: normalizeErrors,
};

export interface ITypesSchema {
	json: JSONSchemaType<ISchemaProperties>;
}
