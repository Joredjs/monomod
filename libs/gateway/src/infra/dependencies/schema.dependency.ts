import * as ajvErrors from 'ajv-errors';
import Ajv, { JSONSchemaType } from 'ajv';
import { ISchemaClient, ISchemaProperties } from '@nxms/core/domain';

function normalizeErrors(validator) {
	ajvErrors.default(validator, { singleError: true });
}

export const clientSchema: ISchemaClient = {
	Validator: Ajv,
	defaultOptions: { allErrors: true, strict: false },
	errors: normalizeErrors,
};

export interface ITypesSchema {
	json: JSONSchemaType<ISchemaProperties>;
}
