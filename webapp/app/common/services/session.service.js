angular.module('app.common').service('SessionService', function($http) {
    var service = {
        loggedIn: false,
        userInfo: null,
        setSession: function(_loggedIn, _userInfo) {
            this.loggedIn = _loggedIn;
            this.userInfo = _userInfo;
        },
        authenticatedGet: function(url, successCallback) {
            config = {
                "headers": {
                    "withCredentials": true,
                    "Access-Control-Allow-Credentials": true
                }
            };
            $http.get(url, config).success(successCallback)
        },
        authenticatedPost: function(url, data, successCallback, failureCallback) {
            config = {
                "headers": {
                    "withCredentials": true,
                    "Access-Control-Allow-Credentials": true
                }
            };
            $http.post(url, data, config).success(successCallback).error(failureCallback);
        },
        authenticatedPut: function(url, data, successCallback, failureCallback) {
            if (data === undefined) {
                data = {};
            }
            config = {
                "headers": {
                    "withCredentials": true,
                    "Access-Control-Allow-Credentials": true
                }
            };
            if (failureCallback === undefined) {
                failureCallback = function(data) {}
            }
            $http.put(url, data, config).success(successCallback).error(failureCallback);
        },
        authenticatedDelete: function(url, successCallback) {
            config = {
                "headers": {
                    "withCredentials": true,
                    "Access-Control-Allow-Credentials": true
                }
            };
            $http.delete(url, config).success(successCallback);
        },
        populateSessionInfo: function(callback) {
            _parent = this;
            this.authenticatedGet(hostname + 'users/session',
                function(data) {
                    _parent.setSession(true, data);
                    if (!!callback) {
                        callback();
                    }
                }
            );
        },
        clearSessionInfo: function() {
            this.setSession(false, null);
        },
        isAdmin: function() {
            if (!this.loggedIn) {
                return false;
            }
            else if(this.isSuperAdmin()){
                return true;
            }
            else {
                return this.userInfo.admin_regions.length > 0
            }
        },
        isSuperAdmin: function(){
            if(!this.loggedIn){
                return false;
            }
            else{
                return this.userInfo.admin_level === 'SUPER';
            }
        },
        isAdminForRegion: function(regionId) {
            if (!this.loggedIn) {
                return false;
            }
            else if(this.isSuperAdmin()){
                return true;
            }
            else {
                return this.userInfo.admin_regions.indexOf(regionId) > -1;
            }
        },
        getAdminRegions: function() {
            return this.userInfo.admin_regions
        }
    };

    return service;
});
