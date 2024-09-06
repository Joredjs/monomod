/* eslint-disable */
export default {
	displayName: 'server-local-e2e',
	preset: '../../..//jest.preset.js',
	setupFiles: ['<rootDir>/src/test-setup.ts'],
	testEnvironment: 'node',
	transform: {
		'^.+\\.[tj]s$': [
			'ts-jest',
			{
				tsconfig: '<rootDir>/tsconfig.spec.json',
			},
		],
	},
	moduleFileExtensions: ['ts', 'js', 'html'],
	coverageDirectory: '../../..//coverage/server-local-e2e',
};
