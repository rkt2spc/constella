/**
 * Created by Stupig on 1/6/2017.
 */
appServices.factory('authenticationService', ['validateService', '$http', '$window',
    function (validateService, $http, $window) {
        var service = {
            saveToken: function (token){
                $window.localStorage['currentUserToken'] = token;
            },

            getToken: function(token){
                return $window.localStorage['currentUserToken'];
            },

            isLoggedIn: function(){
                var token = this.getToken();
                var payload;

                if (token) {
                    payload = token.split('.')[1];
                    payload = $window.atob(payload);
                    payload = JSON.parse(payload);

                    return payload.exp > Date.now() / 1000;
                }
                return false;

            },

            logout: function(){
                $window.localStorage.removeItem('currentUserToken');
            },

            currentUser: function(){
                if (this.isLoggedIn()) {
                    var token = this.getToken();
                    var payload = token.split('.')[1];
                    payload = $window.atob(payload);
                    payload = JSON.parse(payload);
                    return {
                        email: payload.email,
                        username: payload.username
                    };
                }
            },

            register: function(user) {
                return $http.post('/api/authentication/register', user)
                    .success(function (data) {
                        this.saveToken(data.token);
                    });
            },

            login: function (user) {
                return $http.post('/api/login', user)
                    .success(function (data) {
                        this.saveToken(data.token);
                    });
            }
        };

        return service;
    }
]);