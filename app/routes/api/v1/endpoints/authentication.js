/**
 * Created by Stupig on 1/4/2017.
 */

const ObjectId = require('mongoose').Types.ObjectId,
    crypto = require('crypto'),
    User = Utils.getModel('User').Model,
    express = require('express'),
    passport = require('passport'),
    constant = require('../../../../../app/models/Const/siteconst'),
    jwt = require('jsonwebtoken'),
    util = require('../../../../../config/utilities');
authenticationRouter = express.Router();

let generateJwt = user => {
    let expiry = new Date();
    expiry.setDate(expiry.getDate() + 7); // Expire token is 7 days

    return jwt.sign({
        user_id: user.user_id,
        email: user.email,
        username: user.username,
        exp: parseInt(expiry.getTime() / 1000),
    }, constant.SECRET);
};

//====================================================================
authenticationRouter.post('/register', (req, res, next) => {
    let salt = crypto.randomBytes(16).toString('hex');
    let hash = crypto.pbkdf2Sync(req.body.password, salt, 100000, 20, 'sha512').toString('hex');
    let user = new User({
        username: req.body.username,
        email: req.body.email,
        salt: salt,
        hash: hash
    });

    User.create(user, (err, user) => {
        if (!err) {
            if (user) {
                return res.status(200).json({
                    [constant.API_STATUS]: constant.API_SUCCESS_YES,
                    [constant.API_MSG]: constant.SUCCESS,
                    [constant.API_DATA]: user
                });
            }
            return res.status(300).json({
                [constant.API_STATUS]: constant.API_SUCCESS_NO,
                [constant.API_MSG]: constant.GENERAL_ERROR,
            });
        }
        return res.status(300).json({
            [constant.API_STATUS]: constant.API_SUCCESS_NO,
            [constant.API_MSG]: constant.GENERAL_ERROR + " " + err.message
        });
    });
});

authenticationRouter.post('/login', function (req, res, next) {

    if (!req.body.email || !req.body.password) {
        res.json(util.getAPIResponse(constant.API_SUCCESS_NO, constant.INPUT_REQUIRED, null));
        return;
    }

    passport.authenticate('local', function (err, user, info) {
        let token;
        // If Passport throws/catches an error
        if (err) {
            res.json(util.getAPIResponse(constant.API_SUCCESS_NO, err, null));
        } else {
            // If a user is found
            if (user) {
                token = generateJwt(user);
                res.status(200).json({
                    [constant.API_TOKEN]: token,
                    [constant.API_STATUS]: constant.API_SUCCESS_YES,
                    [constant.API_DATA]: user
                });
            } else {
                // If user is not found
                res.status(401).json(util.getAPIResponse(constant.API_SUCCESS_NO, constant.ACCOUNT_NOT_FOUND, null));
            }
        }
    })(req, res, next);
});

//====================================================================
module.exports = authenticationRouter;