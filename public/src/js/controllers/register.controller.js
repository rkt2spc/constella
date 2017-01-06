/**
 * Created by Stupig on 1/6/2017.
 */
appControllers.controller('registerCtrl', ['$location', 'authenticationService',
    ($location, authenticationService) => {
        let vm = this;

        vm.credentials = {
            username: "",
            email: "",
            password: ""
        };

        vm.onSubmit = ()=> {
            authenticationService
                .register(vm.credentials)
                .error(err => {
                    alert(err);
                })
                .then(()=> {
                    $location.path('/');
                });
        }
    }
]);