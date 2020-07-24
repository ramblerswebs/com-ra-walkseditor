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
?>

<form action="<?php echo htmlspecialchars(Uri::getInstance()->toString()); ?>" method="post"
      name="adminForm" id="adminForm">

    <?php echo JLayoutHelper::render('default_filter', array('view' => $this), dirname(__FILE__)); ?>
    <div class="table-responsive">
        <table class="table table-striped" id="walkList">
            <thead>
                <tr>
                    <?php if (isset($this->items[0]->state)): ?>
                        <th width="5%">
                            <?php echo JHtml::_('grid.sort', 'JPUBLISHED', 'a.state', $listDirn, $listOrder); ?>
                        </th>
                    <?php endif; ?>

                    <th class=''>
                        <?php echo JHtml::_('grid.sort', 'COM_RA_WALKSEDITOR_WALKS_DATE', 'a.date', $listDirn, $listOrder); ?>
                        <br/><small>Category / Status</small>
                    </th>

                    <th class=''>
                        <?php echo JHtml::_('grid.sort', 'COM_RA_WALKSEDITOR_WALKS_CONTENT', 'a.content', $listDirn, $listOrder); ?>
                    </th>
                    <th class=''>Leader/Contact
                    </th>
                    <th class=''>Distance
                    </th>

                    <?php if ($canEdit || $canDelete): ?>
                        <th class="center">
                            <?php echo JText::_('COM_RA_WALKSEDITOR_WALKS_ACTIONS'); ?>
                        </th>
                    <?php endif; ?>

                </tr>
            </thead>
            <tfoot>
                <tr>
                    <td colspan="<?php echo isset($this->items[0]) ? count(get_object_vars($this->items[0])) : 10; ?>">
                        <?php echo $this->pagination->getListFooter(); ?>
                    </td>
                </tr>
            </tfoot>
            <tbody>
                <?php foreach ($this->items as $i => $item) : ?>
                    <?php $canEdit = $user->authorise('core.edit', 'com_ra_walkseditor'); ?>

                    <?php if (!$canEdit && $user->authorise('core.edit.own', 'com_ra_walkseditor')): ?>
                        <?php $canEdit = JFactory::getUser()->id == $item->created_by; ?>
                    <?php endif; ?>

                    <tr class="row<?php echo $i % 2; ?>">

                        <?php if (isset($this->items[0]->state)) : ?>
                            <?php $class = ($canChange) ? 'active' : 'disabled'; ?>
                            <td class="center">
                                <a class="btn btn-micro <?php echo $class; ?>" href="<?php echo ($canChange) ? JRoute::_('index.php?option=com_ra_walkseditor&task=walk.publish&id=' . $item->id . '&state=' . (($item->state + 1) % 2), false, 2) : '#'; ?>">
                                    <?php if ($item->state == 1): ?>
                                        <i class="icon-publish"></i>
                                    <?php else: ?>
                                        <i class="icon-unpublish"></i>
                                    <?php endif; ?>
                                </a>
                            </td>
                        <?php endif; ?>
                        <?php $walk = new RDraftWalk($item->content); ?>
                        <td>

                            <?php
                            //  echo $item->date;
                            $date = substr($item->date, 0, 10);
                            if ($date == "0000-00-00") {
                                echo "No Date";
                            } else {
                                $datetime = DateTime::createFromFormat("Y-m-d", $date);
                                echo $datetime->format("D, jS M Y");
                            }
                            echo "<br/><small>" . $item->category_name . " / " . $this->escape($item->status) . "</small>";
                            ?>				</td>

                        <td>

    <?php echo $walk->displayTitle(); ?></a>
                        </td>
                        <td>
    <?php echo $walk->displayContact(); ?>
                        </td>
                        <td>
                            <?php echo $walk->displayDistance();
                            ?>
                        </td>
    <?php if ($canEdit || $canDelete): ?>
                            <td class="center">
                                <a  class="btn btn-mini" type="button" href="<?php echo JRoute::_('index.php?option=com_ra_walkseditor&view=walk&id=' . (int) $item->id); ?>">View</a>
        <?php if ($canEdit): ?>
                                    <a href="<?php echo JRoute::_('index.php?option=com_ra_walkseditor&task=walk.edit&id=' . $item->id, false, 2); ?>" class="btn btn-mini" type="button">Edit</a>
                                    <a href="<?php echo JRoute::_('index.php?option=com_ra_walkseditor&task=walkform.edit&copy=1&id=' . $item->id, false, 2); ?>" class="btn btn-mini" type="button">Clone</a>             <?php endif; ?>
                                <?php if ($canDelete): ?>
                                    <a href="<?php echo JRoute::_('index.php?option=com_ra_walkseditor&task=walkform.remove&id=' . $item->id, false, 2); ?>" class="btn btn-mini delete-button" type="button">Delete</a>
                            <?php endif; ?>
                            </td>
    <?php endif; ?>

                    </tr>
<?php endforeach; ?>
            </tbody>
        </table>
    </div>
<?php if ($canCreate) : ?>
        <a href="<?php echo Route::_('index.php?option=com_ra_walkseditor&task=walkform.edit&id=0', false, 0); ?>"
           class="btn btn-success btn-small"><i
                class="icon-plus"></i>
            <?php echo Text::_('COM_RA_WALKSEDITOR_ADD_ITEM'); ?></a>
<?php endif; ?>

    <input type="hidden" name="task" value=""/>
    <input type="hidden" name="boxchecked" value="0"/>
    <input type="hidden" name="filter_order" value="<?php echo $listOrder; ?>"/>
    <input type="hidden" name="filter_order_Dir" value="<?php echo $listDirn; ?>"/>
<?php echo HTMLHelper::_('form.token'); ?>
</form>

<?php if ($canDelete) : ?>
    <script type="text/javascript">

        jQuery(document).ready(function () {
            jQuery('.delete-button').click(deleteItem);
        });

        function deleteItem() {

            if (!confirm("<?php echo Text::_('COM_RA_WALKSEDITOR_DELETE_MESSAGE'); ?>")) {
                return false;
            }
        }
    </script>
<?php endif; ?>
