import { setError } from '../../domain';

export class ServiceEncode {
	#codeNum = parseInt(process.env.CODE_NUM || '0') || 0;

	#equal = '$#';

	#listsign = '&/!';

	#comma = '@';

	#quote = '%$';

	#reverseString(text: string): string {
		return text.split('').reverse().join('');
	}

	#myencode(char: string): string {
		const b64Text = Buffer.from(
			char.charCodeAt(0).toString(this.#codeNum),
			'utf8'
		).toString('base64');
		/* Const reversedb64 = this.#reverseString(b64Text);
		   const replacedb64 = reversedb64.replaceAll(
		   	'=',
		   	this.#reverseString(this.#equal)
		   );
		   return replacedb64; */
		return this.#reverseString(
			b64Text.replaceAll('=', this.#reverseString(this.#equal))
		);
	}

	#mydecode(char: string): string {
		const replacedText = char.replaceAll(this.#reverseString(this.#equal), '=');
		return Buffer.from(this.#reverseString(replacedText), 'base64').toString(
			'utf8'
		);
	}

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
			/* Const b64Code: string[] = [];
			   chars.forEach((encoded) => b64Code.push(this.#myencode(encoded))); */

			const charList = b64Code
				.reverse()
				.map((hchar) => hchar.split('').map(this.#myencode));

			/* Const charList: Array<string>[] = [];
			   b64Code.reverse().forEach((hchar) => {
			   	const b64Char: string[] = [];
			   	for (const bchar of hchar) {
			   		b64Char.push(this.#myencode(bchar));
			   	}
			   	charList.push(b64Char);
			   }); */

			const stringCharList: string = JSON.stringify(charList)
				.replaceAll('[', this.#listsign)
				.replaceAll(']', this.#reverseString(this.#listsign))
				.replaceAll(',', this.#comma)
				.replaceAll('"', this.#quote);
			return this.#reverseString(this.#stringToHex(stringCharList));
		} catch (error) {
			throw setError({ detail: error, errType: 'nocatch',text:'Error al codificar' });
		}
	}

	public decode(hexText: string): string {
		try {
			const text: string = this.#hexToString(this.#reverseString(hexText));

			const charList: Array<string>[] = JSON.parse(
				text
					.replaceAll(this.#listsign, '[')
					.replaceAll(this.#reverseString(this.#listsign), ']')
					.replaceAll(this.#comma, ',')
					.replaceAll(this.#quote, '"')
			);

			let decoded = '';
			for (const b64Char of charList.reverse()) {
				const b64decode = b64Char.map(this.#mydecode).join('');
				/* Let b64decode = '';
				   for (const myChar of b64Char) {
				   	b64decode += this.#hexToString(this.#mydecode(myChar));
				   } */
				decoded += this.#hexToString(this.#mydecode(b64decode));
			}
			return Buffer.from(decoded, 'utf-8').toString();
		} catch (error) {
			console.error('ERROR al decodificar', error);
			throw setError({
				detail: error,
				errType: 'nocatch',
				text: 'Error al decodificar',
			});
			// Return Buffer.from('error', 'utf-8').toString();
		}
	}
}
