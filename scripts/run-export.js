// Script to run the database export locally
require('dotenv').config();
const http = require('http');

// Get the API key from environment variables
const apiKey = process.env.API_EXPORT_KEY;

if (!apiKey) {
  console.error('❌ API_EXPORT_KEY is not defined in your .env file');
  process.exit(1);
}

// Function to make a request to the export API
async function runExport() {
  return new Promise((resolve, reject) => {
    console.log('Starting database export...');
    
    // Create options for the HTTP request
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/db/export?key=${apiKey}`,
      method: 'GET',
    };
    
    // Make the request
    const req = http.request(options, (res) => {
      let data = '';
      
      // A chunk of data has been received
      res.on('data', (chunk) => {
        data += chunk;
        // Log progress to show the script is still running
        process.stdout.write('.');
      });
      
      // The whole response has been received
      res.on('end', () => {
        process.stdout.write('\n'); // End the progress dots with a newline
        try {
          const result = JSON.parse(data);
          if (result.success) {
            console.log('✅ Database export completed successfully!');
            console.log('\nResults:');
            result.results.forEach(collection => {
              console.log(`- ${collection.collection}: ${collection.count} documents exported (${collection.status})`);
            });
            resolve(result);
          } else {
            console.error('❌ Database export failed:', result.message || result.error || 'Unknown error');
            if (result.results) {
              console.log('\nPartial results:');
              result.results.forEach(collection => {
                const status = collection.status === 'error' ? `ERROR: ${collection.error}` : collection.status;
                console.log(`- ${collection.collection}: ${collection.count} documents exported (${status})`);
              });
            }
            reject(new Error(result.message || result.error || 'Unknown error'));
          }
        } catch (error) {
          console.error('❌ Error parsing response:', error.message);
          console.error('Raw response:', data);
          reject(error);
        }
      });
    });
    
    // Handle errors
    req.on('error', (error) => {
      console.error('❌ Error making request:', error.message);
      reject(error);
    });
    
    // End the request
    req.end();
  });
}

// Set a longer timeout for the HTTP request
http.globalAgent.maxSockets = 1; // Limit to one connection at a time
http.globalAgent.keepAlive = true;
http.globalAgent.keepAliveMsecs = 60000; // 1 minute

// Run the export
console.log('Make sure your Next.js server is running on http://localhost:3000');
console.log('This export process may take several minutes for large collections.');
console.log('Press Ctrl+C to cancel or wait 5 seconds to continue...');

// Wait 5 seconds before starting
setTimeout(() => {
  console.log('\nStarting export process... (dots indicate progress)');
  runExport()
    .then(() => {
      console.log('\nExport process completed successfully.');
    })
    .catch((error) => {
      console.error('\nExport process failed:', error.message);
      console.log('\nTroubleshooting tips:');
      console.log('1. Make sure your Next.js server is running');
      console.log('2. Check your MongoDB connection settings in .env');
      console.log('3. Verify your API_EXPORT_KEY is correct');
      console.log('4. For timeout issues, try increasing the timeout values in the export API');
      process.exit(1);
    });
}, 5000);