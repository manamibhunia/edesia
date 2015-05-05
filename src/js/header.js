var $ = jQuery = require('jquery');
var bootstrap = require('bootstrap');
var moment = require('moment');
var datetimepicker = require('./bootstrap-datetimepicker');

var headerMainTemplate = require('../templates/headerNavTmpl.hbs');
var guestUserTemplate = require('../templates/guestUser.hbs');
var loggedInUserTemplate = require('../templates/loggedInUser.hbs');
var searchResultTemplate = require('../templates/searchResult.hbs');
var menuTemplate = require('../templates/menu.hbs');
var cityListTemplate = require('../templates/cityList.hbs');
var shoppingCartTemplate = require('../templates/shoppingcart.hbs');
var paymentTemplate = require('../templates/payment.hbs');
var CookieUtil = require('../js/cookieutil.js');
var cityList = require('../data/citylist.json');

var HeaderView = function() {

    var searchKey = "";
    var searchAction = "";
    var searchCity = "";
    var searchArea = "";
    var menuUrl = "";
    var catererNameForMenu = "";

    $('header').html(headerMainTemplate());

    if (localStorage.getItem("user")) {
        sessionStorage.setItem("user", JSON.stringify(userObj));
    }

    if (localStorage.getItem("cart")) {
        var cart = JSON.parse(localStorage.getItem("cart"));
        $('.item-no-in-cart').html(cart.cartItems.length);
    }

    if (sessionStorage.getItem("user")) {
        var userObj = JSON.parse(sessionStorage.getItem("user"));
        $('#user-menu').html(loggedInUserTemplate({
            "userName": userObj.customer_first_name
        }));
    } else {
        $('#user-menu').html(guestUserTemplate());
    }

    $('#main').html(cityListTemplate({
        "cityArray": cityList
    }));

    $('.area-link').click(function(event) {

        event.preventDefault();
        var city = $(event.target).attr('data-city');
        var area = $(event.target).attr('data-area');

        searchAction = "searchByArea";
        searchCity = city;
        searchArea = area;
        searchByArea(city, area);
    });

    var searchByArea = function(city, area) {

        var url = '/api/city/' + city + '/area/' + area;
        $.ajax({
            url: url,
            type: 'GET',
            success: function(response, textStatus, jqXHR) {
                if (response) {
                    console.log('Caterer List -', response);
                    showSearchResult(response);
                } else {
                    console.log('No such caterer found');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('Search failed- ', errorThrown);
            }
        });
    };

    $('.dropdown-menu').find('.form-div').click(function(event) {
        event.stopPropagation();
    });

    $('#sign-up').click(function() {

        var requestJson = {
            customer_first_name: $('#first-name').val(),
            customer_last_name: $('#last-name').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            address1: $('#address1').val(),
            address2: $('#address2').val(),
            city: $('#city').val(),
            zip: $('#zip').val(),
            password: $('#password1').val(),
            security_question: $('#security-question').val(),
            security_answer: $('#security-answer').val()
        };
        $.ajax({
            url: '/api/user',
            type: 'POST',
            data: requestJson,
            success: function(data, textStatus, jqXHR) {
                console.log('user registered successfully- ', data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('user registered failed- ', errorThrown);
            }
        });

    });

    $('#sign-in').click(function() {

        var requestJson = {

            email: $('#login-email').val(),
            password: $('#login-password').val(),
        };

        $.ajax({
            url: '/api/user',
            type: 'GET',
            data: requestJson,
            beforeSend: function(jqXHR, settings) {
                if (requestJson.email.trim() !== "" && requestJson.password.trim() !== "") {
                    return true;
                } else {
                    console.log("empty credentials");
                    return false;
                }
            },
            success: function(data, textStatus, jqXHR) {
                if (data) {
                    console.log('user logged in successfully-', data);
                    sessionStorage.setItem("user", JSON.stringify(data));
                    if ($('#remember-me').is(':checked')) {
                        console.log('remember me');
                        localStorage.setItem("user", JSON.stringify(data));
                    }
                    $('#user-menu').html(loggedInUserTemplate({
                        "userName": data.customer_first_name
                    }));
                } else {
                    console.log('No such user found');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('user login failed- ', errorThrown);
            }
        });

    });

    var finalizeCheckout = function() {

        var userObject = null;
        if (sessionStorage.getItem("user")) {
            userObject = JSON.parse(sessionStorage.getItem("user"));
            
        }
        console.log('user details- ',userObject);

        var cartObject = null;
        if (localStorage.getItem("cart")) {
            cartObject = JSON.parse(localStorage.getItem("cart"));

         }
        console.log('cart details- ',cartObject);
            
        $('#main').html(paymentTemplate(userObject));
        $('#delivery-date').datetimepicker({
            format: 'YYYY-MM-DD HH:mm:ss'
        });


        $('#btn-payment').click(function(event){

            event.preventDefault();
            var requestJson = {
                customer_id_fk: userObject.customer_id,
                caterer_id_fk: cartObject.catererId,
                order_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                delivery_date: $('#delv-dt').val(),
                order_status: 'pending',
                total_price: cartObject.cartTotal,
                payment_status: 'paid',
                note: $('#note').val()
            };
            console.log('order details- ',requestJson);
            $.ajax({
                url: '/api/order',
                type: 'POST',
                data: requestJson,
                success: function(response, textStatus, jqXHR) {
                    
                    $('#delivery-date-msg').html($('#delv-dt').val());
                    $('#orderModal').modal('toggle');
                    localStorage.removeItem("cart");
                    $('.item-no-in-cart').html(0);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('Search failed- ', errorThrown);
                }
            });
        });
    };

    var checkout = function() {

        var cartObject = null;
        if (localStorage.getItem("cart")) {
            cartObject = JSON.parse(localStorage.getItem("cart"));
        }
        $('#main').html(shoppingCartTemplate(cartObject));
        $('.continue-shopping').click(function(){
            fetchMenuList(menuUrl, catererNameForMenu);
        });

        $('.finalize-checkout').click(function(){
            finalizeCheckout();
        });

        console.log("btn-checkout");
        $('.btn-delete-item-from-cart').click(function(event){
            
            var btn = $(event.target).closest('.actions').find('button.btn-delete-item-from-cart');
            var cuisineName = $(btn).attr('data-cuisine-name');
            var cuisineId = $(btn).attr('data-cuisine-id');
            console.log("inside delete btn- ",btn);
            console.log("inside delete- ",cuisineName);
            debugger;
            var cartObject = null;
            if (localStorage.getItem("cart")) {
                cartObject = JSON.parse(localStorage.getItem("cart"));
            }

            for(var i =0;i< cartObject.cartItems.length; i++) {

                if(cartObject.cartItems[i].cuisineName == cuisineName) {

                    cartObject.cartItems.splice(i, 1);
                    break;
                }
            }

            cartObject.cartTotal = 0;
            for(var i =0;i< cartObject.cartItems.length; i++) {

                cartObject.cartTotal += cartObject.cartItems[i].itemTotal;
            }
            $('.item-no-in-cart').html(cartObject.cartItems.length);
            localStorage.setItem("cart", JSON.stringify(cartObject));
            checkout();
        });
    };

    $('#shopping-cart-icon').click(function(event) {

        checkout();
    });

    $('.logout-btn').click(function(event) {

        if (localStorage.getItem("user")) {
            localStorage.removeItem("user");
        }
        if (sessionStorage.getItem("user")) {
            sessionStorage.removeItem("user");
        }
        $('#user-menu').html(guestUserTemplate());
    });

    $('#search').click(function(event) {

        var self = this;
        console.log('this- ',this);
        searchKey = $('#search-item').val();
        searchAction = "search";
        search(searchKey);
    });

    var search = function(searchKey) {

        var requestJson = {

            item: searchKey,
        };
        $.ajax({
            url: '/api/caterer',
            type: 'GET',
            data: requestJson,
            success: function(response, textStatus, jqXHR) {
                if (response) {
                    console.log('Caterer List -', response);
                    showSearchResult(response);

                } else {
                    console.log('No such caterer found');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('Search failed- ', errorThrown);
            }
        });
    };

    var showSearchResult = function(searchResult) {

        $('#main').html(searchResultTemplate({
            "searchArray": searchResult
        }));
        $(".occasion-dpd").change(function(event) {

            var self = this;
            var catererId = $(event.target).attr('data-caterer-id');
            var servingTime = $(this).find('option:selected').val();
            var catererName = $(event.target).attr('data-caterer-name');
            var url = '/api/caterer/menuByTime/' + servingTime + '/' + catererId;
            console.log("menuByTime url- ", url);
            menuUrl = url;
            catererNameForMenu = catererName;
            fetchMenuList(url, catererName);
        });
        $(".menu-dpd").change(function(event) {

            var catererId = $(event.target).attr('data-caterer-id');
            var category = $(this).find('option:selected').val();
            var catererName = $(event.target).attr('data-caterer-name');
            var url = '/api/caterer/menuByCategory/' + category + '/' + catererId;
            menuUrl = url;
            catererNameForMenu = catererName;
            fetchMenuList(url, catererName);
        });
    };

    var fetchMenuList = function(url, catererName, catererId) {

        $.ajax({
            url: url,
            type: 'GET',
            success: function(menuResponse, textStatus, jqXHR) {
                console.log('Cuisine LIST- ', menuResponse);
                $('#main').html(menuTemplate({
                    "menuArray": menuResponse,
                    "catererName": catererName
                }));
                $('.btn-add-to-cart').click(function(event){
                    
                    event.preventDefault();
                    var btn = $(event.target).closest('form').find('button');

                    var catererId = $(btn).attr('data-catarer-id');
                    var catererName = $(btn).attr('data-catarer-name'); 
                    var cuisineId = $(btn).attr('data-cuisine-id');
                    var cuisineName = $(btn).attr('data-cuisine-name');
                    var cuisinePrice = $(btn).attr('data-item-price');
                    var cuisineImage = $(btn).attr('data-cuisine-image');
                    var quantity = $(btn).closest('form').find('.item-quantity').val();

                    var cartObject = null;
                    if (localStorage.getItem("cart")) {
                        cartObject = JSON.parse(localStorage.getItem("cart"));
                    }
                    if(cartObject !== null) {
                        if(cartObject.cartItems) {
                            if(cartObject.cartItems.length < 1) {
                                cartObject.cartItems = [];
                                cartObject.cartItems.push({
                                    "cuisineName": cuisineName, 
                                    "cuisineId": cuisineId,
                                    "cuisinePrice": cuisinePrice, 
                                    "cuisineImage": cuisineImage,
                                    "itemTotal": (cuisinePrice*quantity),
                                    "quantity": quantity
                                });
                                cartObject.catererId = catererId;
                            } else {

                                var duplicate = false;

                                for(var i =0;i< cartObject.cartItems.length; i++) {

                                    if(cartObject.cartItems[i].cuisineName == cuisineName) {
                                        duplicate = true;
                                        cartObject.cartItems[i].quantity = (parseInt(cartObject.cartItems[i].quantity) + parseInt(quantity));
                                        cartObject.cartItems[i].itemTotal = (parseInt(cartObject.cartItems[i].quantity) * parseInt(cartObject.cartItems[i].cuisinePrice));
                                        
                                        break;
                                    }
                                }
                                if(duplicate == false) {

                                    cartObject.cartItems.push({
                                        "cuisineName": cuisineName, 
                                        "cuisineId": cuisineId, 
                                        "cuisinePrice": cuisinePrice, 
                                        "cuisineImage": cuisineImage,
                                        "itemTotal": (cuisinePrice*quantity),
                                        "quantity": quantity
                                    });
                                }
                                cartObject.catererId = catererId;
                            }
                        } else {
                            cartObject.cartItems = [];
                            cartObject.cartItems.push({
                                "cuisineName": cuisineName, 
                                "cuisineId": cuisineId, 
                                "cuisinePrice": cuisinePrice, 
                                "cuisineImage": cuisineImage,
                                "itemTotal": (cuisinePrice*quantity),
                                "quantity": quantity
                            });
                            cartObject.cartTotal = (cuisinePrice*quantity);
                            cartObject.catererId = catererId;
                        }
                    } else {
                        cartObject = {
                            cartItems: [],
                            cartTotal: (cuisinePrice*quantity),
                            catererId: catererId
                        };
                        cartObject.cartItems.push({
                            "cuisineName": cuisineName, 
                            "cuisineId": cuisineId, 
                            "cuisinePrice": cuisinePrice, 
                            "cuisineImage": cuisineImage,
                            "itemTotal": (cuisinePrice*quantity),
                            "quantity": quantity
                        });
                    }
                    cartObject.cartTotal = 0;
                    for(var i =0;i< cartObject.cartItems.length; i++) {

                        cartObject.cartTotal += cartObject.cartItems[i].itemTotal;
                    }
                    $('.item-no-in-cart').html(cartObject.cartItems.length);
                    localStorage.setItem("cart", JSON.stringify(cartObject));
                });

                $('.back-to-search a').click(function(event){
                    
                    event.preventDefault();

                    if(searchAction === "search") {
                        search(searchKey);
                    } else {
                        searchByArea(searchCity, searchArea);
                    }
                });

                $('#btn-checkout').click(function(event) {

                    checkout();
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(' failed- ', errorThrown);
            }
        });
    };
};

module.exports = HeaderView;