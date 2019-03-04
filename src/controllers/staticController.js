module.exports = {
    index(req, res, next){
        res.render("static/index", {title: "Welcome to Bloccit"});
    },
    pageTitle(req, res, next){
        res.render("static/index", {page: "The About Page!"});
    }
}