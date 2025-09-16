// Simple upload test script (assumes server running on localhost:5000)
// Usage: node scripts/testUpload.js <workspaceId>
require('dotenv/config');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');

async function main() {
  const workspaceId = process.argv[2] || '00000000-0000-0000-0000-000000000000';
  const endpoint = process.env.TEST_UPLOAD_ENDPOINT || 'http://localhost:5000/api/papers';

  // Minimal PDF buffer (or create a temp file if needed)
  const pdfBuffer = Buffer.from('%PDF-1.1\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n');
  const tmpFile = path.join(__dirname, 'tmp-test.pdf');
  fs.writeFileSync(tmpFile, pdfBuffer);

  const form = new FormData();
  form.append('workspaceId', workspaceId);
  form.append('title', 'Test Upload PDF');
  // Optional: year removed to bypass numeric validation (add Number() if needed)
  // form.append('year', '2024');
  form.append('file', fs.createReadStream(tmpFile));

  console.log('➡️  Uploading test PDF to', endpoint);
  try {
    const res = await fetch(endpoint, { method: 'POST', body: form });
    const json = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(json, null, 2));
  } catch (e) {
    console.error('❌ Upload failed', e);
  } finally {
    fs.unlinkSync(tmpFile);
  }
}

main();
