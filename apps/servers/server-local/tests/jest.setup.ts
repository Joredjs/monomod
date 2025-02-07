import 'reflect-metadata';

// Global Jest setup
beforeAll(() => {
	jest.clearAllMocks();
});

afterAll(() => {
	// Cleanup code
});


process.env.NODE_ENV = 'test';
