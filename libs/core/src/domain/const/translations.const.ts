import { ELanguages, TTranslations } from '../interfaces';
import { EMessageGroup, EMessageType } from './messages.const';

export const TRANSLATIONS: TTranslations = {
	[EMessageGroup.SYSTEM]: {
		[EMessageType.ERROR]: {
			default: {
				[ELanguages.EN]:
					'This is a default error message, check that the message exists: $0 -> $1 -> $2',
				[ELanguages.ES]:
					'Este es un mensaje de error por defecto, verifique que el mensaje exista: $0 -> $1 -> $2',
			},
		},
		[EMessageType.INFO]: {
			default: {
				[ELanguages.EN]:
					'This is a default message, check that the message exists: $0 -> $1 -> $2',
				[ELanguages.ES]:
					'Este es un mensaje por defecto, verifique que el mensaje exista: $0 -> $1 -> $2',
			},
		},
	},
	[EMessageGroup.SERVER]: {
		[EMessageType.ERROR]: {
			configuration: {
				[ELanguages.EN]: 'Microapp is missconfigurated',
				[ELanguages.ES]: 'La microapp está mal configurada',
			},
			create: {
				[ELanguages.EN]: 'Error creating the microapps: $0',
				[ELanguages.ES]: 'Error creando las microapps: $0',
			},
			start: {
				[ELanguages.EN]: 'Error starting the $0 microapp: $1',
				[ELanguages.ES]: 'Error iniciando la microapp $0: $1',
			},
			stop: {
				[ELanguages.EN]: 'MicroApp $0 has been stopped: $1',
				[ELanguages.ES]: 'La microapp $0 se ha detenido: $1',
			},
		},
		[EMessageType.INFO]: {
			listen: {
				[ELanguages.EN]: 'MicroApp $0 listening at http://localhost:$1',
				[ELanguages.ES]: 'MicroApp $0 escuchando en http://localhost:$1',
			},
		},
	},
};
