/* global MISHKA, from js/init.js */

/* Burger
 ******************************/
;(function() {
  var me = {};
  
  me.close = function () {
    var burger = document.querySelector('.burger');

    if (burger) {
      burger.addEventListener('click', function (event) {
        event.preventDefault();
        if (!burger.classList.contains('burger--close')) {
          burger.classList.add('burger--close');
        } else {
          burger.classList.remove('burger--close');
        }
      });
    }
  };

  MISHKA.burger = me;
}());
