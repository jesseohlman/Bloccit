const advertisementQueries = require("../db/queries.advertisements");

module.exports = {
  create(req, res, next){
    let newAd = {
      title: req.body.title,
      description: req.body.description
    };

    advertisementQueries.createAd(newAd, (err, ad) => {
      if(err){
        res.redirect(500, "/advertisements/new");
      } else {
        res.redirect(303, `/advertisements/${ad.id}`);
      }
    })
  },

    index(req, res, next){

        advertisementQueries.getAllAds((err, ads) => {
          if(err){
            res.redirect(500, "static/index");
          } else {
            res.render("advertisements/index", {ads});
          }
        })
     },

     new(req, res, next){
       res.render("advertisements/new");
     },
   
     show(req,res, next){
   
        advertisementQueries.getAd(req.params.id, (err, ad) => {
   
         if(err || ad == null){
           res.redirect(404, "/");
         } else {
           res.render("advertisements/show", {ad});
         }
       });
     },
   
     destroy(req, res, next){
        advertisementQueries.deleteAd(req.params.id, (err, ad) => {
         if(err){
           res.redirect(500, `/advertisements/${ad.id}`)
         } else {
           res.redirect(303, "/advertisements")
         }
       });
     },
   
     edit(req, res, next){
        advertisementQueries.getAd(req.params.id, (err, ad) => {
         if(err || ad == null){
           res.redirect(404, "/");
         } else {
           res.render("advertisements/edit", {ad});
         }
       });
     },
   
     update(req, res, next){
   
        advertisementQueries.updateAd(req.params.id, req.body, (err, ad) => {
   
         if(err || ad == null){
           res.redirect(404, `/advertisements/${req.params.id}/edit`);
         } else {
           res.redirect(`/advertisements/${ad.id}`);
         }
       });
     }
}