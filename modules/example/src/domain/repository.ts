import { IDBPagination } from '@monomod/core/domain';

export interface ExampleRepository {
	search(pagination: IDBPagination): Promise<any[]>;
}
