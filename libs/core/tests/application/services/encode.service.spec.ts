import { ServiceEncode } from '@monomod/core/application';

describe('ServiceEncode', () => {
	let serviceEncode: ServiceEncode = new ServiceEncode();

	beforeEach(() => {
		serviceEncode = new ServiceEncode();
	});

	describe('encode', () => {
		it('should encode a string correctly', () => {
			const text = 'Hello, world! and more text';
			const encodedText = serviceEncode.encode(text);
			expect(encodedText).toBeDefined();
			expect(encodedText).not.toBe(text);
		});

		it('should handle empty strings', () => {
			const text = '';
			const encodedText = serviceEncode.encode(text);
			expect(encodedText).toBeDefined();
			expect(encodedText).toBe('');
		});

		/* It('should throw an error if there is an error during encoding', () => {
		   	const text = 'This is a test string';
		   	jest.spyOn(serviceEncode, 'stringToHex').mockImplementation(() => {
		   		throw new Error('Error during stringToHex');
		   	}); */

		/* 	Expect(() => serviceEncode.encode(text)).toThrowError(
		   		normalizeError({
		   			detail: 'Error during stringToHex',
		   			errType: 'nocatch',
		   			text: 'Error al codificar',
		   		})
		   	);
		   }); */
	});

	describe('decode', () => {
		it('should decode a string correctly', () => {
			const text = 'Hello, world! and more text';
			const encodedText = serviceEncode.encode(text);
			const decodedText = serviceEncode.decode(encodedText);
			expect(decodedText).toBe(text);
		});
		it('should handle empty strings', () => {
			const text = '';
			const encodedText = serviceEncode.encode(text);
			const decodedText = serviceEncode.decode(encodedText);
			expect(decodedText).toBe(text);
		});
		/* It('should throw an error if there is an error during decoding', () => {
		   	const encodedText = 'This is a test string';
		   	jest.spyOn(serviceEncode, 'hexToString').mockImplementation(() => {
		   		throw new Error('Error during hexToString');
		   	});
		   	expect(() => serviceEncode.decode(encodedText)).toThrowError(
		   		normalizeError({
		   			detail: 'Error during hexToString',
		   			errType: 'nocatch',
		   			text: 'Error al decodificar',
		   		})
		   	);
		   }); */
	});
});
