import { EVersions, TRouteSchema, domainKeys } from '@monomod/core/domain';

export const emptySchema: TRouteSchema = {
	[EVersions.alpha]: {},
};

export const paginationSchema: TRouteSchema = {
	[EVersions.alpha]: {
		limit: { minimum: 1, optional: true, type: 'number' },
		start: {
			optional: true,
			pattern: domainKeys.patterns.uuid,
			type: 'string',
		},
	},
};
