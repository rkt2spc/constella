/**
 * Created by phong.tran.nam on 04/01/2017.
 */
'use strict';

const passport = require('passport'),
    crypto = require('crypto'),
    LocalStrategy = require('passport-local').Strategy,
    constant = require('../const/siteconst');

const User = Utils.getModel('User').Model;

passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function (email, password, done) {
        User
            .findOne({email: email})
            .exec((user, err) => {
                if (!user) {
                    return done(null, false, {
                        msg: constant.ACCOUNT_NOT_FOUND
                    });
                }
                // Return if password is wrong
                let salt = crypto.randomBytes(16).toString('hex');
                let hash = crypto.pbkdf2Sync(password, user.salt, 100000, 20, 'sha512').toString('hex');

                if (hass !== user.hash) {
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