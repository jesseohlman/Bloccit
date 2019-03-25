 const flairQueries = require("../db/queries.flairs");

 module.exports = {

    /*index(req, res, next){
        flairQueries.getAllFlairs((err, flairs) => {
            if(err){
                res.redirect(500, "/");
              } else {
                res.render("flairs/index", {flairs});
              }
            });
        },*/

    new(req, res, next){
            res.render("flairs/new", {topicId: req.params.topicId, postId: req.params.id});
        },

    create(req, res, next){

        let newFlair = {
            name: req.body.name,
            color: req.body.color,
            postId: req.params.id
        };

        flairQueries.addFlair(newFlair, (err, flair) => {
            if(err){
                res.redirect(500, `/topics/${req.params.topicId}/posts/${req.params.id}`);
              } else {
                res.redirect(303, `/topics/${req.params.topicId}/posts/${req.params.id}`);
              }
        });
    },

    show(req, res, next){
        flairQueries.getFlair(req.params.flairId, (err, flair) => {
            if(err || flair == null){
                res.redirect(404, "/");
            } else {
                res.render("flairs/show", {flair, topicId: req.params.topicId, postId: req.params.id});
            }
        });
    },

    edit(req, res, next){
    flairQueries.getFlair(req.params.flairId, (err, flair) => {
        if(err || flair == null){
            res.redirect(404, "/");
        } else {
                res.render("flairs/edit", {flair, topicId: req.params.topicId, postId: req.params.id});
            }
        });

        
    },

    update(req, res, next){
        flairQueries.updateFlair(req, req.body, (err, flair) => {
            if(err || flair == null){
                res.redirect(401, `/topics/${req.params.topicId}/posts/${req.params.id}/flairs/${this.params.flairId}/edit`);
            } else {
                res.redirect(`/topics/${req.params.topicId}/posts/${req.params.id}`);
            }
        });
    },

    destroy(req, res, next){

        flairQueries.deleteFlair(req.params.flairId, (err, flair) => {
            if(err || flair == null){
                res.redirect(401, `/topics/${req.params.topicId}/posts/${req.params.id}/flairs/${this.params.flairId}/edit`);
            } else {
                res.redirect(`/topics/${req.params.topicId}/posts/${req.params.id}`);
            }
        })
    }


}