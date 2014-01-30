var coreApp = angular.module('core', ['google-maps', 'ngRoute', 'coreControllers']);

var PermissionDict = {
    0: "Deactivated",
    1: "Editor",
    2: "Builder",
    3: "Group Admin",
    4: "Site Admin"
};

coreApp.factory("$dataService", function ($http) {
    var self = this;

    this.tourList = [];
    this.stopList = [];
    this.userList = [];
    this.groupList = [];

    // gets all the tours, naively caches them
    this.getAllTours = function (callback) {
        callback = (callback && typeof callback === "function") ? callback : function () {};
        // naive caching
        if (self.tourList.length > 0) {
            callback(self.tourList);
            return;
        }

        // if we've got no entries, we will download
        $http.get('/tours.json').success(function (data) {
            self.tourList = data.tours;
            callback(self.tourList);
        });
    };

    this.getTour = function (id, callback) {
        callback = (callback && typeof callback === "function") ? callback : function () {};

        function findTour(id) {
            if (typeof id === "string") {
                id = parseInt(id);
            }

            return _.findWhere(self.tourList, {
                id: id
            });
        };

        var tour = findTour(id);

        if (!tour) {
            this.getAllTours(function () {
                callback(findTour(id));
            });
        } else {
            callback(tour);
        }
    };

    this.getAllStops = function (callback) {
        callback = (callback && typeof callback === "function") ? callback : function () {};

        // naive caching
        if (self.stopList.length > 0) {
            callback(self.stopList);
            return;
        }

        // if we've got no entries, we will download
        $http.get('/stops.json').success(function (data) {
            self.stopList = data.stops;
            callback(self.stopList);
        });
    };

    this.getAllGroups = function (callback) {
        callback = (callback && typeof callback === "function") ? callback : function () {};

        // naive caching
        if (self.groupList.length > 0) {
            callback(self.groupList);
            return;
        }

        // if we've got no entries, we will download
        $http.get('/groups.json').success(function (data) {
            self.groupList = data.groups;
            callback(self.groupList);
        });
    };

    this.getAllUsers = function (callback) {
        callback = (callback && typeof callback === "function") ? callback : function () {};

        /**        
         * We store this in its own function, so that we can download groups if we don't have them already
         */
        function manageUsers() {
            // naive caching
            if (self.userList.length > 0) {
                callback(self.userList);
                return;
            }

            // if we've got no entries, we will download
            $http.get('/users.json').success(function (data) {
                var defaultGroup = {
                    name: "No Group"
                };

                var fixedList = _.map(data.users, function (user) {
                    var group = user.group_id ? _.findWhere(self.groupList, {
                        id: user.group_id
                    }) : null;

                    group = group || defaultGroup;

                    user.role = PermissionDict[user.permission];
                    user.group = group.name;

                    return user;
                });
                self.userList = fixedList;

                callback(self.userList);
            });
        }

        self.getAllGroups(manageUsers);
    };

    this.getAllData = function (callback) {
        callback = (callback && typeof callback === "function") ? callback : function () {};

        this.getAllTours();
        this.getAllStops();
        this.getAllGroups(this.getAllUsers);

        callback();
    };

    return this;
});

coreApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
        when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        }).
        when('/tours', {
            templateUrl: 'partials/tours.html',
            controller: 'TourCtrl'
        }).
        when('/tours/:tourId', {
            templateUrl: 'partials/tour-detail.html',
            controller: 'TourDetailCtrl'
        }).
        when('/groups', {
            templateUrl: 'partials/groups.html',
            controller: 'GroupCtrl'
        }).
        when('/users', {
            templateUrl: 'partials/users.html',
            controller: 'UserCtrl'
        }).
        when('/stops', {
            templateUrl: 'partials/stops.html',
            controller: 'StopCtrl'
        }).
        otherwise({
            redirectTo: '/home'
        });
}]);

var coreControllers = angular.module('coreControllers', []);

coreControllers.controller('HomeCtrl',
    function ($scope, $dataService) {
        $dataService.getAllData();
    });

coreControllers.controller('TourCtrl',
    function ($scope, $dataService) {
        $dataService.getAllTours(function (tours) {
            $scope.tours = tours;
        });
    });

coreControllers.controller('TourDetailCtrl',
    function ($scope, $routeParams, $dataService) {
        $scope.tourId = $routeParams.tourId;

        $scope.map = {
            center: {
                latitude: 45,
                longitude: -73
            },
            zoom: 5
        };
        
        $scope.setCenter = function(lat, lng){
            $scope.map.center.latitude = lat;
            $scope.map.center.longitude = lng;
        }
        
        $scope.centerOn = function (stop) {
            $scope.setCenter(stop.lat, stop.lon);
        };

        $dataService.getTour($scope.tourId, function (tour) {
            console.log(tour);
            $scope.name = tour.name;
            $scope.stops = tour.stops;
            $scope.description = tour.description;
            $scope.map.center.latitude = parseFloat(tour.lat);
            $scope.map.center.longitude = parseFloat(tour.lon);
            $scope.map.zoom = 15;
        });
    });

coreControllers.controller('GroupCtrl',
    function ($scope, $dataService) {
        $dataService.getAllGroups(function (groups) {
            $scope.groups = groups;
        });
    });

coreControllers.controller('UserCtrl',
    function ($scope, $dataService) {
        $dataService.getAllUsers(function (users) {
            $scope.users = users;
        });
    });

coreControllers.controller('StopCtrl',
    function ($scope, $dataService) {
        $dataService.getAllStops(function (stops) {
            $scope.stops = stops;
        });
    });