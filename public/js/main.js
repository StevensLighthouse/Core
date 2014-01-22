/*globals $, ko */
var enableDebug = true;
var baseGeocoderUrl = "http://maps.googleapis.com/maps/api/geocode/json";

/**
 * An empty function that will be used to hide debug information in production.
 */
function emptyFunc() {

}

if (!enableDebug) {
    console.log = emptyFunc;
    console.group = emptyFunc;
    console.groupEnd = emptyFunc;
    console.groupCollapsed = emptyFunc;
}

/**
 * Enum for the roles of a user
 * @readonly
 * @enum {string}
 */
var UserRoles = {
    0: "Deactivated",
    1: "Editor",
    2: "Builder",
    3: "Group Admin",
    4: "Site Admin"
};

/**
 * Represents a single tour.
 * @constructor
 * @param {object} [raw] The raw data to create this tour.
 * @param {object} [parent] A reference to the tour list container.
 */
var TourViewModel = function (raw, parent) {
    var self = this;

    self.id = ko.observable("");
    self.name = ko.observable("");
    self.newName = ko.observable("");

    self.description = ko.observable("");
    self.newDescription = ko.observable("");

    self.visibility = ko.observable(true);
    self.newVisibilty = ko.observable();

    self.visibilityText = ko.computed(function () {
        return self.visibility() ? "visible" : "not visible";
    });

    // These will be changed into computables determined by the stops
    self.lat = ko.observable(0);
    self.lon = ko.observable(0);

    self.stops = ko.observableArray([]);
    self.newStop = ko.observable();
    self.newStops = ko.observableArray([]);

    self.addNewStop = function () {
        var newStop = self.newStop();
        if (self.newStops.indexOf(newStop) < 0) {
            self.newStops.push(newStop);
            parent.parent.addMarker(newStop, self);
            parent.parent.setCenter(newStop.lat(), newStop.lon());
            self.newStop(null);
        }
    };

    self.detachStop = function (stop) {
        self.newStops.remove(stop);
        parent.parent.removeMarker(stop, self);
    };

    self.tourUpdateText = ko.computed(function () {
        return self.id() ? "Update Tour" : "Create Tour";
    });

    self.canSaveTour = ko.computed(function () {
        return self.newName() && self.newName() !== "";
    });

    self.disableSave = ko.computed(function () {
        return !self.canSaveTour();
    })

    self.centerOnStop = function (stop) {
        parent.parent.setCenter(stop.lat(), stop.lon());
    };

    /**
     * Saves or updates a tour on the server
     * @function
     */
    self.saveTour = function () {
        if (!self.canSaveTour()) return;

        self.name(self.newName());
        self.description(self.newDescription());
        self.visibility(self.newVisibilty());
        self.load();

        // we want to save the tour
        if (self.id() && self.id() !== "") {
            $.ajax({
                dataType: "json",
                type: "PUT",
                url: "/tours/" + self.id(),
                data: {
                    name: self.name(),
                    description: self.description(),
                    visibility: self.visibility(),
                    lat: self.lat(),
                    lon: self.lon()
                }
            }).done(function (response) {
                self.id(response.tour.id);
            }).fail(function (r) {
                console.log(r);
            });
        } else {
            // we want to create the tour
            // No reason that I should have to supply lat, lon myself -- should be parsed from stops.
            parent.tours.push(self);

            $.ajax({
                dataType: "json",
                type: "POST",
                url: "/tours",
                data: {
                    name: self.name(),
                    description: self.description(),
                    visibility: self.visibility(),
                    lat: 40.7435753309731,
                    lon: -74.02875912059483
                }
            }).done(function (response) {
                self.id(response.tour.id);
            }).fail(function (r) {
                console.log(r);
            });
        }
    };

    /**
     * Deletes a tour.
     * @function
     */
    self.deleteTour = function () {
        // Ideally, this would totally bring up a confirmation box.
        if (self.id() && self.id() !== "") {
            $.ajax({
                dataType: "json",
                type: "DELETE",
                url: "/tours/" + self.id(),
            });

            parent.tours.remove(self);
            parent.cancelFocus();
        }
    };

    /**
     * Loads a new tour to be displayed
     * @function
     */
    self.load = function () {
        parent.loadTour(self);
        return true;
    };

    /**
     * Sets up the tour to be edited.
     * @function
     */
    self.edit = function () {
        self.newName(self.name());
        self.newDescription(self.description());
        self.newVisibilty(self.visibility());
        self.newStops(self.stops().slice(0));
        parent.loadTour(self);
        return true;
    };

    /**
     * Cancels the fact that we're focusing on this tour
     * Clears out any data that we may have been editing
     * @function
     */
    self.cancelFocus = function () {
        self.newName("");
        self.newDescription("");
        self.newVisibilty(false);

        parent.cancelFocus();
    };

    self.importStops = function (rawStops) {
        var stopList = parent.parent.stopContainer.stops(),
            i,
            stopHashTable,
            currStop;

        // first we set up an associative array that states what the stops are in this 
        for (i = 0, stopHashTable = []; i < rawStops.length; i++) {
            currStop = rawStops[i];
            stopHashTable[currStop.id] = true;
        }

        for (i = 0; i < stopList.length; i++) {
            currStop = stopList[i];

            if (stopHashTable[currStop.id()]) {
                self.stops.push(currStop);
            }
        }
    };

    /**
     * Initializes the tour; safe to self-invoke
     * @function
     */
    self.init = function () {
        if (raw) {
            self.id(raw.id);
            self.name(raw.name);
            self.description(raw.description);
            self.lat(raw.lat);
            self.lon(raw.lon);
            self.visibility(raw.visibility);
            self.importStops(raw.stops);
        }
    };

    (function () {
        self.init();
    }());
};

