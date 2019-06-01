/* Initialization global object for this project
 ******************************/
window.MISHKA = {};

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

/* global MISHKA, from js/init.js */

/* Map
 ******************************/
;(function() {
  var  me = {};
  me.showYmap = function () {
    var contactsMap = document.querySelector('.contacts__map');

    if (contactsMap) {
      if (contactsMap.classList.contains('contacts__map--nojs')) {
        contactsMap.classList.remove('contacts__map--nojs');
      }

      ymaps.ready(init);

      function init() {
        // Создание карты.
        var myMap = new ymaps.Map("map", {
          // Координаты центра карты.
          // Порядок по умолчанию: «широта, долгота».
          // Чтобы не определять координаты центра карты вручную,
          // воспользуйтесь инструментом Определение координат.
          center: [53.900000, 27.566670],
          // Уровень масштабирования. Допустимые значения:
          // от 0 (весь мир) до 19.
          zoom: 12,
          // Элементы управления в наборах подобраны оптимальным образом
          // для карт маленького, среднего и крупного размеров.
          // Также доступны наборы 'default' и 'largeMapDefaultSet'
          controls: ['smallMapDefaultSet'] // если оставить массив пустым, то никаких контроллов не будет
        });

        // (1) Добавление маркера на карту
        var myPlacemark = new ymaps.Placemark(
          [53.900000, 27.566670], // место установки маркера
          {
            hintContent: 'Center of Miensk', // при наведении
            balloonContent: 'Красноармейская улица, 6' // при клике
          }, {
            iconLayout: 'default#image',
            iconImageHref: './img/icon-map-pin.svg', // картинка маркера (путь указывать от файла HTML)
            iconImageSize: [66, 100], // размер маркера
            iconImageOffset: [-20, -60] // сдвиг маркера на карте
          });

        // (2) Подключение маркера на карту
        myMap.geoObjects.add(myPlacemark);

        myMap.behaviors.disable(['scrollZoom']);
      }
    }
  };

  MISHKA.ymap = me;
}());

/* global MISHKA, from js/init.js */

/* Validation
 ******************************/
;(function() {
  var  me = {};

  me.isEmail = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  me.isNumber = function(phone) {
    var re = /^\+?[\d -]+$/;
    return re.test(phone);
  };

  me.isNotEmpty = function(str) {
    return Boolean(str);
  };

  MISHKA.validation = me;
}());

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

/* global MISHKA, from js/init.js */

/* Modal cart
 ******************************/
;(function() {
  var me = {};
  var modal = document.querySelector('.modal-overlay');
  var submitButton = null;

  function onClose(event) {
    event.preventDefault();

    me.close();
    submitButton.removeEventListener('click', onClose);
    modal.removeEventListener('click', onClose);
  }

  function escClose(event) {
    if (event.key === 'Escape' || event.keyCode === 27) {
      me.close();
      window.removeEventListener('keydown', escClose);
    }
  }

  function overlayClose(event) {
    if (event.target === modal) {
      me.close();
    } else {
      event.stopPropagation();
    }
  }

  me.open = function() {
    if (modal.classList.contains('modal-overlay--hidden')) {
      modal.classList.remove('modal-overlay--hidden');
    }

    submitButton = document.querySelector('.modal-cart__button');
    submitButton.addEventListener('click', onClose);
    modal.addEventListener('click', overlayClose);
    window.addEventListener('keydown', escClose);
  };

  me.close = function() {
    if (!modal.classList.contains('modal-overlay--hidden')) {
      modal.classList.add('modal-overlay--hidden');
    }
    modal.removeEventListener('click', overlayClose);
    window.removeEventListener('keydown', escClose);
  };

  MISHKA.modalCart = me;
}());

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
