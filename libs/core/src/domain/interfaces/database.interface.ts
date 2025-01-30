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
