import type { Config } from 'jest';

const config: Config = {
	displayName: 'core',
	preset: '../../jest.preset.js',
	testEnvironment: 'node',
	transform: {
		'^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
	},
	moduleFileExtensions: ['ts', 'js', 'html'],
	coverageDirectory: '../../results/core/coverage/',
	reporters: [
		'default',
		[
			'jest-stare',
			{
				resultDir: 'results/core/tests',
				reportTitle: 'tests result',
				additionalResultsProcessors: ['jest-junit'],
				coverageLink: '../coverage/index.html',
				jestStareConfigJson: 'jest-stare.json',
				jestGlobalConfigJson: 'globalStuff.json',
			},
		],
	],
};

export default config;
