/**
 * Created by Stupig on 1/4/2017.
 */

const ObjectId = require('mongoose').Types.ObjectId,
    crypto = require('crypto'),
    User = Utils.getModel('User').Model,
    express = require('express'),
    constant = require('../../../../../app/models/Const/siteconst');
    authenticationRouter = express.Router();

//====================================================================
authenticationRouter.post('/register', (req, res, next)=> {
    let salt = crypto.randomBytes(16).toString('hex');
    let hash = crypto.pbkdf2Sync(req.body.password, salt, 100000, 20, 'sha512').toString('hex');
    let user = new User({
        username:req.body.username,
        email: req.body.email,
        salt: salt,
        hash:hash
    });

    User.create(user, (err, user)=>{
        if(!err) {
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
            [constant.API_STATUS]:constant.API_SUCCESS_NO,
            [constant.API_MSG]: constant.GENERAL_ERROR + " " + err.message
        });
    });
});

//====================================================================
module.exports = authenticationRouter;