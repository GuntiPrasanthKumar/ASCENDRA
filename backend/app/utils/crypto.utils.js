const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // Standard GCM IV length

function getSecretKey() {
  const secret = process.env.ENCRYPTION_SECRET || process.env.JWT_SECRET;
  if (!process.env.ENCRYPTION_SECRET) {
    console.warn('[SECURITY WARNING] ENCRYPTION_SECRET not set. Falling back to JWT_SECRET for biometric template encryption.');
  }
  if (!secret) {
    throw new Error('ENCRYPTION_SECRET or JWT_SECRET must be set for biometric data encryption.');
  }
  // Create a 32-byte key using SHA-256 of secret
  return crypto.createHash('sha256').update(String(secret)).digest();
}

/**
 * Encrypts a float32 embedding array to AES-256-GCM base64 ciphertext
 */
function encryptEmbedding(embeddingArray) {
  const key = getSecretKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const jsonString = JSON.stringify(Array.from(embeddingArray));

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(jsonString, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const authTag = cipher.getAuthTag().toString('base64');

  return {
    ciphertext: encrypted,
    iv: iv.toString('base64'),
    authTag: authTag
  };
}

/**
 * Decrypts AES-256-GCM base64 ciphertext back to float array
 */
function decryptEmbedding(ciphertext, ivBase64, authTagBase64) {
  const key = getSecretKey();
  const iv = Buffer.from(ivBase64, 'base64');
  const authTag = Buffer.from(authTagBase64, 'base64');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted);
}

/**
 * Computes Cosine Similarity between two float arrays
 */
function cosineSimilarity(vectorA, vectorB) {
  if (!vectorA || !vectorB || vectorA.length !== vectorB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    normA += vectorA[i] * vectorA[i];
    normB += vectorB[i] * vectorB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

module.exports = {
  encryptEmbedding,
  decryptEmbedding,
  cosineSimilarity
};
