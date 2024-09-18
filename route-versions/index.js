const express = require("express");
const v1Router = require("./v1");
const apiRouter = express.Router();

apiRouter.get("/", (req, res) => res.send("choose version"));
apiRouter.use("/v1", v1Router);

module.exports = { apiRouter };
