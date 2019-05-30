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
