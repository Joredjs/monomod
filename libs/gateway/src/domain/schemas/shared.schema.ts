import { EVersions, PATTERNS, TRouteSchema } from '@monomod/core/domain';

export const emptySchema: TRouteSchema = {
	[EVersions.alpha]: {},
};

export const paginationSchema: TRouteSchema = {
	[EVersions.alpha]: {
		limit: { minimum: 1, optional: true, type: 'number' },
		start: {
			optional: true,
			pattern: PATTERNS.uuid,
			type: 'string',
		},
	},
};
