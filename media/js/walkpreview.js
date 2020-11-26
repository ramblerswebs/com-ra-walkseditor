var document, ramblers;
preview = function () {
    this.tableFormat = '[{ "title": "Date", "items": ["{dowddmm}"]},{   "title": "Meet",    "items": ["{meet}","{,meetGR}","{,meetPC}"]},{    "title": "Start",    "items": ["{start}","{,startGR}","{,startPC}"]},{    "title": "Title",    "items": ["{mediathumbr}","{title}"]},{    "title": "Difficulty",    "items": ["{difficulty}"]},{    "title": "Contact",    "items": ["{contact}"]}]';
    this.listFormat = '[ "{dowddmm}", "{,meet}", "{,start}","{,title}","{,distance}","{,contactname}","{,telephone}" ] ';
    this.detailsFormat = '[ "{dowddmm}", "{,title}","{,distance}","{,contactname}" ] ';
    this.display = function (tag, ramblers) {
        tag.innerHTML = '';

        this.displayWalkList(tag);
        this.displayWalkTable(tag);
        this.displayWalkFull(tag);
        //  this.displayComments(tag);

        this.displayJson(tag, ramblers);
    };
    this.displayWalkFull = function (tag) {
        var items, type;
        // Basics section
        var walk = ramblers.walk;
        var displayDiv = document.createElement('div');
        displayDiv.setAttribute('class', 'display');
        tag.appendChild(displayDiv);
        var input = new raInputFields;
        var basicsDiv = document.createElement('div');
        basicsDiv.setAttribute('class', 'display section basics');
        displayDiv.appendChild(basicsDiv);
        var head = input.addHeader(basicsDiv, "h2", "Basic Details");
        this.addDisplayItem(basicsDiv, "Date", walk.basics, 'date');
        this.addDisplayItem(basicsDiv, "", walk.basics, 'title');
        this.addDisplayItem(basicsDiv, "", walk.basics, 'description');
// Meeting type section

        var meetingDiv = document.createElement('div');
        meetingDiv.setAttribute('class', 'display section meeting');
        displayDiv.appendChild(meetingDiv);
        type = ramblers.walk.meeting.type;
        switch (type) {
            case 'car':
                input.addHeader(meetingDiv, "h2", "Meeting: Car share to the walk");
                break;
            case 'coach':
                input.addHeader(meetingDiv, "h2", "Meeting: Catch a coach to the walks");
                break;
            case 'public':
                input.addHeader(meetingDiv, "h2", "Meeting: Use public transport to the walk");
                break;
            case 'none':
                input.addHeader(meetingDiv, "h2", "Meet at the start of the walk");
                break;
            case 'undefined':
                input.addHeader(meetingDiv, "h2", "Meeting: Meeting arrangements not defined");
                break;
        }
        var title = "";
        items = ramblers.walk.meeting.locations;
        for (i = 0; i < items.length; i++) {
            var item = items[i];
            switch (type) {
                case 'car':
                    title = 'Car Share ';
                    break;
                case 'coach':
                    title = 'Pick Up ' + (i + 1).toString();
                    break;
                case 'public':
                    title = 'Pick Up ' + (i + 1).toString();
                    break;
            }
            if (items.length > 1) {
                this.addDisplayItem(meetingDiv, "", title, null);
            }
            this.addDisplayItem(meetingDiv, "Catch ", item, 'servicename');
            this.addDisplayItem(meetingDiv, "Time", item, 'time');
            this.addDisplayItem(meetingDiv, "Name", item, 'name');
            this.addDisplayItem(meetingDiv, "Grid Ref", item, 'gridref8');
        }

// Start Section

        var startDiv = document.createElement('div');
        startDiv.setAttribute('class', 'display section start');
        displayDiv.appendChild(startDiv);
        item = null;
        type = ramblers.walk.start.type;
        switch (type) {
            case 'undefined':
                input.addHeader(startDiv, "h2", "Start/Walking Area");
                var tab = document.createElement('p');
                tab.textContent = 'Error: Not defined';
                startDiv.appendChild(tab);
                break;
            case 'area':
                input.addHeader(startDiv, "h2", "Walking Areas: Where is the walk going to be?");
                item = ramblers.walk.start.area;
                break;
            case 'start':
                input.addHeader(startDiv, "h2", "Start: Where is the walk going to be?");
                item = ramblers.walk.start.location;
                break;
        }
        this.addDisplayItem(startDiv, "Time", item, 'time');
        this.addDisplayItem(startDiv, "Place", item, 'name');
        this.addDisplayItem(startDiv, "Grid Ref", item, 'gridref8');
// Walks Section

        var walksDiv = document.createElement('div');
        walksDiv.setAttribute('class', 'display section walk');
        displayDiv.appendChild(walksDiv);
        input.addHeader(walksDiv, "h2", "Walk Length, Difficulty");
        var items = ramblers.walk.walks;
        for (i = 0; i < items.length; i++) {
            var item = items[i];
            this.addDisplayItem(walksDiv, "Distance", item, 'distance');
            this.addDisplayItem(walksDiv, "Units", item, 'units');
            this.addDisplayItem(walksDiv, "Type", item, 'type');
            this.addDisplayItem(walksDiv, "National Grade", item, 'natgrade');
            this.addDisplayItem(walksDiv, "Local Grade", item, 'localgrade');
            this.addDisplayItem(walksDiv, "Pace", item, 'pace');
            this.addDisplayItem(walksDiv, "Ascent", item, 'ascent');
            this.addDisplayItem(walksDiv, "Duration", item, 'duration');
        }

// Contacts Section

        var contactDiv = document.createElement('div');
        contactDiv.setAttribute('class', 'display section contact');
        displayDiv.appendChild(contactDiv);
        input.addHeader(contactDiv, "h2", "Who to Contact about the Walk");
        input.addTag(contactDiv, "div", this.getItem('contact'));

    };
    this.addDisplayItem = function (tag, title, obj, property) {
        var value = null;
        if (obj === null) {
            return;
        }
        if (property === null) {
            value = obj;
        } else {
            if (obj.hasOwnProperty(property)) {
                value = obj[property];
            }
        }
        if (value === null) {
            return;
        }
        var item = document.createElement('div');
        //   item.setAttribute('class', 'section basics');
        var text = "";
        if (title !== "") {
            text += "<b>" + title + ": </b>";
        }
        item.innerHTML = text + value;
        tag.appendChild(item);
    };
    this.displayWalkList = function (tag) {
        var hr = document.createElement('hr');
        tag.appendChild(hr);
        var h2 = document.createElement('h2');
        h2.textContent = "List View";
        tag.appendChild(h2);
        var div = document.createElement('div');
        tag.appendChild(div);
        //   div.innerHTML = this.getItem('date') + ", " + this.getItem('title');
        var $items = JSON.parse(this.listFormat);
        var $out = "";

        var index, len, $items, $text, $item;
        for (index = 0, len = $items.length; index < len; ++index) {
            $item = $items[index];
            $text = this.getWalkValue(ramblers.walk, $item, true);
            $out += $text;
        }

        div.innerHTML = $out;

    };
    this.displayWalkTable = function (tag) {

        var hr = document.createElement('hr');
        tag.appendChild(hr);
        var h2 = document.createElement('h2');
        h2.textContent = "Table View";
        tag.appendChild(h2);
        var table = document.createElement('table');
        tag.appendChild(table);
        var thead = document.createElement('thead');
        table.appendChild(thead);
        var tbody = document.createElement('tbody');
        table.appendChild(tbody);
        var tr = document.createElement('tr');
        thead.appendChild(tr);
        var td = document.createElement('td');
        td.textContent = "Date";
        tr.appendChild(td);
        td = document.createElement('td');
        td.textContent = "Meeting";
        tr.appendChild(td);
        td = document.createElement('td');
        td.textContent = "Start";
        tr.appendChild(td);
        td = document.createElement('td');
        td.textContent = "Title";
        tr.appendChild(td);
        td = document.createElement('td');
        td.textContent = "Difficulty";
        tr.appendChild(td);
        td = document.createElement('td');
        td.textContent = "Contact";
        tr.appendChild(td);
        tr = document.createElement('tr');
        tbody.appendChild(tr);
        td = document.createElement('td');
        td.innerHTML = this.getItem('date');
        tr.appendChild(td);
        td = document.createElement('td');
        td.textContent = "Meeting";
        tr.appendChild(td);
        td = document.createElement('td');
        td.textContent = "Start";
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerHTML = this.getItem('title');
        tr.appendChild(td);
        td = document.createElement('td');
        td.textContent = "Difficulty";
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerHTML = this.getItem('contact');
        tr.appendChild(td);
        //  div.innerHTML = "<pre>" + JSON.stringify(ramblers.walk, undefined, 4) + "</pre>";

    };
    this.displayComments = function (tag) {
        var htmlString = "<p> Comments about the form </p>"
                + "<ul >"
                + "<li> Walks should have levels of status: draft, awaiting approval, approved, cancelled, completed </li>"
                + "<li> Should they also have a deleted status? </li> "
                + "<li> Form should allow incomplete information while the walk is in draft status, so dates could be defined while the other details are gathered </li>"
                + "<li> What data is required for Coach walks? </li>"
                + "<li> What data is required for Public Transport walks? </li>"
                + "<li> Most walks will have either a single Meeting place or no Meeting place </li>"
                + "<li> Most walks will have a single walk of one distance </li>"
                + "<li> Some walks, especially Coach walks often have a selection of walks to choose from, some Areas hold a get together with multiple walks </li>"
                + "<li> Pace - should this have predefined ranges or be an absolute value in mile / hour or km / hour? </li>"
                + "<li> Ascent - should this have predefined ranges or be an absolute value in feet or metres? </li>"
                + "<li> Duration - given distance, pace and ascent we can estimate the walk duration and display this </li>"
                + "</ul>";
        var comment = document.createElement('div');
        comment.innerHTML = htmlString;
        tag.appendChild(comment);
    };
    this.displayJson = function (tag, ramblers) {
        var hr = document.createElement('hr');
        tag.appendChild(hr);
        var h2 = document.createElement('h2');
        h2.textContent = "Diagnostics";
        tag.appendChild(h2);
        var div = document.createElement('div');
        tag.appendChild(div);
        div.innerHTML = "<pre>" + JSON.stringify(ramblers.walk, undefined, 4) + "</pre>";
    };
    this.getItem = function (option) {
        var walk = ramblers.walk;
        var out = '';
        switch (option) {
            case "{lf}":
                out = "<br/>";
                break;
            case 'date':
                var value = this.getObjProperty(walk, 'basics.date');
                if (value !== null) {
                    out = value;
                } else {
                    out = '<span class="error">No date</span>';
                }
                break;
            case 'title':
                var value = this.getObjProperty(walk, 'basics.title');
                if (value !== null) {
                    out = value;
                } else {
                    out = '<span class="error">No title</span>';
                }
                break;
            case 'contact':
                var value = this.getObjProperty(walk, 'contact.contactType');
                if (value !== null) {
                    if (value === 'isNotLeader') {
                        out += "Contact";
                    } else {
                        out += "Leader";
                    }
                } else {
                    out += "<span class='error'>No Contact type defined</span>";
                }
                var entry = false;
                var value = this.getObjProperty(walk, 'contact.displayName');
                if (value !== null) {
                    entry = true;
                    out += "<br/>" + value;
                }
                var value = this.getObjProperty(walk, 'contact.telephone1');
                if (value !== null) {
                    entry = true;
                    out += "<br/>" + value;
                }
                var value = this.getObjProperty(walk, 'contact.telephone2');
                if (value !== null) {
                    entry = true;
                    out += "<br/>" + value;
                }
                if (!entry) {
                    out = "<span class='error'>No Contact Details defined</span>";
                }
                break;
        }
        return out;
    }
    ;
    this.getObjProperty = function (obj, path) {
        // call getObj("basics.date");
        var property;
        var properties = path.split(".");
        var item = obj;
        for (i = 0; i < properties.length; i++) {
            property = properties[i];
            if (item.hasOwnProperty(property)) {
                item = item[property];
            } else {
                return null;

            }
        }
        return item;

    };
    this.getWalkValue = function (walk, $option, addlink) {
        var BR = "<br/>";
        var out = "";
        var $prefix;
        var values = this.getPrefix($option);
        $prefix = values[0];
        $option = values[1];
        switch ($option) {
            case "{lf}":
                out = "<br/>";
                break;
            case "{group}":
                out = '';
                //out = walk.groupName;
                break;
            case "{dowShortdd}":
                var value = this.getObjProperty(walk, 'basics.date');
                if (value !== null) {
                    out = value;
                    out = this.addWalkLink(walk, "<b>" + shortDoW(walk.dayofweek) + ", " + walk.day + "</b>", addlink, "");
                } else {
                    out = '<span class="error">No date</span>';
                }
                break;
            case "{dowShortddmm}":
                out = this.addWalkLink(walk, "<b>" + shortDoW(walk.dayofweek) + ", " + walk.day + " " + walk.month + "</b>", addlink, "");
                break;
            case "{dowShortddyyyy}":
                out = this.addWalkLink(walk, "<b>" + shortDoW(walk.dayofweek) + " " + walk.walkDate.date.substr(0, 4) + "</b>", addlink, "");
                break;
            case "{dowdd}":
                out = this.addWalkLink(walk, "<b>" + walk.dayofweek + ", " + walk.day + "</b>", addlink, "");
                break;
            case "{dowddmm}":
                var value = this.getObjProperty(walk, 'basics.date');
                if (value !== null) {
                    out = value;
                    var d = new Date(value);
                    var datestring = dateFormat(d, "dddd, mmmm dS, yyyy");
                    out = this.addWalkLink(walk, "<b>" + datestring + "</b>", addlink, "");
                } else {
                    out = '<span class="error">No date</span>';
                }
                break;
            case "{dowddmmyyyy}":
                out = this.addWalkLink(walk, "<b>" + walk.dayofweek + ", " + walk.day + " " + walk.month + " " + walk.walkDate.date.substr(0, 4) + "</b>", addlink, "");
                break;
            case "{meet}":
                if (walk.hasMeetPlace) {
                    out = walk.meetLocation.timeHHMMshort;
                    if (walk.meetLocation.description) {
                        out += " at " + walk.meetLocation.description;
                    }
                }
                break;
            case "{meetTime}":
                if (walk.hasMeetPlace) {
                    out = walk.meetLocation.timeHHMMshort;
                }
                break;
            case "{meetPlace}":
                if (walk.hasMeetPlace) {
                    out = walk.meetLocation.description;
                }
                break;
            case "{meetGR}":
                if (walk.hasMeetPlace) {
                    out = walk.meetLocation.gridref;
                }
                break;
            case "{meetPC}":
                if (walk.hasMeetPlace) {
                    out = walk.meetLocation.postcode;
                }
                break;
            case "{meetOLC}":
                if (walk.hasMeetPlace) {
                    if (walk.meetLocation.exact) {
                        out = OpenLocationCode.encode(walk.meetLocation.latitude, walk.meetLocation.longitude);
                    }
                }
                break;
            case "{meetMapCode}":
                if (walk.hasMeetPlace) {
                    if (walk.meetLocation.exact) {
                        out = getMapCode(walk.meetLocation.latitude, walk.meetLocation.longitude, false);
                    }
                }
                break;
            case "{start}":
                out = '';
                break;
                if (walk.startLocation.exact) {
                    out = walk.startLocation.timeHHMMshort;
                    if (walk.startLocation.description) {
                        out += " at " + walk.startLocation.description;
                    }
                }
                break;
            case "{startTime}":
                if (walk.startLocation.exact) {
                    out = walk.startLocation.timeHHMMshort;
                }
                break;
            case "{startPlace}":
                if (walk.startLocation.exact) {
                    if (walk.startLocation.description) {
                        out += walk.startLocation.description;
                    }
                }
                break;
            case "{startGR}":
                if (walk.startLocation.exact) {
                    out = walk.startLocation.gridref;
                }
                break;
            case "{startPC}":
                if (walk.startLocation.exact) {
                    out = walk.startLocation.postcode;
                }
                break;


            case "{title}":
                var value = this.getObjProperty(walk, 'basics.title');
                if (value !== null) {
                    out = value;
                } else {
                    out = '<span class="error">No title</span>';
                }
                out = "<b>" + out + "</b>";
                break;
            case "{description}":
                out = walk.description;
                break;
            case "{difficulty}":
                out = getWalkValue(walk, "{distance}", addlink);
                out += "<br/><span class='pointer " + walk.nationalGrade.replace(/ /g, "") + "' onclick='javascript:dGH()'>" + walk.nationalGrade + "</span>";
                if (walk.localGrade !== "") {
                    out += "<br/>" + walk.localGrade;
                }
                break;
            case "{distance}":
                if (walk.distanceMiles > 0) {
                    out = walk.distanceMiles + "mi / " + walk.distanceKm + "km";
                }
                break;
            case "{nationalGrade}":
                out = "<span class='pointer " + walk.nationalGrade.replace(/ /g, "") + "' onclick='javascript:dGH()'>" + walk.nationalGrade + "</span>";
                break;
            case "{nGrade}":
                out = "<span class='pointer " + walk.nationalGrade.replace(/ /g, "") + "' onclick='javascript:dGH()'>" + walk.nationalGrade.substr(0, 1) + "</span>";
                break;
            case "{localGrade}":
                out = walk.localGrade;
                break;
            case "{additionalNotes}":
                out = walk.additionalNotes;
                break;
            case "{contact}":
                out = "";
                var value = this.getObjProperty(walk, 'contact.contactType');
                if (value == 'isLeader') {
                    $prefix += "Leader";
                } else {
                    $prefix += "Contact";
                }
                var value = this.getObjProperty(walk, 'contact.displayName');
                if (value !== null) {
                    out += " <strong>" + value + "</strong>";
                }
                var value = this.getObjProperty(walk, 'contact.email');
                if (value !== null) {
                    out += BR + value;
                }
                var value = this.getObjProperty(walk, 'contact.telephone1');
                if (value !== null) {
                    out += BR + value;
                }
                var value = this.getObjProperty(walk, 'contact.telephone2');
                if (value !== null) {
                    out += BR + value;
                }
                break;
            case "{contactname}":
                out = "";
                var value = this.getObjProperty(walk, 'contact.contactType');
                if (value == 'isLeader') {
                    $prefix += "Leader ";
                } else {
                    $prefix += "Contact ";
                }
                var value = this.getObjProperty(walk, 'contact.displayName');
                if (value !== null) {
                    out += " <strong>" + value + "</strong>";
                }
                break;
            case "{telephone}":
            case "{telephone1}":
                var value = this.getObjProperty(walk, 'contact.telephone1');
                if (value !== null) {
                    out += value;
                }
                break;
            case "{telephone2}":
                var value = this.getObjProperty(walk, 'contact.telephone2');
                if (value !== null) {
                    out += value;
                }
                break;
            case "{email}":
            case "{emailat}":
                var value = this.getObjProperty(walk, 'contact.telephone2');
                if (value !== null) {
                    out += value;
                }
                break;
            case "{XXemaillink}":
                if (walk.email !== "") {
                    out = getEmailLink(walk);
                }
                break;


            default:
                $option = $option.replace("{", "");
                out = $option.replace("}", "");
        }
        if (out !== "") {
            return  $prefix + out;
        }
        return "";
    };
    this.getPrefix = function ($option) {
        var $prefix = "";
        var $loop = true;
        do {
            switch ($option.substr(0, 2)) {
                case "{;":
                    $prefix += "<br/>";
                    $option = $option.replace("{;", "{");
                    break;
                case "{,":
                    $prefix += ", ";
                    $option = $option.replace("{,", "{");
                    break;
                case "{[":
                    var $close = $option.indexOf("]");
                    if ($close > 0) {
                        $prefix += $option.substr(2, close - 2);
                        $option = "{" + $option.substr(close + 1);
                    } else {
                        $prefix += $option;
                        $option = "{}";
                    }
                    break;
                default:
                    $loop = false;
            }
        } while ($loop);
        return [$prefix, $option];
    };
    this.addWalkLink = function (walk, $text, addlink, $class) {
        addlink = false;
        if (addlink) {
            return  "<span class='pointer " + $class + "' onclick=\"javascript:displayWalkID(" + walk.id + ")\">" + $text + "</span>";
        }
        return $text;
    }
};
/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function (val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len)
                    val = "0" + val;
                return val;
            };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date))
            throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
                d = date[_ + "Date"](),
                D = date[_ + "Day"](),
                m = date[_ + "Month"](),
                y = date[_ + "FullYear"](),
                H = date[_ + "Hours"](),
                M = date[_ + "Minutes"](),
                s = date[_ + "Seconds"](),
                L = date[_ + "Milliseconds"](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d: d,
                    dd: pad(d),
                    ddd: dF.i18n.dayNames[D],
                    dddd: dF.i18n.dayNames[D + 7],
                    m: m + 1,
                    mm: pad(m + 1),
                    mmm: dF.i18n.monthNames[m],
                    mmmm: dF.i18n.monthNames[m + 12],
                    yy: String(y).slice(2),
                    yyyy: y,
                    h: H % 12 || 12,
                    hh: pad(H % 12 || 12),
                    H: H,
                    HH: pad(H),
                    M: M,
                    MM: pad(M),
                    s: s,
                    ss: pad(s),
                    l: pad(L, 3),
                    L: pad(L > 99 ? Math.round(L / 10) : L),
                    t: H < 12 ? "a" : "p",
                    tt: H < 12 ? "am" : "pm",
                    T: H < 12 ? "A" : "P",
                    TT: H < 12 ? "AM" : "PM",
                    Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                    o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

