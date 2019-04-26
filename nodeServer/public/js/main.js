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

let respondToVisibility = function(element, callback) {
    let options = {
        root: document.documentElement
    };
    let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.intersectionRatio > 0){callback();}
        });
    }, options);
    (element instanceof jQuery) ?    observer.observe(element[0]):     observer.observe(element);
};
if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}

function getTileURL(lat, lon, zoom) {
    let xtile = parseInt(Math.floor( (lon + 180) / 360 * (1<<zoom) ));
    let ytile = parseInt(Math.floor( (1 - Math.log(Math.tan(lat.toRad()) + 1 / Math.cos(lat.toRad())) / Math.PI) / 2 * (1<<zoom) ));
    return { z :zoom , x: xtile ,y: ytile};
}


let global_poly = "" ;

let state = {
    test:"test",
    tabs:{
        visible:"PureMap"
    },
    PureMap:    {
        center:{
            lat:19.04341400140714,
            long:72.82197883695116,
        },
        zoom:16,
        tile: getTileURL(19.04341400140714,72.82197883695116,16),
    }
};

function setState(newState = state)  {
    if (newState !== state) {
        state = deepmerge(state, newState);
        render();
    } else {
        console.log("NOC");
    }
}

let mymap = L.map('mapId').setView([19.04341400140714, 72.8826], 16);
let tilelayer = L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
    maxZoom: 18,
}).addTo(mymap);

let tabs = ["PureMap", "DataSetCreation","Profile" ,"Messages","Settings"];         //Important

function render()   {
    document.querySelector("#temp").innerHTML =state.PureMap.center.lat;

    // show hide Options Tabs
    tabs.forEach( (e) => {let elem = $("."+e+"Options");
        if(e === state.tabs.visible) elem.removeClass("cb-hide") ;else elem.addClass("cb-hide")});

    // update Lat, long
    $("#Lat").val("" +state.PureMap.center.lat);
    $("#Long").val( "" + state.PureMap.center.long);
    $("#Zoom").val( "" + state.PureMap.zoom);
}
function getTileUrls(bounds, tileLayer, zoom) {
    var min = mymap.project(bounds.getNorthWest(), zoom).divideBy(256).floor(),
        max = mymap.project(bounds.getSouthEast(), zoom).divideBy(256).floor(),
        urls = [];

    for (var i = min.x; i <= max.x; i++) {
        for (var j = min.y; j <= max.y; j++) {
            var coords = new L.Point(i, j);
            coords.z = zoom;
            urls.push(tileLayer.getTileUrl(coords));
        }
    }

    return urls;
}

var imageDisplay = function() {
    console.log('image display')
    var sourceOfPicture = "/images/thumb.jpg";
    var img = document.getElementById('bigpic')
    img.src = sourceOfPicture.replace('90x90', '225x225');
    img.style.display = "block";    

  }

  var graphDisplay = function() {

   trace1 = {
  type: 'scatter',
  x: [1, 2, 3, 4],
  y: [10, 15, 13, 17],
  mode: 'lines',
  name: 'forestation',
  line: {
    color: 'rgb(107,142,35)',
    width: 3
  }
};

trace2 = {
  type: 'scatter',
  x: [1, 2, 3, 4],
  y: [12, 9, 15, 12],
  mode: 'lines',
  name: 'urbanization',
  line: {
    color: 'rgb(188,143,143)',
    width: 3
  }
};

trace3 = {
    type: 'scatter',
    x: [1, 2, 3, 4],
    y: [12, 9, 12, 11],
    mode: 'lines',
    name: 'water bodies',
    line: {
      color: 'rgb(135,206,235)',
      width: 1
    }
  };

var layout = {
  width: 500,
  height: 500
};

var data = [trace1, trace2,trace3];

Plotly.newPlot('graph', data, layout);
  }

  

$(function() {
    tabs.forEach( (e) => {let elem = $("#"+e+"Marker");
        respondToVisibility(elem,() => setState({tabs: {visible: e}}));
    });



    let moveFunc = () => {
        if (global_poly !== "") {
            global_poly.remove()
        }
        let bounds = mymap.getBounds();
        let zoom = mymap.getZoom();
        let north_lat = bounds.getNorth();
        let south_lat = bounds.getSouth();
        let east_long = bounds.getEast();
        let west_long = bounds.getWest();

        let center = mymap.getCenter();
        setState({PureMap: {center:{lat:center.lat, long: center.lng},
                zoom:zoom, tile:getTileURL(center.lat,center.lng, zoom)}});

        console.log(north_lat ,south_lat ,east_long ,west_long ,zoom, "+", state.PureMap.tile.x,state.PureMap.tile.y, state.PureMap.tile.z );
        console.log(getTileUrls(mymap.getBounds(),tilelayer,zoom))

        // north_lat = north_lat * (1 - 0.0019);
        // west_long = west_long * (1 + 0.0009);
        // south_lat = south_lat * (1 + 0.0019);
        // east_long = east_long * (1 - 0.0009);
        // global_poly   = L.polygon([
        //     [north_lat, west_long],
        //     [north_lat, east_long],
        //     [south_lat, east_long],
        //     [south_lat, west_long],
        //     [north_lat, west_long]]).addTo(mymap);};
    };

    mymap.on("moveend", moveFunc);

    $('.PureMapOptions div.cb-section.LatLonJump a').on("click", (e) => {let lat = $("#Lat").val(), long = $("#Long").val();
        mymap.panTo(new L.LatLng(lat, long)); setState({PureMap: {center:{lat:lat, long: long}}})
    });
    $('.PureMapOptions div.cb-section.SetZoom a').on("click", (e) => {let zoom = $("#Zoom").val();
        mymap.setZoom(zoom);
    })

});