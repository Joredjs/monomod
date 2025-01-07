// TODO: TItemsResult and IQueryFilters Generic

export type TItemsResult<T> = {
	[K in keyof T]: any;
};

export interface IQueryFilters {
	attributes?: object;
	condition: string;
	values: Record<string, { [key in any]?: string }>;
}

export interface IDBPagination {
	start: string;
	limit: number;
	orderBy: string;
}

export interface IDBListPagination<TGItems> {
	items: TGItems[];
	next?: string;
}

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

export interface IDatabaseClient {
	Add: any;
	Client: any;
	Delete: any;
	Select: any;
	Update: any;
}

export interface ITypesDatabse {
	addInput: any;
	addOutput: any;
	selectInput: any;
	selectOutput: any;
	updateInput: any;
	updateOutput: any;
}