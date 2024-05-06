import { IDBPagination } from '@nxms/core-main/domain';

export interface ExampleRepository {
	search(pagination: IDBPagination): Promise<any[]>;
}
