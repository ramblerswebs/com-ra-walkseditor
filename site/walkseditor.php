<?php

/**
 * Description of RLeafletWalkseditor
 *
 * @author Chris Vaughan
 */
class Walkseditor extends RLeafletMap {

    public $fields = [];

    public function __construct() {
        parent::__construct();
    }

    public function editWalk($walkdate) {

        $this->defineScriptsandCss();

        //  $this->help_page = "https://maphelp.ramblers-webs.org.uk/draw-walking-route.html";

        $this->options->maptools = true;
        $this->options->mylocation = true;
        $this->options->rightclick = true;
        $this->options->fullscreen = true;
        $this->options->search = true;
        $this->options->locationsearch = true;
        $this->options->osgrid = true;
        $this->options->mouseposition = true;
        $this->options->postcodes = true;
        $this->options->fitbounds = true;
        $this->options->displayElevation = false;
        $this->options->cluster = false;
        $this->options->draw = false;
        $this->options->print = true;
        $this->options->ramblersPlaces = true;
        $this->options->controlcontainer = true;
        $this->data = new class {
            
        };
        $this->data->walkdate = $walkdate;
        $this->data->fields = $this->fields;
        parent::setCommand('ra.walkseditor.editwalk');
        parent::setDataObject($this->data);
        parent::display();
    }

    public function viewWalk() {

        $this->defineScriptsandCss();

        $this->options->maptools = true;
        $this->options->mylocation = true;
        $this->options->rightclick = true;
        $this->options->fullscreen = true;
        $this->options->search = true;
        $this->options->locationsearch = true;
        $this->options->osgrid = true;
        $this->options->mouseposition = true;
        $this->options->postcodes = true;
        $this->options->fitbounds = true;
        $this->options->displayElevation = false;
        $this->options->cluster = false;
        $this->options->draw = false;
        $this->options->print = true;
        $this->options->ramblersPlaces = true;
        $this->options->controlcontainer = true;
        $this->data = new class {
            
        };
        $this->data->fields = $this->fields;
        parent::setCommand('ra.walkseditor.viewwalk');
        parent::setDataObject($this->data);
        parent::display();
    }

    // view all walks
    public function viewAllWalks($data) {

        $this->defineScriptsandCss();

        $this->options->maptools = true;
        $this->options->mylocation = true;
        $this->options->rightclick = true;
        $this->options->fullscreen = true;
        $this->options->search = true;
        $this->options->locationsearch = true;
        $this->options->osgrid = true;
        $this->options->mouseposition = true;
        $this->options->postcodes = true;
        $this->options->fitbounds = true;
        $this->options->displayElevation = false;
        $this->options->cluster = false;
        $this->options->draw = false;
        $this->options->print = true;
        $this->options->ramblersPlaces = true;
        $this->options->controlcontainer = true;
        $this->options->calendar = true;
        $this->data = $data;
        parent::setCommand('ra.walks_editor.viewAllwalks');
        parent::setDataObject($this->data);
        parent::display();
    }

    public function editPlace() {
        //  $this->help_page = "https://maphelp.ramblers-webs.org.uk/draw-walking-route.html";
        $this->defineScriptsandCss();
        $this->options->fullscreen = true;
        $this->options->search = true;
        $this->options->locationsearch = true;
        $this->options->osgrid = true;
        $this->options->mouseposition = true;
        $this->options->postcodes = true;
        $this->options->fitbounds = false;
        $this->options->displayElevation = false;
        $this->options->cluster = false;
        $this->options->draw = false;
        $this->options->print = true;
        $this->options->ramblersPlaces = true;
        $this->options->controlcontainer = true;

        $this->data = new class {
            
        };
        $this->data->fields = $this->fields;
        parent::setCommand('ra.walkseditor.editplace');
        parent::setDataObject($this->data);
        parent::display();
    }