/**
 * A container around the list of tours.
 * @constructor
 * @param {object} [raw] The raw data to create tours.
 * @param {objet} [parent] A reference to the app container.
 */
var TourContainerViewModel = function (parent) {
    var self = this;

    // Allows us climb up the chain fo rwhen we want to import stops
    self.parent = parent;

    self.tours = ko.observableArray([]);
    self.newTourName = ko.observable("");
    self.newTourDescription = ko.observable("");
    self.newTourList = ko.observableArray();
    self.newTourPool = ko.observableArray();
    self.newTourVisibility = ko.observable(true);

    self.toggleNewVisibility = function () {
        self.newTourVisibility(!self.newTourVisibility())
    };

    self.createTour = function () {
        self.newTourName("");
        self.newTourDescription("");
        self.newTourList([]);
        self.newTourVisibility(true);
        self.newTourPool(parent.stopContainer.stops().slice(0));
    };

    self.listToPool = function (data) {
        self.newTourPool.push(data);
        self.newTourList.remove(data);

        return false;
    };

    self.poolToList = function (data) {
        self.newTourList.push(data);
        self.newTourPool.remove(data);

        return false;
    }

    self.saveTour = function () {
        if (!self.newTourName()) return false;
        if (!self.newTourDescription()) return false;
        if (!self.newTourList().length) return false;

        var stopIds = ko.utils.arrayMap(self.newTourList(), function (stop) {
            return stop.id();
        }),
            center = parent.getCenter();

        $.ajax({
            dataType: "json",
            type: "POST",
            url: "/tours",
            data: {
                name: self.newTourName(),
                description: self.newTourDescription(),
                visibility: self.newTourVisibility(),
                lat: center.lat,
                lon: center.lng,
                stops: stopIds
            }
        }).done(function (response) {
            self.tours.push(new TourViewModel(response.tour, self));
        }).fail(function (r) {
            console.log(r);
        });

        return true;
    };

    // When we want to focus on one tour to view / edit it
    self.focusedTour = ko.observable();

    // Sets us up to create a new tour
    self.createNewTour = function () {
        self.focusedTour(new TourViewModel(null, self));
        self.focusedTour().edit();
        return true;
    };

    self.availableStops = ko.computed(function () {
        return parent.stopContainer.stops();
    });

    self.focusOn = function (id) {
        // panic
        var asNum = parseInt(id);
        if (Number.isNaN(asNum)) return;

        for (var i = 0; i < self.tours().length; i++) {
            if (self.tours()[i].id() === asNum) {
                self.focusedTour(self.tours()[i]);
                self.focusedTour().load();
                return;
            }
        }
    };

    self.focusedTourId = ko.observable(null);
    self.focusedTourComputed = ko.computed(function () {
        var target = parseInt(self.focusedTourId()),
            tourList = self.tours(),
            i,
            curr;

        if (!target || !tourList.length) return null;

        for (i = 0; i < tourList.length; i++) {
            curr = tourList[i];

            if (curr.id() === target) {
                return curr;
            }
        }

        return null;
    }, this);

    self.preview = function (id) {
        self.focusedTourId(id);

        return true;
    };

    self.hidePreview = function () {
        self.focusedTourId(null);
    }

    self.edit = function (id) {
        self.focusOn(id);
        if (!self.focusedTour()) return false;
        self.focusedTour().edit();
        return true;
    };

    /**
     * Loads a tour to be visible on the map, as well as come into some sort of focus
     * @function
     */
    self.loadTour = function (tour) {
        var lat = tour.lat(),
            lon = tour.lon(),
            stops = tour.stops(),
            i,
            currStop;

        self.focusedTour(tour);

        if (stops.length > 0) {
            for (i = 0; i < stops.length; i++) {
                curr = stops[i];
                parent.addMarker(curr, tour);
            }
        }
        if (lat && lon) {
            parent.setCenter(lat, lon);
        }
    };

    /**
     * Clears out the focused tour field and brings us back to the tour list
     * @function
     */
    self.cancelFocus = function () {
        self.focusedTour(null);
        parent.clearMap();
    };

    /**
     * Initializes the tour list container; safe to self-invoke
     * @function
     */
    self.init = function () {
        $.ajax({
            dataType: "json",
            url: "/tours.json",
            success: function (data) {
                var tours = ko.utils.arrayMap(data.tours, function (tour) {
                    return new TourViewModel(tour, self);
                });
                self.tours(tours);
            }
        });
    };

    (function () {
        self.init();
    }());
};

