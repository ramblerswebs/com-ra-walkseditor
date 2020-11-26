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

use Joomla\CMS\Component\Router\RouterViewConfiguration;
use Joomla\CMS\Component\Router\RouterView;
use Joomla\CMS\Component\Router\Rules\StandardRules;
use Joomla\CMS\Component\Router\Rules\NomenuRules;
use Joomla\CMS\Component\Router\Rules\MenuRules;
use Joomla\CMS\Factory;
use Joomla\CMS\Categories\Categories;

/**
 * Class Ra_walkseditorRouter
 *
 */
class Ra_walkseditorRouter extends RouterView
{
	private $noIDs;
	public function __construct($app = null, $menu = null)
	{
		$params = Factory::getApplication()->getParams('com_ra_walkseditor');
		$this->noIDs = (bool) $params->get('sef_ids');
		
		$walks = new RouterViewConfiguration('walks');
		$walks->setKey('id')->setNestable();
		$this->registerView($walks);
			$walk = new RouterViewConfiguration('walk');
			$walk->setKey('id')->setParent($walks, 'catid');
			$this->registerView($walk);
			$walkform = new RouterViewConfiguration('walkform');
			$walkform->setKey('id');
			$this->registerView($walkform);$places = new RouterViewConfiguration('places');
		$this->registerView($places);
			$place = new RouterViewConfiguration('place');
			$place->setKey('id')->setParent($places);
			$this->registerView($place);
			$placeform = new RouterViewConfiguration('placeform');
			$placeform->setKey('id');
			$this->registerView($placeform);$contacts = new RouterViewConfiguration('contacts');
		$this->registerView($contacts);
			$contact = new RouterViewConfiguration('contact');
			$contact->setKey('id')->setParent($contacts);
			$this->registerView($contact);
			$contactform = new RouterViewConfiguration('contactform');
			$contactform->setKey('id');
			$this->registerView($contactform);$events = new RouterViewConfiguration('events');
		$events->setKey('id')->setNestable();
		$this->registerView($events);
			$event = new RouterViewConfiguration('event');
			$event->setKey('id')->setParent($events, 'catid');
			$this->registerView($event);
			$eventform = new RouterViewConfiguration('eventform');
			$eventform->setKey('id');
			$this->registerView($eventform);
		$grades = new RouterViewConfiguration('grades');
			$this->registerView($grades);
			$gradeform = new RouterViewConfiguration('gradeform');
			$gradeform->setKey('id');
			$this->registerView($gradeform);


		parent::__construct($app, $menu);

		$this->attachRule(new MenuRules($this));

		if ($params->get('sef_advanced', 0))
		{
			$this->attachRule(new StandardRules($this));
			$this->attachRule(new NomenuRules($this));
		}
		else
		{
			JLoader::register('Ra_walkseditorRulesLegacy', __DIR__ . '/helpers/legacyrouter.php');
			JLoader::register('Ra_walkseditorHelpersRa_walkseditor', __DIR__ . '/helpers/ra_walkseditor.php');
			$this->attachRule(new Ra_walkseditorRulesLegacy($this));
		}
	}


	
			/**
			 * Method to get the segment(s) for a category
			 *
			 * @param   string  $id     ID of the category to retrieve the segments for
			 * @param   array   $query  The request that is built right now
			 *
			 * @return  array|string  The segments of this item
			 */
			public function getWalksSegment($id, $query)
			{
				$category = Categories::getInstance('ra_walkseditor.walks')->get($id);

				if ($category)
				{
					$path = array_reverse($category->getPath(), true);
					$path[0] = '1:root';

					if ($this->noIDs)
					{
						foreach ($path as &$segment)
						{
							list($id, $segment) = explode(':', $segment, 2);
						}
					}

					return $path;
				}

				return array();
			}
		/**
		 * Method to get the segment(s) for an walk
		 *
		 * @param   string  $id     ID of the walk to retrieve the segments for
		 * @param   array   $query  The request that is built right now
		 *
		 * @return  array|string  The segments of this item
		 */
		public function getWalkSegment($id, $query)
		{
			return array((int) $id => $id);
		}
			/**
			 * Method to get the segment(s) for an walkform
			 *
			 * @param   string  $id     ID of the walkform to retrieve the segments for
			 * @param   array   $query  The request that is built right now
			 *
			 * @return  array|string  The segments of this item
			 */
			public function getWalkformSegment($id, $query)
			{
				return $this->getWalkSegment($id, $query);
			}
		/**
		 * Method to get the segment(s) for an place
		 *
		 * @param   string  $id     ID of the place to retrieve the segments for
		 * @param   array   $query  The request that is built right now
		 *
		 * @return  array|string  The segments of this item
		 */
		public function getPlaceSegment($id, $query)
		{
			return array((int) $id => $id);
		}
			/**
			 * Method to get the segment(s) for an placeform
			 *
			 * @param   string  $id     ID of the placeform to retrieve the segments for
			 * @param   array   $query  The request that is built right now
			 *
			 * @return  array|string  The segments of this item
			 */
			public function getPlaceformSegment($id, $query)
			{
				return $this->getPlaceSegment($id, $query);
			}
		/**
		 * Method to get the segment(s) for an contact
		 *
		 * @param   string  $id     ID of the contact to retrieve the segments for
		 * @param   array   $query  The request that is built right now
		 *
		 * @return  array|string  The segments of this item
		 */
		public function getContactSegment($id, $query)
		{
			return array((int) $id => $id);
		}
			/**
			 * Method to get the segment(s) for an contactform
			 *
			 * @param   string  $id     ID of the contactform to retrieve the segments for
			 * @param   array   $query  The request that is built right now
			 *
			 * @return  array|string  The segments of this item
			 */
			public function getContactformSegment($id, $query)
			{
				return $this->getContactSegment($id, $query);
			}
			/**
			 * Method to get the segment(s) for a category
			 *
			 * @param   string  $id     ID of the category to retrieve the segments for
			 * @param   array   $query  The request that is built right now
			 *
			 * @return  array|string  The segments of this item
			 */
			public function getEventsSegment($id, $query)
			{
				$category = Categories::getInstance('ra_walkseditor.events')->get($id);

				if ($category)
				{
					$path = array_reverse($category->getPath(), true);
					$path[0] = '1:root';

					if ($this->noIDs)
					{
						foreach ($path as &$segment)
						{
							list($id, $segment) = explode(':', $segment, 2);
						}
					}

					return $path;
				}

				return array();
			}
		/**
		 * Method to get the segment(s) for an event
		 *
		 * @param   string  $id     ID of the event to retrieve the segments for
		 * @param   array   $query  The request that is built right now
		 *
		 * @return  array|string  The segments of this item
		 */
		public function getEventSegment($id, $query)
		{
			return array((int) $id => $id);
		}
			/**
			 * Method to get the segment(s) for an eventform
			 *
			 * @param   string  $id     ID of the eventform to retrieve the segments for
			 * @param   array   $query  The request that is built right now
			 *
			 * @return  array|string  The segments of this item
			 */
			public function getEventformSegment($id, $query)
			{
				return $this->getEventSegment($id, $query);
			}
		/**
		 * Method to get the segment(s) for an grade
		 *
		 * @param   string  $id     ID of the grade to retrieve the segments for
		 * @param   array   $query  The request that is built right now
		 *
		 * @return  array|string  The segments of this item
		 */
		public function getGradeSegment($id, $query)
		{
			return array((int) $id => $id);
		}
			/**
			 * Method to get the segment(s) for an gradeform
			 *
			 * @param   string  $id     ID of the gradeform to retrieve the segments for
			 * @param   array   $query  The request that is built right now
			 *
			 * @return  array|string  The segments of this item
			 */
			public function getGradeformSegment($id, $query)
			{
				return $this->getGradeSegment($id, $query);
			}

	
			/**
			 * Method to get the id for a category
			 *
			 * @param   string  $segment  Segment to retrieve the ID for
			 * @param   array   $query    The request that is parsed right now
			 *
			 * @return  mixed   The id of this item or false
			 */
			public function getWalksId($segment, $query)
			{
				if (isset($query['id']))
				{
					$category = Categories::getInstance('ra_walkseditor.walks', array('access' => false))->get($query['id']);

					if ($category)
					{
						foreach ($category->getChildren() as $child)
						{
							if ($this->noIDs)
							{
								if ($child->alias == $segment)
								{
									return $child->id;
								}
							}
							else
							{
								if ($child->id == (int) $segment)
								{
									return $child->id;
								}
							}
						}
					}
				}

				return false;
			}
		/**
		 * Method to get the segment(s) for an walk
		 *
		 * @param   string  $segment  Segment of the walk to retrieve the ID for
		 * @param   array   $query    The request that is parsed right now
		 *
		 * @return  mixed   The id of this item or false
		 */
		public function getWalkId($segment, $query)
		{
			return (int) $segment;
		}
			/**
			 * Method to get the segment(s) for an walkform
			 *
			 * @param   string  $segment  Segment of the walkform to retrieve the ID for
			 * @param   array   $query    The request that is parsed right now
			 *
			 * @return  mixed   The id of this item or false
			 */
			public function getWalkformId($segment, $query)
			{
				return $this->getWalkId($segment, $query);
			}
		/**
		 * Method to get the segment(s) for an place
		 *
		 * @param   string  $segment  Segment of the place to retrieve the ID for
		 * @param   array   $query    The request that is parsed right now
		 *
		 * @return  mixed   The id of this item or false
		 */
		public function getPlaceId($segment, $query)
		{
			return (int) $segment;
		}
			/**
			 * Method to get the segment(s) for an placeform
			 *
			 * @param   string  $segment  Segment of the placeform to retrieve the ID for
			 * @param   array   $query    The request that is parsed right now
			 *
			 * @return  mixed   The id of this item or false
			 */
			public function getPlaceformId($segment, $query)
			{
				return $this->getPlaceId($segment, $query);
			}
		/**
		 * Method to get the segment(s) for an contact
		 *
		 * @param   string  $segment  Segment of the contact to retrieve the ID for
		 * @param   array   $query    The request that is parsed right now
		 *
		 * @return  mixed   The id of this item or false
		 */
		public function getContactId($segment, $query)
		{
			return (int) $segment;
		}
			/**
			 * Method to get the segment(s) for an contactform
			 *
			 * @param   string  $segment  Segment of the contactform to retrieve the ID for
			 * @param   array   $query    The request that is parsed right now
			 *
			 * @return  mixed   The id of this item or false
			 */
			public function getContactformId($segment, $query)
			{
				return $this->getContactId($segment, $query);
			}
			/**
			 * Method to get the id for a category
			 *
			 * @param   string  $segment  Segment to retrieve the ID for
			 * @param   array   $query    The request that is parsed right now
			 *
			 * @return  mixed   The id of this item or false
			 */
			public function getEventsId($segment, $query)
			{
				if (isset($query['id']))
				{
					$category = Categories::getInstance('ra_walkseditor.events', array('access' => false))->get($query['id']);

					if ($category)
					{
						foreach ($category->getChildren() as $child)
						{
							if ($this->noIDs)
							{
								if ($child->alias == $segment)
								{
									return $child->id;
								}
							}
							else
							{
								if ($child->id == (int) $segment)
								{
									return $child->id;
								}
							}
						}
					}
				}

				return false;
			}
		/**
		 * Method to get the segment(s) for an event
		 *
		 * @param   string  $segment  Segment of the event to retrieve the ID for
		 * @param   array   $query    The request that is parsed right now
		 *
		 * @return  mixed   The id of this item or false
		 */
		public function getEventId($segment, $query)
		{
			return (int) $segment;
		}
			/**
			 * Method to get the segment(s) for an eventform
			 *
			 * @param   string  $segment  Segment of the eventform to retrieve the ID for
			 * @param   array   $query    The request that is parsed right now
			 *
			 * @return  mixed   The id of this item or false
			 */
			public function getEventformId($segment, $query)
			{
				return $this->getEventId($segment, $query);
			}
			/**
		 * Method to get the segment(s) for an grade
		 *
		 * @param   string  $segment  Segment of the grade to retrieve the ID for
		 * @param   array   $query    The request that is parsed right now
		 *
		 * @return  mixed   The id of this item or false
		 */
		public function getGradeId($segment, $query)
		{
			return (int) $segment;
		}
			/**
			 * Method to get the segment(s) for an gradeform
			 *
			 * @param   string  $segment  Segment of the gradeform to retrieve the ID for
			 * @param   array   $query    The request that is parsed right now
			 *
			 * @return  mixed   The id of this item or false
			 */
			public function getGradeformId($segment, $query)
			{
				return $this->getGradeId($segment, $query);
			}



}
