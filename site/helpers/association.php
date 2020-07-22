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

JLoader::register('ContentHelper', JPATH_ADMINISTRATOR . '/components/com_content/helpers/content.php');
JLoader::register('CategoryHelperAssociation', JPATH_ADMINISTRATOR . '/components/com_categories/helpers/association.php');

use \Joomla\CMS\Factory;

/**
 * Content Component Association Helper.
 *
 * @since  3.0
 */
class Ra_walkseditorHelperAssociation extends CategoryHelperAssociation
{
    /**
     * Method to get the associations for a given item
     *
     * @param   integer  $id    Id of the item
     * @param   string   $view  Name of the view
     *
     * @return  array   Array of associations for the item
     *
     * @since  3.0
     *
     * @throws Exception
     */
    public static function getAssociations($id = 0, $view = null)
    {
        jimport('helper.route', JPATH_COMPONENT_SITE);

        $app = Factory::getApplication();
        $jinput = $app->input;
        $view = is_null($view) ? $jinput->get('view') : $view;
        $id = empty($id) ? $jinput->getInt('id') : $id;

        if ($view == 'category' || $view == 'categories')
        {
            return self::getCategoryAssociations($id, 'com_ra_walkseditor');
        }

        return array();
    }
}
