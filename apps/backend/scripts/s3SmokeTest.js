// Plain JS S3 Smoke Test using AWS SDK v3
require('dotenv/config');
const crypto = require('crypto');
const { 
  S3Client, 
  PutObjectCommand, 
  HeadObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand 
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

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

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const minimalPdf = Buffer.from('%PDF-1.1\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n', 'utf-8');

async function run() {
  const randomId = crypto.randomBytes(8).toString('hex');
  const key = `smoke-test/s3-test-${randomId}.pdf`;
  console.log(`Starting S3 smoke test bucket='${bucket}' region='${region}' key='${key}'`);
  try {
    console.log('Uploading...');
    const putCommand = new PutObjectCommand({ 
      Bucket: bucket, 
      Key: key, 
      Body: minimalPdf, 
      ContentType: 'application/pdf', 
      ACL: 'private' 
    });
    await s3.send(putCommand);
    console.log('Upload OK');

    const headCommand = new HeadObjectCommand({ Bucket: bucket, Key: key });
    const head = await s3.send(headCommand);
    console.log('HEAD OK size=', head.ContentLength);

    const getCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
    const getRes = await s3.send(getCommand);
    
    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of getRes.Body) {
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks);
    console.log('GET OK size=', body.length);

    const signedGetCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
    const signed = await getSignedUrl(s3, signedGetCommand, { expiresIn: 60 });
    console.log('Signed URL (60s):', signed);

    const deleteCommand = new DeleteObjectCommand({ Bucket: bucket, Key: key });
    await s3.send(deleteCommand);
    console.log('Delete OK');

    console.log('S3 Smoke Test PASSED');
  } catch (e) {
    console.error('S3 Smoke Test FAILED');
    console.error(e);
    process.exit(1);
  }
}

run();
