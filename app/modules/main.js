require.config({
  paths: {
    angular         : '../lib/angular/angular',
    angularRoute    : '../lib/angular-route/angular-route',
    angularResource : '../lib/angular-resource/angular-resource',
    satellizer      : '../lib/satellizer/satellizer',
    bootstrap       : '../lib/bootstrap/dist/js/bootstrap',
    bootstrapUI     : '../lib/angular-bootstrap/ui-bootstrap-tpls',
    jquery          : '../lib/jquery/dist/jquery',
    angularFileUpload: '../lib/angular-file-upload/dist/angular-file-upload.min',
    angularUISelect : '../lib/angular-ui-select/dist/select',
    moment          : '../lib/moment/moment'
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
    angularUISelect: {
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
  config: {
    moment: {
      noGlobal: true
    }
  },
  urlArgs: 'bust=' + (new Date()).getTime(),
  waitSeconds: 0

});
requirejs(['app']);
