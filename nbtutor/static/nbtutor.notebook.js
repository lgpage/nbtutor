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
        var href = '/nbextensions/nbtutor/nbtutor.min.css';
        $('<link/>', { id: 'nbtutor-css', type: 'text/css', rel: 'stylesheet', href }).appendTo('head');
      }
    }

    function loadNbtutorSource() {
      requirejs(["nbtutor"], function () {
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
      console.log('nbtutor >> loadExtension');
      requirejs.config({
        paths: { "nbtutor": require.toUrl("./nbtutor.min") }
      });

      injectNbtutorRoot();
      injectNbtutorCss();
      loadNbtutorSource();
    }

    return {
      load_ipython_extension: loadExtension
    };
  });