var StopViewModel = function (raw, parent) {
    var self = this;

    self.id = ko.observable("");
    self.name = ko.observable("");
    self.newName = ko.observable("");

    self.description = ko.observable("");
    self.newDescription = ko.observable("");

    self.newAddress = ko.observable("");

    self.visibility = ko.observable(true);
    self.newVisibilty = ko.observable();

    self.visibilityText = ko.computed(function () {
        return self.visibility() ? "visible" : "not visible";
    });

    // These will be changed into computables determined by the stops
    self.lat = ko.observable(0);
    self.lon = ko.observable(0);

    self.geolocate = function () {
        if (self.newAddress()) {
            $.ajax({
                dataType: "json",
                url: baseGeocoderUrl,
                data: {
                    sensor: true,
                    address: self.newAddress()
                },
                success: function (data) {
                    if (data.status === "OK" && data.results.length > 0) {
                        self.lat(data.results[0].geometry.location.lat);
                        self.lon(data.results[0].geometry.location.lng);
                        parent.setMarker(self.lat(), self.lon());
                    }
                }
            });
        }
    }

    self.load = function () {

    };

    self.edit = function () {
        self.newName(self.name());
        self.newDescription(self.description());
        self.newVisibilty(self.visibility());
        self.newAddress("");
        parent.loadStop(self);
    };

    self.deleteStop = function () {
        // Ideally, this would totally bring up a confirmation box.
        if (self.id() && self.id() !== "") {
            $.ajax({
                dataType: "json",
                type: "DELETE",
                url: "/stops/" + self.id(),
            });

            parent.stops.remove(self);
            parent.cancelFocus();
        }
    };

    /**
     * Cancels the fact that we're focusing on this stop
     * Clears out any data that we may have been editing
     * @function
     */
    self.cancelFocus = function () {
        self.newName("");
        self.newDescription("");
        self.newVisibilty(false);
        parent.cancelFocus();
    };

    self.canSaveStop = ko.computed(function () {
        if (!self.newName()) return false;
        if (!self.newDescription()) return false;

        if (!self.lon() || self.lon() > 180 || self.lon() < -180) return false;
        if (!self.lat() || self.lat() > 90 || self.lat() < -90) return false;

        return true;
    });

    /**
     * Saves or updates a stop on the server
     * @function
     */
    self.saveStop = function () {
        if (!self.canSaveStop()) return;

        self.name(self.newName());
        self.description(self.newDescription());
        self.visibility(self.newVisibilty());
        //        self.load();

        // we want to save the stop
        if (self.id() && self.id() !== "") {
            $.ajax({
                dataType: "json",
                type: "PUT",
                url: "/stops/" + self.id(),
                data: {
                    name: self.name(),
                    description: self.description(),
                    visibility: self.visibility(),
                    lat: self.lat(),
                    lon: self.lon()
                }
            });
        } else {
            parent.stops.push(self);

            $.ajax({
                dataType: "json",
                type: "POST",
                url: "/stops",
                data: {
                    name: self.name(),
                    description: self.description(),
                    visibility: self.visibility(),
                    lat: self.lat(),
                    lon: self.lon()
                }
            }).done(function (response) {
                self.id(response.stop.id);
            }).fail(function (r) {
                console.log(r);
            });
        }

        self.cancelFocus();
    };

    /**
     * Initializes the tour; safe to self-invoke
     * @function
     */
    self.init = function () {
        if (raw) {
            self.id(raw.id);
            self.name(raw.name);
            self.description(raw.description);
            self.lat(raw.lat);
            self.lon(raw.lon);
            self.visibility(raw.visibility);
        } else {
            // If raw is unsupplied, then we will simply pre-seed with starter data because that means the tour is new
            self.name("My New Stop");
            self.description("My Favorite Place");
            self.visibility(true);
        }
    };

    (function () {
        self.init();
    }());

};

