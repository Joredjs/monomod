import { ExampleRepository } from '../domain';
import { IDBPagination, IDatabases } from '@nxms/core-main/domain';

export class XXTECHNOLOGYExampleRepository implements ExampleRepository {
	private database: IDatabases;

	constructor(database: IDatabases) {
		this.database = database;
	}

	async search(pagination: IDBPagination): Promise<any[]> {
		try {
			const result = await this.database.getAll('ciudades', pagination);
			if (!result) {
				return result;
			}

			//do something
			return result;
		} catch (error) {
			return null;
		}
	}
}
