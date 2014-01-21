ko.bindingHandlers.debug = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        // This will be called when the binding is first applied to an element
        // Set up any initial state, event handlers, etc. here
        console.groupCollapsed("[Debug] Initializaing:");
        console.log(element);
        console.log(valueAccessor());
        console.log(allBindings);
        console.log(viewModel);
        console.log(bindingContext);
        console.groupEnd();
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        // This will be called once when the binding is first applied to an element,
        // and again whenever the associated observable changes value.
        // Update the DOM element based on the supplied values here.
        console.groupCollapsed("[Debug] Updating:");
        console.log(element);
        console.log(valueAccessor());
        console.log(allBindings);
        console.log(viewModel);
        console.log(bindingContext);
        console.groupEnd();
    }
};

ko.bindingHandlers.page = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var ele = $(element),
            val = valueAccessor(),
            type = val.constructor,
            allBindings = allBindingsAccessor(),
            curr = "";

        function change() {
            curr = window.location.hash;
            if (curr) curr = curr.substr(1);
            if ((type === String && val === curr) || (type === Array && val.indexOf(curr) >= 0)) {
                ele.show();
                if(allBindings.onVisible && typeof allBindings.onVisible === "function"){
                    allBindings.onVisible();
                }
            } else {
                ele.hide();
            }
        };
        change();

        window.addEventListener("hashchange", change);
    }
};

ko.bindingHandlers.slide = {
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var ele = $(element),
            value = valueAccessor();

        if (value()) {
            ele.show();
        }
        else {
            ele.hide();
        }
    }
};
