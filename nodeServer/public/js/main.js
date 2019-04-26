
const layerMaskBind = (cssSelector, toggleOnVal, toggleOffVal,  callbackOnClick) => {
    var elem = $(cssSelector);
    elem.on('click', (() =>{
        elem.toggleClass(toggleOnVal);
        elem.toggleClass(toggleOffVal);
        var selected = elem.hasClass(toggleOnVal);
        callbackOnClick(selected);
    }))

};

function getTileURL(lat, lon, zoom) {
    let xtile = parseInt(Math.floor( (lon + 180) / 360 * (1<<zoom) ));
    let ytile = parseInt(Math.floor( (1 - Math.log(Math.tan(lat.toRad()) + 1 / Math.cos(lat.toRad())) / Math.PI) / 2 * (1<<zoom) ));
    return { z :zoom , x: xtile ,y: ytile};
}

let global_poly = "" ;

// Help : DrawType  - {mask | icon}
//         mask  > drawTool: {PolyLine| Circle| Square}
//         icon  > drawTool: {Buildings| Forestry| Waterbody}
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
        layers:{
            main:{
                "masks":false,
                "paths":false
            }
        }
    },
    DataSetCreation:    {
        drawType:'mask',
        drawTool:'mask',
        iconMarkers: [],
        maskShapes:[]
    }
};

function setState(newState = state)  {
    if (newState !== state) {
        state = deepmerge(state, newState);
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

let tabs = ["PureMap", "DataSetCreation","Profile" ,"Messages","Settings"];         //Important

function render()   {
    document.querySelector("#temp").innerHTML = state.PureMap.center.lat;

    // show hide Options Tabs
    tabs.forEach( (e) => {let elem = $("."+e+"Options");
        if(e === state.tabs.visible) elem.removeClass("cb-hide") ;else elem.addClass("cb-hide")});


    //  Shoe Selected draw tool
    if(state.tabs.visible === "PureMap") {
        // update Lat, long
        $("#Lat").val("" +state.PureMap.center.lat);
        $("#Long").val( "" + state.PureMap.center.long);
        $("#Zoom").val( "" + state.PureMap.zoom);
    } else if(state.tabs.visible === "DataSetCreation")    {
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

function mapClickHandler(event)  {
    // generate a marker object with the icon
    if( state.tabs.visible === "DataSetCreation")    {
        let markerLatLng = event.latlng;
        console.log(markerLatLng);

        L.marker(markerLatLng , {
            "icon":ICONS[state.DataSetCreation.drawTool]
        }).addTo(mymap)
    }
}

function handleDataSetCreationEventHandlers()   {
    // For the Mask Draw
    // Shape Selection(PolyLine, Circle, Square)
    $("[name='DrawShapeType']").parent().on('click', (e)=>
    {
        let nameOfDrawTool = e.target.innerText.trim();
        setState({DataSetCreation: {drawType:"mask",drawTool:   nameOfDrawTool}});
    });

    // For the Icon Selector
    // Icon Selection(Building, Forestry, Waterbody)
    $("[name='IconType']").parent().on('click', (e)=>
    {
        let nameOfDrawTool = e.target.innerText.trim();
        setState({DataSetCreation: {drawType:"icon",drawTool:   nameOfDrawTool}});
    });
}

$(function() {
    tabs.forEach( (e) => {let elem = $("#"+e+"Marker");
        respondToVisibility(elem,() => setState({tabs: {visible: e}}));
    });

    // Event Handlers
    mymap.on("click", mapClickHandler);
    mymap.on("moveend", moveFunc);
    handleDataSetCreationEventHandlers();
    //("[name='DrawShape']").parent().on('click', (e)=>console.log(e.target.innerText))

    $('.PureMapOptions div.cb-section.LatLonJump a').on("click", (e) => {let lat = $("#Lat").val(), long = $("#Long").val();
        mymap.panTo(new L.LatLng(lat, long)); setState({PureMap: {center:{lat:lat, long: long}}})
    });
    $('.PureMapOptions div.cb-section.SetZoom a').on("click", (e) => {let zoom = $("#Zoom").val();
        mymap.setZoom(zoom);
    });

    // Main Layers [Maps, Masks, Paths]
    const mainLayers = {
        "#masks > span": () => setState(),
        "#paths > span": () => console.log("paths toggled"),
    };
    $.each(mainLayers, (k,v) =>  layerMaskBind(k,"label-success", "label-default",v ));

});