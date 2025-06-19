import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route";
import restaurantRoute from "./routes/restaurant.route";
import menuRoute from "./routes/menu.route";
import orderRoute from "./routes/order.route";
import path from "path";

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

const PORT = process.env.PORT || 8085;

const DIRNAME = path.resolve();

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
    app.use(express.static(path.join(DIRNAME,"/client/dist")));
    app.get("*",(_,res) => {
        res.sendFile(path.resolve(DIRNAME, "client","dist","index.html"));
    });
}

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`✅ Server is running at http://localhost:${PORT}`);
    });
};

startServer();