module.exports = {
    index(req, res, next){
        res.render("static/index", {title: "Welcome to Bloccit"});
    },
    aboutPage(req, res, next){
        res.render("static/about", {title: "About us"});
    }
}