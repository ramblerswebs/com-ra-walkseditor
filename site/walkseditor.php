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

        //  $this->help_page = "https://maphelp.ramblers-webs.org.uk/draw-walking-route.html";

        $this->options->settings = true;
        $this->options->mylocation = true;
        $this->options->rightclick = true;
        $this->options->fullscreen = true;
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
        RWalkseditor::addScriptsandCss();
    }

    public function viewWalk() {
// is this used?
        $this->options->settings = true;
        $this->options->mylocation = true;
        $this->options->rightclick = true;
        $this->options->fullscreen = true;
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
        RWalkseditor::addScriptsandCss();
    }

    // view all walks
    public function viewAllWalks($data) {

        $this->options->settings = true;
        $this->options->mylocation = true;
        $this->options->rightclick = true;
        $this->options->fullscreen = true;
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
        parent::setCommand('ra.walkseditor.comp.viewAllwalks');
        parent::setDataObject($this->data);
        parent::display();
        $document = JFactory::getDocument();
        $document->addScript("media/lib_ramblers/vendors/jplist-es6-master/dist/1.2.0/jplist.min.js", "text/javascript");
        RWalkseditor::addScriptsandCss();
    }

    public function editPlace() {
        //  $this->help_page = "https://maphelp.ramblers-webs.org.uk/draw-walking-route.html";

        $this->options->fullscreen = true;
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
        RWalkseditor::addScriptsandCss();
    }

    public function editEvent() {
        //  $this->help_page = "https://maphelp.ramblers-webs.org.uk/draw-walking-route.html";
        $this->options->fullscreen = true;
        $this->options->mouseposition = true;
        $this->options->postcodes = true;
        $this->options->fitbounds = false;
        $this->options->displayElevation = false;
        $this->options->cluster = false;
        $this->options->draw = false;
        $this->options->print = true;
        $this->options->ramblersPlaces = true;
        $this->options->controlcontainer = true;
        $document = JFactory::getDocument();
        RLoad::addScript("media/lib_ramblers/js/ramblerswalks.js", "text/javascript");
        $path = "media/lib_ramblers/walkseditor/js/";
     //   RLoad::addScript($path . "loader.js", "text/javascript");
     //   RLoad::addScript($path . "clocklet.min.js", "text/javascript");
     //   RLoad::addStyleSheet($path . "clocklet.min.css", "text/css");
        //  RLoad::addScript($path . "tabs.js", "text/javascript");
        //   RLoad::addScript($path . "walkcontroller.js", "text/javascript");
        //    RLoad::addScript($path . "mapdisplay.js", "text/javascript");
        RLoad::addScript($path . "inputfields.js", "text/javascript");
        //  RLoad::addScript($path . "raGeneral.js", "text/javascript");
        RLoad::addScript($path . "walkeditor.js", "text/javascript");
        RLoad::addScript($path . "maplocation.js", "text/javascript");
        RLoad::addScript($path . "draftwalk.js", "text/javascript");
        RLoad::addScript($path . "viewAllWalks.js", "text/javascript");

        $path = "media/lib_ramblers/js/";
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
        //  RLoad::addScript($path . "tabs.js", "text/javascript");
        //  RLoad::addScript($path . "walkcontroller.js", "text/javascript");
        //   RLoad::addScript($path . "mapdisplay.js", "text/javascript");
        RLoad::addScript($path . "inputfields.js", "text/javascript");
        //  RLoad::addScript($path . "raGeneral.js", "text/javascript");
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

}