    public function editEvent() {
        //  $this->help_page = "https://maphelp.ramblers-webs.org.uk/draw-walking-route.html";
        $this->options->fullscreen = true;
        $this->options->search = true;
        $this->options->locationsearch = true;
        $this->options->osgrid = true;
        $this->options->mouseposition = true;
        $this->options->postcodes = true;
        $this->options->fitbounds = false;
        $this->options->displayElevation = false;
        $this->options->cluster = false;
        $this->options->draw = false;
        $this->options->print = true;
        $this->options->ramblersPlaces = true;
        $this->options->controlcontainer = true;
        //  $document = JFactory::getDocument();
        RLoad::addScript("libraries/ramblers/js/ramblerswalks.js", "text/javascript");
        $path = "media/com_ra_walkseditor/js/";
        RLoad::addScript($path . "loader.js", "text/javascript");
        RLoad::addScript($path . "clocklet.min.js", "text/javascript");
        RLoad::addStyleSheet($path . "clocklet.min.css", "text/css");
        RLoad::addScript($path . "tabs.js", "text/javascript");
        RLoad::addScript($path . "walkcontroller.js", "text/javascript");
        //    RLoad::addScript($path . "mapdisplay.js", "text/javascript");
        RLoad::addScript($path . "inputfields.js", "text/javascript");
        RLoad::addScript($path . "raGeneral.js", "text/javascript");
        RLoad::addScript($path . "walkeditor.js", "text/javascript");
        RLoad::addScript($path . "maplocation.js", "text/javascript");
        RLoad::addScript($path . "draftwalk.js", "text/javascript");
        RLoad::addScript($path . "viewAllWalks.js", "text/javascript");

        $path = "libraries/ramblers/js/";
        RLoad::addScript($path . "feedhandler.js", "text/javascript");

        $path = "media/com_ra_walkseditor/css/";
        RLoad::addStyleSheet($path . "style.css", "text/css");

        parent::addScriptsandStyles($this->options);
        parent::getOptionsScript();
        $optionstext = $this->options->text();

        $fields = json_encode($this->fields);
        $args = "'" . $fields . "'";
        echo "<script type='text/javascript'>" . PHP_EOL;
        echo parent::getMapInfo() . PHP_EOL;
        echo parent::getOptionsScript();
        echo "window.onload = function () {loadEditEvent(" . $args . ");};" . PHP_EOL;

        echo "</script>" . PHP_EOL;

        echo '<div id="js-outer-content"></div>';
        echo "<br/>";
    }

    public function viewEvent() {
        //  $this->help_page = "https://maphelp.ramblers-webs.org.uk/draw-walking-route.html";
        $this->options->fullscreen = true;
        $this->options->search = true;
        $this->options->locationsearch = true;
        $this->options->osgrid = true;
        $this->options->mouseposition = true;
        $this->options->postcodes = true;
        $this->options->fitbounds = false;
        $this->options->displayElevation = false;
        $this->options->cluster = false;
        $this->options->draw = false;
        $this->options->print = true;
        $this->options->ramblersPlaces = true;
        $this->options->controlcontainer = true;
        //  $document = JFactory::getDocument();
        RLoad::addScript("libraries/ramblers/js/ramblerswalks.js", "text/javascript");
        $path = "media/com_ra_walkseditor/js/";
        RLoad::addScript($path . "loader.js", "text/javascript");
        RLoad::addScript($path . "tabs.js", "text/javascript");
        RLoad::addScript($path . "walkcontroller.js", "text/javascript");
        //   RLoad::addScript($path . "mapdisplay.js", "text/javascript");
        RLoad::addScript($path . "inputfields.js", "text/javascript");
        RLoad::addScript($path . "raGeneral.js", "text/javascript");
        RLoad::addScript($path . "draftwalk.js", "text/javascript");

        $path = "media/com_ra_walkseditor/css/";
        RLoad::addStyleSheet($path . "style.css", "text/css");
        parent::addScriptsandStyles($this->options);

        $fields = json_encode($this->fields);
        $args = "'" . $fields . "'";
        echo "<script type='text/javascript'>" . PHP_EOL;
        echo parent::getMapInfo() . PHP_EOL;
        echo parent::getOptionsScript();
        echo "window.onload = function () {loadViewEvent(" . $args . ");};" . PHP_EOL;

        echo "</script>" . PHP_EOL;

        echo '<div id="js-outer-content"></div>';
        echo "<br/>";
    }

