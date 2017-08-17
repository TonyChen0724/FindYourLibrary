/**
 * Created by xichen on 8/12/17.
 */

//todo: see line 60

var Map = (function() {

    var pub = {};
    var pointsofInterest = {
        "type": "FeatureCollection",
        "features":[
            {
                "type": "Feature",
                "properties": {
                    "description": "College of Education"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [ 170.5199, -45.86759]
                },
                "id": 1 },
        ] };

    //{"type":"FeatureCollection",
    // "features":[
    // {
    //      "type":"Feature",
    //      "properties":{
    //          "description":"145 Union St East"
    //     },
    //      "geometry":{
    // "type":"Point","coordinates":[-45,170]},
    // "id":1},
    // {
    //      "type":"Feature",
    //      "properties": {
    //          "description":"597 Castle St"},
    //      "geometry":{"type":"Point","coordinates":[-45,170]},"id":2},
    // {"type":"Feature","properties":{"description":"33 Baldwin St"},"geometry":{"type":"Point","coordinates":
    // [-45,170]},"id":3}]}




    var pointsofLibrary = {};
    pointsofLibrary.type = "FeatureCollection";
    pointsofLibrary.features = [];
    /* this function is for converting xml file to GeoJSON file. */
    function appendToGeo() {
        var fileName = "./new.xml";
        var success = $.ajax({
            type: "GET",
            url: fileName,
            cache: false,
            success: function (data) {
                converting(data);
                console.log(JSON.stringify(pointsofLibrary));
                //popup.setContent("<pre" + JSON.stringify(geojson, null, 2) + "</pre>");
                //L.geoJSON(pointsofLibrary).addTo(mymap); // geoJSON is not working, find out why?

                var mymap = L.map('mapid').setView([-45.8744, 170.5029], 14);
                L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                    maxZoom: 18,
                    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                    id: 'mapbox.streets'
                }).addTo(mymap);
                var pointsofLibraryLayer = L.geoJSON(pointsofLibrary, {
                    onEachFeature: onEachFeatureImpl
                }).addTo(mymap);
            },
            error:  function(xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }

        });
    }

    function onEachFeatureImpl(feature, layer) {
        // var popupContent = "<b>Point of Interest</b> <br/>" +
        //     feature.properties.description;
        var i = 0;
        var popupContent = "<pre>" + JSON.stringify(pointsofLibrary, null, 2) + "</pre>";
        layer.bindPopup(popupContent);
    }

    function converting(data) {
        var addresses = $(data).find("library");
        if (addresses.length == 0) {
            alert("no library information");
        }
        else {
            $(data).find("library").each(function() {
                var object = {};
                object.type = "Feature";
                object.properties = {};
                object.geometry = {};
                object.geometry.type = "Point";
                var address = $(this).find("address")[0].textContent;
                var lat = $(this).find("lat")[0].textContent;
                var lng = $(this).find("lng")[0].textContent;
                var id = $(this).find("id")[0].textContent;
                object.properties.description = address;
                object.geometry.coordinates = [];
                object.geometry.coordinates.push(parseFloat(lng));
                object.geometry.coordinates.push(parseFloat(lat));
                object.id = parseInt(id);
                pointsofLibrary.features.push(object);


            })




        }
    }


    pub.setup = function() {
        appendToGeo();
    };
    return pub;
}());

$(document).ready(Map.setup);