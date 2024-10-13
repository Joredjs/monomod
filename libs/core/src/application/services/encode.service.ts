import { normalizeError } from '../errors';

export class ServiceEncode {
	#codeNum = parseInt(process.env.CODE_NUM || '0') || 0;

	#equal = '$#';

	#listsign = '&/!';

	#comma = '@';

	#quote = '%$';

	#reverseString(text: string): string {
		return text.split('').reverse().join('');
	}

	#myencode = (char: string): string => {
		const b64Text = Buffer.from(
			char.charCodeAt(0).toString(this.#codeNum),
			'utf8'
		).toString('base64');

		return this.#reverseString(
			b64Text.replaceAll('=', this.#reverseString(this.#equal))
		);
	};

	#mydecode = (char: string): string => {
		const replacedText = char.replaceAll(this.#reverseString(this.#equal), '=');
		return Buffer.from(this.#reverseString(replacedText), 'base64').toString(
			'utf8'
		);
	};

	#stringToHex(str: string): string {
		let hex = '';
		for (let ind = 0; ind < str.length; ind += 1) {
			const charCode = str.charCodeAt(ind);
			hex += charCode.toString(this.#codeNum).padStart(2, '0');
		}
		return hex;
	}

	#hexToString(hex: string): string {
		let str = '';
		for (let ind = 0; ind < hex.length; ind += 2) {
			const hexValue = hex.substring(ind, ind + 2);
			str += String.fromCharCode(parseInt(hexValue, 16));
		}
		return str;
	}

	public encode(text: string): string {
		try {
			const chars: string[] = text.split('');
			const b64Code = chars.map(this.#myencode);

			const charList = b64Code.reverse();

			if (charList.length) {
				const stringCharList: string = JSON.stringify(charList)
					.replaceAll('[', this.#listsign)
					.replaceAll(']', this.#reverseString(this.#listsign))
					.replaceAll(',', this.#comma)
					.replaceAll('"', this.#quote);
				return this.#reverseString(this.#stringToHex(stringCharList));
			}
			return '';
		} catch (error) {
			throw normalizeError({
				detail: error,
				errType: 'nocatch',
				text: 'Error al codificar',
			});
		}
	}

	public decode(hexText: string): string {
		try {
			const text: string = this.#hexToString(this.#reverseString(hexText));

			let charList: string[] = [],
				decoded = '';

			if (text !== '') {
				charList = JSON.parse(
					text
						.replaceAll(this.#listsign, '[')
						.replaceAll(this.#reverseString(this.#listsign), ']')
						.replaceAll(this.#comma, ',')
						.replaceAll(this.#quote, '"')
				);
			}

			for (const b64Char of charList.reverse()) {
				const b64decode = this.#mydecode(b64Char);
				decoded += this.#hexToString(b64decode);
			}

			return Buffer.from(decoded, 'utf-8').toString();
		} catch (error) {
			throw normalizeError({
				detail: error,
				errType: 'nocatch',
				text: 'Error al decodificar',
			});
		}
	}
}
