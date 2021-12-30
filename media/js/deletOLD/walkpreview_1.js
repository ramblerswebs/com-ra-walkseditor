var document, ra;
preview = function () {
    this.display = function (tag, ramblers) {
        tag.innerHTML = '';
        var walk = JSON.parse(JSON.stringify(ramblers.walk));  // clone walk
        var gwemWalk = this.convertToGWEM(tag, walk);
        var nwalk = this.convGWEM1toPHPWalk(gwemWalk);
        this.displayPreview(tag, [nwalk]);
        this.displayJson(tag, ramblers.walk, gwemWalk);
    };


    this.displayPreview = function (tag, walks) {
        // var command = "ra.display.walksTabs";

        var $options = {
            divId: '9754572874',
            mapHeight: "500px",
            mapWidth: "100%",
            helpPage: "ledwalks.html",
            cluster: true,
            displayElevation: false,
            fullscreen: true,
            search: true,
            locationsearch: true,
            mylocation: true,
            osgrid: true,
            mouseposition: true,
            postcodes: true,
            fitbounds: false,
            copyright: true,
            maptools: true,
            rightclick: true,
            print: true
        };
        var data = {walks: walks,
            displayClass: 'pantone7474white',
            jplistName: "display",
            noPagination: false,
            displayDetailsPrompt: true,
            legendposition: "top",
            customListFormat: null,
            customTableFormat: null,
            customGradesFormat: null
        };

        var itemsDiv = document.createElement('div');
        itemsDiv.setAttribute('id', $options.divId);
        tag.appendChild(itemsDiv);
        var display = new ra.display.walksTabs($options, data);
        display.load();
        //  ra.bootstrapper(command, JSON.stringify($options), JSON.stringify(data));
    };
    this.convGWEM1toPHPWalk = function ($item) {
        var nWalk = {};
        nWalk.id = $item.id;
        nWalk.status = $item.status.value;
        nWalk.groupCode = $item.groupCode;
        nWalk.groupName = $item.groupName;
        nWalk.dateUpdated = {date: $item.dateUpdated};
        nWalk.dateCreated = {date: $item.dateCreated};
        nWalk.cancellationReason = $item.cancellationReason;
        nWalk.walkDate = {date: $item.date};
        nWalk.month = ra.date.Month(nWalk.walkDate.date);
        nWalk.dayofweek = ra.date.dow(nWalk.walkDate.date);
        nWalk.detailsPageUrl = $item.url;
        nWalk.title = ra.html.convertToText($item.title);
        $item.description = ra.convert_mails($item.description);
        nWalk.descriptionHtml = $item.description;
        nWalk.description = ra.html.convertToText($item.description);
        nWalk.additionalNotes = $item.additionalNotes;
        nWalk.isLinear = $item.isLinear;
        if ($item.finishTime === null) {
            nWalk.finishTime = null;
        } else {
            nWalk.finishTime = "2000-01-01T" + $item.finishTime;
        }
//        switch ($item.finishTime) {
//            case null:
//                nWalk.finishTime = null;
//                break;
//            case "00:00:00":
//                nWalk.finishTime = null;
//                break;
//            default:
//                //            $day = nWalk.walkDate.format('Ymd ');
//                //       nWalk.finishTime = DateTime::createFromFormat('Ymd H:i:s', $day.$item.finishTime);
//                break;
//        }

        nWalk.nationalGrade = $item.difficulty.text;
        nWalk.localGrade = $item.gradeLocal;
        nWalk.distanceMiles = $item.distanceMiles;
        nWalk.distanceKm = $item.distanceKM;
        nWalk.pace = $item.pace;
        nWalk.ascentFeet = $item.ascentFeet;
        nWalk.ascentMetres = $item.ascentMetres;
        // contact details
        nWalk.email = '';
        if ($item.walkContact !== null) {
            nWalk.isLeader = $item.walkContact.isWalkLeader === "true";
            nWalk.contactName = $item.walkContact.contact.displayName.trim();
            // nWalk.emailAddr = $item.walkContact.contact.email;
            if ($item.walkContact.contact.email.length > 0) {
                nWalk.email = "email available";
            }
            // nWalk.email = str_replace("@", " (at) ", nWalk.emailAddr);
            nWalk.telephone1 = $item.walkContact.contact.telephone1;
            nWalk.telephone2 = $item.walkContact.contact.telephone2;
        }
        nWalk.walkLeader = $item.walkLeader;
// read strands
        nWalk.strands = $item.strands;
        nWalk.festivals = $item.festivals;
        nWalk.suitability = $item.suitability;
        nWalk.surroundings = $item.surroundings;
        nWalk.theme = $item.theme;
        nWalk.specialStatus = $item.specialStatus;
        nWalk.facilities = $item.facilities;

// pocess meeting and starting locations
        nWalk.hasMeetPlace = false;
        nWalk.meetLocation = null;
        nWalk.startLocation = null;
        nWalk.finishTime = null;
        nWalk.finishLocation = null;
        $item.points.forEach(function ($value) {
            if ($value.typeString === "Meeting") {
                nWalk.hasMeetPlace = true;
                nWalk.meetLocation = ra.walk.convertGWEM1location($value);
            }
            if ($value.typeString === "Start") {
                nWalk.startLocation = ra.walk.convertGWEM1location($value);
            }
            if ($value.typeString === "End") {
                nWalk.finishLocation = ra.walk.convertGWEM1location($value);
            }
        });
//        nWalk.createExtraData();
        nWalk.media = $item.media;

        return nWalk;
    };

    this.convertToGWEM = function (tag, walk) {
        var gwem = {
            id: 99999,
            status: {
                value: "Published"
            },
            difficulty: {
                text: "Technical"
            },
            strands: {
                items: []
            },
            linkedEvent: {
                text: ""
            },
            festivals: {
                items: []
            },
            walkContact: {
                contact: {
                    displayName: "No contact name",
                    email: "",
                    groupCode: "ZZ99",
                    telephone1: "",
                    telephone2: ""
                },
                isWalkLeader: true
            },
            linkedWalks: {
                items: []
            },
            linkedRoute: null,
            title: "EXAMPLE WALKS TITLE",
            walkLeader: "",
            description: "<p>EXAMPLE WALKS DESCRIPTION</p>",
            groupCode: "ZZ99",
            groupName: "Ramblers Group Name",
            additionalNotes: "",
            date: "2100-08-25T00:00:00",
            distanceKM: 8888,
            distanceMiles: 5555,
            finishTime: "13:00:00",
            suitability: {
                items: []
            },
            surroundings: {
                items: []
            },
            theme: {
                items: []
            },
            specialStatus: {
                items: []
            },
            facilities: {
                items: []
            },
            pace: "",
            ascentMetres: null,
            ascentFeet: null,
            gradeLocal: "",
            attendanceMembers: null,
            attendanceNonMembers: null,
            attendanceChildren: null,
            cancellationReason: "",
            dateUpdated: "2100-06-17T14:32:28+01:00",
            dateCreated: "2100-06-17T14:31:25+01:00",
            media: [],
            points: [
                {
                    time: "02:00:00",
                    gridRef: "",
                    easting: 583898,
                    northing: 153738,
                    latitude: 54.39788,
                    longitude: 2.63306,
                    postcode: "YO15 1AR",
                    postcodeLatitude: 54.11664,
                    postcodeLongitude: -0.08289,
                    description: "EXAMPLE: Middle of North sea",
                    showExact: true,
                    typeString: "Start"
                }
            ],
            groupInvite: {
                groupCode: null
            },
            isLinear: false,
            url: "https://www.ramblers.org.uk/go-walking/find-a-walk-or-route/walk-detail.aspx?walkID=4117797"
        };
        this.checkFields(tag, walk, gwem);
        return gwem;
    };
    this.checkFields = function (tag, walk, gwem) {
        var hr = document.createElement('hr');
        tag.appendChild(hr);
        var h2 = document.createElement('h3');
        h2.textContent = "Pre Publishing checks";
        tag.appendChild(h2);
        var div = document.createElement('div');
        tag.appendChild(div);
        var ul = document.createElement('ul');
        tag.appendChild(ul);
        if (this.getObjProperty(walk, 'basics') === null) {
            this.notificationMsg(ul, "Error: No basics section found");
            walk.basics = {};
        }
        if (this.getObjProperty(walk, 'basics.date') === null) {
            this.notificationMsg(ul, "Error: No walk date found");
        } else {
            gwem.date = walk.basics.date + "T00:00:00";
        }
        if (this.getObjProperty(walk, 'basics.title') === null) {
            this.notificationMsg(ul, "Error: No walk title found");
        } else {
            gwem.title = walk.basics.title;
        }
        if (this.getObjProperty(walk, 'basics.description') === null) {
            this.notificationMsg(ul, "Error: No walk description found");
        } else {
            gwem.description = walk.basics.description;
        }
        if (this.getObjProperty(walk, 'basics.notes') !== null) {
            gwem.additionalNotes = walk.basics.notes;
        }
        if (this.getObjProperty(walk, 'meeting') === null) {
            this.notificationMsg(ul, "Error: No meeting found");
            walk.meeting = {};
        }
        if (this.getObjProperty(walk, 'meeting.type') === null) {
            this.notificationMsg(ul, "Error: No meeting type defined");
            walk.meeting.type = 'none';
        } else {
            if (this.getObjProperty(walk, 'meeting.type') === 'undefined') {
                this.notificationMsg(ul, "Error: No meeting type selected");
                walk.meeting.type = 'none';
            }
        }
        switch (walk.meeting.type) {
            case 'undefined':
                this.notificationMsg(ul, "Error: No meeting type selected");
                break;
            case 'car':
            case 'coach':
            case 'public':
                var point = {time: "01:00:00",
                    gridRef: "SG705140",
                    easting: 583898,
                    northing: 153738,
                    latitude: 52.67527,
                    longitude: -5.39581,
                    postcode: "LL53 8DE",
                    postcodeLatitude: 52.76267,
                    postcodeLongitude: -4.78836,
                    description: "EXAMPLE: Middle of Irish sea",
                    showExact: true,
                    typeString: "Meeting"};
                var meet = walk.meeting.locations[0];
                this.setValue(meet, 'time', point, 'time', ul, "Error: No meeting time given");
                this.setValue(meet, 'name', point, 'description', ul, "Error: No Title/Description given for meeting location");
                this.setValue(meet, 'latitude', point, 'latitude', ul, "Error: No latitude given for meeting location");
                this.setValue(meet, 'longitude', point, 'longitude', ul, "Error: No longitude given for meeting location");
                this.setValue(meet, 'gridref8', point, 'gridRef', ul, "Error: No grid reference given for meeting location");
                this.setValue(meet, 'nearestpostcode.postcode', point, 'postcode', ul, "Error: No nearest postcode for meeting location");
                this.setValue(meet, 'nearestpostcode.latitude', point, 'postcodeLatitude', ul, "Error: No postcode latitude given for meeting location");
                this.setValue(meet, 'nearestpostcode.longitude', point, 'postcodeLongitude', ul, "Error: No postcode longitude given for meeting location");

                gwem.points.push(point);
                if (walk.meeting.locations.length > 1) {
                    this.notificationMsg(ul, "Warning: Addition meeting places cannot be handled at the moment");
                }
                break;
            default:

        }

        var ok;
        ok = this.setValue(walk, 'start', null, null, ul, "Error: No start found");
        if (ok) {
            var start = this.findPoint(gwem, 'Start');
            ok = this.setValue(walk, 'start.type', null, null, ul, "Error: Start location/General area of walk not specified");
            if (ok) {
                switch (this.getObjProperty(walk, 'start.type')) {
                    case 'area':
                        start.showExact = false;
                        start.description = walk.start.area.name;
                        start.latitude = walk.start.area.latitude;
                        start.longitude = walk.start.area.longitude;
                        start.gridRef = walk.start.area.gridref8;
                        start.postcode = '';
                        start.postcodeLatitude = 0;
                        start.postcodeLongitude = 0;
                        break;
                    case 'start':
                        start.showExact = true;
                        this.setValue(walk, 'start.location.time', start, 'time', ul, "Error: No start time given");
                        this.setValue(walk, 'start.location.name', start, 'description', ul, "Error: No Title/Description given for Start location");
                        this.setValue(walk, 'start.location.latitude', start, 'latitude', ul, "Error: No latitude given for Start location");
                        this.setValue(walk, 'start.location.longitude', start, 'longitude', ul, "Error: No longitude given for Start location");
                        this.setValue(walk, 'start.location.gridref8', start, 'gridRef', ul, "Error: No grid reference given for Start location");
                        this.setValue(walk, 'start.location.nearestpostcode.postcode', start, 'postcode', ul, "Error: No nearest postcode for Start location");
                        this.setValue(walk, 'start.location.nearestpostcode.latitude', start, 'postcodeLatitude', ul, "Error: No postcode latitude given for Start location");
                        this.setValue(walk, 'start.location.nearestpostcode.longitude', start, 'postcodeLongitude', ul, "Error: No postcode longitude given for Start location");

                        break;
                    default:
                        this.notificationMsg(ul, "Error: Start location/General area of walk not specified");
                }
            }
        }

        if (this.getObjProperty(walk, 'walks') === null) {
            this.notificationMsg(ul, "Error: No walk defined");
            walk.meeting = {};
        }
           if (walk.walks.length > 1) {
            this.notificationMsg(ul, "Warning: Walks with more than one walk distance/grade cannot be handled at the moment");
        }

        var singlewalk = walk.walks[0];
        if (this.getObjProperty(singlewalk, 'distance') === null) {
            this.notificationMsg(ul, "Error: No distance specified for the walk");
        } else {
            switch (singlewalk.units) {
                case 'miles':
                    gwem.distanceKM = singlewalk.distance * 8 / 5;
                    gwem.distanceMiles = singlewalk.distance;
                    break;
                case 'km':
                    gwem.distanceKM = singlewalk.distance;
                    gwem.distanceMiles = singlewalk.distance * 5 / 8;
                    break;
                default:
                    this.notificationMsg(ul, "Error: Walk distance is not defined as miles or km");
            }
        }
        if (this.getObjProperty(singlewalk, 'natgrade') === null) {
            this.notificationMsg(ul, "Error: No national grade has been assigned to the walk");
        } else {
            switch (singlewalk.natgrade) {
                case 'easyaccess':
                    gwem.difficulty.text = "Easy Access";
                    break;
                case 'easy':
                    gwem.difficulty.text = "Easy";
                    break;
                case 'leisurely':
                    gwem.difficulty.text = "Leisurely";
                    break;
                case 'moderate':
                    gwem.difficulty.text = "Moderate";
                    break;
                case 'strenuous':
                    gwem.difficulty.text = "Strenuous";
                    break;
                case 'technical':
                    gwem.difficulty.text = "Technical";
                    break;
                default:

            }
        }

        this.setValue(singlewalk, 'localgrade', gwem, 'gradeLocal', ul, "Info: No Local grade has been assigned to the walk");

        var ok = this.setValue(walk, 'contact', null, null, ul, "No contact information");
        if (ok) {
            this.setValue(walk, 'contact.displayName', gwem.walkContact.contact, 'displayName', ul, "Error: No contact name given");
            this.setValue(walk, 'contact.email', gwem.walkContact.contact, 'email', ul, "Info: No contact email given");
            this.setValue(walk, 'contact.telephone1', gwem.walkContact.contact, 'telephone1', ul, "Info: No contact telephone number given");
            this.setValue(walk, 'contact.telephone2', gwem.walkContact.contact, 'telephone2', ul, "Info: No contact alternative telephone number given");
        }
        var hr = document.createElement('hr');
        tag.appendChild(hr);

    };
    this.setValue = function (walk, property, gwem, value, tag, msg) {
        var newvalue = this.getObjProperty(walk, property);
        if (newvalue === null) {
            this.notificationMsg(tag, msg);
            return false;
        } else {
            if (gwem !== null) {
                gwem[value] = newvalue;
            }
            return true;
        }
    };
    this.findPoint = function (gwem, type) {
        for (var j = 0; j < gwem.points.length; j++) {
            var pt = gwem.points[j];
            if (pt.typeString === type) {
                return pt;
            }
            return null;
        }
    };

    this.displayJson = function (tag, walk, gwemWalk) {
        var hr = document.createElement('hr');
        tag.appendChild(hr);
        var details = document.createElement('details');
        tag.appendChild(details);
        var summary = document.createElement('summary');
        summary.textContent = "Diagnostics";
        details.appendChild(summary);
        var div = document.createElement('div');
        details.appendChild(div);
        div.innerHTML = "<pre>" + JSON.stringify(walk, undefined, 4) + "</pre>";
        var div = document.createElement('div');
        details.appendChild(div);
        div.innerHTML = "<pre>" + JSON.stringify(gwemWalk, undefined, 4) + "</pre>";
    };
    this.notificationMsg = function (tag, msg) {
        var ele = document.createElement('li');
        if (msg.includes("Error")){
            ele.innerHTML="<span style='color:red'>"+msg+"</span> - A dummy value has been used";
        }else{
        ele.textContent = msg;}
        tag.appendChild(ele);
    };

    this.getObjProperty = function (obj, path) {
        // call getObj("basics.date");
        var property;
        var result = null;
        var properties = path.split(".");
        var item = obj;
        for (i = 0; i < properties.length; i++) {
            property = properties[i];
            if (item.hasOwnProperty(property)) {

                result = item;
                item = item[property];
            } else {
                return null;

            }
        }
        return item;

    };

walkDetails = function ($walk) {
        var PHP_EOL = "\n";
        var $html = "";
        var $link, $out, $text;
        $html += "<div class='walkstdfulldetails stdfulldetails walk" + $walk.status + "' >" + PHP_EOL;
        $html += "<div class='group " + gradeCSS($walk.nationalGrade) + "'><b>Group</b>: " + $walk.groupName + "</div>" + PHP_EOL;
        $html += "<div class='basics'>" + PHP_EOL;
        $html += "<div class='description'><b><span class='walktitle'>" + $walk.title + "</span><br/>" + my.getWalkValue($walk, '{dowddmm}') + PHP_EOL;
        $html += "</b></div>" + PHP_EOL;
        if ($walk.description !== "") {
            $html += "<div class='description'> " + $walk.descriptionHtml + "</div>" + PHP_EOL;
        }
        if ($walk.additionalNotes !== "") {
            $html += "<div class='additionalnotes'><b>Additional Notes</b>: " + $walk.additionalNotes + "</div>" + PHP_EOL;
        }
        if ($walk.isLinear) {
            $html += "<b>Linear Walk</b>";
        } else {
            $html += "<b>Circular walk</b>";
        }
        if ($walk.hasMeetPlace) {
            $out = "<div><b>Meeting time " + $walk.meetLocation.timeHHMMshort + "</b></div>";
            $html += $out + PHP_EOL;
        }
        if ($walk.startLocation.exact) {
            $out = "<div><b>Start time " + $walk.startLocation.timeHHMMshort + "</b></div>";
            $html += $out + PHP_EOL;
        }
        if ($walk.finishTime !== null) {
            $out = "<div>(Estimated finish time " + ra.time.HHMMshort($walk.finishTime) + ")</div>";
            $html += $out + PHP_EOL;
        }
        $html += "</div>";
        if ($walk.hasMeetPlace) {
            $html += "<div class='meetplace'>";
            $out = _addLocationInfo("Meeting", $walk.meetLocation);
            $html += $out;
            $html += "</div>" + PHP_EOL;
        }
        if ($walk.startLocation.exact) {
            $html += "<div class='startplace'>";
        } else {
            $html += "<div class='nostartplace'><b>No start place - Rough location only</b>: ";
        }
        $html += _addLocationInfo("Start", $walk.startLocation);
        $html += "</div>" + PHP_EOL;
        if ($walk.isLinear) {
            $html += "<div class='finishplace'>";
            if ($walk.finishLocation !== null) {
                $html += _addLocationInfo("Finish", $walk.finishLocation);
            } else {
                $html += "<span class='walkerror' >Linear walk but no finish location supplied</span>";
            }
            $html += "</div>" + PHP_EOL;
        }
        $html += "<div class='difficulty'><b>Difficulty</b>: ";
        if ($walk.distanceMiles > 0) {
            $html += ra.html.addDiv("distance", "<b>Distance</b>: " + $walk.distanceMiles + "mi / " + $walk.distanceKm + "km");
        }
        $html += ra.html.addDiv("nationalgrade", "<b>National Grade</b>: " + $walk.nationalGrade);
        if ($walk.localGrade !== "") {
            $link = $walk.localGrade;
            $html += ra.html.addDiv("localgrade", "<b>Local Grade</b>: " + $link);
        }
        if ($walk.pace !== "") {
            $html += ra.html.addDiv("pace", "<b>Pace</b>: " + $walk.pace);
        }
        if ($walk.ascentFeet !== null) {
            $html += ra.html.addDiv("ascent", "<b>Ascent</b>: " + $walk.ascentMetres + " m/" + $walk.ascentFeet + " ft");
        }
        $html += "</div>" + PHP_EOL;
        if ($walk.isLeader === false) {
            $html += "<div class='walkcontact'><b>Contact: </b>";
        } else {
            $html += "<div class='walkcontact'><b>Contact Leader: </b>";
        }
        $html += ra.html.addDiv("contactname", "<b>Name</b>: " + $walk.contactName);
        if ($walk.email !== "") {
            $html += my.getEmailLink($walk);
        }
        if ($walk.telephone1 + $walk.telephone2 !== "") {
            $text = "<b>Telephone</b>: ";
            if ($walk.telephone1 !== "") {
                $text += $walk.telephone1;
                if ($walk.telephone2 !== "") {
                    $text += ", ";
                }
            }
            if ($walk.telephone2 !== "") {
                $text += $walk.telephone2;
            }
            $html += ra.html.addDiv("telephone", $text);
        }
        if ($walk.isLeader === false) {
            if ($walk.walkLeader !== "") {
                $html += "<div class='walkleader'><b>Walk Leader</b>: " + $walk.walkLeader + "</div>" + PHP_EOL;
            }
        }
        $html += "</div>" + PHP_EOL;
//        $html += my.addItemInfo("strands", "", $walk.strands);
//        $html += my.addItemInfo("festivals", "Festivals", $walk.festivals);
//        $html += my.addItemInfo("suitability", "Suitability", $walk.suitability);
//        $html += my.addItemInfo("surroundings", "Surroundings", $walk.surroundings);
//        $html += my.addItemInfo("theme", "Theme", $walk.theme);
//        $html += my.addItemInfo("specialStatus", "Special Status", $walk.specialStatus);
//        $html += my.addItemInfo("facilities", "Facilities", $walk.facilities);
        if ($walk.media.length > 0) {
            if ($walk.media.length > 0) {
                $html += "<div class='walkmedia'> ";
                var index, len;
                for (index = 0, len = $walk.media.length; index < len; ++index) {
                    var item = $walk.media[index];
                    var caption = "<div>";
                    if (item.caption !== "") {
                        caption += item.caption;
                    } else {
                        caption += "<br/>";
                    }
                    if (item.copyright !== "") {
                        caption += "<br/><i>&copy; " + item.copyright + "</i>";
                    } else {
                        caption += "<br/>";
                    }
                    caption += "</div>";
                    $html += "<div class='walk-image' ><img data-size='1' class='walkmedia' src='" + item.url + "' onclick='ra.walk.mediasize(this)' >" + caption + "</div>";
                }
                $html += "</div>" + PHP_EOL;
            }
        }
        var mapdiv = "Div" + $walk.id;
        $html += "<div id='" + mapdiv + "'></div>" + PHP_EOL;
        $html += "<div class='walkdates'>" + PHP_EOL;
        $html += "<div class='updated'><a href='" + $walk.detailsPageUrl + "' target='_blank' >View walk on National Web Site</a></div>" + PHP_EOL;
        $html += "<div class='updated'>Walk ID " + $walk.id + "</div>" + PHP_EOL;
        $html += "<div class='updated walk" + $walk.status + "'>Last update: " + ra.date.dowShortddmmyyyy($walk.dateUpdated) + "</div>" + PHP_EOL;
        $html += "</div>" + PHP_EOL;
        $html += "</div>" + PHP_EOL;
        return $html;
    };

gradeCSS = function (nationalGrade) {
        var $class = "";
        switch (nationalGrade) {
            case "Easy Access":
                $class = "grade-ea";
                break;
            case "Easy":
                $class = "grade-e";
                break;
            case "Leisurely":
                $class = "grade-l";
                break;
            case "Moderate":
                $class = "grade-m";
                break;
            case "Strenuous":
                $class = "grade-s";
                break;
            case "Technical":
                $class = "grade-t";
                break;
            default:
                break;
        }
        return $class;
    };
};