(function() {

    'use strict';

    angular
        .module('betApp')
        .controller('TransferController', TransferController);


    function TransferController($http, $rootScope, $scope, SweetAlert) {
        // Run this function at initial
        $scope.ini = function() {
            $scope.ticket = {};
            $scope.getAllGame();
            $scope.getBonus();
            $scope.mainWallet = 'Main Wallet';

            $scope.$watch('ticket.target', function(newVal, oldVal) {

                if (newVal == $scope.mainWallet)
                    $scope.bonus = false;
                else
                    $scope.bonus = angular.copy($scope.originBonus);
            });
        }

        // Fletch all game
        $scope.getAllGame = function() {
            var req = {
                method: 'GET',
                url: baseUrl + 'api/game/all/title'
            }

            $http(req)
                .then(function(response) {
                    $scope.games = angular.copy(response.data);
                    $scope.transferTos = angular.copy(response.data);
                    $scope.transferFroms = angular.copy(response.data);
                    $scope.transferFroms.unshift($scope.mainWallet);

                    $scope.ticket = {
                        origin: $scope.transferFroms[0],
                        target: $scope.transferTos[0]
                    }

                }, function(error) {
                    SweetAlert.swal("Sorry!", error.data.error, "error");
                });
        }

        // Get bonus type for client
        $scope.getBonus = function() {
            var req = {
                method: 'GET',
                url: baseUrl + 'api/transfer/bonus'
            }

            $http(req)
                .then(function(response) {
                    $scope.originBonus = response.data.data.bonus;
                    $scope.bonus = angular.copy($scope.originBonus);
                }, function(error) {
                    SweetAlert.swal("Sorry!", error.data.error, "error");
                });
        }

        // Change transfer origin
        $scope.changeTransferFrom = function(wallet) {
            if (wallet != $scope.mainWallet) {
                $scope.transferTos = [$scope.mainWallet];
                $scope.ticket.target = $scope.transferTos[0];
            } else {
                $scope.transferTos = angular.copy($scope.games);
                $scope.ticket.target = $scope.transferTos[0];
            }
        }

        // Submit this ticket
        $scope.submitTransfer = function() {
            var req = {
                method: 'PUT',
                url: baseUrl + 'api/cashier/transfer',
                data: $scope.ticket
            }

            $http(req)
                .then(function(response) {

                    SweetAlert.swal("Thanks You!", 'Your ticket has been processed', "success");
                    $rootScope.$broadcast('creditUserInfo:update');
                    $rootScope.$broadcast('credit:update');
                    $scope.getBonus();

                }, function(error) {
                    SweetAlert.swal("Sorry!", error.data.error, "error");
                });
        }

        // Run config
        $scope.ini();
    }

})();