    private function defineScriptsandCss() {
        JHtml::_('jquery.framework');
        $document = JFactory::getDocument();
        RLoad::addScript("libraries/ramblers/js/feedhandler.js", "text/javascript");
        RLoad::addScript("libraries/ramblers/js/ra.js", "text/javascript");
        // Leaflet
        $document->addStyleSheet("libraries/ramblers/vendors/leaflet1.7.1/leaflet.css", "text/css");
        $document->addScript("libraries/ramblers/vendors/leaflet1.7.1/leaflet.js", "text/javascript");
        RLoad::addScript("libraries/ramblers/leaflet/ramblersleaflet.js", "text/javascript");
        RLoad::addStyleSheet("libraries/ramblers/leaflet/ramblersleaflet.css", "text/css");
        RLoad::addScript("libraries/ramblers/vendors/Leaflet.fullscreen-1.0.2/dist/Leaflet.fullscreen.min.js", "text/javascript");


        $document->addStyleSheet("libraries/ramblers/vendors/Leaflet.markercluster-1.4.1/dist/MarkerCluster.css", "text/css");
        $document->addStyleSheet("libraries/ramblers/vendors/Leaflet.markercluster-1.4.1/dist/MarkerCluster.Default.css", "text/css");
        $document->addScript("libraries/ramblers/vendors/Leaflet.markercluster-1.4.1/dist/leaflet.markercluster.js", "text/javascript");

        RLoad::addScript("libraries/ramblers/leaflet/L.Control.Mouse.js", "text/javascript");
        RLoad::addStyleSheet("libraries/ramblers/leaflet/L.Control.Mouse.css", "text/css");

        // grid ref to/from lat/long
        $document->addScript("libraries/ramblers/vendors/geodesy/vector3d.js", "text/javascript");
        $document->addScript("libraries/ramblers/vendors/geodesy/latlon-ellipsoidal.js", "text/javascript");
        $document->addScript("libraries/ramblers/vendors/geodesy/osgridref.js", "text/javascript");

        // Bing maps
        $document->addScript("libraries/ramblers/vendors/bing/bing.js", "text/javascript");

        $path = "libraries/ramblers/vendors/leaflet.browser.print-1/src/";
        $document->addScript($path . "leaflet.browser.print.js", "text/javascript");
        $document->addScript($path . "leaflet.browser.print.sizes.js", "text/javascript");
        $document->addScript($path . "leaflet.browser.print.utils.js", "text/javascript");

        RLoad::addScript("libraries/ramblers/js/ra.js", "text/javascript");
        RLoad::addScript("libraries/ramblers/js/raMap.js", "text/javascript");
        RLoad::addScript("libraries/ramblers/js/raWalk.js", "text/javascript");
        RLoad::addScript("libraries/ramblers/js/raLocation.js", "text/javascript");
        RLoad::addScript("libraries/ramblers/leaflet/ra-map-mylocation.js", "text/javascript");

        RLoad::addScript("libraries/ramblers/leaflet/ra-container.js", "text/javascript");

        RLoad::addStyleSheet("libraries/ramblers/jsonwalks/css/ramblerslibrary.css", "text/css");
        // tools

        RLoad::addStyleSheet("libraries/ramblers/leaflet/ra-map-tools.css", "text/css");
        RLoad::addScript("libraries/ramblers/leaflet/ra-map-tools.js", "text/javascript");
        RLoad::addScript("libraries/ramblers/js/feedhandler.js", "text/javascript");

        RLoad::addScript("libraries/ramblers/jsonwalks/std/display.js", "text/javascript");

        $document->addScript("libraries/ramblers/vendors/jplist-es6-master/dist/1.2.0/jplist.min.js", "text/javascript");

        RLoad::addScript("libraries/ramblers/js/ramblerswalks.js", "text/javascript");
        $path = "media/com_ra_walkseditor/";
        RLoad::addScript($path . "js/loader.js", "text/javascript");
        RLoad::addScript($path . "js/tabs.js", "text/javascript");
        RLoad::addScript($path . "js/walkcontroller.js", "text/javascript");
        //    RLoad::addScript($path . "js/mapdisplay.js", "text/javascript");
        RLoad::addScript($path . "js/inputfields.js", "text/javascript");
        RLoad::addScript($path . "js/raGeneral.js", "text/javascript");
        RLoad::addScript($path . "js/draftwalk.js", "text/javascript");
        RLoad::addScript($path . "js/clocklet.min.js", "text/javascript");
        RLoad::addStyleSheet($path . "js/clocklet.min.css", "text/css");
        RLoad::addScript($path . "js/viewAllWalks.js", "text/javascript");
        RLoad::addScript($path . "js/walkeditor.js", "text/javascript");
        RLoad::addScript($path . "js/placeEditor.js", "text/javascript");
        RLoad::addScript($path . "js/maplocation.js", "text/javascript");
        RLoad::addScript($path . "js/walksEditorHelps.js", "text/javascript");

        RLoad::addStyleSheet($path . "css/style.css", "text/css");
    }

}
