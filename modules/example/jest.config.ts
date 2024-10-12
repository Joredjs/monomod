/* eslint-disable */
export default {
	displayName: 'module-example',
	preset: '../../jest.preset.js',
	testEnvironment: 'node',
	transform: {
		'^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
	},
	moduleFileExtensions: ['ts', 'js', 'html'],
	coverageDirectory: '../../results/module-example/coverage/',
	reporters: [
		'default',
		[
			'jest-stare',
			{
				resultDir: 'results/module-example/tests',
				reportTitle: 'tests result',
				additionalResultsProcessors: ['jest-junit'],
				coverageLink: '../coverage/index.html',
				jestStareConfigJson: 'jest-stare.json',
				jestGlobalConfigJson: 'globalStuff.json',
			},
		],
	],
};
