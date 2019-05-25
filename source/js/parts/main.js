/* global MISHKA, from js/init.js */

/* Main
 ******************************/
;(function() {
  var weekOrderBtn = document.querySelector('.week-product__order-button');
  var productOrderBtn = document.querySelector('.product__order-button');
  var form = document.querySelector('.order-form');
  var orderBtns = [weekOrderBtn, productOrderBtn];

  function addClickForModal(btnsArr) {
    for (var i = 0; i < btnsArr.length; i++) {
      if (btnsArr[i]) {
        btnsArr[i].addEventListener('click', function () {
          event.preventDefault();
          MISHKA.modalCart.open();
        });
      }
    }
  }

  addClickForModal(orderBtns);

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (MISHKA.form.isValid()) {
        console.log('All good');
      } else {
        console.log('Is not valid');
      }
    });
  }

  MISHKA.menu.open();
  MISHKA.ymap.showYmap();
}());
