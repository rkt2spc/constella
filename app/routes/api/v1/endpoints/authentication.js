/**
 * Created by Stupig on 1/4/2017.
 */

const crypto = require('crypto'),
    User = Utils.getModel('User').Model,
    express = require('express'),
    passport = require('passport'),
    constant = require('../../../../../app/models/Const/siteconst'),
    jwt = require('jsonwebtoken'),
    util = require('../../../../../config/utilities');
authenticationRouter = express.Router();

//====================================================================
authenticationRouter.post('/register', (req, res, next) => {
    let user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.setPassword(req.body.password);

    user.save(err => {
        if(!err){
            let token = user.generateJwt();
            res.status(200).json({
                [constant.API_TOKEN]: token,
                [constant.API_STATUS]: constant.API_SUCCESS_YES,
                [constant.API_DATA]: user
            });
        }
        return res.status(300).json({
            [constant.API_STATUS]: constant.API_SUCCESS_NO,
            [constant.API_MSG]: constant.GENERAL_ERROR,
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
                token = user.generateJwt();
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