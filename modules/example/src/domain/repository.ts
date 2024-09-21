import { IDBPagination } from '@nxms/core/domain';

export interface ExampleRepository {
	search(pagination: IDBPagination): Promise<any[]>;
}
