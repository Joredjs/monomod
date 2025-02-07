import {
	IErrResponse,
	IErrorMapping,
	IPortErrors,
	IPortMessages,
	TOKENS,
} from '../../domain';
import { Injectable } from '../di';

@Injectable(TOKENS.services.errors)
export class ServiceErrors implements IPortErrors {
	constructor(private messages: IPortMessages) {}

	normalize(errInfo: IErrorMapping): IErrorMapping | IErrResponse {
		if (errInfo.messageKey) {
			errInfo.text = this.messages.getMessage(errInfo.messageKey);
		}
		return this.#normalizeError(errInfo);
	}

	isIErrResponse(errInfo: unknown): errInfo is IErrResponse {
		return (
			errInfo !== null &&
			typeof errInfo === 'object' &&
			'code' in errInfo &&
			'error' in errInfo &&
			typeof errInfo.error === 'object' &&
			'detail' in errInfo.error &&
			'text' in errInfo.error
		);
	}

	isIErrorMapping(errInfo: unknown): errInfo is IErrorMapping {
		return (
			errInfo !== null &&
			typeof errInfo === 'object' &&
			'detail' in errInfo &&
			'errType' in errInfo
		);
	}

	#normalizeError(errInfo: IErrorMapping): IErrorMapping | IErrResponse {
		if (errInfo && typeof errInfo === 'object') {
			if (this.isIErrResponse(errInfo)) {
				// It's likely an IErrResponse
				return errInfo as IErrResponse;
			} else if (this.isIErrorMapping(errInfo)) {
				// It's likely an IErrorMap
				return errInfo as IErrorMapping;
			}
			// It's an object but not in the propper format
			const oldErr = errInfo;
			return {
				detail:
					typeof oldErr === 'string'
						? oldErr
						: JSON.stringify(oldErr, Object.getOwnPropertyNames(oldErr)),
				errType: 'nocatch',
			};
		}

		// Fallback for unknown error formats
		return {
			detail: typeof errInfo === 'string' ? errInfo : JSON.stringify(errInfo),
			errType: 'nocatch',
		};
	}
}
