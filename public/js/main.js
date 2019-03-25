function isMergeableObject(val) {
    var nonNullObject = val && typeof val === 'object';

    return nonNullObject
        && Object.prototype.toString.call(val) !== '[object RegExp]'
        && Object.prototype.toString.call(val) !== '[object Date]'
}

function emptyTarget(val) {
    return Array.isArray(val) ? [] : {}
}

function cloneIfNecessary(value, optionsArgument) {
    var clone = optionsArgument && optionsArgument.clone === true;
    return (clone && isMergeableObject(value)) ? deepmerge(emptyTarget(value), value, optionsArgument) : value
}

function defaultArrayMerge(target, source, optionsArgument) {
    var destination = target.slice()
    source.forEach(function(e, i) {
        if (typeof destination[i] === 'undefined') {
            destination[i] = cloneIfNecessary(e, optionsArgument)
        } else if (isMergeableObject(e)) {
            destination[i] = deepmerge(target[i], e, optionsArgument)
        } else if (target.indexOf(e) === -1) {
            destination.push(cloneIfNecessary(e, optionsArgument))
        }
    })
    return destination
}

function mergeObject(target, source, optionsArgument) {
    var destination = {}
    if (isMergeableObject(target)) {
        Object.keys(target).forEach(function (key) {
            destination[key] = cloneIfNecessary(target[key], optionsArgument)
        })
    }
    Object.keys(source).forEach(function (key) {
        if (!isMergeableObject(source[key]) || !target[key]) {
            destination[key] = cloneIfNecessary(source[key], optionsArgument)
        } else {
            destination[key] = deepmerge(target[key], source[key], optionsArgument)
        }
    })
    return destination
}

function deepmerge(target, source, optionsArgument) {
    var array = Array.isArray(source);
    var options = optionsArgument || { arrayMerge: defaultArrayMerge }
    var arrayMerge = options.arrayMerge || defaultArrayMerge

    if (array) {
        return Array.isArray(target) ? arrayMerge(target, source, optionsArgument) : cloneIfNecessary(source, optionsArgument)
    } else {
        return mergeObject(target, source, optionsArgument)
    }
}

deepmerge.all = function deepmergeAll(array, optionsArgument) {
    if (!Array.isArray(array) || array.length < 2) {
        throw new Error('first argument should be an array with at least two elements')
    }
    return array.reduce(function(prev, next) {
        return deepmerge(prev, next, optionsArgument)
    })
};

// dfsdfsdfs
let global_poly = "" ;

let state = {
    test:"test",
    tabs:{
        visible:"PureMap"
    }
};
function setState(newState ={})  {
    if (newState !== state) {
        state = deepmerge(state, newState);
        render(state);
    }
}
function render()   {
    console.log(state.tabs.visible);
    document.querySelector("#temp").innerHTML = state.tabs.visible
}

let respondToVisibility = function(element, callback) {
    let options = {
        root: document.documentElement
    };
    let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.intersectionRatio > 0){callback();}
        });
    }, options);
    observer.observe(element);
};

$(function()    {
    respondToVisibility(document.getElementById("PureMapMarker"),
            () => setState({tabs:{visible:"PureMapMarker"}}));
    respondToVisibility(document.getElementById("DataSetCreationMarker"),
        () => setState({tabs:{visible:"DataSetCreationMarker"}}));
    respondToVisibility(document.getElementById("ProfileMarker"),
        () => setState({tabs:{visible:"ProfileMarker"}}));
    respondToVisibility(document.getElementById("MessagesMarker"),
        () => setState({tabs:{visible:"MessagesMarker"}}));
    respondToVisibility(document.getElementById("SettingsMarker"),
        () => setState({tabs:{visible:"SettingsMarker"}}));

    var mymap = L.map('mapId').setView([19, 72.8826], 11);

    L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
        maxZoom: 18,
    }).addTo(mymap);

let moveFunc =  () => {
    if (global_poly !== "" )   {
        global_poly.remove()
    }
    let zoom = mymap.getZoom();
    let bounds = mymap.getBounds();
    let north_lat = bounds.getNorth();
    let south_lat = bounds.getSouth();
    let east_long = bounds.getEast();
    let west_long = bounds.getWest();
    north_lat = north_lat * (1- 0.0019);
    south_lat = south_lat * (1+ 0.0019);
    east_long = east_long * (1- 0.0009);
    west_long = west_long * (1+ 0.0009);
    console.log(  north_lat ,south_lat ,east_long ,west_long )

    global_poly   = L.polygon([
        [north_lat, west_long],
        [north_lat, east_long],
        [south_lat, east_long],
        [south_lat, west_long],
        [north_lat, west_long]]).addTo(mymap);};
    // mymap.on("moveend",moveFunc);


});

