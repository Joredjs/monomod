import { emptySchema, paginationSchema } from './shared.schema';
import { ISchemaObject } from '@monomod/core/domain';

export const schemas: ISchemaObject = {
	empty: emptySchema,
	pagination: paginationSchema,
};
