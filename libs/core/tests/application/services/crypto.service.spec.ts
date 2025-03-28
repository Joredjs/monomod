import { ServiceCrypto } from '@monomod/core/application';
import {
	createMockCipher,
	createMockCryptoClient,
	createMockDecipher,
	mockPortCryptoClient,
} from '../../mocks';

describe('ServiceCrypto', () => {
	let service: ServiceCrypto;
	let mockCryptoClient: ReturnType<typeof createMockCryptoClient>;
	let mockCipher: ReturnType<typeof createMockCipher>;
	let mockDecipher: ReturnType<typeof createMockDecipher>;

	beforeEach(() => {
		jest.clearAllMocks();
		process.env.CRYPTO_aad = 'myencryptionkey';
		process.env.CRYPTO_key = '123456789';

		mockCryptoClient = createMockCryptoClient(
			['aes-256-ccm'],
			{
				keyLength: 32,
				ivLength: 16,
			},
			'random-bytes'
		);
		mockCipher = createMockCipher();
		mockDecipher = createMockDecipher();

		service = new ServiceCrypto(mockCryptoClient);
	});

	describe('encrypt', () => {
		it('should encrypt string data successfully', async () => {
			const testData = 'test-data';

			mockPortCryptoClient.encrypt.mockReturnValue(mockCipher);

			const result = service.encrypt(Buffer.from(testData));

			expect(result).toBeDefined();
			expect(mockPortCryptoClient.encrypt).toHaveBeenCalled();
			expect(mockCipher.setAAD).toHaveBeenCalled();
			expect(mockCipher.getAuthTag).toHaveBeenCalled();

			// Verificar que el resultado es un string en base64 válido
			expect(() => Buffer.from(result, 'base64')).not.toThrow();
		});

		it('should encrypt object data successfully', () => {
			const testData = { key: 'value' };

			mockPortCryptoClient.encrypt.mockReturnValue(mockCipher);

			const result = service.encrypt(Buffer.from(JSON.stringify(testData)));

			expect(result).toBeDefined();
			expect(mockPortCryptoClient.encrypt).toHaveBeenCalled();
		});

		it('should handle encryption errors', () => {
			const testData = 'test-data';
			mockPortCryptoClient.encrypt.mockImplementation(() => {
				throw new Error('Encryption failed');
			});

			expect(() => service.encrypt(Buffer.from(testData))).toThrow();
		});
	});

	describe('decrypt', () => {
		it('should decrypt data successfully', () => {
			const encryptedData = Buffer.from(
				JSON.stringify({
					x0x1: Buffer.from('encrypted-data').toString('base64'),
					x0x2: Buffer.from('auth-tag').toString('base64'),
					x0x3: Buffer.from('iv').toString('base64'),
				})
			).toString('base64');

			mockPortCryptoClient.decrypt.mockReturnValue(mockDecipher);

			const result = service.decrypt(encryptedData);

			expect(result).toBe('decrypted');
			expect(mockPortCryptoClient.decrypt).toHaveBeenCalled();
			expect(mockDecipher.setAAD).toHaveBeenCalled();
			expect(mockDecipher.setAuthTag).toHaveBeenCalled();
		});

		it('should handle missing crypto components', () => {
			const invalidData = Buffer.from(
				JSON.stringify({
					x0x1: 'data',
					// Missing x0x2 and x0x3
				})
			).toString('base64');

			expect(() => service.decrypt(invalidData)).toThrow();
		});

		it('should handle decryption errors', () => {
			const encryptedData = Buffer.from(
				JSON.stringify({
					x0x1: Buffer.from('encrypted-data').toString('base64'),
					x0x2: Buffer.from('auth-tag').toString('base64'),
					x0x3: Buffer.from('iv').toString('base64'),
				})
			).toString('base64');

			mockPortCryptoClient.decrypt.mockImplementation(() => {
				throw new Error('Decryption failed');
			});

			expect(() => service.decrypt(encryptedData)).toThrow();
		});
	});
});
