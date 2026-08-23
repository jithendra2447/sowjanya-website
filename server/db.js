import mongoose from 'mongoose';
import dns from 'dns';

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

export const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.log('[MongoDB] MONGODB_URI is not set. Database connection is disconnected.');
    return;
  }

  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      family: 4,
      tls: true,
      tlsAllowInvalidCertificates: true,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
  }
};
