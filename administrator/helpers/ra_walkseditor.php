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

/**
 * Ra_walkseditor helper.
 *
 * @since  1.6
 */
class Ra_walkseditorHelper
{
	/**
	 * Configure the Linkbar.
	 *
	 * @param   string  $vName  string
	 *
	 * @return void
	 */
	public static function addSubmenu($vName = '')
	{
		JHtmlSidebar::addEntry(
			JText::_('COM_RA_WALKSEDITOR_TITLE_WALKS'),
			'index.php?option=com_ra_walkseditor&view=walks',
			$vName == 'walks'
		);

		JHtmlSidebar::addEntry(
			JText::_('JCATEGORIES') . ' (' . JText::_('COM_RA_WALKSEDITOR_TITLE_WALKS') . ')',
			"index.php?option=com_categories&extension=com_ra_walkseditor.walks",
			$vName == 'categories.walks'
		);
		if ($vName=='categories') {
			JToolBarHelper::title('RA Walks Editor: JCATEGORIES (COM_RA_WALKSEDITOR_TITLE_WALKS)');
		}

JHtmlSidebar::addEntry(
			JText::_('COM_RA_WALKSEDITOR_TITLE_PLACES'),
			'index.php?option=com_ra_walkseditor&view=places',
			$vName == 'places'
		);

JHtmlSidebar::addEntry(
			JText::_('COM_RA_WALKSEDITOR_TITLE_CONTACTS'),
			'index.php?option=com_ra_walkseditor&view=contacts',
			$vName == 'contacts'
		);

JHtmlSidebar::addEntry(
			JText::_('COM_RA_WALKSEDITOR_TITLE_EVENTS'),
			'index.php?option=com_ra_walkseditor&view=events',
			$vName == 'events'
		);

		JHtmlSidebar::addEntry(
			JText::_('JCATEGORIES') . ' (' . JText::_('COM_RA_WALKSEDITOR_TITLE_EVENTS') . ')',
			"index.php?option=com_categories&extension=com_ra_walkseditor.events",
			$vName == 'categories.events'
		);
		if ($vName=='categories') {
			JToolBarHelper::title('RA Walks Editor: JCATEGORIES (COM_RA_WALKSEDITOR_TITLE_EVENTS)');
		}
		JHtmlSidebar::addEntry(
			JText::_('COM_RA_WALKSEDITOR_TITLE_GRADES'),
			'index.php?option=com_ra_walkseditor&view=grades',
			$vName == 'grades'
		);

		JHtmlSidebar::addEntry(
			JText::_('COM_RA_WALKSEDITOR_TITLE_IMPORTS'),
			'index.php?option=com_ra_walkseditor&view=imports',
			$vName == 'imports'
		);
		JHtmlSidebar::addEntry(
			JText::_('COM_RA_WALKSEDITOR_TITLE_EXPORTS'),
			'index.php?option=com_ra_walkseditor&view=exports',
			$vName == 'exports'
		);
	}

	/**
	 * Gets the files attached to an item
	 *
	 * @param   int     $pk     The item's id
	 *
	 * @param   string  $table  The table's name
	 *
	 * @param   string  $field  The field's name
	 *
	 * @return  array  The files
	 */
	public static function getFiles($pk, $table, $field)
	{
		$db = Factory::getDbo();
		$query = $db->getQuery(true);

		$query
			->select($field)
			->from($table)
			->where('id = ' . (int) $pk);

		$db->setQuery($query);

		return explode(',', $db->loadResult());
	}

	/**
	 * Gets a list of the actions that can be performed.
	 *
	 * @return    JObject
	 *
	 * @since    1.6
	 */
	public static function getActions()
	{
		$user   = Factory::getUser();
		$result = new JObject;

		$assetName = 'com_ra_walkseditor';

		$actions = array(
			'core.admin', 'core.manage', 'core.create', 'core.edit', 'core.edit.own', 'core.edit.state', 'core.delete'
		);

		foreach ($actions as $action)
		{
			$result->set($action, $user->authorise($action, $assetName));
		}

		return $result;
	}
}

