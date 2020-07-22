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

use \Joomla\CMS\Categories\Categories;
/**
 * Content Component Category Tree
 *
 * @since  1.6
 */

class Ra_walkseditorWalksCategories extends Categories
{
	/**
	 * Class constructor
	 *
	 * @param   array  $options  Array of options
	 *
	 * @since   11.1
	 */
	public function __construct($options = array())
	{
		$options['table'] = '#__ra_walkseditor_walks';
		$options['extension'] = 'com_ra_walkseditor.walks';
		parent::__construct($options);
	}
}
class Ra_walkseditorWalksCategories extends Categories
{
	/**
	 * Class constructor
	 *
	 * @param   array  $options  Array of options
	 *
	 * @since   11.1
	 */
	public function __construct($options = array())
	{
		$options['table'] = '#__ra_walkseditor_events';
		$options['extension'] = 'com_ra_walkseditor.walks';
		parent::__construct($options);
	}
}
