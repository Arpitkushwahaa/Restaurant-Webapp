const fs = require('fs');
const path = require('path');

console.log('Running pre-start check for client build files...');

const clientDistPath = path.join(__dirname, 'client', 'dist');
const indexHtmlPath = path.join(clientDistPath, 'index.html');

// Check if client/dist exists
if (!fs.existsSync(clientDistPath)) {
    console.log('❌ Client dist directory not found. Creating empty directory structure...');
    try {
        // Create the client/dist directory
        fs.mkdirSync(clientDistPath, { recursive: true });
        console.log('✅ Created empty client/dist directory');
        
        // Create placeholder index.html
        const placeholderHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restaurant Web App</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
            text-align: center;
        }
        .container {
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #e53e3e;
        }
        p {
            line-height: 1.6;
        }
        .api-status {
            margin-top: 20px;
            padding: 15px;
            border-radius: 4px;
            background-color: #f0f4f8;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Restaurant Web App API</h1>
        <p>The backend API is running successfully! This is a placeholder page.</p>
        <p>The frontend application hasn't been built yet or is being served from another location.</p>
        
        <div class="api-status">
            <h3>API Status: Online</h3>
            <p>You can access the REST API at /api/v1/</p>
        </div>
    </div>
</body>
</html>
`;
        
        fs.writeFileSync(indexHtmlPath, placeholderHtml);
        console.log('✅ Created placeholder index.html');
    } catch (err) {
        console.error('Error creating client build structure:', err);
        process.exit(1);
    }
} else {
    if (!fs.existsSync(indexHtmlPath)) {
        console.log('❌ index.html not found in client/dist directory. Creating placeholder...');
        // Create placeholder index.html
        const placeholderHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restaurant Web App</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
            text-align: center;
        }
        .container {
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #e53e3e;
        }
        p {
            line-height: 1.6;
        }
        .api-status {
            margin-top: 20px;
            padding: 15px;
            border-radius: 4px;
            background-color: #f0f4f8;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Restaurant Web App API</h1>
        <p>The backend API is running successfully! This is a placeholder page.</p>
        <p>The frontend application hasn't been built yet or is being served from another location.</p>
        
        <div class="api-status">
            <h3>API Status: Online</h3>
            <p>You can access the REST API at /api/v1/</p>
        </div>
    </div>
</body>
</html>
`;
        
        try {
            fs.writeFileSync(indexHtmlPath, placeholderHtml);
            console.log('✅ Created placeholder index.html');
        } catch (err) {
            console.error('Error creating placeholder index.html:', err);
            process.exit(1);
        }
    } else {
        console.log('✅ Client build files found and ready to serve');
    }
}

console.log('Pre-start check complete!'); 