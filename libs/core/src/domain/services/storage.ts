export interface IStorageClient {
	Add: any;
	Client: any;
	Get: any;
	List: any;
	Remove: any;
}

export interface ITypesStorage {
	addInput: any;
	addOutput: any;
	getInput: any;
	getOutput: any;
	listInput: any;
	listOutput: any;
	removeInput: any;
	removeOutput: any;
}
export interface IServiceStorage {
	upload(name: string, data: string, path?: string): Promise<string>;
	read(name: string, path?: string): Promise<string>;
	list(path?: string): Promise<any[]>;
	remove(key: string, path?: string): void;
}
