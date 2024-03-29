<?php

/**
 * @version    CVS: 0.0.1
 * @package    Com_Ra_walkseditor
 * @author     Chris Vaughan Derby & South Derbyshire Ramblers <webmaster@ramblers-webs.org.uk>
 * @copyright  2020 webmaster@ramblers-webs.org.uk
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */
// No direct access
defined('_JEXEC') or die;

use \Joomla\CMS\Factory;
use \Joomla\CMS\Router\Route;
use \Joomla\CMS\Session\Session;
use \Joomla\CMS\Language\Text;

/**
 * Walk controller class.
 *
 * @since  1.6
 */
class Ra_walkseditorControllerWalkForm extends \Joomla\CMS\MVC\Controller\FormController {

    /**
     * Method to check out an item for editing and redirect to the edit form.
     *
     * @return void
     *
     * @since    1.6
     *
     * @throws Exception
     */
    public function edit($key = NULL, $urlVar = NULL) {
        $app = Factory::getApplication();

        // Get the previous edit id (if any) and the current edit id.
        $previousId = (int) $app->getUserState('com_ra_walkseditor.edit.walk.id');
        $editId = $app->input->getInt('id', 0);
        $copy = $app->input->getInt('copy', 0);
        $date = $app->input->getString('date', '');

        // Set the user id for the user to edit in the session.
        $app->setUserState('com_ra_walkseditor.edit.walk.id', $editId);
        $app->setUserState('com_ra_walkseditor.edit.walk.copy', $copy);
        $app->setUserState('com_ra_walkseditor.edit.walk.date', $date);
        // Get the model.
        $model = $this->getModel('WalkForm', 'Ra_walkseditorModel');

        // Check out the item
        if ($editId and!$copy) {
            $model->checkout($editId);
        }

        // Check in the previous user.
        if ($previousId) {
            $model->checkin($previousId);
        }

        // Redirect to the edit screen.
        $this->setRedirect(Route::_('index.php?option=com_ra_walkseditor&view=walkform&layout=edit', false));
    }

    /**
     * Method to save a user's profile data.
     *
     * @return void
     *
     * @throws Exception
     * @since  1.6
     */
    public function save($key = NULL, $urlVar = NULL) {
        // Check for request forgeries.
        Session::checkToken() or jexit(Text::_('JINVALID_TOKEN'));

        // Initialise variables.
        $app = Factory::getApplication();
        $model = $this->getModel('WalkForm', 'Ra_walkseditorModel');

        // Get the user data.
        $data = Factory::getApplication()->input->get('jform', array(), 'array');

        // Validate the posted data.
        $form = $model->getForm();

        if (!$form) {
            throw new Exception($model->getError(), 500);
        }

        // Validate the posted data.
        $data = $model->validate($form, $data);

        // Check for errors.
        if ($data === false) {
            // Get the validation messages.
            $errors = $model->getErrors();

            // Push up to three validation messages out to the user.
            for ($i = 0, $n = count($errors); $i < $n && $i < 3; $i++) {
                if ($errors[$i] instanceof Exception) {
                    $app->enqueueMessage($errors[$i]->getMessage(), 'warning');
                } else {
                    $app->enqueueMessage($errors[$i], 'warning');
                }
            }

            $input = $app->input;
            $jform = $input->get('jform', array(), 'ARRAY');

            // Save the data in the session.
            $app->setUserState('com_ra_walkseditor.edit.walk.data', $jform);

            // Redirect back to the edit screen.
            $id = (int) $app->getUserState('com_ra_walkseditor.edit.walk.id');
            $this->setRedirect(Route::_('index.php?option=com_ra_walkseditor&view=walkform&layout=edit&id=' . $id, false));

            $this->redirect();
        }

        // Attempt to save the data.
        $return = $model->save($data);

        // Check for errors.
        if ($return === false) {
            // Save the data in the session.
            $app->setUserState('com_ra_walkseditor.edit.walk.data', $data);

            // Redirect back to the edit screen.
            $id = (int) $app->getUserState('com_ra_walkseditor.edit.walk.id');
            $this->setMessage(Text::sprintf('Save failed', $model->getError()), 'warning');
            $this->setRedirect(Route::_('index.php?option=com_ra_walkseditor&view=walkform&layout=edit&id=' . $id, false));
        }

        // Check in the profile.
        if ($return) {
            $model->checkin($return);
        }

        // Clear the profile id from the session.
        $app->setUserState('com_ra_walkseditor.edit.walk.id', null);

        // Redirect to the list screen.
        $this->setMessage(Text::_('COM_RA_WALKSEDITOR_ITEM_SAVED_SUCCESSFULLY'));
        $menu = Factory::getApplication()->getMenu();
        $item = $menu->getActive();
        $url = (empty($item->link) ? 'index.php?option=com_ra_walkseditor&view=walks' : $item->link);
        $this->setRedirect(Route::_($url, false));

        // Flush the data from the session.
        $app->setUserState('com_ra_walkseditor.edit.walk.data', null);
        // changes to remove walks cache to enable walks to appear striaght away
        $status = $data['status'];
        if ($status == 'Published' or $status == 'Cancelled') {
            echo 'delete cache';
        }
    }

    /**
     * Method to abort current operation
     *
     * @return void
     *
     * @throws Exception
     */
    public function cancel($key = NULL) {
        $app = Factory::getApplication();

        // Get the current edit id.
        $editId = (int) $app->getUserState('com_ra_walkseditor.edit.walk.id');

        // Get the model.
        $model = $this->getModel('WalkForm', 'Ra_walkseditorModel');

        // Check in the item
        if ($editId) {
            $model->checkin($editId);
        }

        $menu = Factory::getApplication()->getMenu();
        $item = $menu->getActive();
        $url = (empty($item->link) ? 'index.php?option=com_ra_walkseditor&view=walks' : $item->link);
        $this->setRedirect(Route::_($url, false));
    }

    /**
     * Method to remove data
     *
     * @return void
     *
     * @throws Exception
     *
     * @since 1.6
     */
    public function remove() {
        $app = Factory::getApplication();
        $model = $this->getModel('WalkForm', 'Ra_walkseditorModel');
        $pk = $app->input->getInt('id');

        // Attempt to save the data
        try {
            $return = $model->delete($pk);

            // Check in the profile
            $model->checkin($return);

            // Clear the profile id from the session.
            $app->setUserState('com_ra_walkseditor.edit.walk.id', null);

            $menu = $app->getMenu();
            $item = $menu->getActive();
            $url = (empty($item->link) ? 'index.php?option=com_ra_walkseditor&view=walks' : $item->link);

            // Redirect to the list screen
            $this->setMessage(Text::_('COM_RA_WALKSEDITOR_ITEM_DELETED_SUCCESSFULLY'));
            $this->setRedirect(Route::_($url, false));

            // Flush the data from the session.
            $app->setUserState('com_ra_walkseditor.edit.walk.data', null);
        } catch (Exception $e) {
            $errorType = ($e->getCode() == '404') ? 'error' : 'warning';
            $this->setMessage($e->getMessage(), $errorType);
            $this->setRedirect('index.php?option=com_ra_walkseditor&view=walks');
        }
    }

}
