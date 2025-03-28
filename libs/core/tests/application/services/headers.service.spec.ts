import { EPrivacyLevel } from '@monomod/core/domain';
import { ServiceHeaders } from '@monomod/core/application';
import {
	createMockITransactionParams,
	mockPortCrypto,
} from '../../mocks';

describe('ServiceHeaders', () => {
	let service: ServiceHeaders;

	const validTokenValue = 'valid-token';
	const headers = {
		'xx-monomodhh-tk': validTokenValue,
	};

	beforeEach(() => {
		jest.clearAllMocks();
		service = new ServiceHeaders(mockPortCrypto);
	});

	describe('validateToken', () => {
		const mockTokenInfo = {
			privacy: EPrivacyLevel.public,
			valid: Date.now(),
		};

		beforeEach(() => {
			mockPortCrypto.decrypt.mockReturnValue(JSON.stringify(mockTokenInfo));
		});

		it('should validate token successfully', () => {
			const info = createMockITransactionParams(headers, [
				EPrivacyLevel.public,
			]);
			const result = service.validateToken(info);

			expect(result).toEqual(mockTokenInfo);
			expect(mockPortCrypto.decrypt).toHaveBeenCalledWith(validTokenValue);
		});

		it('should throw error when token is missing', () => {
			const info = createMockITransactionParams({}, [EPrivacyLevel.public]);
			expect(() => service.validateToken(info)).toThrow();
		});

		it('should throw error when token is expired', () => {
			const expiredTokenInfo = {
				privacy: EPrivacyLevel.public,
				valid: Date.now() - 3600001, // más de una hora atrás
			};
			mockPortCrypto.decrypt.mockReturnValue(JSON.stringify(expiredTokenInfo));

			const info = createMockITransactionParams({}, []);

			expect(() => service.validateToken(info)).toThrow();
		});

		it('should throw error when privacy level does not match', () => {
			const tokenInfo = {
				privacy: EPrivacyLevel.user,
				valid: Date.now(),
			};
			mockPortCrypto.decrypt.mockReturnValue(JSON.stringify(tokenInfo));

			const info = createMockITransactionParams({}, [EPrivacyLevel.public]);

			expect(() => service.validateToken(info)).toThrow();
		});
	});

	describe('validateMandatory', () => {
		it('should validate mandatory headers successfully', () => {
			const headers = {
				'x-monomod-so': 'web',
			};

			expect(() => service.validateMandatory(headers)).not.toThrow();
		});

		it('should throw error when mandatory header is missing', () => {
			const headers = {};

			expect(() => service.validateMandatory(headers)).toThrow();
		});

		it('should throw error when mandatory header has invalid value', () => {
			const headers = {
				'x-monomod-so': 'invalid',
			};

			expect(() => service.validateMandatory(headers)).toThrow();
		});
	});

	describe('validate', () => {
		it('should validate specific header successfully', () => {
			const headers = {
				'x-monomod-so': 'web',
			};

			expect(service.validate(headers, 'so')).toBe(true);
		});

		it('should throw error when specific header is invalid', () => {
			const headers = {
				'x-monomod-so': 'invalid',
			};

			expect(() => service.validate(headers, 'so')).toThrow();
		});
	});

	describe('validateRouteHeaders', () => {
		it('should validate route headers successfully', () => {
			const info = createMockITransactionParams(headers, [
				EPrivacyLevel.public,
			]);

			const result = service.validateRouteHeaders(info);
			expect(result).toBeDefined();
		});

		it('should throw error when headers are missing', () => {
			const info = createMockITransactionParams({}, []);

			expect(() => service.validateRouteHeaders(info)).toThrow();
		});
	});
});
