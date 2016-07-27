var jwt = require('jwt-simple');
var validateUser = require('../controllers/auth.js').validateUser;

module.exports = function (req, res, next) {
    
    // When performing a cross domain request, you will recieve
    // a preflighted request first. This is to check if our the app
    // is safe. 
    
    // We skip the token outh for [OPTIONS] requests.
    //if(req.method == 'OPTIONS') next();
    
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
            }
            
            
            // Authorize the user to see if s/he can access our resources
            var dbUser = decoded.user;
            if (dbUser) {
                var isAllowed = false;
                switch (dbUser.roles[0]) {
                    case 'admin':
                        if (req.url.indexOf('/api/v1/user') >= 0 && req.url.indexOf('/api/v1/admin') >= 0) {
                            next(); // To move to next middleware
                        }
                        isAllowed = true;
                        break;
                    case 'user':
                        if (req.url.indexOf('/api/v1/user') >= 0) {
                            next(); // To move to next middleware
                        }
                        isAllowed = true;
                        break;
                    case 'candidate':
                        if (req.url.indexOf('/api/v1/candidate') >= 0) {
                            next(); // To move to next middleware
                        }
                        isAllowed = true;
                        break;
                }
                
                if (!isAllowed) {
                    res.status(403);
                    res.json({
                        "status": 403,
                        "message": "Not Authorized"
                    });
                    return;
                }
            } else {
                // No user with this name exists, respond back with a 401
                res.status(401);
                res.json({
                    "status": 401,
                    "message": "Invalid User"
                });
                return;
            }


        } catch (err) {
            res.status(500);
            res.json({
                "status": 500,
                "message": "Oops something went wrong",
                "error": err
            });
        }
    } else {
        res.status(401);
        res.json({
            "status": 401,
            "message": "Invalid Token or Key"
        });
        return;
    }
};