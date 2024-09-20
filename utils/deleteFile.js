const fs = require("fs");

// Function to delete a file
const deleteFile = async (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`failed to clean file: ${err}`);
        }
    });
};

module.exports = deleteFile;
