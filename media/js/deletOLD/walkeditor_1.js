//var ramblers;
function walkeditor(walk) {
    this.walk = walk;

    this.addEditForm = function (editDiv) {
        // first clear any old form from div
        editDiv.innerHTML = "";
        var form = document.createElement('div'); // was form
        form.setAttribute('class', 'ra_container');
        form.setAttribute('id', 'ra_container');
        editDiv.appendChild(form);

        var input = new raInputFields;

        // Basics section

        var basicsDiv = document.createElement('details');
        basicsDiv.setAttribute('class', 'section basics');
        basicsDiv.setAttribute('open', true);
        form.appendChild(basicsDiv);

        input.addHeader(basicsDiv, "summary", "Basic Details");
        this.addBasics(basicsDiv);

        // Walks Section

        var walksDiv = document.createElement('details');
        walksDiv.setAttribute('class', 'section walk');
        walksDiv.setAttribute('open', true);
        form.appendChild(walksDiv);

        input.addHeader(walksDiv, "summary", "Walk");
        var walks = new raWalkItems(this.walk);
        walks.add(walksDiv, 'js-Walk', true);


        // Meeting type section

        var optionsDiv = document.createElement('details');
        optionsDiv.setAttribute('class', 'section meeting');
        optionsDiv.setAttribute('open', true);
        form.appendChild(optionsDiv);

        input.addHeader(optionsDiv, "summary", "Meeting");
        this.addMeetingType(optionsDiv);

        // Start Section

        var startDiv = document.createElement('details');
        startDiv.setAttribute('class', 'section start');
        startDiv.setAttribute('open', true);
        form.appendChild(startDiv);

        input.addHeader(startDiv, "summary", "Start");
        this.addStartType(startDiv);

        // Contacts Section

        var contactDiv = document.createElement('details');
        contactDiv.setAttribute('class', 'section ');
        contactDiv.setAttribute('open', true);
        form.appendChild(contactDiv);

        input.addHeader(contactDiv, "summary", "Contact");
        this.addContact(contactDiv);


        // Booking  section

        var bookingDiv = document.createElement('details');
        bookingDiv.setAttribute('class', 'section booking');
        form.appendChild(bookingDiv);

        input.addHeader(bookingDiv, "summary", "Booking");
        this.addBooking(bookingDiv);

        // Publicity  section

        var publicityDiv = document.createElement('details');
        publicityDiv.setAttribute('class', 'section publicity');
        form.appendChild(publicityDiv);

        input.addHeader(publicityDiv, "summary", "Sundries?");
        this.addPublicity(publicityDiv);

        // Editors notes

        var notesDiv = document.createElement('details');
        notesDiv.setAttribute('class', 'section notes');
        form.appendChild(notesDiv);

        input.addHeader(notesDiv, "summary", "Editor's Notes");
        this.addNotes(notesDiv);

    };


    this.addBasics = function (tag) {

        if (tag === null) {
            throw new Error("raWalkType container is null");
        }

        if (!this.walk.hasOwnProperty('basics')) {
            this.walk.basics = {};
        }
        var basics = this.walk.basics;
        var input = new raInputFields;
        var itemDiv = input.itemsItemDivs(tag);

        this._date = input.addDate(itemDiv, 'date', 'Date of walk', basics, 'date');
        this._title = input.addText(itemDiv, 'walktitle', "Title:", basics, 'title', 'Enter descriptive title of the walk');
        this._desc = input.addTextArea(itemDiv, 'desc', "Description:", 4, basics, 'description', 'Add a description of walk so walkers know what to expect');
        this._notes = input.addTextAreaSummary(itemDiv, 'notes', "Additional Notes:", 2, basics, 'notes');
        this._repeat = input.addDUMMYSummary(itemDiv, 'repeat', "Repeating Event:", 2, basics, 'repeat');
        this._repeat = input.addDUMMYSummary(itemDiv, 'images', "Photos/Images", 2, basics, 'images');

//     var options = {
//            public: "Public",
//            member: "Member Only",
//            print: "Print Only"
//        };
        //        this._restrictions = input.addSelect(itemDiv, 'moptions', 'Restrictions (viewable by) ', options, basics, 'restriction');

        return;

    };
    this.addMeetingType = function (tag) {

        if (tag === null) {
            throw new Error("raWalkType tag is null");
        }
        if (!this.walk.hasOwnProperty('meeting')) {
            this.walk.meeting = {};
        }
        var meeting = this.walk.meeting;
        var options = {
            undefined: "Please Select...",
            none: "We travel independently to the  start of the walk",
            car: "We can meet up and car share to start of walk",
            coach: 'We meet and catch a coach to the walk',
            public: 'We meet and use public transport to the walk (Bus, Tram, Train)'
        };
        var input = new raInputFields;
        this._option = input.addSelect(tag, 'moptions', 'How do you get to the walk? ', options, meeting, 'type');
        var _this = this;
        this._option.addEventListener("change", function () {
            //  var editor = new walkeditor(this.walk);
            _this.setMeetingType(this.value);
        });
        this._meetingsDiv = document.createElement('div');
        this._meetingsDiv.setAttribute('class', 'ra_meetings');
        this._meetingsDiv.setAttribute('id', 'ra_meetings');
        tag.appendChild(this._meetingsDiv);
        this.setMeetingType(this._option.value);

        return;
    };
    this.setMeetingType = function (type) {
        var tag = document.getElementById("ra_meetings");
        tag.innerHTML = "";
        // ramblers.walk.meeting = {};
        this.walk.meeting.type = type;
        var input = new raInputFields;
        switch (type) {
            case 'undefined':
                break;
            case 'none':
                //  input.addHeader(tag, "h3", "Meeting at start of walk");
                input.addHeader(tag, "p", "Walkers travel independently to start of walk.");
                break;
            case 'car':
                //  input.addHeader(tag, "h3", "Car Share to start of Walk");
                var items = new raWalkItems(this.walk);
                items.add(tag, 'js-CarShare', false);
                break;
            case 'coach':
                //   input.addHeader(tag, "h3", "Coach pick up locations");
                var items = new raWalkItems(this.walk);
                items.add(tag, 'js-Pickup', true);
                break;
            case 'public':
                //   input.addHeader(tag, "h3", "Public transport details");
                var items = new raWalkItems(this.walk);
                items.add(tag, 'js-PublicTrans', true);
                break;
            default:
                alert("Type error - please report this issue");
        }
    };

    this.addCarShare = function (tag) {

        if (tag === null) {
            throw new Error("js-CarShare container is null");
        }

        if (!this.walk.meeting.hasOwnProperty('locations')) {
            this.walk.meeting.locations = [];
        }
        var locations = this.walk.meeting.locations;

        var no = findItemNumber(tag);
        if (locations.length - 1 < no) {
            locations[no] = {};
        }
        var input = new raInputFields;
        this._time = input.addTime(tag, 'time', 'Meeting Time', locations[no], 'time');
        var itemsDiv = document.createElement('div');
        itemsDiv.setAttribute('class', 'location-group');
        tag.appendChild(itemsDiv);
        var location = new maplocation(itemsDiv, locations[no]);
        location.addLocation();
        //  this._info = input.addText(tag, 'locations', "Car Share Info:", locations[no], 'info');
        return;

    };
    this.addPickUp = function (tag) {

        if (tag === null) {
            throw new Error("raWalkType container is null");
        }
        if (!this.walk.meeting.hasOwnProperty('locations')) {
            this.walk.meeting.locations = [];
        }
        var locations = this.walk.meeting.locations;
        var no = findItemNumber(tag);
        if (locations.length - 1 < no) {
            locations[no] = {};
        }
        var input = new raInputFields;
        this._time = input.addTime(tag, 'time', 'Pickup Time', locations[no], 'time');
        var itemsDiv = document.createElement('div');
        itemsDiv.setAttribute('class', 'location-group');
        tag.appendChild(itemsDiv);
        var location = new maplocation(itemsDiv, locations[no]);
        location.addLocation();
        //      selectLocationItem(itemsDiv, locations, false);
        return;

    };

    this.addPublicTrans = function (tag) {

        if (tag === null) {
            throw new Error("raWalkType container is null");
        }
        if (!this.walk.meeting.hasOwnProperty('locations')) {
            this.walk.meeting.locations = [];
        }
        var locations = this.walk.meeting.locations;
        var no = findItemNumber(tag);
        if (locations.length - 1 < no) {
            locations[no] = {};
        }
        var input = new raInputFields;
        this._time = input.addTime(tag, 'time', 'Service Time: ', locations[no], 'time');
        this._servicename = input.addText(tag, 'name', "Service Name:", locations[no], 'servicename');
        var itemsDiv = document.createElement('div');
        itemsDiv.setAttribute('class', 'location-group');
        tag.appendChild(itemsDiv);
        var location = new maplocation(itemsDiv, locations[no]);
        location.addLocation();
        //    selectLocationItem(itemsDiv, locations, false);
        return;

    };
    this.addStartType = function (tag) {
        var startingsDiv;
        if (tag === null) {
            throw new Error("raWalkType tag is null");
        }
        var options = {
            undefined: "Please Select...",
            start: "Start location for the walk",
            area: "General area for walk"
        };
        if (!this.walk.hasOwnProperty('start')) {
            this.walk.start = {};
        }
        var start = this.walk.start;
        var input = new raInputFields;

        this._option = input.addSelect(tag, 'moptions', 'Publish: ', options, start, 'type');

        startingsDiv = document.createElement('div');
        startingsDiv.setAttribute('class', 'js-start');
        startingsDiv.setAttribute('id', 'js-start');
        tag.appendChild(startingsDiv);

        this.setStartTypeOption(this._option.value);
        var _this = this;
        this._option.addEventListener("change", function () {
            // var editor = new walkeditor(this.walk);
            _this.setStartTypeOption(this.value);
        });
        return;
    };

    this.setStartTypeOption = function (type) {
        var tag = document.getElementById("js-start");
        tag.innerHTML = "";
        this.walk.start.type = type;
        var input = new raInputFields;
        switch (type) {
            case 'undefined':
                break;
            case 'start':
                // input.addHeader(tag, "h3", "Details of the starting location");
                input.addHeader(tag, "p", "Walkers can travel independently to start of walk");
                var _this = this;
                // var editor = new walkeditor(this.walk);
                _this.addStart(tag);
                break;
            case 'area':
                //  input.addHeader(tag, "h3", "General area in which the walk will be held");
                input.addHeader(tag, "p", "Walkers, who wish to go to start of walk, will need to contact the walk organiser/contact");
                var _this = this;
                //var editor = new walkeditor(this.walk);
                _this.addArea(tag);
                break;
            default:
                alert("Starting Type error - please report this issue");
        }
    };

    this.addStart = function (tag) {

        if (tag === null) {
            throw new Error("raWalkType container is null");
        }
        if (!this.walk.start.hasOwnProperty('location')) {
            this.walk.start.location = {};
        }
        var location = this.walk.start.location;
        var input = new raInputFields;
        var itemDiv = input.itemsItemDivs(tag);
        this._time = input.addTime(itemDiv, 'time', 'Start Time', location, 'time');
        var itemsDiv2 = document.createElement('div');
        itemsDiv2.setAttribute('class', 'location-group');
        itemDiv.appendChild(itemsDiv2);
        var location = new maplocation(itemsDiv2, location);
        location.addLocation();
        //    selectLocationItem(itemsDiv2, location,true);
        //    this._returntime = input.addTime(itemDiv, 'returntime', 'Approx Return Time', data.walk.start, 'returntime');
    };


    this.addArea = function (tag) {

        if (tag === null) {
            throw new Error("raWalkType container is null");
        }
        if (!this.walk.start.hasOwnProperty('area')) {
            this.walk.start.area = {};
        }
        delete  this.walk.start.area.nearestpostcode;
        var startArea = this.walk.start.area;
        var input = new raInputFields;
        var itemDiv = input.itemsItemDivs(tag);
        var location = new maplocation(itemDiv, startArea, 'area');
        location.addLocation();
        //    this._returntime = input.addTime(itemDiv, 'returntime', 'Approx Return Time', data.walk.start, 'returntime');

    };
    this.addWalk = function (tag) {

        if (tag === null) {
            throw new Error("js-Walk container is null");
        }
        var mPace = {
            undefined: "Please Select...",
            slow: "Slow",
            medium: "Medium",
            fast: "Fast"
        };
        var mWalk = {
            circular: "Circular",
            linear: "Linear",
            figure: "Figure of Eight"
        };
        var mUnits = {
            undefined: "Please Select...",
            miles: "Miles",
            km: "Kilometres"
        };
        var mNatGrades = {
            undefined: "Please Select...",
            easyaccess: "Easy Access",
            easy: "Easy",
            leisurely: 'Leisurely',
            moderate: 'Moderate',
            strenuous: 'Strenuous',
            technical: 'Technical'
        };
        if (!this.walk.hasOwnProperty('walks')) {
            this.walk.walks = [];
        }
        var walks = this.walk.walks;
        var no = findItemNumber(tag);
        if (walks.length - 1 < no) {
            walks[no] = {};
        }
        var input = new raInputFields;
        this._dist = input.addNumber(tag, 'dist', "Distance:", walks[no], 'distance');
        this._dist.setAttribute('type', 'number');
        this._dist.setAttribute('min', 0);

        this._unit = input.addSelect(tag, 'distanceunits', 'Distance is in ', mUnits, walks[no], 'units');
        this._type = input.addSelect(tag, 'walktype', 'The walk is ', mWalk, walks[no], 'type');
        this._natgrade = input.addSelect(tag, 'natgrade', 'National Grade ', mNatGrades, walks[no], 'natgrade');

        var detailTags = input.addDetailsTag(tag);
        detailTags.summary.innerHTML = 'Additional details';
        this._localgrade = input.addLocalGradeSelect(detailTags.details, 'localgrade', "Local Grade:", walks[no], 'localgrade');
        this._pace = input.addText(detailTags.details, 'pace', 'Pace ', mPace, walks[no], 'pace');
        this._ascent = input.addText(detailTags.details, 'ascent', "Ascent:", walks[no], 'ascent');
        this._duration = input.addText(detailTags.details, 'duration', "Duration:", walks[no], 'duration');

    };

    this.addContact = function (tag) {

        if (tag === null) {
            throw new Error("raWalkType container is null");
        }
        var options = {
            undefined: "Please Select...",
            isLeader: "Yes they are the Leader",
            isNotLeader: "No - not the leader"
        };
        if (!this.walk.hasOwnProperty('contact')) {
            this.walk.contact = {};
        }
        var contact = this.walk.contact;
        var input = new raInputFields;
        var itemDiv = input.itemsItemDivs(tag);
        //  selectContactItem(itemDiv, contact);
        this._displayName = input.addText(itemDiv, 'name', "Display Name:", contact, 'displayName');
        this._email = input.addEmail(itemDiv, 'email', "Email Address:", contact, 'email');
        this._tel1 = input.addText(itemDiv, 'tel1', "Contact Telephone 1:", contact, 'telephone1');
        this._tel2 = input.addText(itemDiv, 'tel2', "Contact Telephone 2:", contact, 'telephone2');
        this._option = input.addSelect(itemDiv, 'moptions', 'Contact is walks Leader ', options, contact, 'contactType');
        //    input.addPredefinedContactButton(itemDiv, contact);
        return;
    };

    this.sortData = function () {
        var walk = this.walk;
        if (!walk.hasOwnProperty('meeting')) {
            walk.meeting = {};
        }
        if (!walk.meeting.hasOwnProperty('locations')) {
            walk.meeting.locations = [];
        }
        if (!walk.hasOwnProperty('walks')) {
            walk.walks = [];
        }
        walk.meeting.locations = walk.meeting.locations.sort(this.dynamicSort("time"));
        walk.walks = walk.walks.sort(this.dynamicSort("distance"));
    };

    this.dynamicSort = function (property) {
        return function (tag1, tag2) {
            var value1 = tag1[property];
            var value2 = tag2[property];
            var no1 = Number(value1);
            var no2 = Number(value2);
            if (isNaN(no1) || isNaN(no2))
            {
                return value1 > value2;
            } else {
                return no1 > no2;
            }
        };
    };
    this.addBooking = function (tag) {


        if (tag === null) {
            throw new Error("raWalkType container is null");
        }
        if (!this.walk.hasOwnProperty('booking')) {
            this.walk.booking = {};
        }
        var booking = this.walk.booking;
        var input = new raInputFields;
        var itemDiv = input.itemsItemDivs(tag);
        var comment = document.createElement('p');
        comment.textContent = 'Change this secition to whatever options we agree upon';
        itemDiv.appendChild(comment);
        return;

    };
    this.addPublicity = function (tag) {


        if (tag === null) {
            throw new Error("raWalkType container is null");
        }

        var suitablity = {child: 'Child friendly',
            dog: 'Dog friendly',
            nocar: 'No car needed',
            pushchair: 'Pushchair friendly',
            wheelchair: 'Wheelchair friendly'};
        var facilities = {parking: 'parking',
            toilet: 'toilet',
            refresh: 'refreshments',
            disabledToilets: 'disabled toilet'};
        var surroundings = {city: 'city', country: 'country', farmland: 'farmland'};
        var theme = {ad: 'adventure', hist: 'history', long: 'long distance path'};
        if (!this.walk.hasOwnProperty('publicity')) {
            this.walk.publicity = {};
        }
        var publicity = this.walk.publicity;
        var input = new raInputFields;
        var itemDiv = input.itemsItemDivs(tag);
        var comment = document.createElement('p');
        comment.textContent = 'Change this secition to whatever options we agree upon';
        itemDiv.appendChild(comment);
        input.addMultiChoice(itemDiv, 'surroundings', 'Surroundings', surroundings, publicity, 'surroundings');
        input.addMultiChoice(itemDiv, 'suitablity', 'Suitablity', suitablity, publicity, 'suitablity');
        input.addMultiChoice(itemDiv, 'facilities', 'facilities', suitablity, publicity, 'facilities');
        input.addMultiChoice(itemDiv, 'theme', 'theme', theme, publicity, 'theme');

        return;

    };
    this.addNotes = function (tag) {


        if (tag === null) {
            throw new Error("raWalkType container is null");
        }


        if (!this.walk.hasOwnProperty('notes')) {
            this.walk.notes = {};
        }
        var notes = this.walk.notes;
        var input = new raInputFields;
        var itemDiv = input.itemsItemDivs(tag);
        var comment = document.createElement('p');
        comment.textContent = 'Record any future changes that will be required or additional information required, before the walk can be published';
        itemDiv.appendChild(comment);
        this._comments = input.addTextArea(itemDiv, 'comments', "Editor Comments:", 4, notes, 'comments', 'Record any comments about future changes that are required');

        return;

    };
}
;
function raWalkItems(walk) {
    this.walk = walk;

    this.add = function (tag, itemName, many) {

        if (tag === null) {
            throw new Error("raWalkItems container is null");
        }

        var itemsDiv = document.createElement('div');
        itemsDiv.setAttribute('class', 'js-items');
        tag.appendChild(itemsDiv);

        if (many) {

            this._addItem = document.createElement('button');
            this._addItem.setAttribute('type', 'button');
            this._addItem.setAttribute('class', 'actionbutton right');
            this._addItem.setAttribute('data-object', itemName);
            this._addItem.textContent = "Add";
            this._addItem.ra = {};
            this._addItem.ra.walk = this.walk;
            tag.appendChild(this._addItem);
            this._addItem.addEventListener("click", this.addButton);
            this._sortItems = document.createElement('button');
            this._sortItems.setAttribute('type', 'button');
            this._sortItems.setAttribute('class', 'actionbutton right');
            this._sortItems.textContent = "Sort";
            this._sortItems.ra = {};
            this._sortItems.ra.walk = this.walk;
            tag.appendChild(this._sortItems);
            this._sortItems.addEventListener("click", function (e) {
                alert('sort');
                ramblers.controller.clickEditButton();
            });
            var p = document.createElement('div');
            p.style.height = "35px";
            tag.appendChild(p);
        }
        // add extra items if they are in the input already
        var howmany = 1;
        if (!this.walk.hasOwnProperty('walks')) {
            this.walk.walks = [];
        }
        if (!this.walk.meeting.hasOwnProperty('locations')) {
            this.walk.meeting.locations = [];
        }

        var arr = [];
        switch (itemName) {
            case 'js-Walk':
                arr = this.walk.walks;
                break;
            case 'js-CarShare':
                arr = this.walk.meeting.locations;
                break;
            case 'js-Pickup':
                arr = this.walk.meeting.locations;
                break;
            case 'js-PublicTrans':
                arr = this.walk.meeting.locations;
                break;
            default:
            // code block
        }
        howmany = arr.length;
        var i = 0;
        do {
            var itemDiv = document.createElement('div');
            itemDiv.setAttribute('class', 'js-item');
            itemsDiv.appendChild(itemDiv);
            this.addItem(itemDiv, itemName);
            i += 1;
        } while (i < howmany);
        return;

    };
    this.addItem = function (itemDiv, type) {
        this._deleteItem = document.createElement('button');
        this._deleteItem.setAttribute('type', 'button');
        this._deleteItem.setAttribute('class', 'actionbutton delete');
        this._deleteItem.setAttribute('data-object', type);
        this._deleteItem.textContent = "Delete";
        itemDiv.appendChild(this._deleteItem);
        switch (type) {
            case 'js-Walk':
                var editor = new walkeditor(this.walk);
                editor.addWalk(itemDiv);
                break;
            case 'js-CarShare':
                var editor = new walkeditor(this.walk);
                editor.addCarShare(itemDiv);
                break;
            case 'js-Pickup':
                var editor = new walkeditor(this.walk);
                editor.addPickUp(itemDiv);
                break;
            case 'js-PublicTrans':
                var editor = new walkeditor(this.walk);
                editor.addPublicTrans(itemDiv);
                break;
            default:
            // code block
        }


        this._deleteItem.addEventListener("click", this.deleteButton);
    };
    this.addButton = function () {
        var type = this.getAttribute("data-object");
        var itemsDiv = this.previousSibling;
        var itemDiv = document.createElement('div');
        itemDiv.setAttribute('class', 'js-item');
        itemsDiv.appendChild(itemDiv);
        var items = new raWalkItems(this.ra.walk);
        items.addItem(itemDiv, type);
    };
    this.deleteButton = function () {
        var tag = this;
        var no = findItemNumber(tag);
        var parent = this.parentNode;
        if (parent.className === "js-item") {
            parent.parentNode.removeChild(parent);
        } else {
            alert("Remove: Invalid parent node - please report issue");
        }
        //  remove item from walk object
        var type = tag.getAttribute("data-object");
        switch (type) {
            case 'js-Walk':
                delete  this.walk.walks[no];

                var arr = this.walk.walks.filter(function (val) {
                    return val;
                });
                this.walk.walks = arr;
                break;
            case 'js-Pickup':
                delete  this.walk.meeting.locations[no];
                var arr = this.walk.meeting.locations.filter(function (val) {
                    return val;
                });
                this.walk.meeting.locations = arr;
                break;
            case 'js-PublicTrans':
                delete  this.walk.meeting.locations[no];
                var arr = this.walk.meeting.locations.filter(function (val) {
                    return val;
                });
                this.walk.meeting.locations = arr;
                break;
            default:
                alert("Delete item program error");
        }
    };
}
;