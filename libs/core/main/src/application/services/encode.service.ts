import { setError } from '../../domain/result';

export class ServiceEncode {
	#codeNum = parseInt(process.env.CODE_num) || 0;

	#equal = "$#";

	#listsign = "&/!";

	#comma = "@";

	#quote = "%$";

	#reverseString(text: string): string {
		return text.split("").reverse().join("");
	}

	#myencode(char: string): string {
		const b64Text = Buffer.from(
			char.charCodeAt(0).toString(this.#codeNum),
			"utf8"
		).toString("base64");
		const reversedb64 = this.#reverseString(b64Text);
		const replacedb64 = reversedb64.replaceAll(
			"=",
			this.#reverseString(this.#equal)
		);
		return replacedb64;
	}

	#mydecode(char: string): string {
		const replacedtext = char.replaceAll(this.#reverseString(this.#equal), "=");
		const reversedText = this.#reverseString(replacedtext);
		const text = Buffer.from(reversedText, "base64").toString("utf8");
		return text;
	}

	#stringToHex(str: string): string {
		let hex = "";
		for (let ind = 0; ind < str.length; ind += 1) {
			const charCode = str.charCodeAt(ind);
			const hexValue = charCode.toString(this.#codeNum);

			hex += hexValue.padStart(2, "0");
		}
		return hex;
	}

	#hexToString(hex: string): string {
		let str = "";
		for (let ind = 0; ind < hex.length; ind += 2) {
			const hexValue = hex.substring(ind, ind + 2);
			const decimalValue = parseInt(hexValue, 16);
			str += String.fromCharCode(decimalValue);
		}
		return str;
	}

	public encode(texto: string): string {
		try {
			const chars: string[] = texto.split("");
			const b64Code: string[] = [];
			chars.forEach((encoded) => b64Code.push(this.#myencode(encoded)));

			const charList: Array<string>[] = [];
			b64Code.reverse().forEach((hchar) => {
				const b64Char: string[] = [];
				for (const bchar of hchar) {
					b64Char.push(this.#myencode(bchar));
				}
				charList.push(b64Char);
			});

			const stringCharList: string = JSON.stringify(charList)
				.replaceAll("[", this.#listsign)
				.replaceAll("]", this.#reverseString(this.#listsign))
				.replaceAll(",", this.#comma)
				.replaceAll("\"", this.#quote);
			const hexTex: string = this.#reverseString(
				this.#stringToHex(stringCharList)
			);

			return hexTex;
		} catch (error) {
			throw setError({ detail: error, errType: "nocatch" });
		}
	}

	public decode(hexText: string): string {
		try {
			const text: string = this.#hexToString(this.#reverseString(hexText));

			const charList: Array<string>[] = JSON.parse(
				text
					.replaceAll(this.#listsign, "[")
					.replaceAll(this.#reverseString(this.#listsign), "]")
					.replaceAll(this.#comma, ",")
					.replaceAll(this.#quote, "\"")
			);

			let decoded = "";
			for (const b64Char of charList.reverse()) {
				let b64decode = "";
				for (const myChar of b64Char) {
					b64decode += this.#hexToString(this.#mydecode(myChar));
				}
				decoded += this.#hexToString(this.#mydecode(b64decode));
			}
			return Buffer.from(decoded, "utf-8").toString();
		} catch (error) {
			console.error("ERROR al decodificar", error);
			return Buffer.from("error", "utf-8").toString();
		}
	}
}
