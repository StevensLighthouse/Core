var baseGeocoderUrl = "http://maps.googleapis.com/maps/api/geocode/json";
var coreControllers = angular.module('coreControllers', []);

function mapShim() {
    this.center = {};
    this.center.latitude = 40.77;
    this.center.longitude = -73.98;
    this.zoom = 15;
    return this;
};

mapShim.prototype.setCenter = function (lat, lng) {
    this.center.latitude = lat;
    this.center.longitude = lng;
};

coreControllers.controller('HomeCtrl',
    function ($scope, $dataService) {
        $dataService.getAllData();
    });

coreControllers.controller('TourCtrl',
    function ($scope, $dataService) {
        $scope.tours = [];

        $dataService.getAllTours().then(function (tours) {
            $scope.tours = tours;
        });
    });

coreControllers.controller('NewTourCtrl',
    function ($scope, $dataService) {
        $scope.verb = "Create";
        $scope.name = "";
        $scope.description = "";
        $scope.stops = [];
        $scope.visibility = true;

        $scope.map = new mapShim();

        $dataService.getAllStops().then(function (stops) {
            $scope.allStops = stops;
        })

        $scope.centerOnStop = function (stop) {
            $scope.map.setCenter(stop.lat, stop.lon);
        };

        $scope.poolToList = function (stop) {
            $scope.allStops = _.without($scope.allStops, stop);
            $scope.stops.push(stop);
            $scope.centerOnStop(stop);
        };

        $scope.listToPool = function (stop) {
            $scope.allStops.push(stop);
            $scope.stops = _.without($scope.stops, stop);
        }

        $scope.saveTour = function () {
            $dataService.addTour($scope.name, $scope.description, $scope.visibility, $scope.map.center.latitude, $scope.map.center.longitude, $scope.stops)
                .then(function () {
                    window.location = "#/tours";
                }, function (errorList) {
                    $scope.errorList = errorList;
                });
        };
    });

coreControllers.controller('TourEditCtrl',
    function ($scope, $routeParams, $dataService) {
        $scope.verb = "Update";
        $scope.name = "";
        $scope.description = "";
        $scope.stops = [];
        $scope.visibility = true;

        $scope.tourId = $routeParams.tourId;

        $scope.map = new mapShim();

        $scope.centerOn = function (stop) {
            $scope.map.setCenter(stop.lat, stop.lon);
        }

        $scope.centerOnStop = function (stop) {
            $scope.map.setCenter(stop.lat, stop.lon);
        };

        $scope.poolToList = function (stop) {
            $scope.allStops = _.without($scope.allStops, stop);
            $scope.stops.push(stop);
            $scope.centerOnStop(stop);
        };

        $scope.listToPool = function (stop) {
            $scope.allStops.push(stop);
            $scope.stops = _.without($scope.stops, stop);
        }

        $scope.saveTour = function () {
            $dataService.updateTour($scope.tourId, $scope.name, $scope.description, $scope.visibility, $scope.map.center.latitude, $scope.map.center.longitude, $scope.stops)
                .then(function () {
                    window.location = "#/tours";
                }, function (errorList) {
                    $scope.errorList = errorList;
                });
        };

        $dataService.getTour($scope.tourId).then(function (tour) {
            $scope.name = tour.name;
            $scope.stops = tour.stops;
            $scope.description = tour.description;
            $scope.map.setCenter(parseFloat(tour.lat), parseFloat(tour.lon));
            $dataService.getAllStops().then(function (stops) {
                var usedDict = {};

                for (var i = 0; i < $scope.stops.length; i++) {
                    usedDict[$scope.stops[i].id] = true
                }

                $scope.allStops = _.reject(stops, function (stop) {
                    return usedDict[stop.id];
                });
            });

        });
    });

coreControllers.controller('TourDetailCtrl',
    function ($scope, $routeParams, $dataService) {
        $scope.tourId = $routeParams.tourId;

        $scope.map = new mapShim();

        $scope.centerOn = function (stop) {
            $scope.map.setCenter(stop.lat, stop.lon);
        }

        $dataService.getTour($scope.tourId).then(function (tour) {
            $scope.name = tour.name;
            $scope.stops = tour.stops;
            $scope.description = tour.description;
            $scope.map.setCenter(parseFloat(tour.lat), parseFloat(tour.lon));
        });
    });

coreControllers.controller('GroupCtrl',
    function ($scope, $dataService) {
        $dataService.getAllGroups().then(function (groups) {
            $scope.groups = groups;
        });
    });

coreControllers.controller('NewGroupCtrl',
    function ($scope, $dataService) {
        $scope.verb = "Create";
        $scope.name = "";
        $scope.description = "";

        $scope.saveGroup = function () {
            $dataService.addGroup($scope.name, $scope.description).then(function () {
                window.location = "#/groups";
            }, function (errorList) {
                $scope.errorList = errorList;
            });
        };
    });

coreControllers.controller('GroupEditCtrl',
    function ($scope, $routeParams, $dataService) {
        $scope.groupId = $routeParams.groupId;
        $scope.verb = "Update";
        $scope.name = "";
        $scope.description = "";

        $dataService.getGroup($scope.groupId).then(function (group) {
            $scope.name = group.name;
            $scope.description = group.description;
        });

        $scope.saveGroup = function () {
            $dataService.updateGroup($scope.groupId, $scope.name, $scope.description).then(function () {
                window.location = "#/groups";
            }, function (errorList) {
                $scope.errorList = errorList;
            });
        };
    });

