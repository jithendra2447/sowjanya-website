import mongoose from 'mongoose';
import dns from 'dns';

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const DEFAULT_MONGODB_URI = 'mongodb+srv://lscollectionsstore_db_user:7EDn7WiD9aopRGaw@cluster0.d4msf3w.mongodb.net/lscollections?retryWrites=true&w=majority';

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const uri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      family: 4,
      tls: true,
      tlsAllowInvalidCertificates: true,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    throw error;
  }
};
