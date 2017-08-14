/**
 * Created by xichen on 8/12/17.
 */
//todo: see line 67
var Map = (function() {

    var pub = {};

    var mymap = L.map('mapid').setView([-45.8744, 170.5029], 14);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(mymap);


    // var pointsofInterest = {
    //     "type": "FeatureCollection",
    //     "features":[
    //         {
    //             "type": "Feature",
    //             "properties": {
    //                 "description": "College of Education"
    //             },
    //             "geometry": {
    //                 "type": "Point",
    //                 "coordinates": [ 170.5199, -45.86759]
    //             },
    //             "id": 1 },
    //         {
    //             "type": "Feature",
    //             "properties": {
    //                 "description": "HCI lab"
    //             },
    //             "geometry": {
    //                 "type": "Point",
    //                 "coordinates": [170.51528, -45.86788]
    //             },
    //             "id": 2 }
    //     ] };
    //
    //
    // var obj = {"type": "Feature",
    //     "properties": {
    //         "description": "HCI lab"
    //     },
    //     "geometry": {
    //         "type": "Point",
    //         "coordinates": [170.51600, -45.86800]
    //     },
    //     "id": 2 };
    //pointsofInterest.features[0].coordinates = [170.81528, -45.8749];


    var pointsofLibrary = {};
    pointsofLibrary.features = [];
    /* this function is for converting xml file to GeoJSON file. */
    function appendToGeo() {
        var fileName = "./libraries.xml";

        var success = $.ajax({
            type: "GET",
            url: fileName,
            cache: false,
            success: function (data) {
                converting(data); // this statement is not activated, using classicalCinima to find out why?
            }
        });
    }

    function converting(data) {

        var addresses = $(data).find("address");
        if (addresses.length == 0) {
            alert("no library information");
        }
        else {
            for (i = 0; i < addresses.length; i++) {
                var object = {};
                object.properties = {};
                object.geometry = {};
                object.properties.description = $(data).find("address")[i].textContent;
                object.geometry.type = "Point";
                object.geometry.coordinates = [];
                object.geometry.coordinates.push($(data).find("lat")[i].textContent);
                object.geometry.coordinates.push($(data).find("lng")[i].textContent);
                object.id = i + 1;
                pointsofLibrary.features.push(object);
            }
        }
    }


    pub.setup = function() {
        appendToGeo();
        alert(JSON.stringify(pointsofLibrary));
        L.geoJSON(pointsofLibrary).addTo(mymap);
    };
    return pub;
}());

$(document).ready(Map.setup);