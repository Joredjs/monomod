/* eslint-disable */
export default {
	displayName: 'server-local',
	preset: '../../../jest.preset.js',
	testEnvironment: 'node',
	transform: {
		'^.+\\.[tj]s$': [
			'ts-jest',
			{
				tsconfig: '<rootDir>/tsconfig.spec.json',
				astTransformers: {
					// before: [
					// 	{
					// 		path: 'ts-jest-mock-import-meta',
					// 		options: {
					// 			metaObjectReplacement: { url: 'https://www.url.com' },
					// 		},
					// 	},
					// ],
				},
			},
		],
	},
	moduleFileExtensions: ['ts', 'js', 'html'],
	coverageDirectory: '../../../results/server-local/coverage/',
	testMatch: ['<rootDir>/tests/**/*.spec.ts', '<rootDir>/src/**/*.spec.ts'],
	setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
	reporters: [
		'default',
		[
			'jest-stare',
			{
				resultDir: 'results/server-local/tests',
				reportTitle: 'tests result',
				additionalResultsProcessors: ['jest-junit'],
				coverageLink: '../coverage/index.html',
				jestStareConfigJson: 'jest-stare.json',
				jestGlobalConfigJson: 'globalStuff.json',
			},
		],
	],
};
