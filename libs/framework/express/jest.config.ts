/* eslint-disable */
export default {
	displayName: 'framework-express',
	preset: '../../../jest.preset.js',
	testEnvironment: 'node',
	transform: {
		'^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
	},
	moduleFileExtensions: ['ts', 'js', 'html'],
	coverageDirectory: '../../../results/framework-express/coverage/',
	reporters: [
		'default',
		[
			'jest-stare',
			{
				resultDir: 'results/framework-express/tests',
				reportTitle: 'tests result',
				additionalResultsProcessors: ['jest-junit'],
				coverageLink: '../coverage/index.html',
				jestStareConfigJson: 'jest-stare.json',
				jestGlobalConfigJson: 'globalStuff.json',
			},
		],
	],
};