var StopContainerViewModel = function (parent) {
    var self = this,
        miniMap,
        miniMapOptions = {
            zoom: 17,
            center: new google.maps.LatLng(40.7435753309731, -74.02875912059483),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

    self.stops = ko.observableArray([]);
    self.stops.subscribe(function (newVal) {
        parent.tourContainer.newTourPool(newVal.slice(0));
    });

    // When we want to focus on one stop to view / edit it
    self.focusedStop = ko.observable();

    self.findStops = function () {

    };

    // Sets us up to create a new stop
    self.createNewStop = function () {
        self.focusedStop(new StopViewModel(null, self));
        self.focusedStop().edit();
    };

    /**
     * Loads a stop to be visible on the map, as well as come into some sort of focus
     * @function
     */
    self.loadStop = function (stop) {
        self.focusedStop(stop);

        if (stop.id()) {
            miniMapOptions.center = new google.maps.LatLng(stop.lat(), stop.lon());
        }

        miniMap = new google.maps.Map(document.getElementById('mini-map'), miniMapOptions);

        if (stop.id()) {
            google.maps.event.addListenerOnce(miniMap, 'idle', function () {
                //loaded fully
                self.setMarker(stop);
            });
        }
    };

    /**
     * Clears out the focused stop field and brings us back to the stop list
     * @function
     */
    self.cancelFocus = function () {
        self.focusedStop(null);
    };

    // Map operations

    self.markers = [];

    /**
     * Removes all markers from the map
     * @function
     */
    self.removeMarkers = function () {
        for (var i = 0; i < self.markers.length; i++) {
            self.markers[i].setMap(null);
        }

        self.markers = [];
    };

    /**
     * Changes the position of the map
     * @function
     */
    self.setCenter = function (lat, lon) {
        miniMap.setCenter(new google.maps.LatLng(lat, lon));
    };


    self.addMarker = function (lat, lon) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lon),
            map: miniMap
        });
        self.markers.push(marker);
        self.setCenter(lat, lon);

        return marker;
    };

    /**
     * Sets a single marker onto the map
     * @function
     */
    self.setMarker = function (lat, lon) {
        self.removeMarkers();

        return self.addMarker(lat, lon);
    };

    /**
     * Initializes the stop list container; safe to self-invoke
     * @function
     */
    self.init = function () {
        $.ajax({
            dataType: "json",
            url: "/stops.json",
            success: function (data) {
                var stops = ko.utils.arrayMap(data.stops, function (stop) {
                    return new StopViewModel(stop, self);
                });
                self.stops(stops);
            }
        });
    };

    (function () {
        self.init();
    }());
};

var UserViewModel = function (raw, parent) {
    this.id = ko.observable(raw.id);
    this.email = ko.observable(raw.email);
    this.permission = ko.observable(raw.permission);
    this.groupId = ko.observable(raw.group_id);

    this.role = ko.computed(function () {
        return UserRoles[this.permission()];
    }, this);

    this.groupName = ko.computed(function () {
        if (!this.groupId()) return "No Group";
        var group = parent.getGroup(this.groupId());
        if (!group) return "No Group";
        return group.name();
    }, this);
};

var GroupViewModel = function (raw) {
    var self = this;

    this.id = ko.observable(raw.id);
    this.name = ko.observable(raw.name);
    this.description = ko.observable(raw.description);
};

