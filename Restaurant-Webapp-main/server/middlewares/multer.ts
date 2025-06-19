import multer from "multer"

// Configure storage for file uploads
const storage = multer.memoryStorage();

// Export the configured multer instance
export const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});