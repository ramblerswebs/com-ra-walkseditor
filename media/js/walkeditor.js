var ra, mapLocationInput, window, document;
function walkeditor(walk) {
    this.walk = walk;

//    this.addAdmin = function () {
//        if (!this.walk.hasOwnProperty('admin')) {
//            var admin = {};
//            this.walk.admin = admin;
//            admin.version = '1.0';
//            admin.created = new Date();
//            admin.updated = null;
//            admin.cancelledReason='';
//        }
//    };
//
//    this.addAdmin();
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
        var walkItems = new raItems({
            editor: this,
            tag: walksDiv,
            many: true,
            dataClass: 'js-Walk',
            dataObject: this.walk,
            arrayProperty: 'walks',
            createFunction: this.addWalk,
            sortFunction: this.sortWalks
        });
        walkItems.display();

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
        contactDiv.setAttribute('class', 'section contact');
        contactDiv.setAttribute('open', true);
        form.appendChild(contactDiv);

        input.addHeader(contactDiv, "summary", "Contact");
        this.addContact(contactDiv);

        // Editors notes

        var notesDiv = document.createElement('details');
        notesDiv.setAttribute('class', 'section notes');
        form.appendChild(notesDiv);

        input.addHeader(notesDiv, "summary", "Editor's Notes", ra.walkseditor.help.editorNotes);
        this.addNotes(notesDiv);

        // add top button
        this.addScrollButton(form);

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

        this._date = input.addDate(itemDiv, 'date', 'Date of walk', basics, 'date', ra.walkseditor.help.basicDate);

        this._title = input.addText(itemDiv, 'walktitle', "Title:", basics, 'title', 'Enter descriptive title of the walk', ra.walkseditor.help.basicTitle);

        this._desc = input.addHtmlArea(itemDiv, 'desc', "Description:", 4, basics, 'description', 'Add a description of walk so walkers know what to expect', ra.walkseditor.help.basicDesc);

        this._notes = input.addTextAreaSummary(itemDiv, 'notes', "Additional Notes:", 2, basics, 'notes', '', ra.walkseditor.help.basicNotes);

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
        this._option = input.addSelect(tag, 'moptions', 'How do you get to the walk? ', options, meeting, 'type', ra.walkseditor.help.meetType);
        var _this = this;

        this._meetingsDiv = document.createElement('div');
        this._meetingsDiv.setAttribute('class', 'ra_meetings');
        tag.appendChild(this._meetingsDiv);
        this.setMeetingType(this._meetingsDiv, this._option.value);
        this._option.addEventListener("change", function () {
            _this.setMeetingType(_this._meetingsDiv, this.value, true);
        });
        return;
    };
    this.setMeetingType = function (tag, type, change = false) {
        //    var tag = document.getElementById("ra_meetings");
        tag.innerHTML = "";
        var meeting = this.walk.meeting;
        meeting.type = type;
        var input = new raInputFields;
        var options = {
            editor: this,
            tag: tag,
            many: true,
            dataClass: 'invalid',
            dataObject: this.walk.meeting,
            arrayProperty: 'locations',
            createFunction: this.addMeetingLocation,
            sortFunction: this.sortMeetingLocation
        };
        switch (type) {
            case 'undefined':
                if (change) {
                    meeting.locations = [];
                }
                break;
            case 'none':
                input.addHeader(tag, "p", "Walkers travel independently to start of walk.");
                if (change) {
                    meeting.locations = [];
                }
                break;
            case 'car':
                options.many = false;
                options.dataClass = 'js-CarShare';
                if (change) {
                    meeting.locations = [];
                    meeting.locations[0] = {};
                }
                var locations = new raItems(options);
                locations.display();
                break;
            case 'coach':
                options.dataClass = 'js-Pickup';
                if (change) {
                    meeting.locations = [];
                    meeting.locations[0] = {};
                }
                var locations = new raItems(options);
                locations.display();
                break;
            case 'public':
                options.dataClass = 'js-PublicTrans';
                if (change) {
                    meeting.locations = [];
                    meeting.locations[0] = {};
                }
                var locations = new raItems(options);
                locations.display();
                break;
            default:
                alert("Type error - please report this issue");
    }
    };
    this.addMeetingLocation = function (editor, tag, no) {

        var meeting = editor.walk.meeting;
        if (!meeting.hasOwnProperty('locations')) {
            meeting.locations = [];
        }
        var locations = meeting.locations;
        if (no === locations.length) {
            locations[no] = {};
        }

        var input = new raInputFields;
        this._time = input.addTime(tag, 'time', 'Meeting Time', locations[no], 'time', ra.walkseditor.help.meetTime);
        var itemsDiv = document.createElement('div');
        itemsDiv.setAttribute('class', 'location-group');
        tag.appendChild(itemsDiv);
        var location = new mapLocationInput(itemsDiv, locations[no], mapLocationInput.MEETING);
        location.addLocation();
        if (false) {
            input.addPredefinedLocationButton(itemsDiv, location, ra.walkseditor.help.meetPredefined);
            var _this = this;
            itemsDiv.addEventListener("predefinedLocation", function (e) {
                var item = e.raData.item;
                location.updateDetails(item);
                //  alert('predefinedLocation');
                _this.name.value = item.name;
                _this.gridref10.value = item.gridreference;
                _this.latitude.value = item.latitude;
                _this.longitude.value = item.longitude;
            });
        }

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

        this._option = input.addSelect(tag, 'moptions', 'Publish: ', options, start, 'type', ra.walkseditor.help.startType);

        startingsDiv = document.createElement('div');
        startingsDiv.setAttribute('class', 'js-start');
        startingsDiv.setAttribute('id', 'js-start');
        tag.appendChild(startingsDiv);

        this.setStartTypeOption(this._option.value);
        var _this = this;
        this._option.addEventListener("change", function () {
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
                input.addHeader(tag, "p", "Walkers can travel independently to start of walk");
                var _this = this;
                _this.addStart(tag);
                break;
            case 'area':
                input.addHeader(tag, "p", "Walkers, who wish to go to start of walk, will need to contact the walk organiser/contact");
                var _this = this;
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
        this._time = input.addTime(itemDiv, 'time', 'Start Time', location, 'time', ra.walkseditor.help.startTime);
        var itemsDiv2 = document.createElement('div');
        itemsDiv2.setAttribute('class', 'location-group');
        itemDiv.appendChild(itemsDiv2);
        var location = new mapLocationInput(itemsDiv2, location, mapLocationInput.START);
        location.addLocation();
    };


    this.addArea = function (tag) {

        if (tag === null) {
            throw new Error("raWalkType container is null");
        }
        if (!this.walk.start.hasOwnProperty('location')) {
            this.walk.start.location = {};
        }
        var location = this.walk.start.location;
        var input = new raInputFields;
        var itemDiv = input.itemsItemDivs(tag);
        this._time = input.addTime(itemDiv, 'time', 'Start Time (Optional)', location, 'time', ra.walkseditor.help.areaTime);
        var itemsDiv2 = document.createElement('div');
        itemsDiv2.setAttribute('class', 'location-group');
        itemDiv.appendChild(itemsDiv2);
        var location = new mapLocationInput(itemsDiv2, location, mapLocationInput.AREA);
        location.addLocation();
    };
    this.addWalk = function (editor, tag, no) {

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
            undefined: "Please Select...",
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
            'Easy Access': "Easy Access",
            'Easy': "Easy",
            'Leisurely': 'Leisurely',
            'Moderate': 'Moderate',
            'Strenuous': 'Strenuous',
            'Technical': 'Technical'
        };
        if (!editor.walk.hasOwnProperty('walks')) {
            editor.walk.walks = [];
        }
        var walks = editor.walk.walks;
        if (no === walks.length) {
            walks[no] = {};
        }

        var input = new raInputFields;
        editor._dist = input.addNumber(tag, 'dist', "Distance:", walks[no], 'distance', ra.walkseditor.help.walkDistance);
        editor._dist.setAttribute('type', 'number');
        editor._dist.setAttribute('min', 0);

        editor._unit = input.addSelect(tag, 'distanceunits', 'Distance is in ', mUnits, walks[no], 'units', ra.walkseditor.help.walkUnits);
        editor._type = input.addSelect(tag, 'walktype', 'The walk is ', mWalk, walks[no], 'type', ra.walkseditor.help.walkType);
        editor._natgrade = input.addSelect(tag, 'natgrade', 'National Grade ', mNatGrades, walks[no], 'natgrade', ra.walkseditor.help.walkNatGrade);

        var detailTags = input.addDetailsTag(tag);
        detailTags.summary.innerHTML = 'Additional details';
        editor._leader = input.addText(detailTags.details, 'leader', 'Walk Leader Name', walks[no], 'leader', 'Walk leader(s) if different from contact', ra.walkseditor.help.walkLeader);
        editor._localgrade = input.addLocalGradeSelect(detailTags.details, 'localgrade', "Local Grade:", walks[no], 'localgrade', ra.walkseditor.help.walkLocalGrade);
        editor._pace = input.addText(detailTags.details, 'pace', 'Pace ', mPace, walks[no], 'pace', ra.walkseditor.help.walkPace);
        editor._ascent = input.addText(detailTags.details, 'ascent', "Ascent:", walks[no], 'ascent', '', ra.walkseditor.help.walkAscent);
        editor._duration = input.addText(detailTags.details, 'duration', "Duration:", walks[no], 'duration', '', ra.walkseditor.help.walkDuration);

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
        this._displayName = input.addText(itemDiv, 'name', "Display Name:", contact, 'displayName', '', ra.walkseditor.help.contactName);
        this._email = input.addEmail(itemDiv, 'email', "Email Address:", contact, 'email', ra.walkseditor.help.contactEmail);
        this._tel1 = input.addText(itemDiv, 'tel1', "Contact Telephone 1:", contact, 'telephone1', '', ra.walkseditor.help.contactTel1);
        this._tel2 = input.addText(itemDiv, 'tel2', "Contact Telephone 2:", contact, 'telephone2', '', ra.walkseditor.help.contactTel2);
        this._option = input.addSelect(itemDiv, 'moptions', 'Contact is walks Leader ', options, contact, 'contactType', ra.walkseditor.help.contactType);
        input.addPredefinedContactButton(itemDiv, contact, ra.walkseditor.help.contactPredefined);
        var _this = this;
        itemDiv.addEventListener("predefinedContact", function (e) {
            var item = e.raData.item;
            _this._displayName.value = item.displayname;
            _this._email.value = item.email;
            _this._tel1.value = item.telephone1;
            _this._tel2.value = item.telephone2;
        });
        return;
    };
    this.addScrollButton = function (tag) {
        //   <button onclick="topFunction()" id="myBtn" title="Go to top">Top</button>
        var topButton = document.createElement('button');
        topButton.classList.add('topbutton');
        topButton.classList.add('link-button');
        topButton.classList.add('small');


        topButton.textContent = "Top";
        topButton.addEventListener("click", function (e) {
            //      document.body.scrollTop = 0;
            //      document.documentElement.scrollTop = 0;
            window.scrollTo(0, 250);
        });
        tag.appendChild(topButton);


// When the user scrolls down 20px from the top of the document, show the button
        window.onscroll = function () {
            scrollFunction();
        };

        function scrollFunction() {
            if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
                topButton.style.display = "block";
            } else {
                topButton.style.display = "none";
            }
        }

// When the user clicks on the button, scroll to the top of the document
        function topFunction() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
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
        if (notes.comments.length > 0) {
            tag.setAttribute('open', true);
        }
        return;

    };
}
;


