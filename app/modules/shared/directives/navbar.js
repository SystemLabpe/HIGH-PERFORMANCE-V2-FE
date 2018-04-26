define(['shared/shared','shared/controllers/navbarController'], function(shared){
  'use strict';

  shared.directive('navbar',[
    function () {
      return {
        restrict    : 'E',
        templateUrl : 'modules/shared/views/navbar.tpl.html',
        controller  : 'shared.navbarController'
        // link        : function (scope,elm,attrs) {
        //   console.log('ELEM -> ' , $(elm));
        //   var collapsible = $(elm).find(".navbar-collapse");
        //   var visible = false;

        //   collapsible.on("show.bs.collapse", function () {
        //     visible = true;
        //   });

        //   collapsible.on("hide.bs.collapse", function () {
        //     visible = false;
        //   });

        //   var nav = $('.navbar-collapse');
        //   console.log('NAV -> ',nav);

        //   nav.find('a').on('click', function (event) {
        //     console.log('CLICK!!!');
        //   });

        //   $(elm).find("a").each(function (index, element) {
        //     console.log('ENTRO -> ',element);
        //     $(element).click(function (e) {
        //       console.log('CLICK -> ',element);
        //       if (visible && "auto" == collapsible.css("overflow-y")) {
        //         collapsible.collapse("hide");
        //       }
        //     });
        //   });

        // }
      }
  }]);

});
