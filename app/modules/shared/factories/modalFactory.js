define(['shared/shared','shared/controllers/modalController','shared/controllers/infoListModalController'],function(shared){
  'use strict';

  shared.factory('shared.modalFactory',['$uibModal', function ($uibModal) {
    var modalFactory = {};

    modalFactory.showModal = function(modalData) {

      var settings = {
        templateUrl: 'modules/shared/views/modal.tpl.html',
        controller : 'shared.modalController',
        resolve    : {
          modalData : function () {
            return modalData;
          }
        }
      };

      return $uibModal.open(settings).result;
    };

    modalFactory.showInfoListModalFactory = function(infoList) {
      var settings = {
        templateUrl: 'modules/shared/views/info-list-modal.tpl.html',
        controller : 'shared.infoListModalController',
        resolve    : {
          infoList : function () {
            return infoList;
          }
        }
      };

      return $uibModal.open(settings).result;
    };

    return modalFactory;

  }]);

});
