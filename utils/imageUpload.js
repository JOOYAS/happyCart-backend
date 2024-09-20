const cloudinaryInstance = require("../config/cloudinary");

const handleImageUpload = async (path) => {
    try {
        const uploadResult = await cloudinaryInstance.uploader.upload(path, {
            resource_type: "image",
        });
        if (!uploadResult.secure_url) {
            throw new Error("Image upload failed: No secure URL returned.");
        }
        return uploadResult.secure_url;
    } catch (error) {
        console.error("Image upload failed:", error.message || error);
        throw new Error("Failed to upload image");
    }
};

module.exports = handleImageUpload;
