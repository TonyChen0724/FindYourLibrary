/**
 * Created by xichen on 8/21/17.
 */
/**
 * Created by xichen on 8/12/17.
 */
var Map = (function() {
    var adressSpecifier = []; // I use this addressSpecifier for the convenience of adding an onclick to each address
    var pub = {};



    var statement = "<tr> <th>Address</th> <th>Number of books present</th> <th>Capacity of library</th></tr>";
    var bookstatement = "";
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



            },
            error:  function(xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }

        });
    }

    function onEachFeatureImpl(feature, layer) {

        var i = 0;
        var popupContent = "<b>Name: </b>" + feature.properties.description + feature.properties.capacity;
        layer.bindPopup(popupContent);
    }

    function converting(data) {
        var addresses = $(data).find("library");
        if (addresses.length == 0) {
            alert("no library information");
        }
        else {
            $(data).find("library").each(function() {
                var address = $(this).find("address")[0].textContent;
                var lat = $(this).find("lat")[0].textContent;
                var lng = $(this).find("lng")[0].textContent;
                var id = $(this).find("id")[0].textContent;
                // soak the address as id
                var tableid = address.replace(/\s+/g, '');
                tableid = tableid.replace(/\d+/g, '');

                bookstatement += "<table id='" + tableid + "' style='width:100%' border='1px solid black'> <tr><th>title</th> <th>author</th> <th>year</th></tr>";
                var object = {};
                object.type = "Feature";
                object.properties = {};
                object.geometry = {};
                object.geometry.type = "Point";
                object.properties.description = address;
                object.geometry.coordinates = [];
                object.geometry.coordinates.push(parseFloat(lng));
                object.geometry.coordinates.push(parseFloat(lat));
                object.id = parseInt(id);
                pointsofLibrary.features.push(object);


                var booknum = $(this).find("title").length;
                for (var i = 0; i < booknum; i++) {
                    var titles = $(this).find("title")[i].textContent;
                    var authors = $(this).find("author")[i].textContent;
                    var years = $(this).find("year")[i].textContent;

                    bookstatement += "<tr><td>" + titles + "</td><td>" + authors +
                        "</td><td>" + years + "</td></tr>";
                }


                object.properties.booknumber = $(this).find("book").length;
                object.properties.capacity = $(this).find("capacity")[0].textContent;
                statement += "<tr><td id='" + tableid + "0'>" + address + "</td><td>" + object.properties.booknumber +
                    "</td><td>" + object.properties.capacity + "</td></tr>";

                adressSpecifier.push(tableid + "0");



            })

            $("#libraryinfo").html(statement);
            $("#Bookinfo").html(bookstatement);
            $("#Bookinfo").children().hide(); // I hide them all


            console.log(adressSpecifier);
            for (f = 0; f < adressSpecifier.length; f++) {
                var sel = "#" + adressSpecifier[f];

                $(sel).click (function() {
                    var tablespecifier = this.id.replace(/\d+/g, '');
                    $("#" + tablespecifier).toggle();
                });
                console.log(sel);
            }




        }
    }


    pub.setup = function() {
        appendToGeo();
        // I must find a way to hide all this book info table first

    };
    return pub;
}());

$(document).ready(Map.setup);