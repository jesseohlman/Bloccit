const express = require("express");
//const routeConfig = require("./config/route-config");
const appConfig = require("./config/main-config");
const app = express();

const mainRoute = require("./routes/static");
const routeConfig = require("./config/route-config.js");

appConfig.init(app, express);
routeConfig.init(app);

app.use('/', mainRoute);

module.exports = app;