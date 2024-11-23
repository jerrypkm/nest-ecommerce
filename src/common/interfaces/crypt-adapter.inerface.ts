export interface EncryptAdapter {
  hashSync(text: string, salt: number): string;
  compareSync(data: string, encrypted: string): boolean;
}
