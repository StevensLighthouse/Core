/*globals $, ko */
var enableDebug = true;

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
    EditTour: "Edit Tour"
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

    self.tourUpdateText = ko.computed(function () {
        return self.id() ? "Update Tour" : "Create Tour";
    });

    self.canSaveTour = ko.computed(function () {
        return self.newName() && self.newName() !== "";
    });

    self.disableSave = ko.computed(function () {
        return !self.canSaveTour();
    })

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
            }).done(function (response) {
                self.id(response.tour.id);
            }).fail(function (r) {
                console.log(r);
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

    self.tours = ko.observableArray([]);

    // When we want to focus on one tour to view / edit it
    self.focusedTour = ko.observable();

    // Sets us up to create a new tour
    self.createNewTour = function () {
        self.focusedTour(new TourViewModel(null, self));
        self.focusedTour().edit();
    };

    /**
     * Loads a tour to be visible on the map, as well as come into some sort of focus
     * @function
     */
    self.loadTour = function (tour, state) {
        var lat = tour.lat(),
            lon = tour.lon();
        parent.state(SiteState.Loading);
        self.focusedTour(tour);
        parent.state(state);

        if (lat && lon) {
            parent.setCenter(lat, lon);
            parent.setMarker(lat, lon, tour.name());
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

/**
 * A container around our application.
 * @constructor
 * @param {object} [raw] The raw data that will
 */
var AppContainer = function (raw, map) {
    var self = this;

    // Determines what's actually visible on the page.
    self.state = ko.observable(SiteState.Loading);

    self.tourContainer = ko.observable();

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
        map.setCenter(new google.maps.LatLng(lat, lon));
    };

    self.addMarker = function (lat, lon, title) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lon),
            map: map,
            title: title
        });

        self.markers.push(marker);
        return marker;
    };

    /**
     * Sets a single marker onto the map
     * @function
     */
    self.setMarker = function (lat, lon, title) {
        self.removeMarkers();

        return self.addMarker(lat, lon, title);
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

        // We will temporarily generate the list of tour view models inside tourContainer's init function
        self.tourContainer(new TourContainerViewModel(raw, self));
    };
};