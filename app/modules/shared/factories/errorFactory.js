define(['shared/shared'],function(shared){
  'use strict';

  shared.factory('shared.errorFactory',[function () {
    var errorFactory = {};

    // errorFactory.getError = function(error) {
    //   var errorResult = {};
    //   if(error.status !== -1) {
    //     if(error.status === 303) {
    //       errorResult.type = 'warning';
    //       errorResult.text = sgpCommonFilter(error.data.code,'error');
    //     } else if(error.status === 400) {
    //       var errorFields = '';
    //       error.data.forEach(function(errorItem,index){
    //         errorFields += ' ' + errorItem.field;
    //         if(index !== error.data.length - 1) {
    //           errorFields += ',';
    //         }
    //       });
    //       errorResult.type = 'warning';
    //       errorResult.text = 'Error con los datos: ' + errorFields;
    //     } else {
    //       errorResult.type = 'danger';
    //       errorResult.text = 'Ocurrió un error, recargue la página';
    //     }
    //   } else {
    //     errorResult.type = 'danger';
    //     errorResult.text = 'Ocurrió un error, recargue la página';
    //   }

    //   return errorResult;
    // };

    errorFactory.getCustomAlert = function(type,msg) {
      var errorResult = {};
      errorResult.type = type;
      if(msg) {
        errorResult.text = msg;
      } else {
        errorResult.text = 'Ocurrió un error, recargue la página';
      }
      return errorResult;
    };

    return errorFactory;

  }]);

});
