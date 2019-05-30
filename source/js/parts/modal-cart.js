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
