<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

use Joomla\CMS\Response\JsonResponse;

class Ra_walkseditorControllerWalks extends JControllerLegacy {

    public function execute($task) {
        try {
            $search = JFactory::getApplication()->input->get('search');
            $search = strtolower($search);

            // Get a db connection.
            $db = JFactory::getDbo();

// Create a new query object.
            $query = $db->getQuery(true);
            $query->select($db->quoteName(array('state', 'date', 'category', 'content')));
            $query->from($db->quoteName('#__ra_walkseditor_walks'));
            $query->where($db->quoteName('status') . " = " . "'Published'", 'OR');
            $query->where($db->quoteName('status') . " = " . "'Cancelled'");
            $query->order('ordering ASC');

// Reset the query using our newly populated query object.
            $db->setQuery($query);

// Load the results as a list of stdClass objects (see later for more options on retrieving data).
            $results = $db->loadObjectList();
            $walks = [];
            foreach ($results as $key => $result) {
                $walk = json_decode($result->content);
                $walks[] = $walk;
            }
            foreach ($walks as $walk) {
                if (!property_exists($walk->basics, 'notes')) {
                    $walk->basics->notes = '';
                }
                foreach ($walk->walks as $singleWalk) {
                    if (!property_exists($singleWalk, 'gradeLocal')) {
                        $singleWalk->gradeLocal = '';
                    }
                    if (!property_exists($singleWalk, 'pace')) {
                        $singleWalk->pace = '';
                    }
                    if (!property_exists($singleWalk, 'ascentMetres')) {
                        $singleWalk->ascentMetres = 0;
                    }
                    if (!property_exists($singleWalk, 'gradeLocal')) {
                        $singleWalk->gradeLocal = '';
                    }
                }
                if (!property_exists($walk->contact, 'email')) {
                    $walk->contact->email = '';
                }
                if (!property_exists($walk->contact, 'telephone1')) {
                    $walk->contact->telephone1 = '';
                }
                if (!property_exists($walk->contact, 'telephone2')) {
                    $walk->contact->telephone2 = '';
                }
                if (!property_exists($walk, 'notes')) {
                    unset($walk->notes);
                }
            }
            $response = new stdClass();
            $response->version = '1.0';
            $response->walks = $walks;

            //    $results = array_values($results); // renumber array
            echo new JsonResponse($response);
        } catch (Exception $e) {
            echo new JsonResponse($e);
        }
    }

}
