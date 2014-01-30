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
            zoom: 15,
            setCenter: function (lat, lng) {
                this.center.latitude = lat;
                this.center.longitude = lng;
            }
        };

        $dataService.getTour($scope.tourId, function (tour) {
            $scope.name = tour.name;
            $scope.stops = tour.stops;
            $scope.description = tour.description;
            $scope.map.setCenter(parseFloat(tour.lat), parseFloat(tour.lon));
        });
    });

coreControllers.controller('GroupCtrl',
    function ($scope, $dataService) {
        $dataService.getAllGroups(function (groups) {
            $scope.groups = groups;
        });
    });

coreControllers.controller('GroupDetailCtrl',
    function ($scope, $routeParams, $dataService) {
        $scope.groupId = $routeParams.groupId;

        $dataService.getGroup($scope.groupId, function (group) {
            $scope.name = group.name;
            $scope.description = group.description;
        });
    });

coreControllers.controller('UserCtrl',
    function ($scope, $dataService) {
        $dataService.getAllUsers(function (users) {
            $scope.users = users;
        });
    });

coreControllers.controller('UserDetailCtrl',
    function ($scope, $routeParams, $dataService) {
        $scope.userId = $routeParams.userId;

        $dataService.getUser($scope.userId, function (user) {
            $scope.email = user.email;
            $scope.role = user.role;
            $scope.group = user.group;
        });
    });

coreControllers.controller('StopCtrl',
    function ($scope, $dataService) {
        $dataService.getAllStops(function (stops) {
            $scope.stops = stops;
        });
    });

coreControllers.controller('StopDetailCtrl',
    function ($scope, $routeParams, $dataService) {
        $scope.stopId = $routeParams.stopId;

        $scope.map = {
            center: {
                latitude: 45,
                longitude: -73
            },
            zoom: 15,
            setCenter: function (lat, lng) {
                this.center.latitude = lat;
                this.center.longitude = lng;
            }
        };

        $scope.stop = {
            center: {
                latitude: 45,
                longitude: -73,
            },
            setCenter: function (lat, lng) {
                this.center.latitude = lat;
                this.center.longitude = lng;
            }
        };

        $dataService.getStop($scope.stopId, function (stop) {
            $scope.name = stop.name;
            $scope.description = stop.description;
            $scope.map.setCenter(parseFloat(stop.lat), parseFloat(stop.lon));
            $scope.stop.setCenter(parseFloat(stop.lat), parseFloat(stop.lon));
        });
    });