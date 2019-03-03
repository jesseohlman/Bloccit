const express = require("express");
const app = express();

app.get("/marco", (req, res, next) => {
    res.send("polo");
});

module.exports = app;