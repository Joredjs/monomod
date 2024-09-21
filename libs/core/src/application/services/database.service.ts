import { IDatabaseAdapter } from '../../domain';

export class ServiceDatabase {
	#adapters: IDatabaseAdapter;

	constructor(adapters: IDatabaseAdapter) {
		this.#adapters = adapters;
	}

	getAll() {
		return {
			// Mydb=sql,mongo,dynamo,firebase,etc
			mydb: this.#adapters.mydb,
		};
	}
}
