import { ServiceCrypto } from '@monomod/core/application';

describe('ServiceCrypto', () => {
	let service: ServiceCrypto;
	const mockClientCrypto = {
		encrypt: jest.fn(),
		decrypt: jest.fn(),
		hash: jest.fn(),
		random: jest.fn(),
		getCiphers: jest.fn(),
		getInfo: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		process.env.CRYPTO_aad = 'test-aad';
		process.env.CRYPTO_key = 'test-key';

		// Mock de funciones básicas
		mockClientCrypto.getCiphers.mockReturnValue(['aes-256-ccm']);
		mockClientCrypto.getInfo.mockReturnValue({
			keyLength: 32,
			ivLength: 16,
		});
		mockClientCrypto.hash.mockReturnValue({
			update: jest.fn().mockReturnThis(),
			digest: jest.fn().mockReturnValue('mocked-hash'),
		});
		mockClientCrypto.random.mockReturnValue(Buffer.from('random-bytes'));

		service = new ServiceCrypto(mockClientCrypto);
	});

	describe('encrypt', () => {
		it('should encrypt string data successfully', async () => {
			const testData = 'test-data';
			const mockCipher = {
				update: jest.fn().mockReturnValue(Buffer.from('encrypted')),
				final: jest.fn(),
				setAAD: jest.fn(),
				getAuthTag: jest.fn().mockReturnValue(Buffer.from('auth-tag')),
			};

			mockClientCrypto.encrypt.mockReturnValue(mockCipher);

			const result = service.encrypt(Buffer.from(testData));

			expect(result).toBeDefined();
			expect(mockClientCrypto.encrypt).toHaveBeenCalled();
			expect(mockCipher.setAAD).toHaveBeenCalled();
			expect(mockCipher.getAuthTag).toHaveBeenCalled();

			// Verificar que el resultado es un string en base64 válido
			expect(() => Buffer.from(result, 'base64')).not.toThrow();
		});

		it('should encrypt object data successfully', () => {
			const testData = { key: 'value' };
			const mockCipher = {
				update: jest.fn().mockReturnValue(Buffer.from('encrypted')),
				final: jest.fn(),
				setAAD: jest.fn(),
				getAuthTag: jest.fn().mockReturnValue(Buffer.from('auth-tag')),
			};

			mockClientCrypto.encrypt.mockReturnValue(mockCipher);

			const result = service.encrypt(Buffer.from(JSON.stringify(testData)));

			expect(result).toBeDefined();
			expect(mockClientCrypto.encrypt).toHaveBeenCalled();
		});

		it('should handle encryption errors', () => {
			const testData = 'test-data';
			mockClientCrypto.encrypt.mockImplementation(() => {
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

			const mockDecipher = {
				update: jest.fn().mockReturnValue('decrypted'),
				final: jest.fn().mockReturnValue(''),
				setAAD: jest.fn(),
				setAuthTag: jest.fn(),
			};

			mockClientCrypto.decrypt.mockReturnValue(mockDecipher);

			const result = service.decrypt(encryptedData);

			expect(result).toBe('decrypted');
			expect(mockClientCrypto.decrypt).toHaveBeenCalled();
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

			mockClientCrypto.decrypt.mockImplementation(() => {
				throw new Error('Decryption failed');
			});

			expect(() => service.decrypt(encryptedData)).toThrow();
		});
	});
});
