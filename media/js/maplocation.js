var OsGridRef, ra;

function mapLocationInput(tag, raobject, location) { // constructor function

    this.input = new raInputFields;
    this.tag = tag;
    this.raobject = raobject;
    this.location = location;
    this.fields = {};

    this.addLocation = function () {
        this.raobject.isLatLongSet = false;
        if (this.raobject.hasOwnProperty('latitude')) {
            if (this.raobject.hasOwnProperty('longitude')) {
                if (this.raobject.latitude === 0 && this.raobject.longitude === 0) {
                    this.raobject.isLatLongSet = false;
                } else {
                    this.raobject.isLatLongSet = true;
                }
            }
        }
        switch (this.location) {
            case mapLocationInput.AREA :
                this.fields.name = this.input.addText(this.tag, 'location', "Name of General Area:", this.raobject, 'name', 'Name of general area for the walk', ra.walkseditor.help.startArea);
                break;
            case mapLocationInput.START :
                this.fields.name = this.input.addText(this.tag, 'location', "Name of start place:", this.raobject, 'name', 'A name of the location so people can find it', ra.walkseditor.help.startName);
                break;
            case mapLocationInput.MEETING :
                this.fields.name = this.input.addText(this.tag, 'location', "Name of meeting place:", this.raobject, 'name', 'A name of the location so people can find it', ra.walkseditor.help.meetName);
                break;
            default:
                alert("Program error: Invalid place type");
        }

        this.details = document.createElement('details');
        tag.appendChild(this.details);
        this.summary = document.createElement('summary');
        this.details.appendChild(this.summary);
        this.addLocationEditor(this.details);
        this.details.open = true;
        var _this = this;
        this.details.addEventListener("toggle", function () {
            var open = _this.details.open;
            if (open) {
                if (_this.raobject.isLatLongSet) {
                    _this.zoomMap();
                }

            }
        });
    };
    this.zoomMap = function () {
        var lat = this.raobject.latitude;
        var long = this.raobject.longitude;
        this.map.setView([lat, long], 12);
    };
    this.addLocationEditor = function (tag) {
        this.setSummary();
        var editorDiv = document.createElement('div');
        editorDiv.setAttribute('class', 'location-editor');
        tag.appendChild(editorDiv);
        var table = document.createElement('table');
        table.setAttribute('class', 'no-extra');
        table.style.width = '100%';
        editorDiv.appendChild(table);
        var tr = document.createElement('tr');
        table.appendChild(tr);
        var left = document.createElement('td');
        left.innerHTML = "";
        left.style.width = '30%';
        tr.appendChild(left);

        var tags = [
            {name: 'title', parent: 'root', tag: 'h5'},
            {name: 'latlong', parent: 'root', tag: 'h5'},
            {name: 'gr10', parent: 'root', tag: 'h5'},
            {name: 'postcode', parent: 'root', tag: 'h5'},
            {name: 'drag', parent: 'root', tag: 'p'},
            {name: 'buttons', parent: 'root', tag: 'div'},
            {name: 'search', parent: 'buttons', tag: 'div'},
            {name: 'pc', parent: 'buttons', tag: 'div'},
            {name: 'pcTitle', parent: 'pc', tag: 'h5'},
            {name: 'addDelPC', parent: 'pc', tag: 'div'},
            {name: 'places', parent: 'buttons', tag: 'div'},
            {name: 'ptitle', parent: 'places', tag: 'h5'},
            {name: 'addremove', parent: 'places', tag: 'div'}
        ];
        this.elements = ra.html.generateTags(left, tags);
        this.elements.drag.innerHTML = "Drag marker to correct location";
        this.updateStatusPanel();
        var comment = document.createElement('p');
        comment.innerHTML = '';
        left.appendChild(comment);
        this.findButton = this.addMapFindLocationButton(this.elements.search);
        switch (this.location) {
            case mapLocationInput.MEETING :
            case mapLocationInput.START :
                this.elements.pcTitle.innerHTML = "Postcode";
                new ra.help(this.elements.pcTitle, ra.walkseditor.help.locationPostcode).add();
                this.addPostcode = this.addPostcodeButton(this.elements.addDelPC);
                this.deletePostcode = this.deletePostcodeButton(this.elements.addDelPC);
                this.elements.ptitle.innerHTML = "Previously used Meeting/Starting places";
                new ra.help(this.elements.ptitle, ra.walkseditor.help.locationStart).add();
                this.displayPlacesButton(this.elements.addremove);
                this.removePlacesButton(this.elements.addremove);
                break;
        }
        var right = document.createElement('td');
        right.style.width = '70%';
        tr.appendChild(right);
        var mapoptions = Object.assign({}, ra.defaultMapOptions);
        mapoptions.mapHeight = "400px";
        this.lmap = new leafletMap(right, mapoptions);
        this.map = this.lmap.map;
        this.layer = L.featureGroup().addTo(this.map);
        this.postcodeLayer = L.featureGroup().addTo(this.map);
        this.placesLayer = L.featureGroup().addTo(this.map);

        this.updateMapMarker();
        tag.addEventListener('toggle', function () {
            _this.map.invalidateSize();
        });
        var _this = this;
        this.tag.addEventListener('marker-moved', function (e) {
            var zoom = !_this.raobject.isLatLongSet;

            var latlng = e.ra.latlng;
            _this.raobject.latitude = latlng.lat;
            _this.raobject.longitude = latlng.lng;
            _this.raobject.isLatLongSet = true;
            var p = new LatLon(_this.raobject.latitude, _this.raobject.longitude);
            var grid = OsGridRef.latLonToOsGrid(p);
            _this.raobject.gridref8 = grid.toString(6);
            _this.raobject.gridref10 = grid.toString(8);
            _this.postcodeLayer.clearLayers();
            if (_this.raobject.hasOwnProperty('postcode')) {
                delete _this.raobject.postcode;
            }
            _this.setSummary( );
            _this.updateMapMarker();
            _this.updateStatusPanel();
            if (zoom) {
                _this.zoomMap();
            }

        });

        this.findButton.addEventListener("locationfound", function (e) { // (1)
            let event = new Event("marker-moved", {bubbles: true}); // 
            var item = e.raData.item;
            event.ra = {};
            event.ra.latlng = L.latLng(parseFloat(item.lat), parseFloat(item.lon));
            _this.tag.dispatchEvent(event);
        });

    };
    this.setSummary = function () {
        if (this.raobject.isLatLongSet) {
            var latlgn = 'Lat ' + this.raobject.latitude.toFixed(4) + '/ Long ' + this.raobject.longitude.toFixed(4);
            if (this.raobject.gridref8 === "") {
                this.summary.innerHTML = '<h4>Location: Outside UK: ' + latlgn + "</h4>";
            } else {
                this.summary.innerHTML = '<h4>Location: ' + latlgn + ' Grid Ref: ' + this.raobject.gridref8 + "</h4>";
            }
        } else {
            this.summary.innerHTML = '<h4 style="color:red">Location not defined: Drag marker to correct position</h4>';
        }
    };
    this.updateMapMarker = function () {
        this.layer.clearLayers();
        var img;
        switch (this.location) {
            case mapLocationInput.AREA :
                img = ra.baseDirectory() + "libraries/ramblers/images/marker-area.png";
                break;
            case mapLocationInput.START :
                img = ra.baseDirectory() + "libraries/ramblers/images/marker-start.png";
                break;
            default:
                img = ra.baseDirectory() + "libraries/ramblers/images/marker-route.png";
        }

        var icon = L.icon({
            iconUrl: img,
            iconSize: [35, 35],
            iconAnchor: [16, 16],
            popupAnchor: [0, 0]
        });
        var lat, long;
        if (this.raobject.isLatLongSet) {
            lat = this.raobject.latitude;
            long = this.raobject.longitude;
            //  this.map.setView([lat, long], 15);
        } else {
            lat = 54;
            long = 1.9;
            this.map.setView([54.5, -1.68], 5);
        }
        var _this = this;
        var marker = L.marker([lat, long], {draggable: true, icon: icon}).addTo(this.layer);
        marker.addEventListener('dragend', function (e) {
            let event = new Event("marker-moved", {bubbles: true}); // (2)
            event.ra = {};
            event.ra.latlng = e.target.getLatLng();
            _this.tag.dispatchEvent(event);
        });
    };

    this.updateStatusPanel = function () {
        this.elements.title.innerHTML = "<br/>";
        this.elements.latlong.innerHTML = '';
        if (raobject.isLatLongSet) {
            // this.elements.latlong.innerHTML += 'Lat: ' + this.raobject.latitude.toFixed(5) + " Long: " + this.raobject.longitude.toFixed(5);

            if (raobject.gridref10 !== "") {
                this.elements.gr10.innerHTML = 'Grid Ref[8 Figure]: ' + this.raobject.gridref10;
            } else {
                this.elements.gr10.innerHTML = '';
            }
            this.elements.postcode.innerHTML = '';
            if (this.raobject.hasOwnProperty('postcode')) {
                if (this.raobject.postcode !== "") {
                    this.elements.postcode.innerHTML = 'Postcode: ' + this.raobject.postcode.value;
                }
            }
        }
    };

    this.addMapFindLocationButton = function (tag) {
        var findButton = document.createElement('button');
        findButton.setAttribute('type', 'button');
        findButton.setAttribute('class', 'actionbutton');
        findButton.textContent = "Location search";
        tag.appendChild(findButton);
        new ra.help(tag, ra.walkseditor.help.locationSearch).add();
        var feed = new feeds();
        findButton.feedhelper = feed;
        findButton.addEventListener("click", function (e) {
            var target = e.target;
            target.feedhelper.getSearchMapModal(e);
        });
        return findButton;
    };
    this.updateDetails = function (item) {
        this.raobject.name = item.name;
        this.fields.name.value = item.name;
        this.raobject.isLatLongSet = true;
        this.raobject.latitude = item.latitude;
        this.raobject.longitude = item.longitude;
        this.updateMapMarker();
        this.updateStatusPanel();
        // this.getClosestPostcode();
        let event = new Event("marker-moved", {bubbles: true}); // (2)
        event.ra = {};
        event.ra.latlng = {};
        event.ra.latlng.lat = item.latitude;
        event.ra.latlng.lng = item.longitude;
        this.tag.dispatchEvent(event);
    };
    this.addPostcodeButton = function (tag) {
        var button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.setAttribute('class', 'actionbutton');
        button.textContent = "Add Postcode";
        tag.appendChild(button);
        //   var feed = new feeds();
        //   button.feedhelper = feed;
        var _this = this;
        button.addEventListener("click", function (e) {
            if (_this.raobject.isLatLongSet) {
                _this.displayPostcodes();
            } else {
                alert("You must position marker before adding postcode");
            }
        });
        return button;
    };
    this.deletePostcodeButton = function (tag) {
        var button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.setAttribute('class', 'actionbutton');
        button.textContent = "Remove Postcode";
        tag.appendChild(button);
        var _this = this;
        button.addEventListener("click", function (e) {
            _this.postcodeLayer.clearLayers();
            delete _this.raobject.postcode;
            _this.updateStatusPanel();
        });
        return button;
    };
    this.displayPostcodes = function () {
        var p = new LatLon(this.raobject.latitude, this.raobject.longitude);
        var grid = OsGridRef.latLonToOsGrid(p);
        this.postcodeLayer.clearLayers();
        if (this.raobject.hasOwnProperty('postcode')) {
            delete this.raobject.postcode;
        }
        var east = Math.round(grid.easting);
        var north = Math.round(grid.northing);
        var _this = this;
        // alert("The nearest postcodes will be displayed. \nYou can then select the appropriate one for SatNav. \nJust click the correct postcode");
        var url = "https://postcodes.theramblers.org.uk/index.php?easting=" + east + "&northing=" + north + "&dist=20&maxpoints=20";
        ra.ajax.getJSON(url, function (err, pcs) {
            if (err !== null) {

            } else {
                if (pcs.length !== 0) {
                    pcs.forEach(function (pc) {
                        var gr = new OsGridRef(pc.Easting, pc.Northing);
                        var latlong = OsGridRef.osGridToLatLon(gr);
                        var icon = L.icon({
                            iconUrl: ra.baseDirectory() + "media/com_ra_walkseditor/css/postcode-icon.png"
                        });
                        var marker = L.marker([latlong.lat, latlong.lon], {icon: icon}).addTo(_this.postcodeLayer);
                        marker.ra = {};
                        marker.ra.postcode = pc.Postcode.replace(/  /g, " ");
                        marker.ra.latlong = latlong;
                        marker.addEventListener('click', function (e) {
                            var marker = e.target;
                            _this.raobject.postcode = {};
                            _this.raobject.postcode.value = marker.ra.postcode;
                            _this.raobject.postcode.latitude = marker.ra.latlong.lat;
                            _this.raobject.postcode.longitude = marker.ra.latlong.lon;
                            _this.postcodeLayer.eachLayer(function (layer) {
                                if (layer !== marker) {
                                    _this.postcodeLayer.removeLayer(layer);
                                }
                            });
                            _this.updateStatusPanel();

                        });
                    }

                    );

                }
                setTimeout(function () {
                    ra.map.zoomLayer(_this.map, _this.postcodeLayer);
                }, 1000);
            }
        });
    };
    this.displayPlacesButton = function (tag) {
        var button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.setAttribute('class', 'actionbutton');
        button.innerHTML = "Display";
        tag.appendChild(button);
        var _this = this;
        button.addEventListener("click", function (e) {
            _this.placesLayer.clearLayers();
            if (_this.raobject.isLatLongSet) {
                //  alert("The nearest places used by Ramblers' Groups will be displayed");
                var latlng = new LatLon(_this.raobject.latitude, _this.raobject.longitude);
                ra.map.displayStartingPlaces(latlng, _this.placesLayer, 20, 30);
                setTimeout(function () {
                    ra.map.zoomLayer(_this.map, _this.placesLayer);
                }, 1000);

            } else {
                alert("Marker position not set");
            }
        });
        return button;
    };
    this.removePlacesButton = function (tag) {
        var button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.setAttribute('class', 'actionbutton');
        button.innerHTML = "Remove";
        tag.appendChild(button);
        var _this = this;
        button.addEventListener("click", function (e) {
            _this.placesLayer.clearLayers();

        });
        return button;
    };

}
;


// Instance method will be available to all instances but only load once in memory 
mapLocationInput.prototype.publicMethod = function () {
    alert(this.publicVariable);
};

// Static variable shared by all instances
mapLocationInput.AREA = "Area";
mapLocationInput.POINT = "Point";
mapLocationInput.MEETING = "Meet";