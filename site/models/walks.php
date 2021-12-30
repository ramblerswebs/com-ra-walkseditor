<?php

/**
 * @version    CVS: 0.0.1
 * @package    Com_Ra_walkseditor
 * @author     Chris Vaughan Derby & South Derbyshire Ramblers <webmaster@ramblers-webs.org.uk>
 * @copyright  2020 webmaster@ramblers-webs.org.uk
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use \Joomla\CMS\Factory;
use \Joomla\CMS\Language\Text;

jimport('joomla.application.component.modellist');

/**
 * Methods supporting a list of Ra_walkseditor records.
 *
 * @since  1.6
 */
class Ra_walkseditorModelWalks extends \Joomla\CMS\MVC\Model\ListModel
{
	/**
	 * Constructor.
	 *
	 * @param   array  $config  An optional associative array of configuration settings.
	 *
	 * @see        JController
	 * @since      1.6
	 */
	public function __construct($config = array())
	{
		if (empty($config['filter_fields']))
		{
			$config['filter_fields'] = array(
				'id', 'a.id',
				'ordering', 'a.ordering',
				'state', 'a.state',
				'created_by', 'a.created_by',
				'modified_by', 'a.modified_by',
				'date', 'a.date',
				'category', 'a.category',
				'content', 'a.content',
				'status', 'a.status',
			);
		}

		parent::__construct($config);
	}

        
        
	/**
	 * Method to auto-populate the model state.
	 *
	 * Note. Calling getState in this method will result in recursion.
	 *
	 * @param   string  $ordering   Elements order
	 * @param   string  $direction  Order direction
	 *
	 * @return void
	 *
	 * @throws Exception
	 *
	 * @since    1.6
	 */
	protected function populateState($ordering = null, $direction = null)
	{
		$app  = Factory::getApplication();
            
		$list = $app->getUserState($this->context . '.list');

		$ordering  = isset($list['filter_order'])     ? $list['filter_order']     : null;
		$direction = isset($list['filter_order_Dir']) ? $list['filter_order_Dir'] : null;
		if(empty($ordering)){
		$ordering = $app->getUserStateFromRequest($this->context . '.filter_order', 'filter_order', $app->get('filter_order'));
		if (!in_array($ordering, $this->filter_fields))
		{
		$ordering = 'category';
		}
		$this->setState('list.ordering', $ordering);
		}
		if(empty($direction))
		{
		$direction = $app->getUserStateFromRequest($this->context . '.filter_order_Dir', 'filter_order_Dir', $app->get('filter_order_Dir'));
		if (!in_array(strtoupper($direction), array('ASC', 'DESC', '')))
		{
		$direction = 'ASC';
		}
		$this->setState('list.direction', $direction);
		}

		$list['limit']     = $app->getUserStateFromRequest($this->context . '.list.limit', 'limit', $app->get('list_limit'), 'uint');
		$list['start']     = $app->input->getInt('start', 0);
		$list['ordering']  = $ordering;
		$list['direction'] = $direction;
                $list['limit']=10000;

		$app->setUserState($this->context . '.list', $list);
		$app->input->set('list', null);
           
            
        // List state information.

        parent::populateState($ordering, $direction);

        $context = $this->getUserStateFromRequest($this->context.'.filter.search', 'filter_search');
        $this->setState('filter.search', $context);

        $this->setState($this->context . 'id', $app->input->getInt('id', 0));

        // Split context into component and optional section
        $parts = FieldsHelper::extract($context);

        if ($parts)
        {
            $this->setState('filter.component', $parts[0]);
            $this->setState('filter.section', $parts[1]);
        }
	}

