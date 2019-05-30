/* global MISHKA, from js/init.js */

/* Main
 ******************************/
;(function() {
  var weekOrderBtn = document.querySelector('.week-product__order-button');
  var productOrderBtns = document.querySelectorAll('.product__order-button');
  var form = document.querySelector('.order-form');
  var requiredFields = document.querySelectorAll('[data-valid="required"]');
  var orderBtns = Array.prototype.slice.call(productOrderBtns);
  orderBtns.push(weekOrderBtn);

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

  if (requiredFields) {
    for (var i = 0; i < requiredFields.length; i++) {
      requiredFields[i].addEventListener('focus', function () {
        var that = this;
        if (that.classList.contains('order-form__input--error')) {
          that.classList.remove('order-form__input--error');
        }
      });
    }
  }

  MISHKA.menu.open();
  MISHKA.ymap.showYmap();
}());
