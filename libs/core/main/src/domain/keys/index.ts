import { errores } from './errores';
import { headersPrefix } from './headers';
import { httpCodes } from './http';
import { modulos } from './modules';

const globalCors: RegExp[] = [/mysubdomain\.mydomain\.com$/];

const allowedDomains: string[] = ['https://mysubdomain.mydomain.com'];

export const domainKeys = {
	core: {
		allowedDomains,
		crypto: {
			defaultBytes: 8,
			defaultAuthTagLength: 16,
			key: '',
		},
		globalCors,
		pagination: {
			limit: 100,
			start: 0,
		},
		token: {
			userinfo: {
				key: 'uit',
				name: 'userInfoToken',
			},
		},
	},
	errores,
	headersPrefix,
	httpCodes,
	modulos,
	patterns: {
		cc: '^[\\d]{5,10}$',
		ce: '^[\\d]{4,7}$',
		correo: '^((?!\\.)[\\w\\-_.]*[^.])(@\\w+)(\\.\\w+(\\.\\w+)?[^.\\W])$',
		fecha: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$',
		imagen: '^[a-zA-Z0-9_-]{2,20}.(png|svg|jpg|gif|jpeg|webp)$',
		imagenb64: '^data:image\\/(png|jpeg|jpg|gif);base64,[a-zA-Z0-9+/]+={0,2}$',
		nit: '^([0-9]{9})+-{1}[0-9]{1}$',
		nombre: '^[a-zA-Z\\s]{2,40}$',
		pass: '^[\\dA-Za-zñÑ]{8,12}$',
		sigla: '^[A-Z]{3}$',
		tel: '^([3]{1})([01235]{1})[\\d]{8}$',
		uuid: '^[\\w]{8}-[\\w]{4}-[\\w]{4}-[\\w]{4}-[\\w]{12}$',
	},
	storage: {
		user: 'xrt-q23e',
	},
};
