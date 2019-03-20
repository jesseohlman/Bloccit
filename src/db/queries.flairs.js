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
        return Flair.create({
            name: newFlair.name,
            color: newFlair.color
        })
        .then((flair) => {
            callback(null, flair);
        })
        .catch((err) => {
            callback(err);
        })
    },

    deleteFlair(id, callback){
        return Flair.destroy({
            where: {id}
        })
        .then((topic) => {
            callback(null, topic);
        })
        .catch ((err) => {
            callback(err);
        })
    },
}
