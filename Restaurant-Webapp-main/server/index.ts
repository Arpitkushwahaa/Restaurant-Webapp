import dotenv from "dotenv";
import path from "path";

// Try to load from different possible locations
const envPaths = [
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '.env'),
    path.resolve(process.cwd(), '.env')
];

for (const envPath of envPaths) {
    const result = dotenv.config({ path: envPath });
    if (!result.error) {
        console.log(`Loaded environment from: ${envPath}`);
        break;
    }
}

import express from "express";
import connectDB from "./db/connectDB";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route";
import restaurantRoute from "./routes/restaurant.route";
import menuRoute from "./routes/menu.route";
import orderRoute from "./routes/order.route";
import fs from "fs";

const app = express();

const PORT = process.env.PORT || 8085;

const DIRNAME = path.resolve();
console.log("Current directory:", DIRNAME);

// default middleware for any mern project
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(cookieParser());

// More flexible CORS options
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177",
    "https://restaurant-webapp-client.vercel.app", // Vercel frontend URL
];
const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};
app.use(cors(corsOptions))

// api
app.use("/api/v1/user", userRoute);
app.use("/api/v1/restaurant", restaurantRoute);
app.use("/api/v1/menu", menuRoute);
app.use("/api/v1/order", orderRoute);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    const clientPath = path.join(DIRNAME, "client", "dist");
    const indexHtmlPath = path.join(clientPath, "index.html");
    
    console.log("Looking for client files at:", clientPath);
    console.log("Looking for index.html at:", indexHtmlPath);
    
    // Check if client/dist exists
    try {
        if (fs.existsSync(clientPath)) {
            console.log("✅ Client dist folder found");
            if (fs.existsSync(indexHtmlPath)) {
                console.log("✅ index.html found");
            } else {
                console.log("❌ index.html not found");
                // List files in the dist directory to help debug
                const files = fs.readdirSync(clientPath);
                console.log("Files in dist directory:", files);
            }
        } else {
            console.log("❌ Client dist folder not found");
        }
    } catch (err) {
        console.error("Error checking client files:", err);
    }
    
    // Serve static files from the client/dist directory
    app.use(express.static(clientPath));
    
    // For any other routes, serve the index.html
    app.get("*", (_, res) => {
        res.sendFile(indexHtmlPath);
    });
}

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`✅ Server is running at http://localhost:${PORT}`);
    });
};

startServer();