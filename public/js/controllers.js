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

        $scope.setCenter = function (lat, lng) {
            $scope.map.center.latitude = lat;
            $scope.map.center.longitude = lng;
        }

        $scope.centerOn = function (stop) {
            $scope.setCenter(stop.lat, stop.lon);
        };

        $dataService.getTour($scope.tourId, function (tour) {
            $scope.name = tour.name;
            $scope.stops = tour.stops;
            $scope.description = tour.description;
            $scope.map.center.latitude = parseFloat(tour.lat);
            $scope.map.center.longitude = parseFloat(tour.lon);
            $scope.map.zoom = 15;
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