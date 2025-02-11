// @monomod/core/tests/application/services/schema.service.spec.ts
import { ServiceSchema } from '@monomod/core/application';
import { ISchema } from '@monomod/core/domain';

interface MockValidateFunction extends jest.Mock {
	errors?: Array<{
		keyword: string;
		message?: string;
		// otros campos que necesites
	}>;
}

describe('ServiceSchema', () => {
	let service: ServiceSchema;
	const mockValidate = jest.fn() as MockValidateFunction;

	let mockSchema: ISchema = {
		name: {
			type: 'string',
			errorMessage: 'Name must be a string',
		},
		age: {
			type: 'number',
			minimum: 0,
			errorMessage: 'Age must be a non-negative number',
		},
		email: {
			type: 'string',
			pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
			errorMessage: 'Invalid email format',
		},
	};
	const mockCompile = jest.fn().mockReturnValue(mockValidate);
	const mockAjv = jest.fn(() => ({
		compile: mockCompile,
	}));
	const mockSchemaClient = {
		Validator: mockAjv,
		defaultOptions: { allErrors: true, strict: false },
		errors: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		service = new ServiceSchema(mockSchemaClient);
	});

	describe('validate', () => {
		const testSchema = {
			name: {
				type: 'string',
				errorMessage: 'Name must be a string',
			},
			age: {
				type: 'number',
				minimum: 0,
				errorMessage: 'Age must be a non-negative number',
			},
			email: {
				type: 'string',
				pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
				errorMessage: 'Invalid email format',
			},
		};

		it('should validate successfully when data matches schema', () => {
			mockValidate.mockReturnValue(true);

			const result = service.validate(mockSchema, ['name', 'age'], {
				name: 'John',
				age: 30,
			});

			expect(result).toBe(true);
			expect(mockValidate).toHaveBeenCalledWith({ name: 'John', age: 30 });
		});

		it('should throw error when type validation fails with errorMessage', () => {
			const errorMsg = 'Name must be a string';

			mockValidate.mockReturnValue(false);
			mockValidate.errors = [
				{
					keyword: 'errorMessage',
					message: errorMsg,
				},
			];

			expect(() =>
				service.validate(mockSchema, ['name'], { name: 123 })
			).toThrow(
				expect.objectContaining({
					errType: 'params',
					text: errorMsg,
					detail: expect.any(Array),
				})
			);
		});

		it('should throw error when required field is missing', () => {
			const errorMsg = 'Must have required property';

			mockValidate.mockReturnValue(false);
			mockValidate.errors = [
				{
					keyword: 'errorMessage',
					message: errorMsg,
				},
			];

			expect(() =>
				service.validate(mockSchema, ['name', 'age'], { name: 'John' })
			).toThrow(
				expect.objectContaining({
					errType: 'params',
					text: errorMsg,
					detail: expect.any(Array),
				})
			);
		});

		it('should throw error when pattern validation fails', () => {
			const errorMsg = 'Invalid email format';

			mockValidate.mockReturnValue(false);
			mockValidate.errors = [
				{
					keyword: 'errorMessage',
					message: errorMsg,
				},
			];

			expect(() =>
				service.validate(mockSchema, ['name', 'email'], {
					name: 'John',
					email: 'invalid-email',
				})
			).toThrow(
				expect.objectContaining({
					errType: 'params',
					text: errorMsg,
					detail: expect.any(Array),
				})
			);
		});

		it('should handle multiple validation errors', () => {
			const errorMsg = 'Name must be a string';

			mockValidate.mockReturnValue(false);
			mockValidate.errors = [
				{
					keyword: 'errorMessage',
					message: errorMsg,
				},
				{
					keyword: 'errorMessage',
					message: 'Age must be a non-negative number',
				},
			];

			// Debería usar el primer mensaje de error
			expect(() =>
				service.validate(mockSchema, ['name', 'age'], { name: 123, age: -1 })
			).toThrow(
				expect.objectContaining({
					errType: 'params',
					text: errorMsg,
					detail: expect.any(Array),
				})
			);
		});

		it('should handle conditional validations', () => {
			/*  const conditionalSchema = {
        type: {
          enum: ['personal', 'business'],
          errorMessage: 'Type must be either personal or business'
        },
        taxId: {
          if: { properties: { type: { const: 'business' } } },
          then: { type: 'string', minLength: 10 },
          else: { type: 'null' },
          errorMessage: 'TaxID is required for business type'
        }
      }; */

			const errorMsg = 'TaxID is required for business type';
			mockValidate.mockReturnValue(false);
			mockValidate.errors = [
				{
					keyword: 'errorMessage',
					message: errorMsg,
				},
			];

			expect(() =>
				service.validate(mockSchema, ['type', 'taxId'], {
					type: 'business',
					taxId: '123',
				})
			).toThrow(
				expect.objectContaining({
					errType: 'params',
					text: errorMsg,
					detail: expect.any(Array),
				})
			);
		});

		it('should handle custom error messages in properties', () => {
			/* const schemaWithCustomErrors = {
        age: {
          type: 'number',
          minimum: 18,
          errorMessage: {
            type: 'Age must be a number',
            minimum: 'Must be 18 or older'
          }
        }
      }; */

			const errorMsg = 'Must be 18 or older';

			mockValidate.mockReturnValue(false);
			mockValidate.errors = [
				{
					keyword: 'errorMessage',
					message: errorMsg,
				},
			];

			expect(() => service.validate(mockSchema, ['age'], { age: 16 })).toThrow(
				expect.objectContaining({
					errType: 'params',
					text: errorMsg,
					detail: expect.any(Array),
				})
			);
		});

		it('should use default error message when no errorMessage is provided', () => {
			mockValidate.mockReturnValue(false);
			mockValidate.errors = [
				{
					keyword: 'type',
					message: 'must be string',
				},
			];

			expect(() =>
				service.validate({ name: { type: 'string' } }, ['name'], { name: 123 })
			).toThrow(
				expect.objectContaining({
					errType: 'params',
					detail: expect.any(Array),
				})
			);
		});

		it('should throw error when schema is invalid', () => {
			mockCompile.mockImplementation(() => {
				throw new Error('Invalid schema');
			});

			expect(() =>
				service.validate(mockSchema, ['name'], { name: 'John' })
			).toThrow();
		});
	});
});