coreControllers.controller('GroupDetailCtrl',
    function ($scope, $routeParams, $dataService) {
        $scope.groupId = $routeParams.groupId;

        $dataService.getGroup($scope.groupId).then(function (group) {
            $scope.name = group.name;
            $scope.description = group.description;
        });
    });

coreControllers.controller('UserCtrl',
    function ($scope, $dataService) {
        $dataService.getAllUsers().then(function (users) {
            $scope.users = users;
        });
    });

coreControllers.controller('NewUserCtrl',
    function ($scope, $dataService) {
        $dataService.getAllGroups().then(function (groups) {
            $scope.possibleGroups = groups;
        });

        $scope.verb = "Create";
        $scope.email = "";
        $scope.pass1 = "";
        $scope.pass2 = "";
        $scope.role = "0";
        $scope.group = "";

        $scope.saveUser = function () {
            $dataService.addUser($scope.email, $scope.pass1, $scope.role, $scope.group).then(function () {
                window.location = "#/users";
            }, function (errorList) {
                $scope.errorList = errorList;
            });
        };
    });

coreControllers.controller('UserDetailCtrl',
    function ($scope, $routeParams, $dataService) {
        $scope.userId = $routeParams.userId;

        $dataService.getUser($scope.userId).then(function (user) {
            $scope.email = user.email;
            $scope.role = user.role;
            $scope.group = user.group;
        });
    });

coreControllers.controller('UserEditCtrl', 
    function ($scope, $routeParams, $dataService) {
        $scope.userId = $routeParams.userId;
        $scope.verb = "Update";
        $scope.selectedGroup = "";
        
        $dataService.getAllGroups().then(function (groups) {
            $scope.possibleGroups = groups;
        });

        $dataService.getUser($scope.userId).then(function (user) {
            $scope.email = user.email;
            $scope.role = user.permission;
            $scope.selectedGroup = user.group_id;
        });

        $scope.saveUser = function () {
            var groupId = $scope.selectedGroup ? $scope.selectedGroup.id : null;

            $dataService.updateUser($scope.userId, $scope.email, $scope.pass1, $scope.role, groupId).then(function () {
                window.location = "#/users";
            }, function (errorList) {
                $scope.errorList = errorList;
            });
        };
    });

coreControllers.controller('StopCtrl',
    function ($scope, $dataService) {
        $dataService.getAllStops().then(function (stops) {
            $scope.stops = stops;
        });
    });

coreControllers.controller('StopDetailCtrl',
    function ($scope, $routeParams, $dataService) {
        $scope.stopId = $routeParams.stopId;
        $scope.map = new mapShim();
        $scope.stop = new mapShim();

        $dataService.getStop($scope.stopId).then(function (stop) {
            $scope.name = stop.name;
            $scope.description = stop.description;
            $scope.map.setCenter(parseFloat(stop.lat), parseFloat(stop.lon));
            $scope.stop.setCenter(parseFloat(stop.lat), parseFloat(stop.lon));
        });
    });

coreControllers.controller('NewStopCtrl',
    function ($scope, $dataService) {
        $scope.verb = "Create";
        $scope.name = "";
        $scope.address = "";
        $scope.description = "";
        $scope.visibility = true;
        $scope.map = new mapShim();
        $scope.stop = new mapShim();

        $scope.geolocate = function () {
            if ($scope.address) {
                $.ajax({
                    dataType: "json",
                    url: baseGeocoderUrl,
                    data: {
                        sensor: true,
                        address: $scope.address
                    },
                    success: function (data) {
                        if (data.status === "OK" && data.results.length > 0) {
                            var location = data.results[0].geometry.location;
                            $scope.map.setCenter(location.lat, location.lng);
                            $scope.stop.setCenter(location.lat, location.lng);
                        } else {
                            $scope.errorList = ["There has been an error location that address."];
                        }
                        $scope.$apply();
                    }
                });
            } else {
                $scope.errorList = ["You must include a location in order to geolocate."];
            }
        }

        $scope.saveStop = function () {
            $dataService.addStop($scope.name, $scope.description, $scope.visibility, $scope.stop.center.latitude, $scope.stop.center.longitude)
                .then(function () {
                    window.location = "#/stops";
                }, function (errorList) {
                    $scope.errorList = errorList;
                });
        };
    });

coreControllers.controller('StopEditCtrl',
    function ($scope, $routeParams, $dataService) {
        $scope.stopId = $routeParams.stopId;
        $scope.verb = "Update";
        $scope.name = "";
        $scope.address = "";
        $scope.description = "";
        $scope.visibility = true;
        $scope.map = new mapShim();
        $scope.stop = new mapShim();

        $dataService.getStop($scope.stopId).then(function (stop) {
            $scope.name = stop.name;
            $scope.description = stop.description;
            $scope.map.setCenter(parseFloat(stop.lat), parseFloat(stop.lon));
            $scope.stop.setCenter(parseFloat(stop.lat), parseFloat(stop.lon));
        });

        $scope.saveStop = function () {
            $dataService.updateStop($scope.stopId, $scope.name, $scope.description, $scope.visibility, $scope.stop.center.latitude, $scope.stop.center.longitude)
                .then(function () {
                    window.location = "#/stops";
                }, function (errorList) {
                    $scope.errorList = errorList;
                });
        };
    });