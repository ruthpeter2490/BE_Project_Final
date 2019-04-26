const layerMaskBind = (cssSelector, toggleOnVal, toggleOffVal, callbackOnClick) => {
  var elem = $(cssSelector);
  elem.on('click', (() => {
    elem.toggleClass(toggleOnVal);
    elem.toggleClass(toggleOffVal);
    var selected = elem.hasClass(toggleOnVal);
    callbackOnClick(selected);
  }))

};

function getTileURL(lat, lon, zoom) {
  let xtile = parseInt(Math.floor((lon + 180) / 360 * (1 << zoom)));
  let ytile = parseInt(Math.floor((1 - Math.log(Math.tan(lat.toRad()) + 1 / Math.cos(lat.toRad())) / Math.PI) / 2 * (1 << zoom)));
  return {z: zoom, x: xtile, y: ytile};
}


let global_poly = "";

// Help : DrawType  - {mask | icon}
//         mask  > drawTool: {PolyLine| Circle| Square}
//         icon  > drawTool: {Buildings| Forestry| Waterbody}
let state = {
  test: "test",
  tabs: {
    visible: "PureMap"
  },
  PureMap: {
    center: {
      lat: 19.04341400140714,
      long: 72.82197883695116,
    },
    zoom: 16,
    tile: getTileURL(19.04341400140714, 72.82197883695116, 16),
    layers: {
      main: {
        "masks": false,
        "paths": false
      }
    }
  },
  DataSetCreation: {
    drawType: 'mask',
    drawTool: 'mask',
    iconMarkers: [],
    maskShapes: []
  }
};

function setState(newState = state, clearIconMarker = false) {
  if (newState !== state) {
    state = deepmerge(state, newState);
    if (clearIconMarker) { // another hack ..sigh
      state.DataSetCreation.iconMarkers = [];
    }
    console.log(state);                                 // TODO remove this after debug
    render();
  } else {
    console.log("NOC");
  }
}

let mymap = L.map('mapId').setView([19.04341400140714, 72.8826], 16);
let tilelayer = L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
  maxZoom: 18,
}).addTo(mymap);

let tabs = ["PureMap", "DataSetCreation", "Profile", "Messages", "Settings"];         //Important

