 const flairQueries = require("../db/queries.flairs");

 module.exports = {

    index(req, res, next){
        flairQueries.getAllFlairs((err, flairs) => {
            if(err){
                res.redirect(500, "/");
              } else {
                res.render("flairs/index", {flairs});
              }
            });
        },

    new(req, res, next){
            res.render("flairs/new");
        },

    create(req, res, next){

        let newFlair = {
            name: req.body.name,
            color: req.body.color,
            topicId: req.params.id
        };

        flairQueries.addFlair(newFlair, (err, flair) => {
            if(err){
                res.redirect(500, "/topics/:topicId/flairs");
              } else {
                res.redirect(303, `/topics/:topicId`);
              }
        });
    },


}