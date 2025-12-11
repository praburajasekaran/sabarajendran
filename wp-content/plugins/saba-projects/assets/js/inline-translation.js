/**
 * Inline Translation JavaScript
 *
 * Handles instant translation buttons in edit screens
 *
 * @package Saba_Projects
 */

(function($) {
	'use strict';

	/**
	 * Update translate button label based on field content
	 */
	function updateTranslateButtonLabel($button, $sourceField) {
		var sourceText = $sourceField.val().trim();
		var $label = $button.find('.saba-translate-label');
		
		if (!sourceText) {
			$label.text(sabaTranslation.strings.translate);
			return;
		}

		// Detect language (simple check for Tamil Unicode)
		var isTamil = /[\u0B80-\u0BFF]/.test(sourceText);
		
		if (isTamil) {
			$label.text(sabaTranslation.strings.translateToEnglish || 'Translate to English');
		} else {
			$label.text(sabaTranslation.strings.translateToTamil || 'Translate to Tamil');
		}
	}

	/**
	 * Handle project field translation
	 */
	function handleProjectTranslation($button) {
		var $sourceField = $('#' + $button.data('source-field'));
		var $targetField = $('#' + $button.data('target-field'));
		var projectId = $button.data('project-id');
		var fieldType = $button.data('field-type');
		var sourceText = $sourceField.val().trim();

		if (!sourceText) {
			alert(sabaTranslation.strings.emptyField || 'Please enter text to translate.');
			return;
		}

		// Show loading state
		$button.addClass('loading').prop('disabled', true);
		$button.find('.dashicons').addClass('spin');

		// Make AJAX request
		$.ajax({
			url: sabaTranslation.ajaxurl,
			type: 'POST',
			data: {
				action: 'saba_translate_project_field',
				nonce: sabaTranslation.nonce,
				project_id: projectId,
				field_type: fieldType,
				source_text: sourceText
			},
			success: function(response) {
				if (response.success) {
					$targetField.val(response.data.translation);
					
					// Show success message
					showMessage('success', sabaTranslation.strings.translationSuccess || 'Translation completed successfully!');
					
					// Update button labels
					updateTranslateButtonLabel($button, $sourceField);
					var $oppositeButton = $button.closest('.saba-translation-field-group').find('.saba-translate-btn').not($button);
					updateTranslateButtonLabel($oppositeButton, $targetField);
				} else {
					showMessage('error', response.data.message || sabaTranslation.strings.translationError || 'Translation failed.');
				}
			},
			error: function() {
				showMessage('error', sabaTranslation.strings.ajaxError || 'AJAX request failed. Please try again.');
			},
			complete: function() {
				$button.removeClass('loading').prop('disabled', false);
				$button.find('.dashicons').removeClass('spin');
			}
		});
	}

	/**
	 * Handle village name translation
	 */
	function handleVillageTranslation($button) {
		var $sourceField = $('#' + $button.data('source-field'));
		var $targetField = $('#' + $button.data('target-field'));
		var termId = $button.data('term-id');
		var sourceText = $sourceField.val().trim();

		if (!sourceText) {
			alert(sabaTranslation.strings.emptyField || 'Please enter text to translate.');
			return;
		}

		// Show loading state
		$button.addClass('loading').prop('disabled', true);
		$button.find('.dashicons').addClass('spin');

		// Make AJAX request
		$.ajax({
			url: sabaTranslation.ajaxurl,
			type: 'POST',
			data: {
				action: 'saba_translate_village_name',
				nonce: sabaTranslation.nonce,
				term_id: termId,
				source_text: sourceText
			},
			success: function(response) {
				if (response.success) {
					$targetField.val(response.data.translation);
					
					// Show success message
					showMessage('success', sabaTranslation.strings.translationSuccess || 'Translation completed successfully!');
					
					// Update button labels
					updateTranslateButtonLabel($button, $sourceField);
					var $oppositeButton = $button.closest('tr, .form-field').find('.saba-translate-village-btn').not($button);
					if ($oppositeButton.length) {
						updateTranslateButtonLabel($oppositeButton, $targetField);
					}
				} else {
					showMessage('error', response.data.message || sabaTranslation.strings.translationError || 'Translation failed.');
				}
			},
			error: function() {
				showMessage('error', sabaTranslation.strings.ajaxError || 'AJAX request failed. Please try again.');
			},
			complete: function() {
				$button.removeClass('loading').prop('disabled', false);
				$button.find('.dashicons').removeClass('spin');
			}
		});
	}

	/**
	 * Show temporary message
	 */
	function showMessage(type, message) {
		var $notice = $('<div class="notice notice-' + type + ' is-dismissible"><p>' + message + '</p></div>');
		$('.wrap h1').after($notice);
		
		// Auto-dismiss after 5 seconds
		setTimeout(function() {
			$notice.fadeOut(function() {
				$(this).remove();
			});
		}, 5000);
	}

	/**
	 * Initialize on document ready
	 */
	$(document).ready(function() {
		// Project translation buttons
		$(document).on('click', '.saba-translate-btn', function(e) {
			e.preventDefault();
			handleProjectTranslation($(this));
		});

		// Village translation buttons
		$(document).on('click', '.saba-translate-village-btn', function(e) {
			e.preventDefault();
			handleVillageTranslation($(this));
		});

		// Update button labels on field change
		$(document).on('input', '#project_title_english, #project_title_tamil, #project_description_english, #project_description_tamil, #village_name_english, #village_name_tamil', function() {
			var $field = $(this);
			var $button = $field.closest('div').find('.saba-translate-btn, .saba-translate-village-btn');
			if ($button.length) {
				updateTranslateButtonLabel($button, $field);
			}
		});

		// Initial button label updates
		$('.saba-translate-btn, .saba-translate-village-btn').each(function() {
			var $button = $(this);
			var sourceFieldId = $button.data('source-field');
			var $sourceField = $('#' + sourceFieldId);
			if ($sourceField.length) {
				updateTranslateButtonLabel($button, $sourceField);
			}
		});
	});

})(jQuery);






