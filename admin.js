/**
 * Created by xichen on 8/21/17.
 */
/* todo: make a validator for distance -> get the octagon coordinates -> distance(..., octagon coordinates)
 * todo: octagon (-45.874548, 170.503824)
 */
var Admin = (function() {
    var adressSpecifier = []; // I use this addressSpecifier for the convenience of adding an onclick to each address
    var libaddresses = []; // I shall use this to store addresses of libraries for creating select form
    var pub = {};
    var globalCapacity = 0; // I shall use this global capacity to deliver capacities globally -- in validator

    var statement = "<tr> <th>Address</th> <th>Number of books present</th> <th>Capacity of library</th></tr>";
    var selstatement = "";
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

            },
            error:  function(xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }

        });
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
                libaddresses.push(address);
                // soak the address as id
                var tableid = address.replace(/\s+/g, '');
                tableid = tableid.replace(/\d+/g, '');

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



                object.properties.booknumber = $(this).find("book").length;
                object.properties.capacity = $(this).find("capacity")[0].textContent;
                statement += "<tr><td id='" + tableid + "0'>" + address + "</td><td>" + object.properties.booknumber +
                    "</td><td>" + object.properties.capacity + "</td></tr>";

                adressSpecifier.push(tableid + "0");
                if ($("#library").val() == address) {
                    globalCapacity = $(this).find("capacity")[0].textContent;
                }





            })

            $("#libraryinfo").html(statement);
            $("#Bookinfo").children().hide(); // I hide them all

            //<option value="amex">American Express</option>
            for (i = 0; i < libaddresses.length; i++) {
                selstatement += "<option value='" + libaddresses[i].replace(/\s+/g, '').replace(/\d+/g, '') + i + "'>" + libaddresses[i]
                    + "</option>";
            }
            $("#library").html(selstatement);

            // $(data).find("library").each(function() {
            //     var address = $(this).find("address")[0].textContent;
            //
            //     console.log($("#library").val().replace(/\d+/g, ''));
            //     console.log(address.replace(/\s+/g, '').replace(/\d+/g, ''));
            //     if ($("#library").val().replace(/\d+/g, '') == address.replace(/\s+/g, '').replace(/\d+/g, '')) {
            //         globalCapacity = $(this).find("capacity")[0].textContent;
            //     }
            //
            // });

            function checkCapacity(inValue, messages) {
                if (inValue < 0) {
                    messages.push("Capacity should be a non-negative integer");
                }
            }

            function checkCoordinates(lat, lng, messages) {
                //var mymap = L.map('mapid').setView([-45.8744, 170.5029], 14);
                var coordinates = [];
                coordinates.push(parseFloat(lat));
                coordinates.push(parseFloat(lng));
                function getDistance(origin, destination) {
                    // return distance in meters
                    var lon1 = toRadian(origin[1]),
                        lat1 = toRadian(origin[0]),
                        lon2 = toRadian(destination[1]),
                        lat2 = toRadian(destination[0]);

                    var deltaLat = lat2 - lat1;
                    var deltaLon = lon2 - lon1;

                    var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
                    var c = 2 * Math.asin(Math.sqrt(a));
                    var EARTH_RADIUS = 6371;
                    return c * EARTH_RADIUS * 1000;
                }
                function toRadian(degree) {
                    return degree*Math.PI/180;
                }
                console.log(coordinates);
                var distance = getDistance(coordinates, [-45.874548, 170.503824]);
                console.log(distance);
                /* now I shall use the distance as a condition */
                if (distance > 50000) messages.push("The latitude and longitude of a library cannot exceed the specified capacity for that library");
            }

            function checking() {
                var messages = [];
                $(data).find("library").each(function() {
                    var address = $(this).find("address")[0].textContent;

                    if ($("#library").val().replace(/\d+/g, '') == address.replace(/\s+/g, '').replace(/\d+/g, '')) {
                        globalCapacity = $(this).find("capacity")[0].textContent;
                    }

                });
                checkCapacity($("#changeCapacity").val(), messages);
                checkBookNums($("#changebooknum").val(), messages);
                checkCoordinates($("#changelatitude").val(), $("#changelongitude").val(), messages);

                if (messages.length === 0) {
                    $("#errors").html("");
                    $("#checkoutForm").html("<p>Change completed</p>");
                } else {
                    errorHTML = "<p><strong>There were errors processing your form</strong></p>";
                    errorHTML += "<ul>";
                    messages.forEach(function (msg) {
                        errorHTML += "<li>" + msg;
                    });
                    errorHTML += "</ul>";
                    $("#errors").html(errorHTML);
                }
                return false;
            }

            function checkBookNums(inValue, messages) {
                var specifiedcapacity = parseInt(globalCapacity); // just for now


                if (inValue > specifiedcapacity) {
                    messages.push("The number of books should be less than library capacity");
                }
            }
            var form = document.getElementById("checkoutForm");
            form.onsubmit = checking;

        }
    }




    pub.setup = function() {
        appendToGeo();

    };
    return pub;
}());

$(document).ready(Admin.setup);