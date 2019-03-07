const Ad = require("./models").Advertisement;

module.exports = {
    createAd(newAd, callback){
        return Ad.create({
            title: newAd.title,
            description: newAd.description
        })
        .then((ad) => {
            callback(null, ad);
        })
        .catch((err) => {
            callback(err);
        })
    },

    getAllAds(callback){
        return Ad.all()
        .then((ads) => {
            callback(null, ads);
        })
        .catch((err) => {
            callback(err);
        })
    },

        getAd(id, callback){
            return Ad.findById(id)
            .then((ad) => {
                callback(null, ad);
            })
            .catch((err) => {
                callback(err);
            });
        },

        deleteAd(id, callback){
            return Ad.destroy({
                where: {id}
            })
            .then((ad) => {
                callback(null, ad);
            })
            .catch ((err) => {
                callback(err);
            })
        },

        updateAd(id, updatedAd, callback){
            return Ad.findById(id)
            .then((ad) => {
                if(!ad){
                    return callback("Advertisement not found");
                }

                ad.update(updatedAd, {
                    fields: Object.keys(updatedAd)
                })
                .then(() => {
                    callback(null, ad);
                })
                .catch((err) => {
                    callback(err);
                });
            });
        }
}