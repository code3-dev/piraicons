// Test script to verify connection to the target MongoDB database
require('dotenv').config();
const mongoose = require('mongoose');

// Function to get the target MongoDB connection string
function getTargetConnectionString() {
  const uri = process.env.TARGET_MONGODB_URI;
  const password = process.env.TARGET_MONGODB_PASSWORD;
  const database = process.env.TARGET_MONGODB_DATABASE || 'piraicons';
  
  if (!uri) {
    throw new Error('TARGET_MONGODB_URI environment variable is not defined');
  }
  
  if (!password) {
    throw new Error('TARGET_MONGODB_PASSWORD environment variable is not defined');
  }
  
  // Replace the password placeholder in the connection string
  return uri.replace('<db_password>', password);
}

async function testConnection() {
  try {
    const connectionString = getTargetConnectionString();
    console.log('Attempting to connect to target MongoDB...');
    
    const connection = await mongoose.createConnection(connectionString, {
      bufferCommands: true,
      // Increase timeouts to prevent operation timeouts
      socketTimeoutMS: 300000, // 5 minutes
      connectTimeoutMS: 60000, // 1 minute
      serverSelectionTimeoutMS: 60000, // 1 minute
      maxPoolSize: 5, // Reduce connection pool to avoid overwhelming the server
      autoIndex: false, // Disable automatic index creation for better performance
      // Set write concern to ensure data is properly written
      w: 'majority',
      wtimeoutMS: 60000, // 1 minute write timeout
    });
    
    console.log('✅ Successfully connected to target MongoDB!');
    console.log(`Database name: ${process.env.TARGET_MONGODB_DATABASE || 'piraicons'}`);
    
    // List all collections in the database
    const collections = await connection.db.listCollections().toArray();
    console.log('\nAvailable collections:');
    if (collections.length === 0) {
      console.log('No collections found (empty database)');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    await connection.close();
    console.log('\nConnection closed.');
  } catch (error) {
    console.error('❌ Error connecting to target MongoDB:', error.message);
    process.exit(1);
  }
}

testConnection();