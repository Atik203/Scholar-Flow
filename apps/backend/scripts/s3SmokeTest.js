// Plain JS S3 Smoke Test (fallback when TS node types not configured)
require('dotenv/config');
const crypto = require('crypto');
const AWS = require('aws-sdk');

const requiredEnv = [
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_BUCKET_NAME',
  'AWS_REGION',
];
const missing = requiredEnv.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('Missing env vars:', missing.join(', '));
  process.exit(1);
}

const bucket = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_REGION;
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region,
  signatureVersion: 'v4',
});
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const minimalPdf = Buffer.from('%PDF-1.1\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n', 'utf-8');

async function run() {
  const randomId = crypto.randomBytes(8).toString('hex');
  const key = `smoke-test/s3-test-${randomId}.pdf`;
  console.log(`Starting S3 smoke test bucket='${bucket}' region='${region}' key='${key}'`);
  try {
    console.log('Uploading...');
    await s3.putObject({ Bucket: bucket, Key: key, Body: minimalPdf, ContentType: 'application/pdf', ACL: 'private' }).promise();
    console.log('Upload OK');

    const head = await s3.headObject({ Bucket: bucket, Key: key }).promise();
    console.log('HEAD OK size=', head.ContentLength);

    const getRes = await s3.getObject({ Bucket: bucket, Key: key }).promise();
    const body = Buffer.isBuffer(getRes.Body) ? getRes.Body : Buffer.from(getRes.Body);
    console.log('GET OK size=', body.length);

    const signed = s3.getSignedUrl('getObject', { Bucket: bucket, Key: key, Expires: 60 });
    console.log('Signed URL (60s):', signed);

    await s3.deleteObject({ Bucket: bucket, Key: key }).promise();
    console.log('Delete OK');

    console.log('S3 Smoke Test PASSED');
  } catch (e) {
    console.error('S3 Smoke Test FAILED');
    console.error(e);
    process.exit(1);
  }
}

run();
