/**
 * Created by phong.tran.nam on 04/01/2017.
 */
'use strict';

const passport = require('passport'),
    crypto = require('crypto'),
    LocalStrategy = require('passport-local').Strategy,
    constant = require('../app/models/Const/siteconst');

const User = Utils.getModel('User').Model;

module.exports = passport.use(new LocalStrategy({
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