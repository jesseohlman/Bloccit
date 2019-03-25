const ApplicationPolicy = require("./application");

module.exports = class TopicPolicy extends ApplicationPolicy {

    edit() {

        if(this._isAdmin() || this._isOwner()){
            return true
        } else {
            return false
        }
    }

    update() {
        return this.edit();
    }

    destroy() {
        return this.update();
    }
}