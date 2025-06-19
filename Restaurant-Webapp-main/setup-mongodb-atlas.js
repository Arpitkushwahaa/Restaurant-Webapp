/**
 * MongoDB Atlas Setup Script
 * 
 * This script helps set up MongoDB Atlas for the food app.
 */

const fs = require('fs');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`
=======================================================
 MongoDB Atlas Setup for Food App
=======================================================

This script will help you set up MongoDB Atlas for your food app.

Follow these steps:

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (the free tier is sufficient)
3. Create a database user with read/write permissions
4. Add your IP address to the IP whitelist (or use 0.0.0.0/0 for all IPs)
5. Get your connection string from Atlas (Click "Connect" > "Connect your application")

=======================================================
`);

rl.question('Enter your MongoDB Atlas connection string: ', (connectionString) => {
  if (!connectionString || !connectionString.includes('mongodb+srv://')) {
    console.log('⚠️ Invalid MongoDB Atlas connection string. It should start with "mongodb+srv://"');
    rl.close();
    return;
  }

  // Update the connection string in the database connection file
  const dbFilePath = './server/db/connectDB.ts';
  
  try {
    let dbContent = fs.readFileSync(dbFilePath, 'utf8');
    
    // Replace the MongoDB Atlas connection string
    dbContent = dbContent.replace(
      /const MONGODB_ATLAS = ".*";/,
      `const MONGODB_ATLAS = "${connectionString}";`
    );
    
    fs.writeFileSync(dbFilePath, dbContent);
    console.log('✅ MongoDB Atlas connection string updated successfully!');
    
    // Create a .env file
    const envContent = `# MongoDB Connection
MONGO_URI=${connectionString}

# JWT Secret key
SECRET_KEY=thisisasecretkeyandshouldbereplacedinproduction

# Server port
PORT=8085

# Node environment
NODE_ENV=development
`;
    
    fs.writeFileSync('./.env', envContent);
    console.log('✅ .env file created with MongoDB Atlas connection string');
    
  } catch (error) {
    console.error('❌ Error updating connection string:', error.message);
  }
  
  rl.close();
});

rl.on('close', () => {
  console.log(`
=======================================================
Setup complete! 

Next steps:
1. Start your server: npm start
2. Your app will now connect to MongoDB Atlas

To create an admin user, log in with:
- Email: admin@example.com
- Password: admin123
=======================================================
`);
}); 