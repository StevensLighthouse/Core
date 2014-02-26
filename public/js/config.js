Array.prototype.remove = function () {
    var what, a = arguments,
        L = a.length,
        ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

var coreApp = angular.module('core', ['google-maps', 'ngRoute', 'ui.sortable', 'coreControllers']);

var PermissionDict = {
    0: "Deactivated",
    1: "Editor",
    2: "Builder",
    3: "Group Admin",
    4: "Site Admin"
};

coreApp.factory("$dataService",
    function ($http, $q) {
        var self = this;

        this.tourList = [];
        this.stopList = [];
        this.userList = [];
        this.groupList = [];

        this.eventDict = {};
        this.addListener = function (event, onEvent) {
            if (!typeof onEvent === "function") return;

            if (!this.eventDict[event]) {
                this.eventDict[event] = [];
            }

            this.eventDict[event].push(onEvent);
        };

        this.removeListener = function (event, onEvent) {
            if (!typeof onEvent === "function") return;
            if (!this.eventDict[event]) return;
            this.eventDict[event].remove(onEvent);
        };

        this.runEvent = function (event, data) {
            if (!this.eventDict[event]) return;

            for (var i = 0; i < this.eventDict[event].length; i++) {
                this.eventDict[event][i](data);
            }
        };

        this.fixUserList = function (users) {
            var defaultGroup = {
                name: "No Group"
            };

            return _.map(users, function (user) {
                var group = user.group_id ? _.findWhere(self.groupList, {
                    id: user.group_id
                }) : null;

                group = group || defaultGroup;

                user.role = PermissionDict[user.permission];
                user.group = group.name;

                return user;
            });
        };

        this.fixErrorList = function (errors) {
            return _.map(errors, function (error, key) {
                return "[" + key + "] " + error;
            });
        };

        // gets all the tours, naively caches them
        this.getAllTours = function () {
            var d = $q.defer();

            // naive caching
            if (self.tourList.length > 0) {
                d.resolve(self.tourList);
            } else {
                // if we've got no entries, we will download
                $http.get('/tours.json').success(function (data) {
                    self.tourList = data.tours;
                    d.resolve(self.tourList);
                });
            }

            return d.promise;
        };

        this.getTour = function (id) {
            var d = $q.defer();

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
                this.getAllTours().then(function () {
                    d.resolve(findTour(id));
                });
            } else {
                d.resolve(findTour(id));
            }

            return d.promise;
        };

        this.addTour = function (name, description, visibility, lat, lon, stops) {
            var stopIds = _.map(stops, function (stop) {
                return stop.id;
            }),
                request = {
                    name: name,
                    description: description,
                    visibility: visibility,
                    lat: lat,
                    lon: lon,
                    stops: stopIds
                };

            $.ajax({
                dataType: "json",
                type: "POST",
                url: "/tours",
                data: request
            }).done(function (response) {
                self.tourList.push(response.tour);
                self.runEvent("tourAdded", response.tour);
            }).fail(function (r) {
                console.log(r);
            });
        };

        this.updateTour = function (id, name, description, visibility, lat, lon, stops) {
            var stopIds = _.map(stops, function (stop) {
                return stop.id;
            }),
                request = {
                    name: name,
                    description: description,
                    visibility: visibility,
                    lat: lat,
                    lon: lon,
                    stops: stopIds
                };

            $.ajax({
                dataType: "json",
                type: "PUT",
                url: "/tours/" + id,
                data: request
            }).done(function (response) {
                var tour = response.tour;
                for (var i = 0; i < self.tourList.length; i++) {
                    if (self.tourList[i].id === tour.id) {
                        self.tourList[i] = tour;
                        self.runEvent("tourUpdated", response.tour);
                        return;
                    }
                }

                self.tourList.push(tour);
                self.runEvent("tourAdded", tour);
            }).fail(function (r) {
                console.log(r);
            });
        };


        this.getAllStops = function () {
            var d = $q.defer();

            // naive caching
            if (self.stopList.length > 0) {
                d.resolve(self.stopList);
            }

            // if we've got no entries, we will download
            $http.get('/stops.json').success(function (data) {
                self.stopList = data.stops;
                d.resolve(self.stopList);
            });

            return d.promise;
        };

        this.getStop = function (id) {
            var d = $q.defer();

            function findStop(id) {
                if (typeof id === "string") {
                    id = parseInt(id);
                }

                return _.findWhere(self.stopList, {
                    id: id
                });
            };

            var stop = findStop(id);

            if (!stop) {
                this.getAllStops().then(function () {
                    d.resolve(findStop(id));
                });
            } else {
                d.resolve(stop);
            }

            return d.promise;
        };

        this.getAllGroups = function () {
            var d = $q.defer();

            // naive caching
            if (self.groupList.length > 0) {
                d.resolve(self.groupList);
            } else {
                // if we've got no entries, we will download
                $http.get('/groups.json').success(function (data) {
                    self.groupList = data.groups;
                    d.resolve(self.groupList);
                });
            }

            return d.promise;
        };

        this.getGroup = function (id) {
            var d = $q.defer();

            function findGroup(id) {
                if (typeof id === "string") {
                    id = parseInt(id);
                }

                return _.findWhere(self.groupList, {
                    id: id
                });
            };

            var group = findGroup(id);

            if (!group) {
                this.getAllGroups().then(function () {
                    d.resolve(findGroup(id));
                });
            } else {
                d.resolve(group);
            }

            return d.promise;
        };

        this.getAllUsers = function () {
            var d = $q.defer();

            /**        
             * We store this in its own function, so that we can download groups if we don't have them already
             */
            function manageUsers() {
                // if we've got no entries, we will download
                $http.get('/users.json').success(function (data) {
                    self.userList = self.fixUserList(data.users);
                    d.resolve(self.userList);
                });
            }

            // naive caching
            if (self.userList.length > 0) {
                d.resolve(self.userList);
            } else {
                self.getAllGroups().then(manageUsers);
            }

            return d.promise;
        };

        this.getUser = function (id) {
            var d = $q.defer();

            function findUser(id) {
                if (typeof id === "string") {
                    id = parseInt(id);
                }

                return _.findWhere(self.userList, {
                    id: id
                });
            };

            var user = findUser(id);

            if (!user) {
                this.getAllUsers(function () {
                    d.resolve(findUser(id));
                });
            } else {
                d.resolve(user);
            }

            return d.promise;
        };

        this.addUser = function (email, pass1, role, group) {
            var d = $q.defer(),
                param = {
                    email: email,
                    password: pass1,
                    permission: role,
                    group_id: group
                };

            if (email && pass1 && role) {
                $.ajax({
                    dataType: "json",
                    type: "POST",
                    url: "/users",
                    data: param
                }).done(function (response) {
                    if (response.status === "created") {
                        if (self.userList.length) {
                            self.userList.push(self.fixUserList([response.user])[0]);
                            d.resolve(response.user);
                        } else {
                            self.getAllUsers().then(function () {
                                d.resolve(response.user);
                            });
                        }
                    } else {
                        d.reject(self.fixErrorList(response.errors));
                    }
                }).fail(function (r) {
                    d.reject(r);
                });
            } else {
                d.reject(["Please provide all the data!"]);
            }


            return d.promise;
        };

        this.getAllData = function () {
            var d = $q.defer();

            this.getAllStops().then(this.getAllTours).then(this.getAllGroups).then(this.getAllUsers);

            return d.promise;
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
        when('/tours/new', {
            templateUrl: 'partials/edit-tour.html',
            controller: 'NewTourCtrl'
        }).
        when('/tours/:tourId', {
            templateUrl: 'partials/tour-detail.html',
            controller: 'TourDetailCtrl'
        }).
        when('/tours/edit/:tourId', {
            templateUrl: 'partials/edit-tour.html',
            controller: 'TourEditCtrl'
        }).
        when('/groups', {
            templateUrl: 'partials/groups.html',
            controller: 'GroupCtrl'
        }).
        when('/groups/:groupId', {
            templateUrl: 'partials/group-detail.html',
            controller: 'GroupDetailCtrl'
        }).
        when('/users', {
            templateUrl: 'partials/users.html',
            controller: 'UserCtrl'
        }).
        when('/users/new', {
            templateUrl: 'partials/edit-user.html',
            controller: 'NewUserCtrl'
        }).
        when('/users/:userId', {
            templateUrl: 'partials/user-detail.html',
            controller: 'UserDetailCtrl'
        }).
        when('/stops', {
            templateUrl: 'partials/stops.html',
            controller: 'StopCtrl'
        }).
        when('/stops/new', {
            templateUrl: 'partials/edit-stop.html',
            controller: 'NewStopCtrl'
        }).
        when('/stops/:stopId', {
            templateUrl: 'partials/stop-detail.html',
            controller: 'StopDetailCtrl'
        }).
        when('/stops/edit/:stopId', {
            templateUrl: 'partials/edit-stop.html',
            controller: 'StopEditCtrl'
        }).
        otherwise({
            redirectTo: '/home'
        });
}]);