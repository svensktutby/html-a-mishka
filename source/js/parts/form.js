/* global MISHKA, from js/init.js */

/* Form
 ******************************/
;(function() {
  var  me = {};

  me.isValid = function() {
    var requiredFields = document.querySelectorAll('[data-valid="required"]');
    var emailValue = document.querySelector('[data-email]').value;
    var phoneValue = document.querySelector('[data-phone]').value;

    if (!me.isAllCompleted(requiredFields)) {
      console.log('Заполните, пожалуйста, все необходимые поля' );
      return false;
    } else if (!MISHKA.validation.isEmail(emailValue)) {
      console.log('Не верный email');
      return false;
    } else if (!MISHKA.validation.isNumber(phoneValue)) {
      console.log('Не верный номер');
      return false;
    }

    return true;
  };

  me.isAllCompleted = function(data) {
    var result = true;

    for (var i = 0; i < data.length; i++) {

      if (!MISHKA.validation.isNotEmpty(data[i].value)) {
        result = false;
        break;
      }
    }

    return result;
  };


  MISHKA.form = me;
}());
