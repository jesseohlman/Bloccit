module.exports = {
    init(app){
        const staticRoutes = require("../routes/static");
        const topicRoutes = require("../routes/topics");
        const advertisementRoutes = require("../routes/advertisements");

        app.use(advertisementRoutes);
        app.use(staticRoutes);
        app.use(topicRoutes);
    }
}