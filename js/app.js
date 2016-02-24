var app = angular.module('rgb', [])
  .controller('MainCtrl', ['$scope', '$document', function($scope, $document) {

    $(document).ready(function() {
        var time = 0;
        $('.words').each(function() {
            $(this).delay(time).fadeIn(1000, 'swing');
            time += 600;
        });
    });

  }]);
