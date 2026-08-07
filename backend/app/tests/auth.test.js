require('./setup.test');
const assert = require('assert');
const { authService } = require('../services/auth.service');
const { decryptEmbedding, encryptEmbedding, cosineSimilarity } = require('../utils/crypto.utils');

/**
 * Enterprise Authentication Verification Test Suite
 */
async function runAuthTests() {
  console.log('🧪 Starting Enterprise Authentication Verification Tests...\n');

  // Test 1: MediaPipe 512-Float Vector Biometric Encryption & Decryption
  const dummyEmbedding = new Array(512).fill(0).map(() => Math.random() - 0.5);
  const { ciphertext, iv, authTag } = encryptEmbedding(dummyEmbedding);
  assert.ok(ciphertext && iv && authTag, 'Encryption should return ciphertext, iv, and authTag');

  const decrypted = decryptEmbedding(ciphertext, iv, authTag);
  assert.strictEqual(decrypted.length, 512, 'Decrypted embedding should be length 512');
  const similarity = cosineSimilarity(decrypted, dummyEmbedding);
  assert.ok(similarity > 0.999, 'Cosine similarity of decrypted vector should be ~1.0');
  console.log('✅ PASS: Biometric Encrypted Face Descriptor Storage (AES-256-GCM)');

  // Test 2: Token Generation & Opaque Refresh Token Hash
  const mockUser = { _id: '65c8f1234567890123456789', email: 'architect@ascendra.ai', role: 'Student' };
  const accessToken = authService.generateAccessToken(mockUser);
  const refreshToken = authService.generateRefreshToken();
  const tokenHash = authService.hashToken(refreshToken);

  assert.ok(accessToken.length > 20, 'Access token generated');
  assert.ok(refreshToken.length > 20, 'Refresh token generated');
  assert.strictEqual(tokenHash.length, 64, 'SHA-256 token hash should be 64 hex characters');
  console.log('✅ PASS: JWT Access Token & Refresh Token Rotation Hash');

  // Test 3: Password Hash Comparison
  const bcrypt = require('bcryptjs');
  const rawPassword = 'SecurePassword2026!';
  const hash = await bcrypt.hash(rawPassword, 10);
  const isMatch = await bcrypt.compare(rawPassword, hash);
  assert.strictEqual(isMatch, true, 'Bcrypt password hashing verification');
  console.log('✅ PASS: Password Hash Security Verification');

  console.log('\n🎉 All Enterprise Authentication Verification Tests Passed Successfully!');
}

if (require.main === module) {
  runAuthTests().catch((err) => {
    console.error('❌ FAIL: Auth test suite error:', err);
    process.exit(1);
  });
}

module.exports = { runAuthTests };
