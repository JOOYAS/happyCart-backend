const mongoose = require("mongoose");

//to check the _id in params is object id or not
//else have chance to get error
function validateObjectId(req, res, next) {
    const id = Object.values(req.params)[0];

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID format." });
    }

    next();
}

module.exports = validateObjectId;
