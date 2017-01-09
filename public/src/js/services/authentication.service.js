/**
 * Created by Stupig on 1/6/2017.
 */
appServices.factory('authenticationService', ['validateService', '$http', '$window',
    function (validateService, $http, $window) {
        let service = {
            saveToken: token => {
                $window.localStorage['currentUserToken'] = token;
            },

            getToken: token => {
                return $window.localStorage['currentUserToken'];
            },

            isLoggedIn: () => {
                let token = this.getToken();
                let payload;

                if (token) {
                    payload = token.split('.')[1];
                    payload = $window.atob(payload);
                    payload = JSON.parse(payload);

                    return payload.exp > Date.now() / 1000;
                }
                return false;

            },

            logout: () => {
                $window.localStorage.removeItem('currentUserToken');
            },

            currentUser: () => {
                if (this.isLoggedIn()) {
                    let token = this.getToken();
                    let payload = token.split('.')[1];
                    payload = $window.atob(payload);
                    payload = JSON.parse(payload);
                    return {
                        email: payload.email,
                        username: payload.username
                    };
                }
            },

            register: user => {
                return $http.post('/api/authentication/register', user)
                    .success(function (data) {
                        this.saveToken(data.token);
                    });
            },

            login: user => {
                return $http.post('/api/login', user)
                    .success(function (data) {
                        this.saveToken(data.token);
                    });
            },
        };

        return service;
    }
]);