const { PrismaClient } = require('@prisma/client');
const { pdfExtractionService } = require('../dist/app/services/pdfExtractionService');

const prisma = new PrismaClient();

async function testPDFProcessing() {
  try {
    console.log('🔍 Testing PDF Processing...');
    
    // Find a paper with "DRF_Interview_Questions" in the title
    const papers = await prisma.paper.findMany({
      where: {
        title: {
          contains: 'DRF_Interview_Questions',
          mode: 'insensitive'
        }
      },
      include: {
        file: true
      }
    });

    if (papers.length === 0) {
      console.log('❌ No papers found with "DRF_Interview_Questions" in title');
      
      // List all papers to help debug
      const allPapers = await prisma.paper.findMany({
        select: {
          id: true,
          title: true,
          processingStatus: true,
          file: {
            select: {
              objectKey: true
            }
          }
        },
        take: 10
      });
      
      console.log('📋 Available papers:');
      allPapers.forEach(paper => {
        console.log(`  - ${paper.title} (${paper.processingStatus}) - ${paper.file ? 'Has file' : 'No file'}`);
      });
      return;
    }

    const paper = papers[0];
    console.log(`📄 Found paper: ${paper.title}`);
    console.log(`📊 Current status: ${paper.processingStatus}`);
    console.log(`📁 File: ${paper.file ? paper.file.objectKey : 'No file'}`);

    if (!paper.file) {
      console.log('❌ Paper has no file attached');
      return;
    }

    // Test direct PDF processing
    console.log('🚀 Starting direct PDF processing...');
    const result = await pdfExtractionService.extractTextFromPDF(paper.id);

    if (result.success) {
      console.log('✅ PDF processing successful!');
      console.log(`📄 Pages: ${result.pageCount}`);
      console.log(`📝 Text length: ${result.text?.length || 0} characters`);
      console.log(`🧩 Chunks: ${result.chunks?.length || 0}`);
    } else {
      console.log('❌ PDF processing failed:', result.error);
    }

    // Check final status
    const updatedPaper = await prisma.paper.findUnique({
      where: { id: paper.id },
      include: {
        file: true
      }
    });

    console.log(`📊 Final status: ${updatedPaper.processingStatus}`);
    if (updatedPaper.processingError) {
      console.log(`❌ Error: ${updatedPaper.processingError}`);
    }

  } catch (error) {
    console.error('💥 Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testPDFProcessing();
