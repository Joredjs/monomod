export class AppServiceEncode {
	private codeNum = parseInt(process.env.CODE_num) || 0;

	private myencode(char: string) {
		return Buffer.from(
			char.charCodeAt(0).toString(this.codeNum),
			"utf8"
		).toString("base64");
	}

	private stringToHex(str: string) {
		let hex = "";
		for (let ind = 0; ind < str.length; ind += 1) {
			const charCode = str.charCodeAt(ind);
			const hexValue = charCode.toString(this.codeNum);

			hex += hexValue.padStart(2, "0");
		}
		return hex;
	}

	private hexToString(hex: string) {
		let str = "";
		for (let ind = 0; ind < hex.length; ind += 2) {
			const hexValue = hex.substring(ind, ind + 2);
			const decimalValue = parseInt(hexValue, 16);
			str += String.fromCharCode(decimalValue);
		}
		return str;
	}

	public encode(texto: string) {
		const chars: string[] = texto.split("");
		const b64Code: string[] = [];
		chars.forEach((encoded) => b64Code.push(this.myencode(encoded)));

		const charList: Array<string>[] = [];
		b64Code.forEach((hchar) => {
			const b64Char: string[] = [];
			for (const bchar of hchar) {
				b64Char.push(this.myencode(bchar));
			}
			charList.push(b64Char);
		});

		const hexTex = this.stringToHex(JSON.stringify(charList))
			.split("")
			.reverse()
			.join("");

		return hexTex;
	}

	public decode(texto: string): string {
		try {
			const charList = JSON.parse(
				this.hexToString(texto.split("").reverse().join(""))
			);
			let decoded = "";
			for (const b64Char of charList) {
				let b64Code = "";
				for (const myChar of b64Char) {
					b64Code += this.hexToString(
						Buffer.from(myChar, "base64").toString("utf8")
					);
				}
				decoded += this.hexToString(
					Buffer.from(b64Code, "base64").toString("utf8")
				);
			}
			return Buffer.from(decoded, "utf-8").toString();
		} catch (error) {
			console.error("ERROR al decodificar", error);
			return Buffer.from("error", "utf-8").toString();
		}
	}
}
