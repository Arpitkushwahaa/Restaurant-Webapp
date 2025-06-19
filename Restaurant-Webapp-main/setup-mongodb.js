/**
 * MongoDB Setup Script
 * This script helps set up either a MongoDB Atlas connection
 * or a local MongoDB connection for the food app.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const envPath = path.join(__dirname, '.env');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to write to .env file
function writeEnvFile(mongoUri) {
  const envContent = `# MongoDB Connection
MONGO_URI=${mongoUri}

# JWT Secret key
SECRET_KEY=thisisasecretkeyandshouldbereplacedinproduction

# Server port (to match client expectations)
PORT=8085

# Node environment
NODE_ENV=development
`;

  fs.writeFileSync(envPath, envContent);
  console.log(`\n✅ .env file created at: ${envPath}`);
}

// ASCII Art Header
console.log(`
=======================================================
 ______               _                            
|  ____|             | |     /\\                    
| |__ ___   ___   ___| |    /  \\   _ __  _ __     
|  __/ _ \\ / _ \\ / __| |   / /\\ \\ | '_ \\| '_ \\    
| | | (_) | (_) | (__| |  / ____ \\| |_) | |_) |   
|_|  \\___/ \\___/ \\___|_| /_/    \\_\\ .__/| .__/    
                                  | |   | |       
                                  |_|   |_|       
=======================================================
               MongoDB Setup Assistant
=======================================================
`);

console.log("This script will help you set up MongoDB for your food app.\n");

// Ask user for MongoDB connection method
rl.question('Do you want to use:\n1. MongoDB Atlas (cloud)\n2. Local MongoDB\nChoose option (1/2): ', (answer) => {
  if (answer === '1') {
    console.log('\n📝 Setting up MongoDB Atlas connection');
    rl.question('\nEnter your MongoDB Atlas connection string: ', (mongoUri) => {
      if (!mongoUri || !mongoUri.startsWith('mongodb+srv://')) {
        console.log('⚠️ Invalid MongoDB Atlas URI. Using default local connection.');
        writeEnvFile('mongodb://localhost:27017/food-app');
      } else {
        writeEnvFile(mongoUri);
      }
      rl.close();
    });
  } else {
    console.log('\n📝 Setting up local MongoDB connection');
    console.log('Using default URI: mongodb://localhost:27017/food-app');
    writeEnvFile('mongodb://localhost:27017/food-app');
    rl.close();
  }
});

rl.on('close', () => {
  console.log(`
=======================================================
✅ MongoDB setup complete! 
  
🚀 Next steps:
   1. Start your MongoDB server (if using local MongoDB)
   2. Run the server with: npm start
   3. Default admin user will be created automatically
      Email: admin@eathub.com
      Password: admin123
=======================================================
`);
}); 