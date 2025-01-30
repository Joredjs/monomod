export interface IServiceStorage {
	upload(name: string, data: string, path?: string): Promise<string>;
	read(name: string, path?: string): Promise<string>;
	list(path?: string): Promise<any[]>;
	remove(key: string, path?: string): void;
}
