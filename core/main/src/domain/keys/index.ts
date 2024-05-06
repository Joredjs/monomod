import { errores } from "./errores";
import { headersPrefix } from "./headers";
import { httpCodes } from "./http";
import { modulos } from "./modules";


const globalCors: RegExp[] = [];

export const domainKeys = {
	core: {
		crypto: {
			defaultBytes: 8,
			key: "",
		},
		globalCors,
		pagination: {
			limit: 500,
			start: 0,
		},
		token: {
			userinfo: {
				key: "uit",
				name: "userInfoToken",
			},
		},
	},
	errores,
	headersPrefix,
	httpCodes,
	modulos,
	patterns: {
		cc: "^[\\d]{5,10}$",
		ce: "^[\\d]{4,7}$",
		correo: "^((?!\\.)[\\w\\-_.]*[^.])(@\\w+)(\\.\\w+(\\.\\w+)?[^.\\W])$",
		nit: "^([0-9]{9})+-{1}[0-9]{1}$",
		nombre: "^[a-zA-Z\\s]{2,40}$",
		pass: "^[\\dA-Za-zñÑ]{8,12}$",
		tel: "^([3]{1})([01235]{1})[\\d]{8}$",
		uuid: "^[\\w]{8}-[\\w]{4}-[\\w]{4}-[\\w]{4}-[\\w]{12}$",
	},
	storage: {
		user: "xrt-q23e",
	},
};
