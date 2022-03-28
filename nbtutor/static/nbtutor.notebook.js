define(
  ['jquery', 'require', 'base/js/namespace', 'base/js/events'],
  function ($, require, Jupyter, events) {
    "use strict";

    function injectNbtutorRoot() {
      if (!$('#nbtutor').length) {
        $('<nbtutor-root id="nbtutor"></nbtutor-root>').appendTo('body');
      }
    }

    function injectNbtutorCss() {
      if (!$('#nbtutor-css').length) {
        var href = require.toUrl('./nbtutor.min.css');
        console.log('nbtutor >> loadCss', { href: href });
        $('<link/>', { id: 'nbtutor-css', type: 'text/css', rel: 'stylesheet', href: href }).appendTo('head');
      }
    }

    function loadNbtutorSource() {
      require(["nbtutor"], function () {
        var timer = null;

        function waitForNbtutorToBootstrap() {
          if (!!window.Nbtutor) {  // this gets set after bootstrapping completes
            timer = null;
            window.Nbtutor.service.initForNotebook(Jupyter, events);
          } else {
            timer = setTimeout(waitForNbtutorToBootstrap, 100);
          }
        }

        waitForNbtutorToBootstrap();

        setTimeout(function () {
          if (!!timer) {
            clearTimeout(timer);
            console.error('Something went wrong. Nbtutor did not bootstrap correctly.');
          }
        }, 3000);
      });
    }

    function loadExtension() {
      var href = require.toUrl('./nbtutor.min.js');
      console.log('nbtutor >> loadExtension', { href: href });
      if (href.endsWith('.js')) {
        href = href.substring(0, href.length - 3);
      }

      requirejs.config({ paths: { "nbtutor": href } });

      injectNbtutorRoot();
      injectNbtutorCss();
      loadNbtutorSource();
    }

    return {
      load_ipython_extension: loadExtension
    };
  }
);
