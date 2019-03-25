let global_poly = "" ;


$(function()    {
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

