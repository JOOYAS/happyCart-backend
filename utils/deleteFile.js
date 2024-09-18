const fs = require("fs");

// Function to delete a file
const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`failed to clean file: ${err}`);
        } else {
            console.log("File cleaned after use");
        }
    });
};

module.exports = deleteFile;
