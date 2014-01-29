ko.bindingHandlers.debug = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
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
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
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

var StateEnum = {
    Starting: 0,
    Invisible: 1,
    Visible: 2
};

ko.bindingHandlers.page = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var ele = $(element),
            val = valueAccessor(),
            type = val.constructor,
            allBindings = allBindingsAccessor(),
            onVisibleDo = allBindings.onVisible,
            onVisible = (onVisibleDo && typeof onVisibleDo === "function"),
            onHideDo = allBindings.onHide,
            onHide = (onHideDo && typeof onHideDo === "function"),
            curr = "",
            params,
            startingState = StateEnum.Starting,
            newState = null,
            flip = false;

        function change() {
            curr = window.location.hash;
            if (curr) curr = curr.substr(1);
            params = curr.split("/");

            if (params.length > 0) {
                curr = params[0];
                params = params.splice(1);
            }

            if ((type === String && val === curr) || (type === Array && val.indexOf(curr) >= 0)) {
                newState = StateEnum.Visible;

                if (startingState !== newState) {
                    ele.show();

                    if (onVisible) {
                        onVisibleDo.apply(window, params);
                    }
                }
            } else {
                newState = StateEnum.Invisible;

                if (startingState !== newState) {
                    ele.hide();

                    if (onHide) {
                        onHideDo.apply(window, params);
                    }
                }
            }

            startingState = newState;
        };

        change();

        window.addEventListener("hashchange", change);
    }
};

ko.bindingHandlers.slide = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var ele = $(element),
            value = valueAccessor();

        if (value()) {
            ele.show();
        } else {
            ele.hide();
        }
    }
};