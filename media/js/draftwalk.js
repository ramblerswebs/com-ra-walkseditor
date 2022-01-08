var document, ra, FullCalendar;
if (typeof (ra) === "undefined") {
    ra = {};
}
if (typeof (ra.draftWalk) === "undefined") {
    ra.draftWalk = {};
}
ra.draftWalk = function (  ) {
    const isERROR = 'error';
    const isWarning = 'warning';
    const isInformation = 'warning';
    //   this.status = "None";
    this.category = "None";
    this.loggedOn = false;
    this.displayWalk = true;
    this.data = {
        admin: {version: '1.0',
            created: new Date(),
            updated: null,
            status: 'Draft',
            cancelledReason: ''},
        basics: {},
        meeting: {type: "undefined",
            locations: []
        },
        start: {
            type: "undefined"
        },
        walks: [{}],
        contact: {},
        notes: {
            comments: ''
        }
    };

    this.buttons = {delete: null,
        edit: null,
        duplicate: null};

    this.init = function (status, category, loggedOn) {
        this.setWalkStatus(status);
        this.category = category;
        this.loggedOn = loggedOn;
    };
    this.createWithDate = function (date) {
        this.date = date;
    };
    this.setButtons = function (value) {
        this.buttons = value;
    };
    this.createFromJson = function (json) {
        var data;
        try {
            data = JSON.parse(json);
            if (typeof data.basics !== 'undefined') {
                this.data.basics = data.basics;
            }
            if (typeof data.meeting !== 'undefined') {
                this.data.meeting = data.meeting;
            }
            if (typeof data.start !== 'undefined') {
                this.data.start = data.start;
            }
            if (typeof data.walks !== 'undefined') {
                this.data.walks = data.walks;
            }
            if (typeof data.contact !== 'undefined') {
                this.data.contact = data.contact;
            }
            if (typeof data.notes !== 'undefined') {
                this.data.notes = data.notes;
            }

        } catch (err) {
            alert('Cannot process walk (json=' + json + ' )');
        }

    };

    this.setDisplayWalk = function (filters) {
        this.displayWalk = false;
        var status = "RA_Status_" + this.getWalkStatus();
        if (!filters[status]) {
            return;
        }

        var category = "RA_Category_" + this.category;
        if (!filters[category]) {
            return;
        }

        var issues = this.getNoWalkIssues();
        if (issues > 0) {
            if (!filters.RA_Issues) {
                return;
            }
        } else {
            if (!filters.RA_NoIssues) {
                return;
            }
        }

        if (this.dateSet()) {
            if (!filters.RA_DateSet) {
                return;
            }
            var walkDate = this.YYYYMMDD();
            if (walkDate < filters.RA_DateStart) {
                return;
            }
            if (walkDate > filters.RA_DateEnd) {
                return;
            }
            var today = new Date().toISOString().slice(0, 10);
            if (!filters.RA_DatePast) {
                if (walkDate < today) {
                    return;
                }
            }
            if (!filters.RA_DateFuture) {
                if (walkDate >= today) {
                    return;
                }
            }
            var dow = this.dow();
            switch (dow) {
                case "Monday":
                    if (!filters.RA_DayOfWeek_0) {
                        return;
                    }

                    break;
                case "Tuesday":
                    if (!filters.RA_DayOfWeek_1) {
                        return;
                    }
                    break;
                case "Wednesday":
                    if (!filters.RA_DayOfWeek_2) {
                        return;
                    }
                    break;
                case "Thursday":
                    if (!filters.RA_DayOfWeek_3) {
                        return;
                    }
                    break;
                case "Friday":
                    if (!filters.RA_DayOfWeek_4) {
                        return;
                    }
                    break;
                case "Saturday":
                    if (!filters.RA_DayOfWeek_5) {
                        return;
                    }
                    break;
                case "Sunday":
                    if (!filters.RA_DayOfWeek_6) {
                        return;
                    }
                    break;
                default:
                    break;
            }
        } else {
            if (!filters.RA_DateNotSet) {
                return;
            }
        }
        var notes = this.hasEditorNotes();
        if (notes > 0) {
            if (!filters.RA_Notes) {
                return;
            }
        } else {
            if (!filters.RA_NoNotes) {
                return;
            }
        }
        this.displayWalk = true;
        return;
    };
    this.addDisplayClasses = function (cl) {

        var errors = this.getNoWalkIssues();
        if (errors === 0) {
            cl.add("walk-noissues");
        } else {
            cl.add("walk-issues");
        }
        cl.add('status-' + this.getWalkStatusString());
        return;
    };
    this.getDisplayClasses = function () {
        var out = '';
        var errors = this.getNoWalkIssues();
        if (errors === 0) {
            out += " walk-noissues";
        } else {
            out += " walk-issues";
        }
        out += ' status-' + this.getWalkStatusString();
        return out;
    };
    this.dateSet = function () {
        var basics = this.data.basics;
        if (basics.hasOwnProperty('date')) {
            return true;
        } else {
            return false;
        }
    };
    this.dow = function () {
        if (this.dateSet()) {
            var basics = this.data.basics;
            return  ra.date.dow(basics.date);
        } else {
            return null;
        }
    };

    this.displayDetails = function () {
        var html = this.walkDetails();
        ra.modal.display(html, false);
        this._addMaptoWalk();
        this.addButtons(document.getElementById('ramblers-details-buttons1'));
        this.addButtons(document.getElementById('ramblers-details-buttons2'));
        if (this.loggedOn) {
            var tag = document.getElementById('ramblers-diagnostics');
            var details = document.createElement('details');
            tag.appendChild(details);
            var summary = document.createElement('summary');
            summary.textContent = "Diagnostics";
            details.appendChild(summary);
            var div = document.createElement('div');
            details.appendChild(div);
            div.innerHTML = "<pre>" + JSON.stringify(this.data, undefined, 4) + "</pre>";
        }
    };

    this.addButtons = function (tag) {

        //      this.addButton(div, 'View', item.viewUrl);
        if (this.buttons.edit !== null) {
            this.addButton(tag, 'Edit', this.buttons.edit);
        }
        if (this.buttons.duplicate !== null) {
            this.addButton(tag, 'Duplicate', this.buttons.duplicate);
        }
        if (this.buttons.delete !== null) {
            this.addButton(tag, 'Delete', this.buttons.delete);
        }

        return;
    };
    this.addButton = function (div, name, url) {
        var button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.classList.add('ra-button');
        button.innerHTML = name;
        button.addEventListener('click', function () {
            window.location.replace(url);
        });
        div.appendChild(button);
    };
    this.checkFields = function () {
        this.errors = 0;
        this.notifications = [];
        this.checkFieldsBasics();
        this.checkFieldsMeeting();
        this.checkFieldsStart();
        this.checkFieldsWalks();
        this.checkFieldsContact();
    };
    this.checkFieldsBasics = function () {
        var walk = this.data;
        if (this.getObjProperty(walk, 'basics') === null) {
            this.notificationMsg("No basics section found");
        }
        if (this.getObjProperty(walk, 'basics.date') === null) {
            this.notificationMsg("No walk date found");
        }
        if (this.getObjProperty(walk, 'basics.title') === null) {
            this.notificationMsg("No walk title found");
        }
        if (this.getObjProperty(walk, 'basics.description') === null) {
            this.notificationMsg("Information; No walk description found", isWarning);
        }
        if (this.getObjProperty(walk, 'basics.description') === '') {
            this.notificationMsg("Information; No walk description found", isWarning);
        }
    };
    this.checkFieldsMeeting = function () {
        var walk = this.data;
        if (this.getObjProperty(walk, 'meeting') === null) {
            this.notificationMsg("No meeting found");
        }
        var meet = this.getObjProperty(walk, 'meeting');
        var type = this.getObjProperty(meet, 'type');
        if (type === null) {
            this.notificationMsg("Meeting type not defined");
        }

        switch (type) {
            case 'undefined':
                this.notificationMsg("Meeting type not defined");
                break;
            case 'car':
            case 'coach':
            case 'public':
                var meets = this.getObjProperty(meet, 'locations');
                meets.forEach(element => {
                    if (this.getObjProperty(element, 'time') === null) {
                        this.notificationMsg("Meeting time not defined");
                    }
                    if (this.getObjProperty(element, 'name') === null) {
                        this.notificationMsg("Meeting location name not defined");
                    }

                    if (this.getObjProperty(element, 'latitude') === null) {
                        this.notificationMsg("Meeting location latitude/longitude not defined");
                    }
                });
                break;
            case 'none':
            default:
        }
    };
    this.checkFieldsStart = function () {
        var walk = this.data;
        var type = this.getObjProperty(walk, 'start.type');
        switch (type) {
            case 'area':
                var meetingType = this.getObjProperty(walk, 'meeting.type');
                if (meetingType === null || meetingType === 'undefined' || meetingType === 'none') {
                    this.notificationMsg("Information: You have not supplied a meeting point nor a starting place", isWarning);
                }
                if (this.getObjProperty(walk, 'start.location.name') === null) {
                    this.notificationMsg("Walk area name not defined");
                }
                if (this.getObjProperty(walk, 'start.location.latitude') === null) {
                    this.notificationMsg("Walk area latitude/longitude not defined");
                }
                break;
            case 'start':
                if (this.getObjProperty(walk, 'start.location.time') === null) {
                    this.notificationMsg("Start time not defined");
                }
                if (this.getObjProperty(walk, 'start.location.name') === null) {
                    this.notificationMsg("Start name not defined");
                }
                if (this.getObjProperty(walk, 'start.location.latitude') === null) {
                    this.notificationMsg("Start latitude/longitude not defined");
                }
                break;
            default:
                this.notificationMsg("Start information not defined");
        }
    };
    this.checkFieldsWalks = function () {
        var walk = this.data;
        var walks = this.getObjProperty(walk, 'walks');
        if (walks === null) {
            this.notificationMsg("No walk defined");
        } else {
            walks.forEach(singlewalk => {
                var dist = this.getObjProperty(singlewalk, 'distance');
                if (dist === null || dist === '') {
                    this.notificationMsg("Walk - No distance specified");
                }
                if (this.getObjProperty(singlewalk, 'units') === null) {
                    this.notificationMsg("Walk - No distance units (miles/km) specified");
                }
                if (this.getObjProperty(singlewalk, 'natgrade') === null) {
                    this.notificationMsg("Walk - No national grade has been assigned");

                }
                if (this.getObjProperty(singlewalk, 'type') === null) {
                    this.notificationMsg("Walk - No walk shape assigned, circular,linear");
                }
                if (this.getObjProperty(singlewalk, 'type') === "undefined") {
                    this.notificationMsg("Walk - No walk shape assigned, circular,linear");
                }
            });
        }
    };
    this.checkFieldsContact = function () {
        var walk = this.data;

        if (this.getObjProperty(walk, 'contact') === null) {
            this.notificationMsg("Contact - Not defined");
        }
        if (this.getObjProperty(walk, 'contact.displayName') === null) {
            this.notificationMsg("Contact - No name defined");
        }
        var type = this.getObjProperty(walk, 'contact.contactType');
        if (type === null || type === 'undefined') {
            this.notificationMsg("Contact - No type, Leader/Not leader, defined");
        }
        var email = this.getObjProperty(walk, 'email.title') !== null;
        var tel1 = this.getObjProperty(walk, 'contact.telephone1') !== null;
        var tel2 = this.getObjProperty(walk, 'contact.telephon2') !== null;
        if (email || tel1 || tel2) {
            // at least one contact method defined
        } else {
            this.notificationMsg("Information:  Contact - No contact method defined (email or telephone)", isWarning);
        }
    };


    this.getObjProperty = function (obj, path, defaultvalue = null) {
        // call getObj("basics.date");
        if (typeof obj === 'undefined') {
            return defaultvalue;
        }
        if (obj === null) {
            return defaultvalue;
        }
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
                return defaultvalue;

            }
        }
        return item;

    };

    this.setWalkStatus = function (status, reason = '') {
        this.data.admin.status = status;
        if (status === "Cancelled") {
            this.data.admin.cancelledReason = reason;
    }
    };
    this.getWalkStatus = function () {
        return this.data.admin.status;
    };
    this.getWalkStatusString = function () {
        return  this.getWalkStatus().replace(/ /g, "_");
    };
    this.getWalkCategory = function () {
        return this.category;
    };
    this.getWalkDate = function (view) {
        var d = this.getObjProperty(this.data, 'basics.date');
        if (d !== null) {
            if (ra.date.isValidString(d)) {
                var dow = ra.date.dow(d);
                switch (view) {
                    case 'table':
                        return  "<b>" + ra.date.dowdd(d) + "</b><br/>" + " " + ra.date.month(d) + " " + ra.date.YY(d);
                    case 'list':
                    case 'details':
                        return  "<b>" + ra.date.dowdd(d) + "</b>" + " " + ra.date.month(d) + " " + ra.date.YY(d);
                }
            }
        }
        return '????';
    };
    this.getWalkBasics = function (view) {
        var title = this.getObjProperty(this.data, 'basics.title');
        var description = this.getObjProperty(this.data, 'basics.description');
        var notes = this.getObjProperty(this.data, 'basics.notes');
        var out = '';
        out += '<h3>Title: ' + title + '</h3>';
        out += '<h3>Date: ' + this.getWalkDate('details') + '</h3>';
        if (description === null) {
            description = '';
        }
        if (notes === null) {
            notes = '';
        }
        out += '<h4>Description: </h4>' + description;
        out += '<h4>Notes: </h4>' + notes;



        return out;
    };
    this.getWalkMeeting = function (view) {
        var type = this.getObjProperty(this.data, 'meeting.type');
        if (type === null) {
            return  "Meeting type not defined ????";
        }
        var out = type;
        switch (type) {
            case 'car':
                out = 'Car Share';
                break;
            case 'coach':
                out = 'Coach walk';
                break;
            case 'public':
                out = 'Using public transport';
                break;
            case 'none':
                out = 'Meet at start of walk';
                return out;
            default:
        }


        var meets = this.getObjProperty(this.data, 'meeting.locations');
        meets.forEach(element => {
            var time = this.getObjProperty(element, 'time', '????');
            var name = this.getObjProperty(element, 'name', '????');
            var gr = this.getObjProperty(element, 'gridref8', '????');
            var pc = this.getObjProperty(element, 'postcode.value', '');
            switch (view) {
                case 'table':
                    out += '<br/>' + time + ' at ' + name + ' (' + gr + ' ' + pc + ')';
                    break;
                case 'list':
                    out += ', ' + time + ' at ' + name + ' (' + gr + ' ' + pc + ')';
                    break;
                case 'details':
                    out += '<br/>' + time + ' at ' + name + ' (' + gr + ' ' + pc + ')';
                    break;
            }
        });
        return out;
    };
    this.getWalkStart = function (view) {
        var type = this.getObjProperty(this.data, 'start.type');
        var out = "";
        switch (type) {
            case 'start':
                var time = this.getObjProperty(this.data, 'start.location.time', '????');
                var name = this.getObjProperty(this.data, 'start.location.name', '????');
                var gr = this.getObjProperty(this.data, 'start.location.gridref8', '????');
                var pc = this.getObjProperty(this.data, 'start.location.postcode.value', '');
                switch (view) {
                    case 'table':
                        out += time;
                        out += " at " + name;
                        out += ", " + gr + ' ' + pc;
                        break;
                    case 'list':
                        out += time;
                        out += " at " + name;
                        out += ", " + gr + ' ' + pc;
                        break;
                    case 'details':
                        out += 'Start: ';
                        out += time;
                        out += " at " + name;
                        out += "</br/>Grid Ref " + gr + ' ' + pc;
                        break;
                }
                break;
            case 'area':
                var name = this.getObjProperty(this.data, 'start.location.name', '????');
                var gr = this.getObjProperty(this.data, 'start.location.gridref8', '????');
                switch (view) {
                    case 'table':
                        out += 'General Area: ';
                        out += name;
                        out += "</br/>Around Grid Ref " + gr;
                        break;
                    case 'list':
                        out += 'General Area: ';
                        out += name;
                        out += ", Around Grid Ref " + gr;
                        break;
                    case 'details':
                        out += 'General Area: ';
                        out += name;
                        out += "</br/>Around Grid Ref " + gr;
                        break;
                }
                break;
            default:
                out = "????";
        }
        return out;
    };
    this.getWalkTitle = function (view = 'default') {
        var d = this.getObjProperty(this.data, 'basics.title');
        if (d !== null) {
            return  "<b>" + d + "</b>";
        }
        return '????';
    };
    this.getWalkDifficulty = function (view) {
        var out = '';
        if (view === 'details') {
            out += "<ul>";
        }
        var walks = this.getObjProperty(this.data, 'walks');
        walks.forEach(element => {
            var distance = this.getObjProperty(element, 'distance');
            var units = this.getObjProperty(element, 'units');
            var natgrade = this.getObjProperty(element, 'natgrade');
            switch (view) {
                case 'table':
                    out += distance + ' ' + units + ' ' + natgrade + '<br/>';
                    break;
                case 'list':
                    out += distance + ' ' + units + ', ';
                    break;
                case 'details':
                    var localgrade = this.getObjProperty(element, 'localgrade');
                    var leader = this.getObjProperty(element, 'leader');
                    var ascent = this.getObjProperty(element, 'ascent');
                    var duration = this.getObjProperty(element, 'duration');
                    out += '<li>' + distance + ' ' + units + ' ' + natgrade;
                    if (localgrade !== null) {
                        out += " / " + localgrade;
                    }
                    if (ascent !== null) {
                        out += " A: " + ascent;
                    }
                    if (duration !== null) {
                        out += " D: " + duration;
                    }
                    if (leader !== null) {
                        out += " L: " + leader;
                    }
                    out += '</li>';
                    
                    break;
            }

        });
        if (view === 'details') {
            out += "</ul>";
        }
        return out.replaceAll('null', '????');

    };
   
    this.getWalkContact = function (view) {
        var d = this.getObjProperty(this.data, 'contact');
        var out = '';
        if (typeof (d.displayName) === "undefined") {
            out += '????';
        } else {
            out += d.displayName;
        }

        switch (view) {
            case 'table':
                if (typeof (d.email) !== "undefined") {
                    out += '<br/>' + this.obscureInfo(d.email, this.loggedOn);
                }
                if (typeof (d.telephone1) !== "undefined") {
                    out += '<br/>' + this.obscureInfo(d.telephone1, this.loggedOn);
                }
                if (typeof (d.telephone2) !== "undefined") {
                    out += '<br/>' + this.obscureInfo(d.telephone2, this.loggedOn);
                }
                break;
            case 'list':
                if (typeof (d.telephone1) !== "undefined") {
                    out += ', ' + this.obscureInfo(d.telephone1, this.loggedOn);
                }
                break;
            case 'details':
                if (typeof (d.email) !== "undefined") {
                    out += '<br/>' + this.obscureInfo(d.email, this.loggedOn);
                }
                if (typeof (d.telephone1) !== "undefined") {
                    out += '<br/>' + this.obscureInfo(d.telephone1, this.loggedOn);
                }
                if (typeof (d.telephone2) !== "undefined") {
                    out += '<br/>' + this.obscureInfo(d.telephone2, this.loggedOn);
                }
                break;
        }
        return out;
    };
    this.getStatusCategory = function (delimiter, noCategories) {
        var notes = '';
        notes += '[' + this.getWalkStatus() + "]";
        if (noCategories > 1) {
            notes += delimiter + "[" + this.category + "]";
        }
        if (this.hasEditorNotes()) {
            notes += delimiter + "[Editor Notes]";
        }
        var no = this.getNoWalkIssues();
        if (no > 0) {
            notes += delimiter + "[" + no.toString() + " issues]";
        }
        return notes;

    };

    this.getNoWalkIssues = function () {
        this.checkFields();
        return this.errors;

    };
    this.getWalkMessages = function (view = 'all') {
        this.checkFields();
        switch (view) {
            case 'summary':
                //  var sum = this.notifications.slice(0, 3);
                //  return sum.join('<br/>');
                break;
            case 'all':
                break;
        }
        return this.notifications.join('<br/>');

    };
    this.getWalkNotes = function (view) {
        var d = this.getObjProperty(this.data, 'notes.comments');
        var out = '';
        switch (view) {
            case 'table':
                out += d;
                break;
            case 'list':
                out += d;
                break;
            case 'details':
                out += d;
                break;
        }
        return out;
    };
    this.getAsEvent = function () {
        var meetingTime = '';

        var d = this.getObjProperty(this.data, 'basics.date');
        var startTime = this.getObjProperty(this.data, 'start.location.time');
        var meeting = this.getObjProperty(this.data, 'meeting.locations');
        if (meeting !== null) {
            meetingTime = this.getObjProperty(meeting[0], 'time');
            if (meetingTime === "undefined") {
                meetingTime = null;
            }
        }
        var title = this.getObjProperty(this.data, 'basics.title');
        if (title === null) {
            title = 'No title defined';
        }
        if (d === null) {
            var now = new Date();
            var iso = now.toISOString();
            d = iso.substring(0, iso.indexOf('T'));
        }

        var event = {};
        if (meetingTime !== null) {
            //      d = d + "T" + meetingTime + ":00";
        } else {
            if (startTime !== null) {
                //          d = d + "T" + startTime + ":00";
            }
        }
        event.start = d;
        event.title = title;
        event.classNames = ['pointer ' + this.getDisplayClasses()];


        return event;
    };
    this.getAsMarker = function (cluster) {
        var type = this.getObjProperty(this.data, 'start.type');
        var icon, popup, popupoffset, title;
        var lat;
        var lng;
        var date = this.getObjProperty(this.data, 'basics.date');
        var title = this.getObjProperty(this.data, 'basics.title');
        var time = this.getObjProperty(this.data, 'start.location.time');
        var name = this.getObjProperty(this.data, 'start.location.name');
        var gr = this.getObjProperty(this.data, 'start.location.gridref8');
        popup = "<b>Date: " + date + "<br/>Title: " + title + "</b><br/>";
        switch (type) {
            case 'start':
                lat = this.getObjProperty(this.data, 'start.location.latitude');
                lng = this.getObjProperty(this.data, 'start.location.longitude');
                if (lat === null) {
                    lat = 53.70774;
                }
                if (lng === null) {
                    lng = 0.76326;
                }
                popup += "<b>Walk start</b><br/>Time:" + time;
                popup += "<br/>Name:" + name;
                popup += "<br/>GR: " + gr;
                icon = ra.map.icon.markerStart();
                title = 'Start of walk';
                popupoffset = [0, -10];
                break;
            case 'area':
                lat = this.getObjProperty(this.data, 'start.location.latitude');
                lng = this.getObjProperty(this.data, 'start.location.longitude');
                if (lat === null) {
                    lat = 53.70774;
                }
                if (lng === null) {
                    lng = 0.76326;
                }
                popup += "<b>General area for walk only</b><br/>Name: " + name;
                popup += "<br/>Contact group if you wish to join the walk at the start";
                icon = ra.map.icon.markerArea();
                title = 'General area of walk';
                popupoffset = [0, -10];
                break;
            default:
                lat = 53.70774;
                lng = 0.76326;
                icon = ra.map.icon.markerArea();
                title = 'Start not defined';
                popup = 'Start not defined';
                popupoffset = [0, -10];
        }
        //      var marker = L.marker([lat, lng], {icon: icon, title: title, riseOnHover: true}).addTo(layer);
        //     marker.bindPopup(popup, {offset: popupoffset, autoClose: false}).closePopup();

        cluster.addMarker(popup, lat, lng, {icon: icon, title: title, riseOnHover: true});
    };


    this.hasEditorNotes = function () {
        var notes = this.getObjProperty(this.data, 'notes.comments');
        if (notes !== null) {
            return notes.length > 0;
        }
        return false;

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
    this.notificationMsg = function (msg, type = isERROR) {
        if (type === isERROR) {
            this.errors += 1;
        }
        this.notifications.push(msg);
    };
    this.setWalkValues = function () {

    };

    this.walkDetails = function () {


        var PHP_EOL = "\n";
        var $html = "";

        $html += "<div id='ramblers-details-buttons1' ></div>" + PHP_EOL;
        $html += "<div class='walkstdfulldetails stdfulldetails walk draft' >" + PHP_EOL;
        $html += "<div class=\'group status-" + this.getWalkStatusString() + "'><b>Preview of Walk - " + this.getWalkStatus() + " </b></div>" + PHP_EOL;

        $html += "<div class='ra preview section'>" + PHP_EOL;
        $html += '<b>Basics:</b><br/>' + this.getWalkBasics('details');
        $html += "</div>" + PHP_EOL;

        $html += "<div class='ra preview section'>";
        $html += '<b>Meeting:</b><br/>' + this.getWalkMeeting('details');
        $html += "</div>" + PHP_EOL;

        $html += "<div class='ra preview section'>";
        $html += '<b>Start:</b><br/>' + this.getWalkStart('details');
        $html += "</div>" + PHP_EOL;

        $html += "<div class='ra preview section'>";
        $html += '<b>Walk(s):</b><br/>' + this.getWalkDifficulty('details');
        $html += "</div>" + PHP_EOL;

        $html += "<div class='ra preview section'>";
        $html += '<b>Contact:</b><br/>' + this.getWalkContact('details');
        $html += "</div>" + PHP_EOL;


        var mapdiv = "detailsMapDiv";
        $html += "<div id='" + mapdiv + "'></div>" + PHP_EOL;
        $html += "<div class='ra preview section'>" + PHP_EOL;
        $html += '<b>Issues:</b><br/>' + this.getWalkMessages();
        $html += "</div>" + PHP_EOL;


        var notes = this.getWalkNotes('details');
        if (notes !== '') {
            $html += "<div class='ra preview section'>" + PHP_EOL;
            $html += '<b>Editor Notes:</b><br/>' + notes;
            $html += "</div>" + PHP_EOL;
        }
        $html += "</div>" + PHP_EOL;

        $html += "<div id='ramblers-details-buttons2' ></div>" + PHP_EOL;

        //  $html += "</div>" + PHP_EOL;
        $html += "<div id='ramblers-diagnostics' ></div>" + PHP_EOL;
        return $html;
    };
    this._addMaptoWalk = function () {

        var tag = document.getElementById("detailsMapDiv");
        var lmap = new leafletMap(tag, ra.defaultMapOptions);
        var map = lmap.map;
        var points = 0;
        var layer = L.featureGroup().addTo(map);
        var type = this.getObjProperty(this.data, 'meeting.type');
        if (type !== null) {
            var out = '';
            switch (type) {
                case 'car':
                    out = 'Car Share at ';
                    break;
                case 'coach':
                    out = 'Coach walk pickup at ';
                    break;
                case 'public':
                    out = 'Using public transport at ';
                    break;
                case 'none':
                    break;
                default:
            }
            if (out !== '') {
                var meets = this.getObjProperty(this.data, 'meeting.locations');
                meets.forEach(element => {
                    var time = this.getObjProperty(element, 'time', '???');
                    var name = this.getObjProperty(element, 'name', '???');
                    var gr = this.getObjProperty(element, 'gridref8');
                    var lat = this.getObjProperty(element, 'latitude');
                    var long = this.getObjProperty(element, 'longitude');
                    var pc = this.getObjProperty(element, 'postcode.value', null);
                    var pcLat = this.getObjProperty(element, 'postcode.latitude');
                    var pcLng = this.getObjProperty(element, 'postcode.longitude');
                    if (lat !== null && long !== null) {
                        out += time + ' from ' + name + ', ' + gr;

                        var marker = L.marker([lat, long]).addTo(layer);
                        marker.bindPopup(out);
                        points += 1;
                        if (pc !== null) {
                            ra.map.addPostcodeIcon(pc, [pcLat, pcLng], layer);
                        }
                    }
                });
            }
        }

        var type = this.getObjProperty(this.data, 'start.type');
        var out = "Start of walk at ";
        switch (type) {
            case 'start':
                var time = this.getObjProperty(this.data, 'start.location.time', '???');
                var name = this.getObjProperty(this.data, 'start.location.name', '???');
                var gr = this.getObjProperty(this.data, 'start.location.gridref8');
                var lat = this.getObjProperty(this.data, 'start.location.latitude');
                var long = this.getObjProperty(this.data, 'start.location.longitude');
                var pc = this.getObjProperty(this.data, 'start.location.postcode.value', null);
                var pcLat = this.getObjProperty(this.data, 'start.location.postcode.latitude');
                var pcLng = this.getObjProperty(this.data, 'start.location.postcode.longitude');
                out += time;
                out += " from " + name;
                out += ", " + gr;
                if (lat !== null && long !== null) {
                    var marker = L.marker([lat, long]).addTo(layer);
                    marker.bindPopup(out);
                    points += 1;
                }
                if (pc !== null) {
                    ra.map.addPostcodeIcon(pc, [pcLat, pcLng], layer);
                }

                break;
            case 'area':
                var name = this.getObjProperty(this.data, 'start.location.name');
                var gr = this.getObjProperty(this.data, 'start.location.gridref8');
                var lat = this.getObjProperty(this.data, 'start.location.latitude');
                var long = this.getObjProperty(this.data, 'start.location.longitude');

                out += 'General Area: ';
                out += name;
                out += ", Grid Ref " + gr;
                if (lat !== null && long !== null) {
                    L.marker([lat, long]).addTo(layer);
                    points += 1;
                }

                break;

        }
        if (points > 0) {

            var bounds = layer.getBounds();
            map.fitBounds(bounds, {maxZoom: 15, padding: [20, 20]});

        }
    };

    this.gradeCSS = function (nationalGrade) {
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
    this.obscureInfo = function ($text, $canedit) {
        if ($canedit) {
            return $text;
        } else {
            var $no = $text.length;
            if ($no < 5) {
                return "*".repeat($no);
            }
            var $out = $text;
            for (var $i = 0; $i <= $no - 5; $i++) {
                var $char = $out.substr($i, 1);
                if ($char !== "@" && $char !== " ") {
                    $out = $out.replaceAt($i, "*");
                }
            }

            return $out;
        }
    };
    this.YYYYMMDD = function () {
        if (this.dateSet()) {
            var basics = this.data.basics;
            return  ra.date.YYYYMMDD(basics.date);
        } else {
            return null;
        }
    };
    String.prototype.replaceAt = function (index, char) {
        var a = this.split("");
        a[index] = char;
        return a.join("");
    };


};
