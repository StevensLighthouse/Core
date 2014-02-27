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
            var d = $q.defer(),
                stopIds = _.map(stops, function (stop) {
                    return stop.id;
                }),
                param = {
                    name: name,
                    description: description,
                    visibility: visibility,
                    lat: lat,
                    lon: lon,
                    stops: stopIds
                };

            if (name && description && lat && lon && stops.length) {
                $.ajax({
                    dataType: "json",
                    type: "POST",
                    url: "/tours",
                    data: param
                }).done(function (response) {
                    if (response.status === "created") {
                        if (self.tourList.length) {
                            self.tourList.push(response.tour);
                            d.resolve(response.tour);
                        } else {
                            self.getAllTours().then(function () {
                                d.resolve(response.tour);
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

        this.updateTour = function (id, name, description, visibility, lat, lon, stops) {
            var d = $q.defer(),
                stopIds = _.map(stops, function (stop) {
                    return stop.id;
                }),
                param = {
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
                data: param
            }).done(function (response) {
                var tour = response.tour,
                    found = false;

                if (response.status === "updated") {
                    for (var i = 0; i < self.tourList.length && !found; i++) {
                        if (self.tourList[i].id === tour.id) {
                            self.tourList[i] = tour;
                            found = true;
                            d.resolve(tour);
                        }
                    }
                    if (!found) {
                        self.getAllTours().then(function () {
                            d.resolve(tour);
                        })
                    }
                } else {
                    d.reject(self.fixErrorList(response.errors));
                }
            }).fail(function (r) {
                d.reject(r);
            });

            return d.promise;
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

        this.getGlobalStops = function () {
            var d = $q.defer();

            this.getAllStops().then(function (stops) {
                d.resolve(_.filter(stops, function (stop) {
                    return stop.visibility;
                }));
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

        this.addStop = function (name, description, visibility, lat, lon) {
            var d = $q.defer(),
                param = {
                    name: name,
                    description: description,
                    visibility: visibility,
                    lat: lat,
                    lon: lon
                };

            if (name && description && lat && lon) {
                $.ajax({
                    dataType: "json",
                    type: "POST",
                    url: "/stops",
                    data: param
                }).done(function (response) {
                    if (response.status === "created") {
                        if (self.stopList.length) {
                            self.stopList.push(response.stop);
                            d.resolve(response.stop);
                        } else {
                            self.getAllStops().then(function () {
                                d.resolve(response.stop);
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

        this.updateStop = function (id, name, description, visibility, lat, lon) {
            var d = $q.defer(),
                param = {
                    name: name,
                    description: description,
                    visibility: visibility,
                    lat: lat,
                    lon: lon
                };

            if (name && description && lat && lon) {
                $.ajax({
                    dataType: "json",
                    type: "PUT",
                    url: "/stops/" + id,
                    data: param
                }).done(function (response) {
                    var stop = response.stop,
                        found = false;

                    if (response.status === "updated") {
                        for (var i = 0; i < self.stopList.length && !found; i++) {
                            if (self.stopList[i].id === stop.id) {
                                self.stopList[i] = stop;
                                found = true;
                                d.resolve(stop);
                            }
                        }
                        if (!found) {
                            self.getAllStops().then(function () {
                                d.resolve(stop);
                            })
                        }
                    } else {
                        d.reject(self.fixErrorList(response.errors));
                    }
                });
            } else {
                d.reject(["Please provide all the data!"]);

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

        this.addGroup = function (name, description) {
            var d = $q.defer(),
                param = {
                    name: name,
                    description: description
                };

            if (name && description) {
                $.ajax({
                    dataType: "json",
                    type: "POST",
                    url: "/groups",
                    data: param
                }).done(function (response) {
                    if (response.status === "created") {
                        if (self.groupList.length) {
                            self.groupList.push(response.group);
                            d.resolve(response.group);
                        } else {
                            self.getAllGroups().then(function () {
                                d.resolve(response.group);
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

        this.updateGroup = function (id, name, description) {
            var d = $q.defer(),
                param = {
                    name: name,
                    description: description
                };

            if (name && description) {
                $.ajax({
                    dataType: "json",
                    type: "PUT",
                    url: "/groups/" + id,
                    data: param
                }).done(function (response) {
                    var group = response.group,
                        found = false;

                    if (response.status === "updated") {
                        for (var i = 0; i < self.groupList.length && !found; i++) {
                            if (self.groupList[i].id === group.id) {
                                self.groupList[i] = group;
                                found = true;
                                self.userList = self.fixUserList(self.userList);
                                d.resolve(group);
                            }
                        }
                        if (!found) {
                            self.getAllGroups().then(function () {
                                self.userList = self.fixUserList(self.userList);
                                d.resolve(group);
                            })
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
                this.getAllUsers().then(function () {
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

        this.updateUser = function (id, email, pass1, role, group) {
            var d = $q.defer(),
                param = {
                    email: email,
                    password: pass1,
                    permission: role,
                    group_id: group
                };

            if (id && email && role) {
                $.ajax({
                    dataType: "json",
                    type: "PUT",
                    url: "/users/" + id,
                    data: param
                }).done(function (response) {
                    var user = response.user,
                        found = false;

                    if (response.status === "updated") {
                        for (var i = 0; i < self.userList.length && !found; i++) {
                            if (self.userList[i].id === user.id) {
                                var fixedUser = self.fixUserList([user])[0];
                                self.userList[i] = fixedUser;
                                found = true;
                                d.resolve(user);
                            }
                        }
                        if (!found) {
                            self.getAllUsers().then(function () {
                                d.resolve(user);
                            })
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
            controller: 'Home'
        }).
        when('/tours', {
            templateUrl: 'partials/tours.html',
            controller: 'Tours'
        }).
        when('/tours/new', {
            templateUrl: 'partials/tour-editor.html',
            controller: 'TourCreator'
        }).
        when('/tours/:tourId', {
            templateUrl: 'partials/tour.html',
            controller: 'TourDetails'
        }).
        when('/tours/edit/:tourId', {
            templateUrl: 'partials/tour-editor.html',
            controller: 'TourEditor'
        }).
        when('/groups', {
            templateUrl: 'partials/groups.html',
            controller: 'Groups'
        }).
        when('/groups/new', {
            templateUrl: 'partials/group-editor.html',
            controller: 'GroupCreator'
        }).
        when('/groups/:groupId', {
            templateUrl: 'partials/group.html',
            controller: 'GroupDetails'
        }).
        when('/groups/edit/:groupId', {
            templateUrl: 'partials/group-editor.html',
            controller: 'GroupEditor'
        }).
        when('/users', {
            templateUrl: 'partials/users.html',
            controller: 'Users'
        }).
        when('/users/new', {
            templateUrl: 'partials/user-editor.html',
            controller: 'UserCreator'
        }).
        when('/users/:userId', {
            templateUrl: 'partials/user.html',
            controller: 'UserDetails'
        }).
        when('/users/edit/:userId', {
            templateUrl: 'partials/user-editor.html',
            controller: 'UserEditor'
        }).
        when('/stops', {
            templateUrl: 'partials/stops.html',
            controller: 'Stops'
        }).
        when('/stops/global', {
            templateUrl: 'partials/stop-importer.html',
            controller: 'StopImporter'
        }).
        when('/stops/new', {
            templateUrl: 'partials/stop-editor.html',
            controller: 'StopCreator'
        }).
        when('/stops/:stopId', {
            templateUrl: 'partials/stop.html',
            controller: 'StopDetails'
        }).
        when('/stops/edit/:stopId', {
            templateUrl: 'partials/stop-editor.html',
            controller: 'StopEditor'
        }).
        otherwise({
            redirectTo: '/home'
        });
}]);