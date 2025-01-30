import {
	IDBListPagination,
	IDBPagination,
	IQueryFilters,
	TItemsResult,
} from '../interfaces';

export interface IDatabase {
	login<TGItems>(
		correo: string,
		pass: string,
		table: string
	): Promise<TItemsResult<TGItems>>;
	getById<TGItems>(table: string, uuid: string): Promise<TItemsResult<TGItems>>;
	getAll<TGItems>(
		table: string,
		pagination: IDBPagination
	): Promise<IDBListPagination<TItemsResult<TGItems>>>;
	getByQuery<TGItems>(
		table: string,
		query: IQueryFilters,
		pagination?: IDBPagination
	): Promise<TItemsResult<TGItems>[]>;
	add(table: string, data: any): Promise<string>;
	update(table: string, uuid: string, data: any): Promise<string>;
	delete(table: string, uuid: string);
}

export interface IDatabaseAdapter {
	[key: string]: IDatabase;
}
