const express = require("express");
const app = express();

const mainRoute = require("./routes/static");
//const routeConfig = require("./config/route-config.js");

//routeConfig.init(app);

app.use('/', mainRoute);

module.exports = app;