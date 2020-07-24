<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

use Joomla\CMS\Response\JsonResponse;

class Ra_walkseditorControllerContacts extends JControllerLegacy {

    public function execute($task) {
        try {
            $user = JFactory::getUser();
            if ($user->id == 0) {
                throw new Exception('User must be logged in to access data');
            }
            $search = JFactory::getApplication()->input->get('search');
            $search = strtolower($search);

            // Get a db connection.
            $db = JFactory::getDbo();

// Create a new query object.
            $query = $db->getQuery(true);
            $query->select($db->quoteName(array('contactname', 'displayname', 'email', 'telephone1', 'telephone2')));
            $query->from($db->quoteName('#__ra_walkseditor_contacts'));
            $query->where($db->quoteName('state') . ' = 1 ');
            $query->order('ordering ASC');

// Reset the query using our newly populated query object.
            $db->setQuery($query);

// Load the results as a list of stdClass objects (see later for more options on retrieving data).
            $results = $db->loadObjectList();

            // remove items from list if search field
            If ($search != "") {
                foreach ($results as $key => $result) {
                    $found = false;
                    if (strpos(strtolower($result->contactname), $search) !== false) {
                        $found = true;
                    }
                    if (strpos(strtolower($result->displayname), $search) !== false) {
                        $found = true;
                    }
                    if (!$found) {
                        unset($results[$key]);
                    }
                }
            }
            $results = array_values($results); // renumber array
            echo new JsonResponse($results);
        } catch (Exception $e) {
            echo new JsonResponse($e);
        }
    }

}
