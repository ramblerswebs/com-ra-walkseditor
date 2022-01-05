var document, ra, FullCalendar;
if (typeof (ra) === "undefined") {
    ra = {};
}
if (typeof (ra.walks_editor) === "undefined") {
    ra.walks_editor = {};
}
ra.walks_editor.viewAllwalks = function (mapOptions, data) {
    this.data = data;
    this.mapOptions = mapOptions;
    this.settings = {
        currentDisplay: "Table",
        filter: {}
    };
    this.loggedOn = this.data.newUrl !== null;

    var i, clen, item;
    var items = this.data.items;
    for (i = 0, clen = items.length; i < clen; ++i) {
        item = items[i];
        //  try {
        var json = item.content;
        var status = item.status;
        var category = item.category_name;
        item.walk = new ra.draftWalk();
        item.walk.init(status, category, this.loggedOn);
        item.walk.createFromJson(json);
        var buttons = {
            delete: item.deleteUrl,
            edit: item.editUrl,
            duplicate: item.duplicateUrl
        };
        item.walk.setButtons(buttons);
        item.content = '';
    }
    // sort data into date order
    this.data.items.sort(function (a, b) {
        var da = a.walk.data.basics.date;
        var db = b.walk.data.basics.date;
        if (!ra.date.isValidString(da)) {
            da = '';
        }
        if (!ra.date.isValidString(db)) {
            db = '';
        }

        if (da < db) {
            return -1;
        }
        if (da > db) {
            return 1;
        }
        return 0;
    });
    this.masterdiv = document.getElementById(this.mapOptions.divId);
    this.jplistGroup = ra.uniqueID();
    this.myjplist = new ra.jplist(this.jplistGroup);
    this.tableColumns = [{name: 'Status'},
        {name: 'Date', sort: {type: 'date', colname: 'wDate'}},
        {name: 'Meeting'},
        {name: 'Start'},
        {name: 'Title', sort: {type: 'text', colname: 'wTitle'}},
        {name: 'Difficulty'},
        {name: 'Contact', sort: {type: 'text', colname: 'wContact'}}];

    this.load = function () {
        var tags = [
            {name: 'heading', parent: 'root', tag: 'h2'},
            {name: 'buttons', parent: 'root', tag: 'div', attrs: {class: 'alignRight'}},
            {name: 'walksFilter', parent: 'root', tag: 'div', attrs: {class: 'walksFilter'}},
            {name: 'container', parent: 'root', tag: 'div'},

            {name: 'table', parent: 'container', tag: 'table', attrs: {class: 'ra-tab-options'}},
            {name: 'row', parent: 'table', tag: 'tr'},
            {name: 'table', parent: 'row', tag: 'td', attrs: {class: 'ra-tab'}, textContent: 'Table'},
            {name: 'list', parent: 'row', tag: 'td', attrs: {class: 'ra-tab'}, textContent: 'List'},
            {name: 'map', parent: 'row', tag: 'td', attrs: {class: 'ra-tab'}, textContent: 'Map'},
            {name: 'calendar', parent: 'row', tag: 'td', attrs: {class: 'ra-tab'}, textContent: 'Calendar'},
            //          {name: 'issues', parent: 'row', tag: 'td', attrs: {class: 'ra-tab'}, textContent: 'Issues'},
            {name: 'gpxouter', parent: 'root', tag: 'div', attrs: {class: 'gpxouter'}},
            {name: 'diagnostics', parent: 'root', tag: 'div', attrs: {class: 'diagnostics'}}
        ];

        this.elements = ra.html.generateTags(this.masterdiv, tags);
        this.elements.heading.innerHTML = 'Display Draft Walks Programme';
        if (this.loggedOn) {
            this.addButton(this.elements.buttons, 'Create New Walk', this.data.newUrl);
        } else {
            var login = document.createElement('div');
            login.innerHTML = 'Log in to add/edit walks';
            this.elements.buttons.appendChild(login);
        }

        var self = this;

        this.elements.table.addEventListener("click", function () {
            self.removeRecordDisplay();
            self.ra_format("Table");
        });
        this.elements.list.addEventListener("click", function () {
            self.removeRecordDisplay();
            self.ra_format("List");
        });
        this.elements.map.addEventListener("click", function () {
            self.removeRecordDisplay();
            self.ra_format("Map");
        });
        this.elements.calendar.addEventListener("click", function () {
            self.removeRecordDisplay();
            self.ra_format("Calendar");
        });

        this.setFilters(this.data.items);
        self.ra_format(self.settings.currentDisplay);
        this.displayDiagnostics(this.elements.diagnostics);

        document.addEventListener("reDisplayWalks", function () {
            self.setWalkDisplay();
            self.removeRecordDisplay();
            self.ra_format(self.settings.currentDisplay);
        });
    };
    this.setWalkDisplay = function () {
        var items = this.data.items;
        var i;
        for (i = 0, clen = items.length; i < clen; ++i) {
            item = items[i];
            item.walk.setDisplayWalk(this.settings.filter);
        }
    };
    this.displayDiagnostics = function (tag) {
        if (this.loggedOn) {
            var details = document.createElement('details');
            tag.appendChild(details);
            var summary = document.createElement('summary');
            summary.textContent = "Diagnostics";
            details.appendChild(summary);
            var div = document.createElement('div');
            details.appendChild(div);
            div.innerHTML = "<pre>" + JSON.stringify(this.data.items, undefined, 4) + "</pre>";
        }
    };
    this.removeRecordDisplay = function () {
        this.elements.gpxouter.innerHTML = '';
    };
    this.ra_format = function (option) {
        this.settings.currentDisplay = option;
        //    this.elements.status.classList.remove('active');
        this.elements.table.classList.remove('active');
        this.elements.list.classList.remove('active');
        this.elements.map.classList.remove('active');
        this.elements.calendar.classList.remove('active');
        switch (option) {
            case "Table":
                this.elements.table.classList.add('active');
                this.displayTable(this.elements.gpxouter);
                break;
            case "List":
                this.elements.list.classList.add('active');
                this.displayList(this.elements.gpxouter);
                break;
            case "Map":
                this.elements.map.classList.add('active');
                this.displayMap(this.elements.gpxouter);
                break;
            case "Calendar":
                this.elements.calendar.classList.add('active');
                this.displayCalendar(this.elements.gpxouter);
                break;
        }
    };

    this.displayTable = function (tag) {
        var items = this.data.items;
        var i, clen, item;
        var comment = document.createElement('p');
        comment.innerHTML = "Click on walk to view details";

        var pagination = document.createElement('div');
        tag.appendChild(pagination);
        this.itemsPerPage = 10;
        var printButton = this.myjplist.addPagination(items.length, pagination, this.jplistGroup, this.itemsPerPage, false);

        var table = document.createElement('table');
        tag.appendChild(table);
        this.displayTableHeader(table);
        var tbody = document.createElement('tbody');
        table.appendChild(tbody);
        tbody.setAttribute('data-jplist-group', this.jplistGroup);
        var $class = "odd";
        for (i = 0, clen = items.length; i < clen; ++i) {
            item = items[i];
            if (item.walk.displayWalk) {
                this.displayWalkRow(this.tableColumns, tbody, item, $class);
                if ($class === 'odd') {
                    $class = 'even';
                } else {
                    $class = 'odd';
                }
            }
        }
        this.myjplist.init('something');
    };
    this.displayList = function (tag) {

        var items = this.data.items;
        var i, clen, item;
        var comment = document.createElement('p');
        comment.innerHTML = "Click on walk to view details";
        tag.appendChild(comment);
        var pagination = document.createElement('div');
        tag.appendChild(pagination);
        this.itemsPerPage = 10;
        var printButton = this.myjplist.addPagination(items.length, pagination, this.jplistGroup, this.itemsPerPage, false);

        var div = document.createElement('div');
        div.setAttribute('data-jplist-group', this.jplistGroup);
        tag.appendChild(div);
        var odd = true;
        for (i = 0, clen = items.length; i < clen; ++i) {
            item = items[i];
            if (item.walk.displayWalk) {
                var walkDiv = document.createElement('div');
                if (odd) {
                    walkDiv.classList.add("odd");
                } else {
                    walkDiv.classList.add("even");
                }

                walkDiv.setAttribute('data-jplist-item', '');

                var walk = item.walk;
                odd = !odd;
                walkDiv.classList.add("pointer");
                walkDiv.classList.add("draftwalk");
                walk.addDisplayClasses(walkDiv.classList);

                div.appendChild(walkDiv);
                var out = walk.getWalkDate('list') + ', ' +
                        walk.getWalkMeeting('list') + ', ' +
                        walk.getWalkStart('list') + ', ' +
                        walk.getWalkTitle() + ', ' +
                        walk.getWalkDifficulty('list') +
                        walk.getWalkContact('list');
                out += "<br/><div class='alignRight'>" + walk.getStatusCategory(' ', this.settings.noCategories) + "</div>";
                walkDiv.innerHTML = out;
                walkDiv.ra = {};
                walkDiv.ra.walk = walk;
                walkDiv.addEventListener('click', function () {
                    this.ra.walk.displayDetails();
                });
            }
        }
        this.myjplist.init('something');
    };

    this.displayMap = function (tag) {
        var tags = [
            {name: 'comments', parent: 'root', tag: 'div'},
            {name: 'mapped', parent: 'root', tag: 'div'}
        ];
        var mapTags = ra.html.generateTags(tag, tags);
        var comment = document.createElement('p');
        comment.innerHTML = "Walks without a start/walking area are plotted in North Seaa";
        mapTags.comments.appendChild(comment);
        var lmap = new leafletMap(mapTags.mapped, this.mapOptions);
        var map = lmap.map;
        //  var layer = L.featureGroup().addTo(map);
        var mycluster = new cluster(map);
        var items = this.data.items;
        var i, clen, item;
        for (i = 0, clen = items.length; i < clen; ++i) {
            item = items[i];
            if (item.walk.displayWalk) {
                var walk = item.walk;
                walk.getAsMarker(mycluster);
            }
        }
        mycluster.addClusterMarkers();
        mycluster.zoomAll();
    };

    this.displayCalendar = function (tag) {
        var tags = [
            {name: 'comments', parent: 'root', tag: 'div'},
            {name: 'dates', parent: 'root', tag: 'div'},
            {name: 'calendar', parent: 'dates', tag: 'div', attrs: {class: 'ra-tab'}}
        ];
        var mapTags = ra.html.generateTags(tag, tags);
        var comment = document.createElement('p');
        comment.innerHTML = "Walks without a date are displayed 'Today'";
        mapTags.comments.appendChild(comment);
        var comment2 = document.createElement('p');
        comment2.innerHTML = "Click on walk to edit details";
        mapTags.comments.appendChild(comment2);
        var comment3 = document.createElement('p');
        comment3.innerHTML = "Click on date to add walk for that date";
        mapTags.comments.appendChild(comment3);
        var events = this.getEvents();
        var _this = this;
        var calendar = new FullCalendar.Calendar(mapTags.calendar, {
            height: 'auto',
            selectable: true,
            displayEventTime: false,
            eventTextColor: '#000000',
            headerToolbar: {center: 'dayGridMonth,listMonth'}, // buttons for switching between views
            events: events,

            views: {
                dayGrid: {
                    eventTimeFormat: {
                        hour: '2-digit',
                        minute: '2-digit',
                        meridiem: false
                    }
                },
                timeGrid: {
                    // options apply to timeGridWeek and timeGridDay views
                },
                week: {
                    // options apply to dayGridWeek and timeGridWeek views
                },
                day: {
                    // options apply to dayGridDay and timeGridDay views
                }
            },
            eventClick: function (info) {
                var items = _this.data.items;
                var i, clen, item;
                for (i = 0, clen = items.length; i < clen; ++i) {
                    item = items[i];
                    if (item.id === info.event.id) {
                        item.walk.displayDetails();
                    }
                }
            },
            select: function (info) {
                var option;
                alert('check date is in the future');
                if (_this.data.newUrl !== null) {
                    if (_this.data.newUrl.includes('?')) { // allow for SEO
                        option = "&";
                    } else {
                        option = "?";
                    }
                    var url = _this.data.newUrl + option + "date=" + info.startStr.replaceAll("-", "%20");
                    window.location.replace(url);
                }
            }
        });
        calendar.render();
    };
    this.getEvents = function () {
        var events = [];
        var items = this.data.items;
        var i, clen, item;
        for (i = 0, clen = items.length; i < clen; ++i) {
            item = items[i];
            if (item.walk.displayWalk) {
                var walk = item.walk;
                var event = walk.getAsEvent();
                event.id = item.id;
                events.push(event);
            }
        }

        return events;
    };
    this.displayTableHeader = function (table) {
        var thead = document.createElement('thead');
        table.appendChild(thead);
        var tr = document.createElement('tr');
        thead.appendChild(tr);
        var index, len, col;
        for (index = 0, len = this.tableColumns.length; index < len; ++index) {
            col = this.tableColumns[index];
            var th = document.createElement('th');
            th.innerHTML = col.name;
            if (typeof (col.sort) !== "undefined") {
                // this.myjplist.sortButton(th, col.sort.colname, col.sort.type, "asc", "▲");
                // this.myjplist.sortButton(th, col.sort.colname, col.sort.type, "desc", "▼");
            }
            tr.appendChild(th);
        }
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
        return button;
    };
    this.displayWalkRow = function (columns, table, item, $class) {
        var walk = item.walk;
        var tr = document.createElement('tr');
        tr.setAttribute('data-jplist-item', '');
        walk.addDisplayClasses(tr.classList);

        tr.classList.add($class);
        table.appendChild(tr);
        var index, len, col;
        for (index = 0, len = columns.length; index < len; ++index) {
            col = columns[index];
            var td = document.createElement('td');
            td.innerHTML = this.tableValue(walk, col.name);
            if (typeof (col.sort) !== "undefined") {
                //  td.setAttribute('class', col.sort.colname);
            }
            td.classList.add('pointer');
            td.addEventListener('click', function () {
                walk.displayDetails();
            });

            tr.appendChild(td);
        }

    };

    this.tableValue = function (walk, name) {
        switch (name) {
            case "State":
                return   walk.getWalkStatus();
                break;
            case "Category":
                return   walk.getWalkCategory();
                break;
            case "Date":
                return   walk.getWalkDate('table');
                break;
            case "Meeting":
                return  walk.getWalkMeeting('table');
                break;
            case "Start":
                return  walk.getWalkStart('table');
                break;
            case "Title":
                return walk.getWalkTitle();
                break;
            case "Difficulty":
                return walk.getWalkDifficulty('table');
                break;
            case "Issues":
                return walk.getNoWalkIssues();
                break;
            case "Messages":
                return walk.getWalkMessages('summary');
                break;
            case "Contact":
                return  walk.getWalkContact('table');
                break;
            case "Notes":
                return  walk.getWalkNotes('table');
                break;
            case "Status":
                return  walk.getStatusCategory('<br/>', this.settings.noCategories);
                break;
        }
        return 'unknown';
    };
//    this.displayWalk = function ($walk) {
//        var $display = true;
//        switch ($walk.dayofweek) {
//            case "Monday":
//                $display = this.settings.filter.RA_DayOfWeek_0;
//                this.resetDisplay("RA_DayOfWeek_0");
//                break;
//            case "Tuesday":
//                $display = this.settings.filter.RA_DayOfWeek_1;
//                this.resetDisplay("RA_DayOfWeek_1");
//                break;
//            case "Wednesday":
//                $display = this.settings.filter.RA_DayOfWeek_2;
//                this.resetDisplay("RA_DayOfWeek_2");
//                break;
//            case "Thursday":
//                $display = this.settings.filter.RA_DayOfWeek_3;
//                this.resetDisplay("RA_DayOfWeek_3");
//                break;
//            case "Friday":
//                $display = this.settings.filter.RA_DayOfWeek_4;
//                this.resetDisplay("RA_DayOfWeek_4");
//                break;
//            case "Saturday":
//                $display = this.settings.filter.RA_DayOfWeek_5;
//                this.resetDisplay("RA_DayOfWeek_5");
//                break;
//            case "Sunday":
//                $display = this.settings.filter.RA_DayOfWeek_6;
//                this.resetDisplay("RA_DayOfWeek_6");
//                break;
//            default:
//                break;
//        }
//        if (!$display) {
//            return false;
//        }
//        switch ($walk.nationalGrade) {
//            case "Easy Access":
//                $display = this.settings.filter.RA_Diff_ea;
//                this.resetDisplay("RA_Diff_ea");
//                break;
//            case "Easy":
//                $display = this.settings.filter.RA_Diff_e;
//                this.resetDisplay("RA_Diff_e");
//                break;
//            case "Leisurely":
//                $display = this.settings.filter.RA_Diff_l;
//                this.resetDisplay("RA_Diff_l");
//                break;
//            case "Moderate":
//                $display = this.settings.filter.RA_Diff_m;
//                this.resetDisplay("RA_Diff_m");
//                break;
//            case "Strenuous":
//                $display = this.settings.filter.RA_Diff_s;
//                this.resetDisplay("RA_Diff_s");
//                break;
//            case "Technical":
//                $display = this.settings.filter.RA_Diff_t;
//                this.resetDisplay("RA_Diff_t");
//                break;
//            default:
//                break;
//        }
//        if (!$display) {
//            return false;
//        }
//        var dist = Math.ceil($walk.distanceMiles);
//        switch (dist) {
//            case 0:
//            case 1:
//            case 2:
//            case 3:
//                $display = this.settings.filter.RA_Dist_0;
//                this.resetDisplay("RA_Dist_0");
//                break;
//            case 4:
//            case 5:
//                $display = this.settings.filter.RA_Dist_1;
//                this.resetDisplay("RA_Dist_1");
//                break;
//            case 6:
//            case 7:
//            case 8:
//                $display = this.settings.filter.RA_Dist_2;
//                this.resetDisplay("RA_Dist_2");
//                break;
//            case 9:
//            case 10:
//                $display = this.settings.filter.RA_Dist_3;
//                this.resetDisplay("RA_Dist_3");
//                break;
//            case 11:
//            case 12:
//            case 13:
//                $display = this.settings.filter.RA_Dist_4;
//                this.resetDisplay("RA_Dist_4");
//                break;
//            case 14:
//            case 15:
//                $display = this.settings.filter.RA_Dist_5;
//                this.resetDisplay("RA_Dist_5");
//                break;
//            default:
//                $display = this.settings.filter.RA_Dist_6;
//                this.resetDisplay("RA_Dist_6");
//                break;
//        }
//        if (!$display) {
//            return false;
//        }
//        $display = this.settings.filter[$walk.groupCode];
//        if (!$display) {
//            return false;
//        }
//        var d1 = $walk.walkDate.substring(0, 10);
//        var d = this.settings.filter["RA_DateStart"];
//        if (d !== "") {
//            $display = d1 >= d;
//        }
//        if (!$display) {
//            return false;
//        }
//        var d = this.settings.filter["RA_DateEnd"];
//        if (d !== "") {
//            $display = d1 <= d;
//        }
//        if (this.settings.filter.updated > 0) {
//            $display = $walk.updatedDays < this.settings.filter.updated;
//        }
//        if (!$display) {
//            return false;
//        }
//        
//
//        return $display;
//    };

    this.setFilters = function (items) {
        if (items.length === 0) {
            return;
        }
        var filter = new ra.filter(this.settings.filter);
        var result = this.getWalksStats(items);
        filter.setFilterGroup(result.status);
        filter.setFilterGroup(result.category);
        filter.setFilterGroup(result.issues);
        filter.setFilterGroup(result.editorNotes);
        filter.setFilterGroup(result.dates, true);
        filter.setFilterGroup(result.timeSpan);
        filter.setFilterGroup(result.dow);
        filter.setFilterGroup(result.dateSet);

        var tag = this.elements.walksFilter;
        if (tag !== null) {
            filter.addOpenClose(tag, "Filter");
            var div = document.createElement('div');
            div.setAttribute('class', 'filter-columns');
            div.style.display = "none";
            tag.appendChild(div);
            filter.addFilter(div, 'Status', result.status);
            filter.addFilter(div, 'Category', result.category);
            filter.addFilter(div, 'Issues', result.issues);
            filter.addFilter(div, 'Dates', result.dates, true, true);
            filter.addFilter(div, 'Past/Future', result.timeSpan);
             filter.addFilter(div, 'Date Set', result.dateSet);
            filter.addFilter(div, 'Day of the Week', result.dow);
            filter.addFilter(div, 'Editor notes', result.editorNotes);

        }
    };
    this.getWalksStats = function (items) {
        var result = {
            status: {},
            category: {},
            issues: {None: {no: 0, name: 'No Issues', id: 'RA_NoIssues'},
                Has: {no: 0, name: 'Issues', id: 'RA_Issues'}},
            dateSet: {Set: {no: 0, name: 'Set', id: 'RA_DateSet'},
                NotSet: {no: 0, name: 'Not Set ', id: 'RA_DateNotSet'}},
            dates: {min: {no: '9999-99-99', name: 'Start', id: 'RA_DateStart'},
                max: {no: '0000-00-00', name: 'End ', id: 'RA_DateEnd'}},
            timeSpan: {past: {no: 0, name: 'Past', id: 'RA_DatePast'},
                future: {no: 0, name: 'Future', id: 'RA_DateFuture'}},
            dow: {Monday: {no: 0, name: 'Monday', id: 'RA_DayOfWeek_0'},
                Tuesday: {no: 0, name: 'Tuesday', id: 'RA_DayOfWeek_1'},
                Wednesday: {no: 0, name: 'Wednesday', id: 'RA_DayOfWeek_2'},
                Thursday: {no: 0, name: 'Thursday', id: 'RA_DayOfWeek_3'},
                Friday: {no: 0, name: 'Friday', id: 'RA_DayOfWeek_4'},
                Saturday: {no: 0, name: 'Saturday', id: 'RA_DayOfWeek_5'},
                Sunday: {no: 0, name: 'Sunday', id: 'RA_DayOfWeek_6'}},
            editorNotes: {None: {no: 0, name: 'No notes', id: 'RA_NoNotes'},
                Has: {no: 0, name: 'Has notes', id: 'RA_Notes'}}

        };
        var i, len;
        var walk, yyyymmdd;
        len = items.length;


        for (i = 0, len = items.length; i < len; ++i) {
            walk = items[i].walk.data;
            var status = items[i].status;
            if (!result.status.hasOwnProperty(status)) {
                result.status[status] = {no: 0};
                result.status[status].name = status;
                result.status[status].id = 'RA_Status_' + status;
            }
            result.status[status].no += 1;

            var category = items[i].category_name;
            if (!result.category.hasOwnProperty(category)) {
                result.category[category] = {no: 0};
                result.category[category].name = category;
                result.category[category].id = 'RA_Category_' + category;
            }
            result.category[category].no += 1;

            var basics = walk.basics;
            var today=new Date().toISOString().slice(0, 10);
            if (basics.hasOwnProperty('date')) {
                var dayofweek = ra.date.dow(basics.date);
                result.dow[dayofweek].no += 1;
                result.dateSet.Set.no += 1;
                yyyymmdd = ra.date.YYYYMMDD(basics.date);
                if (yyyymmdd < result.dates.min.no) {
                    result.dates.min.no = yyyymmdd;
                }
                if (yyyymmdd > result.dates.max.no) {
                    result.dates.max.no = yyyymmdd;
                }
                if (yyyymmdd>today){
                     result.timeSpan.future.no+=1;
                }else{
                    result.timeSpan.past.no+=1;
                }
                
              
            } else {
                result.dateSet.NotSet.no += 1;
                            }
            var no = items[i].walk.getNoWalkIssues();
            if (no === 0) {
                result.issues.None.no += 1;
            } else {
                result.issues.Has.no += 1;
            }

            if (items[i].walk.hasEditorNotes()) {
                result.editorNotes.Has.no += 1;
            } else {
                result.editorNotes.None.no += 1;
            }

        }
        this.settings.noCategories = Object.keys(result.category).length;
        return result;
    };
};