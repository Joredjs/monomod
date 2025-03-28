// @monomod/core/tests/application/services/storage.service.spec.ts
import { ServiceStorage } from '@monomod/core/application';
import { Readable } from 'stream';
import { createMockStorageClient, mockSend } from '../../mocks/services.mock';

describe('ServiceStorage', () => {
	let service: ServiceStorage<any>;
	let lastConstructedCommand: any;

	beforeEach(() => {
		lastConstructedCommand = null;
		class MockCommand {
			constructor(params: any) {
				lastConstructedCommand = params;
			}
		}

		service = new ServiceStorage(createMockStorageClient(MockCommand));
	});

	describe('upload', () => {
		const validImageData =
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

		it('should upload file successfully', async () => {
			const result = await service.upload('test', validImageData);

			expect(result).toBe('test-etag');
			expect(lastConstructedCommand).toMatchObject({
				Bucket: expect.any(String),
				Key: expect.stringMatching(/^test\.png$/),
				Body: expect.any(Buffer),
			});
		});

		it('should upload file with path', async () => {
			await service.upload('test', validImageData, 'subfolder');

			expect(lastConstructedCommand).toMatchObject({
				Bucket: expect.any(String),
				Key: expect.stringMatching(/^subfolder\/test\.png$/),
				Body: expect.any(Buffer),
			});
		});

		it('should throw error for invalid image data', async () => {
			const invalidData = 'invalid-base64-data';

			try {
				await service.upload('test', invalidData);
			} catch (err) {
				expect(err).toMatchObject({
					errType: 'invalid',
				});
			}
		});

		it('should handle upload error', async () => {
			mockSend.mockRejectedValueOnce(new Error('Upload failed'));

			try {
				await service.upload('test', validImageData);
			} catch (err) {
				expect(err).toMatchObject({
					errType: 'nocatch',
				});
			}
		});
	});

	describe('read', () => {
		it('should read file successfully', async () => {
			const mockBuffer = Buffer.from('test content');
			const mockReadable = Readable.from([mockBuffer]);

			mockSend.mockResolvedValueOnce({
				Body: mockReadable,
			});

			const result = await service.read('test.png');

			expect(result).toContain('data:image/png;base64,');
			expect(lastConstructedCommand).toMatchObject({
				Bucket: expect.any(String),
				Key: 'test.png',
			});
		});

		it('should read file with path', async () => {
			const mockReadable = Readable.from([Buffer.from('test')]);
			mockSend.mockResolvedValueOnce({
				Body: mockReadable,
			});

			await service.read('test.png', 'subfolder');

			expect(lastConstructedCommand).toMatchObject({
				Bucket: expect.any(String),
				Key: 'subfolder/test.png',
			});
		});

		it('should handle read error', async () => {
			mockSend.mockRejectedValueOnce(new Error('Read failed'));

			try {
				await service.read('test.png');
			} catch (err) {
				expect(err).toMatchObject({
					errType: 'nocatch',
				});
			}
		});
	});

	describe('list', () => {
		it('should list files successfully', async () => {
			const mockContents = [{ Key: 'file1.png' }, { Key: 'file2.png' }];

			mockSend
				.mockResolvedValueOnce({ Contents: mockContents }) // Para el List
				.mockResolvedValue({
					// Para los reads subsiguientes
					Body: Readable.from([Buffer.from('test content')]),
				});

			const result = await service.list();

			expect(result).toHaveLength(2);
			expect(result[0]).toHaveProperty('name', 'file1.png');
			expect(result[0]).toHaveProperty('data');
			expect(lastConstructedCommand).toMatchObject({
				Bucket: expect.any(String),
			});
		});

		it('should list files with path', async () => {
			mockSend.mockResolvedValueOnce({ Contents: [] });

			await service.list('subfolder');

			expect(lastConstructedCommand).toMatchObject({
				Bucket: expect.any(String),
				Prefix: 'subfolder/',
			});
		});

		it('should return empty array when no files found', async () => {
			mockSend.mockResolvedValueOnce({});

			const result = await service.list();

			expect(result).toEqual([]);
		});

		it('should handle list error', async () => {
			try {
				await service.list();
			} catch (err) {
				expect(err).toMatchObject({
					errType: 'nocatch',
				});
			}
		});
	});

	describe('remove', () => {
		it('should remove file successfully', async () => {
			mockSend.mockResolvedValueOnce({});

			await service.remove('test.png');

			expect(lastConstructedCommand).toMatchObject({
				Bucket: expect.any(String),
				Key: 'test.png',
			});
		});

		it('should remove file with path', async () => {
			mockSend.mockResolvedValueOnce({});

			await service.remove('test.png', 'subfolder');

			expect(lastConstructedCommand).toMatchObject({
				Bucket: expect.any(String),
				Key: 'subfolder/test.png',
			});
		});

		it('should handle remove error', async () => {
			mockSend.mockRejectedValueOnce(new Error('Remove failed'));
			await expect(service.remove('test.png')).rejects.toMatchObject({
				errType: 'nocatch',
			});
		});
	});
});
