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

HTMLHelper::_('behavior.keepalive');
HTMLHelper::_('behavior.tooltip');
HTMLHelper::_('behavior.formvalidation');
HTMLHelper::_('formbehavior.chosen', 'select');

// Load admin language file
$lang = Factory::getLanguage();
$lang->load('com_ra_walkseditor', JPATH_SITE);
$doc = Factory::getDocument();
$doc->addScript(Uri::base() . '/media/com_ra_walkseditor/js/form.js');

$user    = Factory::getUser();
$canEdit = Ra_walkseditorHelpersRa_walkseditor::canUserEdit($this->item, $user);


?>

<div class="place-edit front-end-edit">
	<?php if (!$canEdit) : ?>
		<h3>
			<?php throw new Exception(Text::_('COM_RA_WALKSEDITOR_ERROR_MESSAGE_NOT_AUTHORISED'), 403); ?>
		</h3>
	<?php else : ?>
		<?php if (!empty($this->item->id)): ?>
			<h1><?php echo Text::sprintf('COM_RA_WALKSEDITOR_EDIT_ITEM_TITLE', $this->item->id); ?></h1>
		<?php else: ?>
			<h1><?php echo Text::_('COM_RA_WALKSEDITOR_ADD_ITEM_TITLE'); ?></h1>
		<?php endif; ?>

		<form id="form-place"
			  action="<?php echo Route::_('index.php?option=com_ra_walkseditor&task=place.save'); ?>"
			  method="post" class="form-validate form-horizontal" enctype="multipart/form-data">
			
	<input type="hidden" name="jform[id]" value="<?php echo isset($this->item->id) ? $this->item->id : ''; ?>" />

	<input type="hidden" name="jform[ordering]" value="<?php echo isset($this->item->ordering) ? $this->item->ordering : ''; ?>" />

	<input type="hidden" name="jform[state]" value="<?php echo isset($this->item->state) ? $this->item->state : ''; ?>" />

	<input type="hidden" name="jform[checked_out]" value="<?php echo isset($this->item->checked_out) ? $this->item->checked_out : ''; ?>" />

	<input type="hidden" name="jform[checked_out_time]" value="<?php echo isset($this->item->checked_out_time) ? $this->item->checked_out_time : ''; ?>" />

				<?php echo $this->form->getInput('created_by'); ?>
				<?php echo $this->form->getInput('modified_by'); ?>
	<div style="display:none">
        <?php echo $this->form->renderField('name'); ?>

	<?php echo $this->form->renderField('abbr'); ?>

	<?php echo $this->form->renderField('postcode'); ?>

	<?php echo $this->form->renderField('latitude'); ?>

	<?php echo $this->form->renderField('longitude'); ?>

	<?php echo $this->form->renderField('gridreference'); ?>

	<?php echo $this->form->renderField('what3words'); ?>
        </div>
			<div class="control-group">
				<div class="controls ra-move-controls">

					<?php if ($this->canSave): ?>
						<button id="js-submitbtn" type="submit" class="validate btn btn-primary">
							<?php echo Text::_('JSUBMIT'); ?>
						</button>
					<?php endif; ?>
					<a class="btn"
					   href="<?php echo Route::_('index.php?option=com_ra_walkseditor&task=placeform.cancel'); ?>"
					   title="<?php echo Text::_('JCANCEL'); ?>">
						<?php echo Text::_('JCANCEL'); ?>
					</a>
				</div>
			</div>

			<input type="hidden" name="option" value="com_ra_walkseditor"/>
			<input type="hidden" name="task"
				   value="placeform.save"/>
			<?php echo HTMLHelper::_('form.token'); ?>
		</form>
                                                 <?php
        require_once 'components/com_ra_walkseditor/walkseditor.php';
        $form = new Walkseditor;
        $form->fields=[];
  //      $form->cancel = Route::_('index.php?option=com_ra_draftgwem2&task=draftgwem2eventform.cancel');
        $form->fields['submit'] = "js-submitbtn";
        $form->fields['name'] = "jform_name";
        $form->fields['abbr'] = "jform_abbr";
        $form->fields['postcode'] = "jform_postcode";
        $form->fields['latitude'] = "jform_latitude";
        $form->fields['longitude'] = "jform_longitude";
        $form->fields['gridref10'] = "jform_gridreference";
        $form->fields['what3words'] = "jform_what3words";
       
        $form->editPlace();
        ?>
	<?php endif; ?>
</div>
