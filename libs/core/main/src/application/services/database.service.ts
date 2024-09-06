import { IDatabaseAdapter } from "@nxms/core-main/domain";

export class ServiceDatabase {
	#adapters: IDatabaseAdapter;

	constructor(adapters: IDatabaseAdapter) {
		this.#adapters = adapters;
	}

	getAll() {
		return {
			//mydb=sql,mongo,dynamo,firebase,etc
			mydb: this.#adapters.mydb,
		};
	}
}
