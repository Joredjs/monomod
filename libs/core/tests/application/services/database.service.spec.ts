import { ServiceDatabase } from '@monomod/core/application';

describe('ServiceDatabase', () => {
	let service: ServiceDatabase;
	const mockDb = {
		mydb: {
			login: jest.fn(),
			getById: jest.fn(),
			getAll: jest.fn(),
			getByQuery: jest.fn(),
			add: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();
		service = new ServiceDatabase(mockDb);
	});

	describe('getAll', () => {
		it('should return all database adapters', () => {
			const result = service.getAll();

			expect(result).toHaveProperty('mydb');
			expect(result.mydb).toBe(mockDb.mydb);
		});

		it('should have all required methods in database adapter', () => {
			const result = service.getAll();
			const db = result.mydb;

			expect(db).toHaveProperty('login');
			expect(db).toHaveProperty('getById');
			expect(db).toHaveProperty('getAll');
			expect(db).toHaveProperty('getByQuery');
			expect(db).toHaveProperty('add');
			expect(db).toHaveProperty('update');
			expect(db).toHaveProperty('delete');
		});
	});
});
