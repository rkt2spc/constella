/**
 * Created by phong.tran.nam on 04/01/2017.
 */
'use strict';

const crypto = require('crypto'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    constant = require('../app/models/Const/siteconst');

const User = Utils.getModel('User').Model;

module.exports = passport => {
    passport.use(new LocalStrategy({
            usernameField: 'email'
        },
        function (email, password, done) {
            User
                .findOne({email: email})
                .exec((err, user) => {
                    if (!user) {
                        return done(null, false, {
                            msg: constant.ACCOUNT_NOT_FOUND
                        });
                    }
                    // Return if password is wrong
                    if (!user.validPassword(password)) {
                        return done(null, false, {
                            msg: constant.PASSWORD_WRONG
                        });
                    }
                    // If credentials are correct, return the user object
                    // remove password property of response data
                    user.hash = '';
                    user.salt = '';
                    return done(null, user);
                });
        }
    ));

    let configFaceAuth = Utils.getFacebookConfig();
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID: configFaceAuth.clientID,
        clientSecret: configFaceAuth.clientSecret,
        callbackURL: configFaceAuth.callbackURL

    },
        function(token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function() {

                // find the user in the database based on their facebook id
                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newUser = new User();

                        // set all of the facebook information in our user model
                        newUser.facebook.id = profile.id; // set the users facebook id
                        newUser.facebook.token = token; // we will save the token that facebook provides to the user
                        newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                        // save our user to the database
                        newUser.save(function (err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }
                });
            });
        }))
};
