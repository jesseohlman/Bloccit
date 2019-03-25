const Topic = require("./models").Topic;
const Flair = require("./models").Flair;

module.exports = {
    getAllFlairs(callback){
        return Flair.all()
        .then((flairs) => {
         callback(null, flairs);
        })
        .catch((err) => {
            callback(err);
        })
    },

    addFlair(newFlair, callback){
        return Flair.create(newFlair)
        .then((flair) => {
            callback(null, flair);
        })
        .catch((err) => {
            callback(err);
        })
    },

    getFlair(id, callback){
        return Flair.findById(id)
        .then((flair) => {
            callback(null, flair);
        })
        .catch ((err) => {
            callback(err);
        })
    },

    deleteFlair(id, callback){
        return Flair.destroy({
            where: {id}
        })
        .then((flair) => {
            callback(null, flair);
        })
        .catch ((err) => {
            callback(err);
        })
    },

    updateFlair(req, updatedFlair, callback){
        return Flair.findById(req.params.flairId)
        .then((flair) => {
            if(!flair){
                return callback("Flair not found");
            }
                flair.update(updatedFlair, {
                    fields: Object.keys(updatedFlair)
                })
                .then(() => {
                    callback(null, flair);
                })
                .catch((err) => {
                    callback(err);
                });
        });
    },
}
