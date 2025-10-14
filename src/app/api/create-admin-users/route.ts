import { NextRequest, NextResponse } from 'next/server';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const adminUsers = [
  {
    email: 'guest@gmail.com',
    password: 'admin123456',
    name: 'Event Coordinator',
    role: 'coordinator'
  }
];

export async function POST(request: NextRequest) {
  try {
    const results = [];
    
    for (const userData of adminUsers) {
      try {
        console.log(`Creating user: ${userData.email}`);
        
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          userData.email, 
          userData.password
        );
        
        const user = userCredential.user;
        
        // Add user profile to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: userData.email,
          name: userData.name,
          role: userData.role,
          createdAt: new Date(),
          createdBy: 'admin-api'
        });
        
        results.push({
          email: userData.email,
          status: 'success',
          uid: user.uid
        });
        
      } catch (error: any) {
        console.error(`Error creating user ${userData.email}:`, error.message);
        
        results.push({
          email: userData.email,
          status: 'error',
          error: error.message
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Admin user creation process completed',
      results
    });
    
  } catch (error: any) {
    console.error('Error in admin user creation:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
