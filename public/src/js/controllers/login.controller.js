/**
 * Created by Stupig on 1/6/2017.
 */
appControllers.controller('loginCtrl', ['$location', 'authenticationService',
    function ($location, authenticationService){
        var vm = this;

        vm.credentials = {
            email: "",
            password: ""
        };

        vm.onSubmit = function(){
            authenticationService
                .login(vm.credentials)
                .error(function(err){
                    alert(err);
                })
                .then(function() {
                    $location.path('/');
                });
        }
    }
]);