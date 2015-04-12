var $ = jQuery = require('jquery');
var bootstrap = require('bootstrap');
var hbr = require('browserify-handlebars');
var coreTemplates = require('../templates/headerNavTmpl.hbs');

var HeaderView = function() {

  $('header').html(coreTemplates());
  $('.dropdown-menu').find('form').click(function (e) {
    e.stopPropagation();
  });
};

module.exports = HeaderView;
