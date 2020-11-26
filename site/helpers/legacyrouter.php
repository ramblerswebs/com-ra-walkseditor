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

use Joomla\CMS\Component\Router\Rules\RulesInterface;
use Joomla\CMS\Categories\Categories;
/**
 * Legacy router
 *
 * @since  1.6
 */
class Ra_walkseditorRulesLegacy implements RulesInterface
{
    /**
     * Constructor for this legacy router
     *
     * @param   JComponentRouterView  $router  The router this rule belongs to
     *
     * @since       3.6
     * @deprecated  4.0
     */
    public function __construct($router)
    {
        $this->router = $router;
    }

    /**
     * Preprocess the route for the com_content component
     *
     * @param   array  &$query  An array of URL arguments
     *
     * @return  void
     *
     * @since       3.6
     * @deprecated  4.0
     */
    public function preprocess(&$query)
    {
    }

    /**
     * Build the route for the com_content component
     *
     * @param   array  &$query     An array of URL arguments
     * @param   array  &$segments  The URL arguments to use to assemble the subsequent URL.
     *
     * @return  void
     *
     * @since       3.6
     * @deprecated  4.0
     */
    public function build(&$query, &$segments)
    {
        $segments = array();
        $view     = null;

        if (isset($query['task']))
        {
            $taskParts  = explode('.', $query['task']);
            $segments[] = implode('/', $taskParts);
            $view       = $taskParts[0];
            unset($query['task']);
        }

        if (isset($query['view']))
        {
            $segments[] = $query['view'];
            $view = $query['view'];
            
            unset($query['view']);
        }

        if (isset($query['id']))
        {

            if ($view !== null)
            {
                
				if ($view == 'walk')
				{
					$segments[] = $query['id'];
				}
				if ($view == 'walks')
				{
					$category = Categories::getInstance('ra_walkseditor.walks')->get($query['id']);
					$path = array_reverse($category->getPath(), true);
					foreach ($path as $id)
					{
						list($tmp, $id) = explode(':', $id, 2);
						$segments[] = $id;
					}
				}
				if ($view == 'walkform')
				{
					$segments[] = $query['id'];
				}
				if ($view == 'place')
				{
					$segments[] = $query['id'];
				}
				if ($view == 'places')
				{
					$segments[] = $query['id'];
				}
				if ($view == 'placeform')
				{
					$segments[] = $query['id'];
				}
				if ($view == 'contact')
				{
					$segments[] = $query['id'];
				}
				if ($view == 'contacts')
				{
					$segments[] = $query['id'];
				}
				if ($view == 'contactform')
				{
					$segments[] = $query['id'];
				}
				if ($view == 'event')
				{
					$segments[] = $query['id'];
				}
				if ($view == 'events')
				{
					$category = Categories::getInstance('ra_walkseditor.events')->get($query['id']);
					$path = array_reverse($category->getPath(), true);
					foreach ($path as $id)
					{
						list($tmp, $id) = explode(':', $id, 2);
						$segments[] = $id;
					}
				}
				if ($view == 'eventform')
				{
					$segments[] = $query['id'];
				}
				if ($view == 'grade')
				{
					$segments[] = $query['id'];
				}
				if ($view == 'grades')
				{
					$segments[] = $query['id'];
				}
				if ($view == 'gradeform')
				{
					$segments[] = $query['id'];
				}
            }
            else
            {
                $segments[] = $query['id'];
            }
            
            unset($query['id']);
        }
    }

    /**
     * Parse the segments of a URL.
     *
     * @param   array  &$segments  The segments of the URL to parse.
     * @param   array  &$vars      The URL attributes to be used by the application.
     *
     * @return  void
     *
     * @since       3.6
     * @deprecated  4.0
     */
    public function parse(&$segments, &$vars)
    {
        $vars = array();

        // View is always the first element of the array
        $vars['view'] = array_shift($segments);
        $model        = Ra_walkseditorHelpersRa_walkseditor::getModel($vars['view']);

        while (!empty($segments))
        {
            $segment = array_pop($segments);

            // If it's the ID, let's put on the request
            if (is_numeric($segment))
            {
                $vars['id'] = $segment;
            }
            else
            {
                
				if ($vars['view'] == 'walks')
				{
					$category = Categories::getInstance('ra_walkseditor.walks', array('access' => false))->get('root');
					if ($category)
					{
						foreach ($category->getChildren() as $child)
						{
							if ($child->alias == $segment)
							{
								$vars['id'] = $child->id;
							}
						}
					}
				}
				if ($vars['view'] == 'places')
				{
					$vars['task'] = $vars['view'] . '.' . $segment;
				}
				if ($vars['view'] == 'contacts')
				{
					$vars['task'] = $vars['view'] . '.' . $segment;
				}
				if ($vars['view'] == 'events')
				{
					$category = Categories::getInstance('ra_walkseditor.events', array('access' => false))->get('root');
					if ($category)
					{
						foreach ($category->getChildren() as $child)
						{
							if ($child->alias == $segment)
							{
								$vars['id'] = $child->id;
							}
						}
					}
							}
				if ($vars['view'] == 'grades')
				{
					$vars['task'] = $vars['view'] . '.' . $segment;
			
				}
				$id = null;
				if (method_exists($model, 'getItemIdByAlias'))
				{
					$id = $model->getItemIdByAlias(str_replace(':', '-', $segment));
				}
				if (!empty($id))
				{
					$vars['id'] = $id;
				}
				else
				{
					$vars['task'] = $vars['view'] . '.' . $segment;
				}
            }
        }
    }
}
