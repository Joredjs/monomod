export interface IServiceCrypto {
	encrypt(texto: any): string;
	decrypt(encrypted: string): string;
}
