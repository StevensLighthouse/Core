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

coreApp.factory("$dataService", function ($http) {
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

    this.getStop = function (id, callback) {
        callback = (callback && typeof callback === "function") ? callback : function () {};

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
            this.getAllStops(function () {
                callback(findStop(id));
            });
        } else {
            callback(stop);
        }
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

    this.getGroup = function (id, callback) {
        callback = (callback && typeof callback === "function") ? callback : function () {};

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
            this.getAllGroups(function () {
                callback(findGroup(id));
            });
        } else {
            callback(group);
        }
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

    this.getUser = function (id, callback) {
        callback = (callback && typeof callback === "function") ? callback : function () {};

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
                callback(findUser(id));
            });
        } else {
            callback(user);
        }
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
        otherwise({
            redirectTo: '/home'
        });
}]);