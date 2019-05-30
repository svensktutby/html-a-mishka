/* global MISHKA, from js/init.js */

/* Form
 ******************************/
;(function() {
  var  me = {};

  me.isValid = function() {
    var requiredFields = document.querySelectorAll('[data-valid="required"]');
    var email = document.querySelector('[data-email]');
    var phone = document.querySelector('[data-phone]');
    var emailValue = email.value;
    var phoneValue = phone.value;

    if (!me.isAllCompleted(requiredFields)) {
      console.log('Заполните, пожалуйста, все необходимые поля' );
      return false;
    } else if (!MISHKA.validation.isEmail(emailValue)) {
      email.classList.add('order-form__input--error');
      console.log('Не верный email');
      return false;
    } else if (!MISHKA.validation.isNumber(phoneValue)) {
      phone.classList.add('order-form__input--error');
      console.log('Не верный номер');
      return false;
    }

    return true;
  };

  me.isAllCompleted = function(data) {
    var result = true;

    for (var i = 0; i < data.length; i++) {
      if (!MISHKA.validation.isNotEmpty(data[i].value)) {
        data[i].classList.add('order-form__input--error');
        result = false;
        // break;
      }
    }

    return result;
  };

  MISHKA.form = me;
}());
