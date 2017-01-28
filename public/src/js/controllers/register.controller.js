/**
 * Created by Stupig on 1/6/2017.
 */
appControllers.controller('registerCtrl', ['$scope','$rootScope', '$state', 'authenticationService',
    function ($scope, $rootScope, $state, authenticationService) {
        $scope.input = {
            username: "",
            email: "",
            password: ""
        };

        $scope.onSubmit = function () {
            authenticationService.register($scope.input, function(err, result){
                if (err) {
                    console.log(err);
                    $scope.message = "You have invalid register, please fill in all required information";
                    $rootScope.loading = false;
                }
                else{
                    $rootScope.loading = false;
                    $state.go('home');
                }
            });
        }
    }
]);