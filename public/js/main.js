/*globals $, ko */
var enableDebug = true;
var baseGeocoderUrl = "http://maps.googleapis.com/maps/api/geocode/json";

function emptyFunc() {

}

if (!enableDebug) {
    console.log = emptyFunc;
    console.group = emptyFunc;
    console.groupEnd = emptyFunc;
    console.groupCollapsed = emptyFunc;
}

/**
 * Enum for the page we want to load
 * @readonly
 * @enum {string}
 */
var SiteState = {
    Loading: "loading",
    TourList: "Tour List",
    ViewTour: "View Tour",
    EditTour: "Edit Tour",
    StopList: "Stop List",
    ViewStop: "View Stop",
    EditStop: "Edit Stop",
    FindStop: "Find Stop"
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
        if (self.stops.indexOf(newStop) < 0) {
            self.stops.push(newStop);
            parent.parent.addMarker(newStop, self);
            parent.parent.setCenter(newStop.lat(), newStop.lon());
        }
    };

    self.detachStop = function (stop) {
        self.newStops.remove(stop);
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
        parent.loadTour(self, SiteState.ViewTour);
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
        parent.loadTour(self, SiteState.EditTour);
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
        var stopList = parent.parent.stopContainer().stops(),
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
        } else {
            // If raw is unsupplied, then we will simply pre-seed with starter data because that means the tour is new
            self.name("My New Tour");
            self.description("A tour of my favorite places");
            self.visibility(true);
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
var TourContainerViewModel = function (raw, parent) {
    var self = this;

    // Allows us climb up the chain fo rwhen we want to import stops
    self.parent = parent;

    self.tours = ko.observableArray([]);

    // When we want to focus on one tour to view / edit it
    self.focusedTour = ko.observable();

    // Sets us up to create a new tour
    self.createNewTour = function () {
        self.focusedTour(new TourViewModel(null, self));
        self.focusedTour().edit();
    };

    self.availableStops = ko.computed(function () {
        return parent.stopContainer().stops();
    });

    /**
     * Loads a tour to be visible on the map, as well as come into some sort of focus
     * @function
     */
    self.loadTour = function (tour, state) {
        var lat = tour.lat(),
            lon = tour.lon(),
            stops = tour.stops(),
            i,
            currStop;

        parent.state(SiteState.Loading);
        self.focusedTour(tour);
        parent.state(state);

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
        parent.state(SiteState.TourList);
        parent.clearMap();
    };

    /**
     * Initializes the tour list container; safe to self-invoke
     * @function
     */
    self.init = function () {
        // We do a .push.apply to only 
        var tours = ko.utils.arrayMap(raw, function (tour) {
            return new TourViewModel(tour, self);
        });

        self.tours.push.apply(self.tours, tours);
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
        parent.loadStop(self, SiteState.EditStop);
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

var StopContainerViewModel = function (raw, parent) {
    var self = this,
        miniMap,
        miniMapOptions = {
            zoom: 17,
            center: new google.maps.LatLng(40.7435753309731, -74.02875912059483),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

    self.stops = ko.observableArray([]);

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
    self.loadStop = function (stop, state) {
        parent.state(SiteState.Loading);
        self.focusedStop(stop);
        parent.state(state);

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
        parent.state(SiteState.StopList);
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
     * Initializes the tour list container; safe to self-invoke
     * @function
     */
    self.init = function () {
        var stops = ko.utils.arrayMap(raw, function (stop) {
            return new StopViewModel(stop, self);
        });

        self.stops.push.apply(self.stops, stops);
    };

    (function () {
        self.init();
    }());
};

/**
 * A container around our application.
 * @constructor
 * @param {object} [raw] The raw data that will
 */
var AppContainer = function (raw, map) {
    var self = this;

    self.map = map;

    // Determines what's actually visible on the page.
    self.state = ko.observable(SiteState.Loading);

    self.tourContainer = ko.observable();
    self.stopContainer = ko.observable();

    self.showTourList = ko.computed(function () {
        return self.state() === SiteState.TourList;
    });

    self.showLoadingPage = ko.computed(function () {
        return self.state() === SiteState.Loading;
    });

    self.showViewTourPage = ko.computed(function () {
        return self.state() === SiteState.ViewTour;
    });

    self.showEditTourPage = ko.computed(function () {
        return self.state() === SiteState.EditTour;
    });

    self.manageStops = function () {
        self.state(SiteState.StopList);
    };

    self.manageTours = function () {
        self.state(SiteState.TourList);
    };

    self.managingTours = ko.computed(function () {
        return self.showTourList() || self.showViewTourPage() || self.showEditTourPage();
    });

    self.showStopList = ko.computed(function () {
        return self.state() === SiteState.StopList;
    });

    self.showEditStopPage = ko.computed(function () {
        return self.state() === SiteState.EditStop;
    });

    self.showViewStopPage = ko.computed(function () {
        return self.state() === SiteState.ViewStop;
    })

    self.managingStops = ko.computed(function () {
        return self.showStopList() || self.showEditStopPage();
    });

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

    self.closeInfoWindows = function() {
        for(var i = 0; i < self.infoWindows.length; i++) {
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
    self.init = function () {
        self.state(SiteState.TourList);

        self.stopContainer(new StopContainerViewModel(raw.stops, self));
        self.tourContainer(new TourContainerViewModel(raw.tours, self));
    };
};