export class Result<T, E> {
	value: T | E;

	type: 'ok' | 'error';

	constructor(type: 'ok' | 'error', value: T | E) {
		this.type = type;
		this.value = value;
	}

	static resOk<T>(value: T): Result<T, never> {
		return new Result<T, never>('ok', value);
	}

	static resErr<E>(value: E): Result<never, E> {
		return new Result<never, E>('error', value);
	}

	isOk(): this is Result<T, any> {
		return this.type === 'ok';
	}

	isErr(): this is Result<any, E> {
		return this.type === 'error';
	}

	unwrap(): T | E {
		if (this.type === 'ok') {
			return this.value as T;
		}
		return this.value as E;
	}
}
