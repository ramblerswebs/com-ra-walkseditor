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

$canEdit = JFactory::getUser()->authorise('core.edit', 'com_ra_walkseditor.' . $this->item->id);

if (!$canEdit && JFactory::getUser()->authorise('core.edit.own', 'com_ra_walkseditor' . $this->item->id)) {
    $canEdit = JFactory::getUser()->id == $this->item->created_by;
}
?>

<form><input type="hidden" id="js-contents" value="<?php echo htmlspecialchars($this->item->content); ?>">

</form>
<div class="controls ra-move-controls">
        <a class="btn" href="<?php 
        echo JRoute::_('index.php?option=com_ra_walkseditor&task=walks'); 
        ?>"><?php echo JText::_("COM_RA_WALKSEDITOR_WALKS_LIST"); ?></a>
    <?php if ($canEdit && $this->item->checked_out == 0): ?>
        <a class="btn" href="<?php echo JRoute::_('index.php?option=com_ra_walkseditor&task=walk.edit&id=' . $this->item->id); ?>"><?php echo JText::_("COM_RA_WALKSEDITOR_EDIT_ITEM"); ?></a>
    <?php endif; ?>

    <?php if (JFactory::getUser()->authorise('core.delete', 'com_ra_walkseditor.walk.' . $this->item->id)) : ?>

        <a class="btn btn-danger" href="#deleteModal" role="button" data-toggle="modal">
            <?php echo JText::_("COM_RA_WALKSEDITOR_DELETE_ITEM"); ?>
        </a>

        <div id="deleteModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="deleteModal" aria-hidden="true">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h3><?php echo JText::_('COM_RA_WALKSEDITOR_DELETE_ITEM'); ?></h3>
            </div>
            <div class="modal-body">
                <p><?php echo JText::sprintf('COM_RA_WALKSEDITOR_DELETE_CONFIRM', $this->item->id); ?></p>
            </div>
            <div class="modal-footer">
                <button class="btn" data-dismiss="modal">Close</button>
                <a href="<?php echo JRoute::_('index.php?option=com_ra_walkseditor&task=walk.remove&id=' . $this->item->id, false, 2); ?>" class="btn btn-danger">
                    <?php echo JText::_('COM_RA_WALKSEDITOR_DELETE_ITEM'); ?>
                </a>
            </div>
        </div>

    <?php endif; ?>
</div>


<?php
 require_once 'components/com_ra_walkseditor/walkseditor.php';
        $form = new Walkseditor;
$form->fields['content'] = 'js-contents';
$form->viewWalk();
