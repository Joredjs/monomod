export interface IPortCrypto {
	encrypt(texto: any): string;
	decrypt(encrypted: string): string;
}
