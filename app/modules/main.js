require.config({
  paths: {
    angular         : '../lib/angular/angular',
    angularRoute    : '../lib/angular-route/angular-route',
    angularResource : '../lib/angular-resource/angular-resource',
    satellizer      : '../lib/satellizer/satellizer',
    bootstrap       : '../lib/bootstrap/dist/js/bootstrap',
    bootstrapUI     : '../lib/angular-bootstrap/ui-bootstrap-tpls',
    jquery          : '../lib/jquery/dist/jquery',
    angularFileUpload: '../lib/angular-file-upload/dist/angular-file-upload.min'
  },
  shim:  {
    angular: {
      exports : 'angular'
    },
    angularRoute: {
      deps  : ['angular']
    },
    angularResource: {
      deps  : ['angular']
    },
    satellizer: {
      deps  : ['angular']
    },
    angularFileUpload: {
      deps  : ['angular']
    },
    jquery: {
      exports : 'jquery'
    },
    bootstrap: {
      deps  : ['jquery']
    },
    bootstrapUI: {
      deps  : ['angular']
    },
    app:  {
      deps  : ['angular']
    }
  },
  urlArgs: 'bust=' + (new Date()).getTime(),
  waitSeconds: 0

});
requirejs(['app']);
