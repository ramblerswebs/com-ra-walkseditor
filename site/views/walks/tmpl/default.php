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

use \Joomla\CMS\HTML\HTMLHelper;
use \Joomla\CMS\Factory;
use \Joomla\CMS\Uri\Uri;
use \Joomla\CMS\Router\Route;
use \Joomla\CMS\Language\Text;

HTMLHelper::addIncludePath(JPATH_COMPONENT . '/helpers/html');
HTMLHelper::_('bootstrap.tooltip');
HTMLHelper::_('behavior.multiselect');
HTMLHelper::_('formbehavior.chosen', 'select');

$user = Factory::getUser();
$userId = $user->get('id');
$listOrder = $this->state->get('list.ordering');
$listDirn = $this->state->get('list.direction');
$canCreate = $user->authorise('core.create', 'com_ra_walkseditor') && file_exists(JPATH_COMPONENT . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'forms' . DIRECTORY_SEPARATOR . 'walkform.xml');
$canEdit = $user->authorise('core.edit', 'com_ra_walkseditor') && file_exists(JPATH_COMPONENT . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'forms' . DIRECTORY_SEPARATOR . 'walkform.xml');
$canCheckin = $user->authorise('core.manage', 'com_ra_walkseditor');
$canChange = $user->authorise('core.edit.state', 'com_ra_walkseditor');
$canDelete = $user->authorise('core.delete', 'com_ra_walkseditor');

// Import CSS
$document = Factory::getDocument();
$document->addStyleSheet(Uri::root() . 'media/com_ra_walkseditor/css/list.css');
// require_once 'components/com_ra_walkseditor/walk.php';
?>
<?php

$data = new Class {
    
};
$data->$userId = $userId;
$data->items = $this->items;
$data->newUrl = null;
if ($canCreate) {
    $data->newUrl = JRoute::_('index.php?option=com_ra_walkseditor&task=walkform.edit&id=0', false, 2);
}
foreach ($this->items as $item) {
    $item->deleteUrl = null;
    $item->editUrl = null;
    $item->duplicateUrl = null;
    $item->viewUrl = JRoute::_('index.php?option=com_ra_walkseditor&view=walk&id=' . (int) $item->id);
    if ($canDelete) {
        $item->deleteUrl = JRoute::_('index.php?option=com_ra_walkseditor&task=walkform.remove&id=' . $item->id, false, 2);
    }
    if ($canEdit) {
        $item->editUrl = JRoute::_('index.php?option=com_ra_walkseditor&task=walk.edit&id=' . $item->id, false, 2);
    }
    if ($canCreate) {
        $item->duplicateUrl = JRoute::_('index.php?option=com_ra_walkseditor&task=walkform.edit&copy=1&id=' . $item->id, false, 2);
    }
}

require_once 'components/com_ra_walkseditor/walkseditor.php';
$form = new Walkseditor;
$form->fields['content'] = 'js-contents';
$form->viewAllWalks($data);
