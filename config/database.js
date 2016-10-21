var mongoose = require('mongoose');
mongoose.Promise = global.Promise; //Use native ES6 Promise instead of Mongoose's default

//------------------------------------------------------------------------
module.exports = {
	
	//Options
	connectionString: process.env.DATABASE_URL || 'mongodb://localhost/flightdb',


	//Methods
	connect: function(connectionString, callback) {

		mongoose.connect(this.connectionString, function(err) {

            if (err) {
            	console.error('cant connect to mongoDB at:', connectionString);
            	callback(err);
            	return;
            }

            console.log('mongoDB connected at:', connectionString);
            callback();
        });
	}
}