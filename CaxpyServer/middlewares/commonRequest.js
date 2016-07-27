var jwt = require('jwt-simple');

var commonRequest = {
    getSessionUser : function (req, res) {
        var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
        //var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];
        if (token) {
            try {
                var decoded = jwt.decode(token, require('../config/secret.js')());
                if (decoded.exp <= Date.now()) {
                    res.status(400);
                    res.json({
                        "status": 400,
                        "message": "Token Expired"
                    });
                    return;
                } else {
                    var dbUser = decoded.user;
                    res.status(200);
                    res.json(dbUser);
                }

            } catch (e) {
                console.log(e);
            }
        } else {
            res.status(403);
            res.json({
                "status": 403,
                "message": "Not Authorized"
            });
            return;
        }
  
    }

};


module.exports = commonRequest;