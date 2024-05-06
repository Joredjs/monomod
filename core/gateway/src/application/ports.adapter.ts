import {
	AppServiceCrypto,
	AppServiceDatabase,
	AppServiceEncode,
	AppServiceHeaders,
	AppServiceMailer,
} from './services';
import { ExamplePort } from '@nxms/module-example/application';
import { TPorts } from '@nxms/core-main/domain';

export class PortsAdapter {
	dbService;

	cryptoService;

	encodeService;

	headersService;

	mailService;

	constructor() {
		this.cryptoService = new AppServiceCrypto();
		this.encodeService = new AppServiceEncode();
		this.headersService = new AppServiceHeaders();
		this.dbService = new AppServiceDatabase();
		this.mailService = new AppServiceMailer();
	}

	getAll(): TPorts {
		const example = new ExamplePort({ db: this.dbService });

		return { example };
	}
}
