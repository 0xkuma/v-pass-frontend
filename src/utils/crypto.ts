import { createCipheriv, randomBytes } from 'crypto';

const algorithm = 'aes-256-ctr';

const getSecretKey = async () => {
  return '12345678123456781234567812345678';
};

export const encrtpyHandler = async (text: string, iv: string) => {
  const key = await getSecretKey();
  const cipher = createCipheriv(algorithm, key, iv.slice(0, 16));
  const encrypted = cipher.update(text, 'utf8', 'hex');
  const encryptedFinal = cipher.final('hex');
  return `${encrypted}${encryptedFinal}`;
};

export const decrpytHandler = async (text: string, iv: string) => {
  const key = await getSecretKey();
  const decipher = createCipheriv(algorithm, key, iv.slice(0, 16));
  const decrypted = decipher.update(text, 'hex', 'utf8');
  const decryptedFinal = decipher.final('utf8');
  return `${decrypted}${decryptedFinal}`;
};
