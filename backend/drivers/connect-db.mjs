import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const dbConnection = async () => {
  try {
    const uri = process.env.MONGODB_URI + process.env.MONGODB_DB;
    await mongoose.connect(uri);
    console.log('Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};