	/**
	 * Build an SQL query to load the list data.
	 *
	 * @return   JDatabaseQuery
	 *
	 * @since    1.6
	 */
	protected function getListQuery()
	{
            // Create a new query object.
            $db    = $this->getDbo();
            $query = $db->getQuery(true);

            // Select the required fields from the table.
            $query->select(
                        $this->getState(
                                'list.select', 'DISTINCT a.*'
                        )
                );

            $query->from('`#__ra_walkseditor_walks` AS a');
            
		// Join over the users for the checked out user.
		$query->select('uc.name AS uEditor');
		$query->join('LEFT', '#__users AS uc ON uc.id=a.checked_out');

		// Join over the created by field 'created_by'
		$query->join('LEFT', '#__users AS created_by ON created_by.id = a.created_by');

		// Join over the created by field 'modified_by'
		$query->join('LEFT', '#__users AS modified_by ON modified_by.id = a.modified_by');
            
		if (!Factory::getUser()->authorise('core.edit', 'com_ra_walkseditor'))
		{
			$query->where('a.state = 1');
		}
		else
		{
			$query->where('(a.state IN (0, 1))');
		}

            // Filter by search in title
            $search = $this->getState('filter.search');

            if (!empty($search))
            {
                if (stripos($search, 'id:') === 0)
                {
                    $query->where('a.id = ' . (int) substr($search, 3));
                }
                else
                {
                    $search = $db->Quote('%' . $db->escape($search, true) . '%');
                }
            }
            

		// Filtering date
		$filter_date_from = $this->state->get("filter.date.from");

		if ($filter_date_from !== null && !empty($filter_date_from))
		{
			$query->where("a.`date` >= '".$db->escape($filter_date_from)."'");
		}
		$filter_date_to = $this->state->get("filter.date.to");

		if ($filter_date_to !== null  && !empty($filter_date_to))
		{
			$query->where("a.`date` <= '".$db->escape($filter_date_to)."'");
		}

		// Filtering category
		$filter_category = $this->state->get("filter.category");

		if ($filter_category)
		{
			$query->where("a.`category` = '".$db->escape($filter_category)."'");
		}

		// Filtering status
		$filter_status = $this->state->get("filter.status");
		if ($filter_status != '') {
			$query->where("a.`status` = '".$db->escape($filter_status)."'");
		}

            $category = $this->state->get($this->context . 'id');
		if (!empty($category)) 
		{
			$query->where('a.category LIKE "%' . $category . '%"');
		}
            
            // Add the list ordering clause.
            $orderCol  = $this->state->get('list.ordering', 'category');
            $orderDirn = $this->state->get('list.direction', 'ASC');

            if ($orderCol && $orderDirn)
            {
                $query->order($db->escape($orderCol . ' ' . $orderDirn));
            }

            return $query;
	}

	/**
	 * Method to get an array of data items
	 *
	 * @return  mixed An array of data on success, false on failure.
	 */
	public function getItems()
	{
		$items = parent::getItems();
		
		foreach ($items as $item)
		{

		if (isset($item->category) && $item->category != '')
		{

			$db    = JFactory::getDbo();
			$query = $db->getQuery(true);

			$query
				->select($db->quoteName('title'))
				->from($db->quoteName('#__categories'))
				->where('FIND_IN_SET(' . $db->quoteName('id') . ', ' . $db->quote($item->category) . ')');

			$db->setQuery($query);

			$result = $db->loadColumn();

			$item->category_name = !empty($result) ? implode(', ', $result) : '';
		}

			$item->status = JText::_('COM_RA_WALKSEDITOR_WALKS_STATUS_OPTION_' . strtoupper($item->status));
		}

		return $items;
	}

	/**
	 * Overrides the default function to check Date fields format, identified by
	 * "_dateformat" suffix, and erases the field if it's not correct.
	 *
	 * @return void
	 */
	protected function loadFormData()
	{
		$app              = Factory::getApplication();
		$filters          = $app->getUserState($this->context . '.filter', array());
		$error_dateformat = false;

		foreach ($filters as $key => $value)
		{
			if (strpos($key, '_dateformat') && !empty($value) && $this->isValidDate($value) == null)
			{
				$filters[$key]    = '';
				$error_dateformat = true;
			}
		}

		if ($error_dateformat)
		{
			$app->enqueueMessage(Text::_("COM_RA_WALKSEDITOR_SEARCH_FILTER_DATE_FORMAT"), "warning");
			$app->setUserState($this->context . '.filter', $filters);
		}

		return parent::loadFormData();
	}

	/**
	 * Checks if a given date is valid and in a specified format (YYYY-MM-DD)
	 *
	 * @param   string  $date  Date to be checked
	 *
	 * @return bool
	 */
	private function isValidDate($date)
	{
		$date = str_replace('/', '-', $date);
		return (date_create($date)) ? Factory::getDate($date)->format("Y-m-d") : null;
	}
}
