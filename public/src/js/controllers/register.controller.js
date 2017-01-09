/**
 * Created by Stupig on 1/6/2017.
 */
appControllers.controller('registerCtrl', ['$location', 'authenticationService',
    function ($location, authenticationService) {
        var vm = this;

        vm.credentials = {
            username: "",
            email: "",
            password: ""
        };

        vm.onSubmit = function () {
            authenticationService
                .register(vm.credentials)
                .error(function(err){
                    alert(err);
                })
                .then(function(){
                    $location.path('/');
                });
        }
    }
]);