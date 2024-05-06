export interface IDBPagination {
	start: number;
	limit: number;
	orderBy: string;
}

export interface IDatabases {
	getById(
		table: string,
		uuid: string,
		pagination?: IDBPagination
	): Promise<any>;
	getAll(table: string, pagination: IDBPagination): Promise<any[]>;
	getByQuery(
		table: string,
		query: any,
		isSubTable?: boolean,
		pagination?: IDBPagination
	): Promise<any[]>;
	add(table: string, data: any): Promise<string>;
	update(table: string, uuid: string, data: any): Promise<any>;
}
