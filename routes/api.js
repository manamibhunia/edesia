//================================== routes for API ====================================
var express = require('express'),
    connection = require('express-myconnection'),
    mysql = require('mysql'),
    bodyParser = require('body-parser'),
    app = express();

module.exports = (function() {
    'use strict';
    var api = express.Router();
    app.use(bodyParser.json());

    var pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'cmpe226'
    });

    var user = api.route('/user');

    user.get(function(request, response) {

        var query = 'select * from customer where email="' + request.query.email + '"';

        console.log('query- ', query);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, rows) {

                if (err) {
                    console.log(err);
                    if (err) return err;
                }
                console.log('Customer List: ', rows);
                connection.release();

                if (rows.length > 0) {
                    console.log('email correct');
                    var userObj = rows[0];
                    if (userObj.password === request.query.password) {
                        console.log('email correct & password correct');
                        delete userObj.password;
                        response.send(userObj);
                    } else {
                        console.log('email correct & password incorrect');
                        response.send("");
                    }
                } else {
                    console.log('email incorrect');
                    response.send("");
                }
            });
        });
    });

    user.post(function(request, response) {

        console.log('Data: ', request.body);
        pool.getConnection(function(err, connection) {
            connection.query('INSERT INTO customer SET ?', request.body, function(err, rows) {
                if (err) {
                    console.log(err);
                    if (err) return err;
                }
                connection.release();
                response.send({
                    message: 'Customer Added'
                });
            });
        });
    });

    var catererCity = api.route('/city/:city/area/:area');

    catererCity.get(function(req, res) {

        var city = req.param('city');
        var area = req.param('area');
        var queryString = 'SELECT * FROM caterer WHERE city="'+city+'" AND area ="'+area+'"';
        pool.getConnection(function(err, connection) {
            connection.query(queryString, function(err, rows) {

                if (err) {
                    console.log(err);
                    if (err) return err;
                }
                console.log('Cuisine List: ', rows);
                connection.release();
                res.send(rows);
            });
        });
    });

    var caterer = api.route('/caterer');

    caterer.get(function(request, response) {

        var item = request.query.item;
        var query = '';
        if (isNaN(item)) {

            query = 'SELECT * FROM caterer WHERE city="' + item + '" OR cuisine_type ="' + item + '"';
        } else {
            query = 'SELECT * FROM caterer WHERE zip=' + item;
        }

        console.log('query- ', query);

        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, rows) {

                if (err) {
                    console.log(err);
                    if (err) return err;
                }
                console.log('Caterer List: ', rows);
                connection.release();
                response.send(rows);
            });
        });
    });

    var cousinePrice = api.route('/caterer/cuisine/price');

    cousinePrice.get(function(request, response) {

        pool.getConnection(function(err, connection) {
            connection.query('SELECT cuisine.cuisine_name, price.item_price FROM cuisine INNER JOIN price ON cuisine.cuisine_id=price.cuisine_id_fk', function(err, rows) {

                if (err) {
                    console.log(err);
                    if (err) return err;
                }
                console.log('Cuisine List: ', rows);
                connection.release();
                response.send(rows);
            });
        });
    });

    /**** getting the cuisine list of according to cuisine serving time  ****/
    var menuByTime = api.route('/caterer/menuByTime/:servingTime/:catererId');


    menuByTime.get(function(req, res) {

        var servingTime = req.param('servingTime');
        var catererId = req.param('catererId');
        var queryString = 'SELECT caterer.caterer_id, caterer.caterer_name, cuisine.cuisine_id, cuisine.cuisine_name, cuisine.image, price.item_price FROM cuisine, price ,caterer WHERE cuisine.cuisine_id=price.cuisine_id_fk AND caterer.caterer_id=price.caterer_id_fk AND caterer.caterer_id =' + catererId + ' AND (cuisine_serving_time LIKE "' + servingTime + '%" or cuisine_serving_time LIKE "%' + servingTime + '" OR cuisine_serving_time LIKE "%'+servingTime+'%")';
        console.log('queryString- ', queryString);
        pool.getConnection(function(err, connection) {
            connection.query(queryString, function(err, rows) {

                if (err) {
                    console.log(err);
                    if (err) return err;
                }
                console.log('Cuisine List: ', rows);
                connection.release();
                res.send(rows);
            });
        });
    });

    /**** getting the cuisine list of according to cuisine serving time  ****/
    var menuByCategory = api.route('/caterer/menuByCategory/:category/:catererId');


    menuByCategory.get(function(req, res) {

        var category = req.param('category');
        var catererId = req.param('catererId');
        var queryString = 'SELECT caterer.caterer_id, caterer.caterer_name, cuisine.cuisine_id, cuisine.cuisine_name, cuisine.image, price.item_price FROM cuisine, price ,caterer WHERE cuisine.cuisine_id=price.cuisine_id_fk AND caterer.caterer_id=price.caterer_id_fk AND caterer.caterer_id ='+ catererId +' AND cuisine_category LIKE "'+category+'%"';
        console.log('queryString- ', queryString);
        pool.getConnection(function(err, connection) {
            connection.query(queryString, function(err, rows) {

                if (err) {
                    console.log(err);
                    if (err) return err;
                }
                console.log('Cuisine List: ', rows);
                connection.release();
                res.send(rows);
            });
        });
    });

    caterer.post(function(req, res) {

        console.log('Data: ', req.body);

        pool.getConnection(function(err, connection) {
            connection.query('INSERT INTO caterer SET ?', req.body, function(err, rows) {
                if (err) {
                    console.log(err);
                    if (err) return err;
                }
                connection.release();
                res.send({
                    message: 'Caterer Added'
                });
            });
        });
    });

    var cuisine = api.route('/cuisine');

    cuisine.get(function(req, res) {

        pool.getConnection(function(err, connection) {
            connection.query('SELECT * FROM cuisine', function(err, rows) {

                if (err) {
                    console.log(err);
                    if (err) return err;
                }
                console.log('Cuisine List: ', rows);
                connection.release();
                res.send(rows);
            });
        });
    });

    cuisine.post(function(req, res) {

        console.log('Data: ', req.body);

        pool.getConnection(function(err, connection) {
            connection.query('INSERT INTO cuisine SET ?', req.body, function(err, rows) {
                if (err) {
                    console.log(err);
                    if (err) return err;
                }
                connection.release();
                res.send({
                    message: 'Cuisine Added'
                });
            });
        });
    });

    var order_details = api.route('/order_details');

    order_details.get(function(req, res) {

        pool.getConnection(function(err, connection) {
            connection.query('SELECT * FROM order_details WHERE orderid', function(err, rows) {

                if (err) {
                    console.log(err);
                    if (err) return err;
                }
                console.log('Order details: ', rows);
                connection.release();
                res.send(rows);
            });
        });
    });

    order_details.post(function(req, res) {

        console.log('Data: ', req.body);

        pool.getConnection(function(err, connection) {
            connection.query('INSERT INTO orders SET ?', req.body, function(err, rows) {
                if (err) {
                    console.log(err);
                    if (err) return err;
                }
                connection.release();
                res.send({
                    message: 'Order Added'
                });
            });
        });
    });

    var price = api.route('/price');
    price.post(function(req, res) {

        console.log('Data: ', req.body);

        pool.getConnection(function(err, connection) {
            connection.query('INSERT INTO price SET ?', req.body, function(err, rows) {
                if (err) {
                    console.log(err);
                    if (err) return err;
                }
                connection.release();
                res.send({
                    message: 'price Added'
                });
            });
        });
    });


    return api;
})();