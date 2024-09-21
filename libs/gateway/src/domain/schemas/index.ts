import { ISchemaObject } from '@nxms/core/domain';
import { emptySchema } from './empty.schema';

console.debug('SCHEMA', emptySchema);

export const schemas: ISchemaObject = {
	empty: emptySchema,
};
