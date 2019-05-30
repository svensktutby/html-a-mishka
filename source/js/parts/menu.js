/* global MISHKA, from js/init.js */

/* Menu
 ******************************/
;(function() {
  var me = {};
  me.open = function () {
    var mainNav = document.querySelector('.main-nav');
    var mainNavToggle = document.querySelector('.main-nav__toggle');

    if (mainNav && mainNav.classList.contains('main-nav--nojs')) {
      mainNav.classList.remove('main-nav--nojs');
    }

    if (mainNavToggle) {
      mainNavToggle.addEventListener('click', function (event) {
        event.preventDefault();
        if (!mainNav.classList.contains('main-nav--open')) {
          mainNav.classList.add('main-nav--open');
        } else {
          mainNav.classList.remove('main-nav--open');
        }
      });
    }
    MISHKA.burger.close();
  };

  MISHKA.menu = me;
}());
