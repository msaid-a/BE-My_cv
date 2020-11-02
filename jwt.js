const jwt = require('jsonwebtoken')
var express = require('express');
var app = express();
const authentication = () =>{
    app.set('Secret', 'hjlkdsahjsahdkjahdslkj');
        app.use((req, res, next) => {
            let token = req.headers['keys'];
            if (token) {
                jwt.verify(token, app.get('Secret'), (err, decoded) => {
                    if (err) {
                        return res.send({ success: false, error: 'Failed to authenticate token.' });
                    } else {
                        req.decoded = decoded;
                        next();
                    }
                });
            } else {
                return res.status(403).send({
                    error: 'No token provided.'
                });
            }
        });
}

module.exports = authentication