const postQueries = require("../db/queries.posts.js");
const Authorizer = require("../policies/post");


module.exports = {
    new(req, res, next){

        const authorized = new Authorizer(req.user).new();

        if(authorized){

        res.render("posts/new", {topicId: req.params.topicId});
        } else {
            req.flash("You ar not authorized to do that.");
            res.redirect(`/topics/${req.params.id}`);
        }
    },

    create(req, res, next){

        const authorized = new Authorizer(req.user).create();

        if(authorized){
            
            let newPost= {
                title: req.body.title,
                body: req.body.body,
                topicId: req.params.topicId,
                userId: req.user.id
            };
            postQueries.addPost(newPost, (err, post) => {
                if(err){
                    res.redirect(500, "/posts/new");
                } else {
                    res.redirect(303, `/topics/${newPost.topicId}/posts/${post.id}`);
                }
            });
        } else {
            req.flash("notice", "You ar not authorized to do that.");
            res.redirect(`/topics/${req.params.id}`);
        }

        

    },

    show(req, res, next){
        postQueries.getPost(req.params.id, (err, post) => {
            if(err || post == null){
                res.redirect(404, "/");
            } else {
                res.render("posts/show", {post});
            }
        });
    },

    edit(req, res, next){

        

    postQueries.getPost(req.params.id, (err, post) => {
        if(err || post == null){
            res.redirect(404, "/");
        } else {
    //{post} passes the post into the ejs file so it can access its properties
                    
        const authorized = new Authorizer(req.user, post).edit();

            if(authorized){
                res.render("posts/edit", {post});
            } else {
                req.flash("You ar not authorized to do that.");
                res.redirect(`/topics/${req.params.id}`);
            }
                }

        });

        
    },

    update(req, res, next){
        postQueries.updatePost(req, req.body, (err, post) => {
            if(err || post == null){
                res.redirect(401, `/topics/${req.params.topicId}/posts/${req.params.id}/edit`);
            } else {
                res.redirect(`/topics/${req.params.topicId}/posts/${req.params.id}`);
            }
        });
    },

    destroy(req, res, next){
        postQueries.deletePost(req, (err, deletedRecordsCount) => {
            if(err){
                res.redirect(500, `/topics/${req.params.topicId}/posts/${req.params.id}`);
            } else {
                res.redirect(303, `/topics/${req.params.topicId}`);
            }
        });
    }
}