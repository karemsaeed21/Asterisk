import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let app;

try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY?.includes('BEGIN PRIVATE KEY')) {
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin SDK initialized successfully');
  } else {
    console.warn('Firebase Admin SDK: Credentials missing or invalid. Initializing in sandbox mode.');
  }
} catch (error) {
  console.error('Firebase Admin SDK: Falling back to sandbox mode due to invalid key format.');
}

export { admin };
