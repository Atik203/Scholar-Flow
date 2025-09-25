// Script to create the missing user based on the token details
require('dotenv/config');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createUserIfNotExists() {
  const userId = '1fd6cc62-630f-4aaf-a1fc-c10b58c9286d';
  const userEmail = 'atikurrahaman0305@gmail.com';

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (existingUser) {
      console.log('✅ User found:', existingUser.email, 'isDeleted:', existingUser.isDeleted);
      
      // If user is soft-deleted, restore them
      if (existingUser.isDeleted) {
        const restoredUser = await prisma.user.update({
          where: { id: userId },
          data: { isDeleted: false }
        });
        console.log('✅ User restored from soft-delete:', restoredUser.email);
      }
      return;
    }

    // Check if user exists by email
    const existingByEmail = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (existingByEmail) {
      console.log('✅ User exists with different ID:', existingByEmail);
      console.log('❌ This is the issue - JWT has different ID than database');
      return;
    }

    // Create the user with the exact ID from the JWT
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        email: userEmail,
        name: 'Md. Atikur Rahaman',
        role: 'RESEARCHER',
        emailVerified: new Date(),
      }
    });

    console.log('✅ User created successfully:', newUser);

    // Create a default workspace for the user
    const workspace = await prisma.workspace.create({
      data: {
        name: 'My Workspace',
        ownerId: userId,
      }
    });

    console.log('✅ Workspace created:', workspace);

    // Add user as workspace member
    await prisma.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: userId,
        role: 'RESEARCHER',
      }
    });

    console.log('✅ User added as workspace member');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUserIfNotExists();