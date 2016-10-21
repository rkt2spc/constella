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
    
    getRouter: function(routeName) { //require the route handler in 'app/routes'
        return require(
            this.app_path(
                path.join('routes', routeName)
            ));
    }
}


