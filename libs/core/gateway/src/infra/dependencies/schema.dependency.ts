import * as ajvErrors from 'ajv-errors';
import Ajv, { JSONSchemaType } from 'ajv';
import { ISchemaClient, ISchemaProperties } from '@nxms/core-main/domain';

function setErrors(validator) {
	ajvErrors.default(validator, { singleError: true });
}

export const clientSchema: ISchemaClient = {
	Validator: Ajv,
	defaultOptions: { allErrors: true, strict: false },
	errors: setErrors,
};

export interface ITypesSchema {
	json: JSONSchemaType<ISchemaProperties>;
}
