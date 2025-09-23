/**
 * Test script to verify paper upload functionality after database migration
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BACKEND_URL = 'http://localhost:5000';

// Test JWT token (replace with a valid token from your auth system)
const TEST_JWT = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmOTk2M2JiNi1jMWM5LTQ5ZDEtODlkZS00ODUxNmNjM2Y1NDEiLCJlbWFpbCI6ImF0aWt1cnJhaGFtYW4wMzA0QGdtYWlsLmNvbSIsInJvbGUiOiJSRVNFQVJDSEVSIiwiaWF0IjoxNzU4NjU0MzY1LCJleHAiOjE3NTg2NTc5NjV9.FXZPHZ8HVv6ovBOnErrtuitMlqMb5p18EBirYNI-uUo';

async function testPaperUpload() {
  try {
    console.log('🧪 Testing paper upload with minimal fields...');
    
    // Create a simple test PDF content
    const testPdfContent = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<</Font<</F1 4 0 R>>>>>>endobj 4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Times-Roman>>endobj xref 0 5 0000000000 65535 f 0000000010 00000 n 0000000053 00000 n 0000000125 00000 n 0000000209 00000 n trailer<</Size 5/Root 1 0 R>>startxref 284 %%EOF');
    
    const form = new FormData();
    
    // Add file
    form.append('file', testPdfContent, {
      filename: 'test-minimal.pdf',
      contentType: 'application/pdf'
    });
    
    // Add minimal form data - only required authors field
    form.append('authors', JSON.stringify(['Test Author']));
    
    console.log('📤 Uploading test paper...');
    
    const response = await axios.post(`${BACKEND_URL}/api/papers`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': TEST_JWT
      },
      timeout: 10000
    });
    
    console.log('✅ Paper upload successful!');
    console.log('📋 Response status:', response.status);
    console.log('📄 Paper ID:', response.data.paper?.id);
    console.log('📝 Paper title:', response.data.paper?.title);
    
    return response.data.paper;
    
  } catch (error) {
    console.error('❌ Paper upload failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

async function testWithCompleteFields() {
  try {
    console.log('\n🧪 Testing paper upload with complete fields...');
    
    const testPdfContent = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<</Font<</F1 4 0 R>>>>>>endobj 4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Times-Roman>>endobj xref 0 5 0000000000 65535 f 0000000010 00000 n 0000000053 00000 n 0000000125 00000 n 0000000209 00000 n trailer<</Size 5/Root 1 0 R>>startxref 284 %%EOF');
    
    const form = new FormData();
    
    // Add file
    form.append('file', testPdfContent, {
      filename: 'test-complete.pdf',
      contentType: 'application/pdf'
    });
    
    // Add complete form data
    form.append('title', 'Test Paper with Complete Fields');
    form.append('authors', JSON.stringify(['Alice Smith', 'Bob Johnson']));
    form.append('year', '2024');
    form.append('source', 'upload');
    
    console.log('📤 Uploading test paper with complete fields...');
    
    const response = await axios.post(`${BACKEND_URL}/api/papers`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': TEST_JWT
      },
      timeout: 10000
    });
    
    console.log('✅ Complete paper upload successful!');
    console.log('📋 Response status:', response.status);
    console.log('📄 Paper ID:', response.data.paper?.id);
    console.log('📝 Paper title:', response.data.paper?.title);
    console.log('👥 Authors:', response.data.paper?.metadata?.authors);
    console.log('📅 Year:', response.data.paper?.metadata?.year);
    
    return response.data.paper;
    
  } catch (error) {
    console.error('❌ Complete paper upload failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

async function main() {
  console.log('🔬 Scholar-Flow Paper Upload Test\n');
  
  try {
    // Test 1: Minimal fields (the scenario that was failing)
    await testPaperUpload();
    
    // Test 2: Complete fields
    await testWithCompleteFields();
    
    console.log('\n🎉 All tests passed! Paper upload is working correctly.');
    
  } catch (error) {
    console.log('\n💥 Tests failed. The database migration fix might need more work.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}