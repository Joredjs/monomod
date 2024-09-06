import {
	BinaryLike,
	BinaryToTextEncoding,
	CipherCCMTypes,
	CipherInfo,
	CipherKey,
	Encoding,
	Hash
} from 'crypto';

export interface ICryptoOptions {
	aad: Buffer;
	digestType: BinaryToTextEncoding;
	encode: Encoding;
	hashType: string;
	llave?: string;
	key: { valor: string; size?: number; hash: CipherKey };
	mode: CipherCCMTypes;
	modeInfo?: CipherInfo;
	tag: NodeJS.ArrayBufferView;
	texto: Buffer;
	vector: { valor?: Buffer; size?: number; hash: BinaryLike };
}

export interface ICryptoRequest {
	tag: Buffer;
	texto: Buffer;
	vector: Buffer;
}

export interface ICryptoResponse {
	/* X0x1: dataencrypted
     x0x2: tag
     x0x3: vector */

	x0x1: string;
	x0x2: string;
	x0x3?: string;
}

export interface ICryptoClient {
	decrypt: any;
	encrypt: any;
	getInfo(mode: CipherCCMTypes): CipherInfo;
	getCiphers(): string[];
	hash(hashType: string): Hash;
	random: any;
}

export interface ITypesCrypto {
	CCMCipher: any;
	CCMDecipher: any;
	CCMTypes: any;
}
