import cloudinary from "./cloudinary";

const uploadImageOnCloudinary = async (file: Express.Multer.File) => {
    try {
        // For development mode, return a placeholder image
        if (process.env.NODE_ENV === "development") {
            return `https://placehold.co/600x400?text=Placeholder+Image`;
        }
        
        // For production, use actual cloudinary upload
        const base64Image = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${file.mimetype};base64,${base64Image}`;
        const uploadResponse = await cloudinary.uploader.upload(dataURI);
        return uploadResponse.secure_url;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return ""; // Return empty string if upload fails
    }
};

export default uploadImageOnCloudinary;