var path = require('path');

module.exports = {

    root_path: path.join(__dirname, '..'),

    //Functions
    app_path: function(subpath) {
        return path.join(this.root_path, 'app', subpath);  
    },

    getConfig: function(configName) {
        return require(
                path.join(this.root_path, 'config', configName)
            );
    },

    getModel: function(modelName) { //require the model in 'app/models'
        return require(
            this.app_path(
                path.join('models', modelName)
            ));
    },

    getDataModel: function(modelName) {
        return this.getModel(
                path.join('data-models', modelName)
            );
    },

    getValidator: function(validatorName) {
        return require(
            this.app_path(
                path.join('validators', validatorName)
            ));
    },
    
    getRouter: function(routeName) { //require the route handler in 'app/routes'
        return require(
            this.app_path(
                path.join('routes', routeName)
            ));
    },

    getAPIResponse:  function(isSuccess, msg, data) {
        return {
            'status': isSuccess,
            'msg': msg,
            'data': data
        };
    },

    getFacebookConfig: function () {
        return {
                'clientID'      : '1665091573789267', // your App ID
                'clientSecret'  : 'df76713db423da346da389f3472a7e2b', // your App Secret
                'callbackURL'   : 'http://localhost:1337/auth/facebook/callback'
        }
    }
};