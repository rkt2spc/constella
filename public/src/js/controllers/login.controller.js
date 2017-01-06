/**
 * Created by Stupig on 1/6/2017.
 */
appControllers.controller('loginCtrl', ['$location', 'authenticationService',
    ($location, authenticationService) => {
        let vm = this;

        vm.credentials = {
            email: "",
            password: ""
        };

        vm.onSubmit = ()=> {
            authenticationService
                .login(vm.credentials)
                .error(err => {
                    alert(err);
                })
                .then(()=> {
                    $location.path('/');
                });
        }
    }
]);