function raItems(options) {
    this.options = options;
    if (options.tag === null) {
        throw new Error("raWalkItems container is null");
    }
    this.display = function ( ) {

        var tag = this.options.tag;
        var many = this.options.many;
        var itemName = this.options.dataClass;

        var itemsDiv = document.createElement('div');
        this.itemsDiv = itemsDiv;
        itemsDiv.setAttribute('class', 'js-items');
        tag.appendChild(itemsDiv);

        if (many) {
            this._addItem = document.createElement('button');
            this._addItem.setAttribute('type', 'button');
            this._addItem.setAttribute('class', 'actionbutton right');
            this._addItem.setAttribute('data-object', itemName);
            this._addItem.textContent = "Add";
            this._addItem.ra = {};
            //   this._addItem.ra.walk = this.walk;
            this._addItem.ra.raItems = this;
            tag.appendChild(this._addItem);
            this._addItem.addEventListener("click", this.addButton);
            this._sortItems = document.createElement('button');
            this._sortItems.setAttribute('type', 'button');
            this._sortItems.setAttribute('class', 'actionbutton right');
            this._sortItems.textContent = "Sort";
            this._sortItems.ra = {};
            //   this._sortItems.ra.walk = this.walk;
            this._addItem.ra.raItems = this;
            tag.appendChild(this._sortItems);
            this._sortItems.addEventListener("click", function (e) {
                alert('sort');
                //         ramblers.controller.clickEditButton();
            });
            var p = document.createElement('div');
            p.style.height = "35px";
            tag.appendChild(p);
        }
        // add extra items if they are in the input already
        var howmany;


        var arr = this.options.dataObject[this.options.arrayProperty];

        howmany = arr.length;
        var i = 0;
        do {
            this.addItem(itemsDiv, itemName, i);
            i += 1;
        } while (i < howmany);
        return;

    };
    this.addItem = function (itemsDiv, type, no) {
        var itemDiv = document.createElement('div');
        itemDiv.setAttribute('class', 'js-item');
        itemsDiv.appendChild(itemDiv);
        this._deleteItem = document.createElement('button');
        this._deleteItem.setAttribute('type', 'button');
        this._deleteItem.setAttribute('class', 'actionbutton delete');
        this._deleteItem.setAttribute('data-object', type);
        this._deleteItem.textContent = "Delete";
        this._deleteItem.ra = {};
        this._deleteItem.ra.raItems = this;
        this._deleteItem.ra.itemDiv = itemDiv;
        itemDiv.appendChild(this._deleteItem);
        this.options.createFunction(this.options.editor, itemDiv, no);
        this._deleteItem.addEventListener("click", this.deleteButton);
    };
    this.addButton = function () {
        var _raItems = this.ra.raItems;
        var itemsDiv = _raItems.itemsDiv;
        var itemName = _raItems.options.dataClass;
        var arr = _raItems.options.dataObject[_raItems.options.arrayProperty];
        var no = arr.length;
        _raItems.addItem(itemsDiv, itemName, no);

    };
    this.deleteButton = function () {
        var _raItems = this.ra.raItems;
        var options = _raItems.options;
        var itemDiv = this.ra.itemDiv;
        var itemsDiv = _raItems.itemsDiv;
        var no = _raItems.findNo(itemsDiv, itemDiv);
        // remove item from data object
        options.dataObject[options.arrayProperty] = _raItems.removeElement(options.dataObject[options.arrayProperty], no);
        // remove from web page
        itemsDiv.removeChild(itemDiv);
// no needs to be worked out from the possition of itenDiv in itemDivs
    };
    this.removeElement = function (array, no) {
        var newArray = [];
        var i;
        var l = array.length;
        for (i = 0; i < l; i++) {
            if (i !== no) {
                var item = array[i];
                newArray.push(item);
            }
        }
        return newArray;
    };
    this.findNo = function (itemsDiv, itemDiv) {
        var children = itemsDiv.children;
        var i;
        var l = children.length;
        for (i = 0; i < l; i++) {
            if (children[i] === itemDiv) {
                return i;
            }
        }
        return 0;
    };

}