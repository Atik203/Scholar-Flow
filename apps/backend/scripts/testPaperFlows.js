#!/usr/bin/env node
// Basic script to exercise paper endpoints: upload -> list -> get -> update -> delete
// Usage: node scripts/testPaperFlows.js <path-to-pdf>

import FormData from 'form-data';
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';

const BASE = process.env.TEST_API_BASE || 'http://localhost:5000/api';
const pdfPath = process.argv[2] || path.join(process.cwd(), 'sample.pdf');

async function upload() {
  if (!fs.existsSync(pdfPath)) {
    console.error('File not found:', pdfPath);
    process.exit(1);
  }
  const form = new FormData();
  form.append('file', fs.createReadStream(pdfPath));
  form.append('title', 'Integration Test Paper');
  // workspaceId intentionally omitted to trigger dev fallback
  const res = await fetch(`${BASE}/papers`, { method: 'POST', body: form });
  const json = await res.json();
  if (!res.ok) throw new Error('Upload failed ' + JSON.stringify(json));
  return json.data.paper;
}

async function list(workspaceId) {
  const res = await fetch(`${BASE}/papers?workspaceId=${workspaceId}`);
  return res.json();
}

async function get(id) {
  const res = await fetch(`${BASE}/papers/${id}`);
  return res.json();
}

async function update(id) {
  const res = await fetch(`${BASE}/papers/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Updated Title From Script' }),
  });
  return res.json();
}

async function remove(id) {
  const res = await fetch(`${BASE}/papers/${id}`, { method: 'DELETE' });
  return res.json();
}

(async () => {
  try {
    console.log('Uploading...');
    const paper = await upload();
    console.log('Uploaded paper id:', paper.id, 'workspace:', paper.workspaceId);

    console.log('Listing...');
    const listResp = await list(paper.workspaceId);
    console.log('List count:', listResp.data.length);

    console.log('Get one...');
    const getResp = await get(paper.id);
    console.log('Get title:', getResp.data.title);

    console.log('Updating metadata...');
    const updResp = await update(paper.id);
    console.log('Updated title:', updResp.data.title);

    console.log('Deleting...');
    const delResp = await remove(paper.id);
    console.log('Delete message:', delResp.message);

    console.log('Success.');
  } catch (e) {
    console.error('Flow error:', e);
    process.exit(1);
  }
})();
