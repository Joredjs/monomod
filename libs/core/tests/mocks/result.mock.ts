import { Result } from '@monomod/core/domain';

export const createSuccessResult = <T>(value: T) => {
	return Result.resOk(value);
};

export const createErrorResult = <E>(error: E) => {
	return Result.resErr(error);
};