function render() {
  document.querySelector("#temp").innerHTML = state.PureMap.center.lat;

  // show hide Options Tabs
  tabs.forEach((e) => {
    let elem = $("." + e + "Options");
    if (e === state.tabs.visible) elem.removeClass("cb-hide"); else elem.addClass("cb-hide")
  });


  if (state.tabs.visible === "PureMap") {
    // update Lat, long
    $("#Lat").val("" + state.PureMap.center.lat);
    $("#Long").val("" + state.PureMap.center.long);
    $("#Zoom").val("" + state.PureMap.zoom);
  } else if (state.tabs.visible === "DataSetCreation") {
    //  Show Selected draw tool
    const iconTool = $(".iconTool");
    const maskTool = $(".maskDrawTool");
    switch (state.DataSetCreation.drawType) {
      case 'mask':
        maskTool.addClass("selectedTool");
        iconTool.removeClass("selectedTool");
        break;
      case 'icon':
        iconTool.addClass("selectedTool");
        maskTool.removeClass("selectedTool");
        break;
      default:
        console.log("Error: in render, highlight in-use tool box");
    }

    // List of Icons inserted
    const iconDataList = $(".IconDataList");
    iconDataList.empty();
    if (state.DataSetCreation.iconMarkers.length > 0) {
      state.DataSetCreation.iconMarkers.forEach(((value, index) => {
        iconDataList.append($('<li/>', {
          id: "IconDataList#" + index,
          className: 'IconDataListItem',
          html: "<b>" + value.type + "</b> : (" + value.lat + "," + value.lng + ")   " + "<button onclick='removeIconMarker(" + index + ")'>Remove</button>"
        }))
      }))
    } else {
      iconDataList.append($('<li/>', {
        html: "No Icons added yet"
      }))
    }
  }
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

function removeIconMarker(markerIndex) {
  let clearIconMarker = false;
  if (state.DataSetCreation.iconMarkers.length === 1) {       // THis is a hacky thing
    clearIconMarker = true;
  }
  let marker = state.DataSetCreation.iconMarkers[markerIndex];
  let globalMarkerDictIndex = marker.globalMarkerDictIndex;
  globalMarkerDict[parseInt(globalMarkerDictIndex)].remove();
  let newIconMarkers = state.DataSetCreation.iconMarkers.splice(markerIndex, 1);
  console.log(newIconMarkers);
  setState({DataSetCreation: {iconMarkers: newIconMarkers}}, clearIconMarker);
}

var imageDisplay = function () {
  console.log('image display')
  var sourceOfPicture = "/images/thumb.jpg";
  var img = document.getElementById('bigpic')
  img.src = sourceOfPicture.replace('90x90', '225x225');
  img.style.display = "block";

}

var graphDisplay = function () {

  trace1 = {
    type: 'scatter',
    x: [1988, 1998, 2008, 2018],
    y: [28, 27, 24, 23],
    mode: 'lines',
    name: 'forestation',
    line: {
      color: 'rgb(107,142,35)',
      width: 3
    }
  };

  trace2 = {
    type: 'scatter',
    x: [1988, 1998, 2008, 2018],
    y: [59, 62, 64, 66],
    mode: 'lines',
    name: 'urbanization',
    line: {
      color: 'rgb(188,143,143)',
      width: 3
    }
  };

  trace3 = {
    type: 'scatter',
    x: [1988, 1998, 2008, 2018],
    y: [12, 12, 11, 10],
    mode: 'lines',
    name: 'water bodies',
    line: {
      color: 'rgb(135,206,235)',
      width: 2
    }
  };

  var layout = {
    width: 500,
    height: 500
  };

  var data = [trace1, trace2, trace3];

  Plotly.newPlot('graph', data, layout);
}



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
    setState({
      PureMap: {
        center: {lat: center.lat, long: center.lng},
        zoom: zoom, tile: getTileURL(center.lat, center.lng, zoom)
      }
    });

    console.log(north_lat, south_lat, east_long, west_long, zoom, "+", state.PureMap.tile.x, state.PureMap.tile.y, state.PureMap.tile.z);
    console.log(getTileUrls(mymap.getBounds(), tilelayer, zoom))

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
  var globalMarkerDict = {};                // IMPORTANT DONT DELETE
  var count_globalMarkerDict = 0;

  function mapClickHandler(event) {
    // generate a marker object with the icon
    if (state.tabs.visible === "DataSetCreation") {
      let markerLatLng = event.latlng;

      var makerlink = L.marker(markerLatLng, {
        "icon": ICONS[state.DataSetCreation.drawTool]
      });
      makerlink.addTo(mymap);
      globalMarkerDict[count_globalMarkerDict] = makerlink;
      var newElem = {
        type: state.DataSetCreation.drawTool,
        lat: event.latlng.lat,
        lng: event.latlng.lng,
        globalMarkerDictIndex: count_globalMarkerDict
      };

      setState({DataSetCreation: {iconMarkers: [...state.DataSetCreation.iconMarkers, newElem]}});
      count_globalMarkerDict += 1;
    }
  }

  function handleDataSetCreationEventHandlers() {
    // For the Mask Draw
    // Shape Selection(PolyLine, Circle, Square)
    $("[name='DrawShapeType']").parent().on('click', (e) => {
      let nameOfDrawTool = e.target.innerText.trim();
      setState({DataSetCreation: {drawType: "mask", drawTool: nameOfDrawTool}});
    });

    // For the Icon Selector
    // Icon Selection(Building, Forestry, Waterbody)
    $("[name='IconType']").parent().on('click', (e) => {
      let nameOfDrawTool = e.target.innerText.trim();
      setState({DataSetCreation: {drawType: "icon", drawTool: nameOfDrawTool}});
    });
  }

  $(function () {
    tabs.forEach((e) => {
      let elem = $("#" + e + "Marker");
      respondToVisibility(elem, () => setState({tabs: {visible: e}}));
    });

    // Event Handlers
    mymap.on("click", mapClickHandler);
    mymap.on("moveend", moveFunc);
    handleDataSetCreationEventHandlers();
    //("[name='DrawShape']").parent().on('click', (e)=>console.log(e.target.innerText))

    $('.PureMapOptions div.cb-section.LatLonJump a').on("click", (e) => {
      let lat = $("#Lat").val(), long = $("#Long").val();
      mymap.panTo(new L.LatLng(lat, long));
      setState({PureMap: {center: {lat: lat, long: long}}})
    });
    $('.PureMapOptions div.cb-section.SetZoom a').on("click", (e) => {
      let zoom = $("#Zoom").val();
      mymap.setZoom(zoom);
    });

    // Main Layers [Maps, Masks, Paths]
    const mainLayers = {
      "#masks > span": () => setState(),
      "#paths > span": () => console.log("paths toggled"),
    };
    $.each(mainLayers, (k, v) => layerMaskBind(k, "label-success", "label-default", v));

  });
