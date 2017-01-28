/**
 * Created by Stupig on 1/6/2017.
 */
appControllers.controller('loginCtrl', ['$scope','$rootScope', '$state', 'authenticationService',
    function ($scope, $rootScope, $state, authenticationService) {
        $scope.credentials = {
            email: "",
            password: ""
        };

        $scope.onSubmit = function(){

            authenticationService.login($scope.input, function(err, data){
                if (err) {
                    console.log(err);
                    $scope.message = "You have invalid login, please fill in all required information";
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