export const createSecretId = (crypto: Crypto) => {
    return crypto.randomUUID();
}