var UserContainer = function () {
    var self = this;

    this.polling = ko.observable(false);
    this.groups = ko.observableArray();
    this.users = ko.observableArray();

    this.newEmail = ko.observable("");
    this.newPermission = ko.observable(0);
    this.newGroup = ko.observable(null);
    this.newPassword = ko.observable("");
    this.newPasswordConfirm = ko.observable("");
    this.newGroupName = ko.observable("");
    this.newGroupDescription = ko.observable("");

    this.getGroup = function (id) {
        var groups = this.groups(),
            curr,
            i;

        for (i = 0; i < groups.length; i++) {
            curr = groups[i];
            if (curr.id() === id) return curr;
        }

        return null;
    };

    this.createUser = function () {
        self.newEmail("");
        self.newPermission(1);
        self.newPassword("");
        self.newPasswordConfirm("");
        self.newGroup(null);
    };

    this.createGroup = function () {
        self.newGroupName("");
        self.newGroupDescription("");
    };

    this.saveUser = function () {
        self.polling(true);

        if (!self.newEmail()) return false;
        if (!self.newPassword()) return false;
        if (!self.newPermission()) return false;
        if (self.newPassword() != self.newPasswordConfirm()) return false;

        $.ajax({
            dataType: "json",
            type: "POST",
            url: "/users",
            data: {
                email: self.newEmail(),
                permission: self.newPermission(),
                password: self.newPassword(),
                group_id: self.newGroup()
            }
        }).done(function (response) {
            self.users.push(new UserViewModel(response.user, self));
            self.polling(false);
        }).fail(function (r) {
            console.log(r);
            self.polling(false);
        });

        return true;
    };

    this.saveGroup = function () {
        if (!self.newGroupName()) return false;

        $.ajax({
            dataType: "json",
            type: "POST",
            url: "/groups",
            data: {
                name: self.newGroupName(),
                description: self.newGroupDescription()
            }
        }).done(function (response) {
            self.groups.push(new GroupViewModel(response.group));
            self.polling(false);
        }).fail(function (r) {
            console.log(r);
            self.polling(false);
        });

        return true;
    };

    this.init = function () {
        $.ajax({
            url: "/users",
            success: function (data) {
                self.users(ko.utils.arrayMap(data.users, function (x) {
                    return new UserViewModel(x, self);
                }));
            },
            dataType: "json"
        });

        $.ajax({
            url: "/groups.json",
            success: function (data) {
                self.groups(ko.utils.arrayMap(data.groups, function (x) {
                    return new GroupViewModel(x);
                }));
            },
            dataType: "json"
        });
    };

    this.init();
};

/**
 * A container around our application.
 * @constructor
 * @param {google_map} [map] The google map object
 */
var AppContainer = function (map) {
    var self = this;

    self.map = map;

    self.userContainer = new UserContainer();
    self.stopContainer = new StopContainerViewModel(self);
    self.tourContainer = new TourContainerViewModel(self);

    // Map operations

    self.markers = [];
    self.infoWindows = [];

    /**
     * Removes all markers from the map
     * @function
     */
    self.removeMarkers = function () {
        for (var i = 0; i < self.markers.length; i++) {
            self.markers[i].setMap(null);
        }

        self.markers = [];
    };

    /**
     * Changes the position of the map
     * @function
     */
    self.setCenter = function (lat, lon) {
        map.setCenter(new google.maps.LatLng(lat, lon));
    };

    self.getCenter = function () {
        return {
            lat: map.getCenter().lat(),
            lng: map.getCenter().lng()
        };
    }

    self.closeInfoWindows = function () {
        for (var i = 0; i < self.infoWindows.length; i++) {
            self.infoWindows[i].close();
        }
    };

    self.infoWindowStop = ko.observable();
    self.infoWindowTrip = ko.observable();
    self.infoWindowMarker = ko.observable();

    self.deleteStopFromTripHelper = function () {
        self.infoWindowMarker().setMap(null);
        self.infoWindowTrip().detachStop(self.infoWindowStop());
    };

    self.addMarker = function (stop, trip) {
        var lat = stop.lat(),
            lon = stop.lon(),
            title = stop.name(),
            description = stop.description(),
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lon),
                map: map,
                title: title
            }),
            infowindow = new google.maps.InfoWindow({
                content: ""
            });

        // Little hacky, but what can you do? :|
        marker.stopId = stop.id();

        window.google.maps.event.addListener(marker, "click", function () {
            // this is actually, legitly voodoo. I am not very pleased with this
            self.closeInfoWindows();
            self.infoWindowStop(stop);
            self.infoWindowTrip(trip);
            self.infoWindowMarker(marker);

            infowindow.setContent($('#hidden-info-window-helper').clone(true)[0]);

            infowindow.open(map, marker);
        });

        self.markers.push(marker);
        self.infoWindows.push(infowindow);

        return marker;
    };

    self.removeMarker = function (stop) {
        for (var i = 0, desiredId = stop.id(), found = false, curr = null; !found && i < self.markers.length; i++) {
            curr = self.markers[i];
            if (curr.stopId === desiredId) {
                found = true;
                curr.setMap(null);
            }
        }
    };

    /**
     * Sets a single marker onto the map
     * @function
     */
    self.setMarker = function (stop) {
        self.removeMarkers();

        return self.addMarker(stop);
    };

    /**
     * Clears the map of all overlays (markers, paths, stops, etc)
     * @function
     */
    self.clearMap = function () {
        self.removeMarkers();
    };

    /**
     * Initializes the application
     * @function
     */
    self.init = function () {};
};