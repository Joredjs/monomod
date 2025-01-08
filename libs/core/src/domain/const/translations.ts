import { ITranslations } from '../services/i18n';

export const translations: ITranslations = {
	generic: {
		errors: {
			default: {
				en: 'This is a default error message, check that the message exists: $0 -> $1 -> $2',
				es: 'Este es un mensaje de error por defecto, verifique que el mensaje exista: $0 -> $1 -> $2',
			},
		},
		info: {
			default: {
				en: 'This is a default message, check that the message exists: $0 -> $1 -> $2',
				es: 'Este es un mensaje por defecto, verifique que el mensaje exista: $0 -> $1 -> $2',
			},
		},
	},
	server: {
		errors: {
			creating: {
				en: 'Error creating the microapps',
				es: 'Error creando las microapps',
			},
			starting: {
				en: 'Error starting the microapp $0',
				es: 'Error iniciando la microapp $0',
			},
			stopping: {
				en: 'MicroApp $0 has been stopped',
				es: 'La microapp $0 se ha detenido',
			},
		},
		info: {
			listening: {
				en: 'MicroApp $0 listening at http://localhost:$1',
				es: 'Escuchando la microapp $0 en http://localhost:$1',
			},
		},
	},
};
