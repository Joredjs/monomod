/* eslint-disable */
export default {
	displayName: 'gateway',
	preset: '../../jest.preset.js',
	testEnvironment: 'node',
	transform: {
		'^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
	},
	moduleFileExtensions: ['ts', 'js', 'html'],
	coverageDirectory: '../../results/gateway/coverage/',
	reporters: [
		'default',
		[
			'jest-stare',
			{
				resultDir: 'results/gateway/tests',
				reportTitle: 'tests result',
				additionalResultsProcessors: ['jest-junit'],
				coverageLink: '../coverage/index.html',
				jestStareConfigJson: 'jest-stare.json',
				jestGlobalConfigJson: 'globalStuff.json',
			},
		],
	],
};
