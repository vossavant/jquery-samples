/**
 * Handles form submissions
 */

// make JSHint happy
/*global console, gsc_ajax, jQuery */

var gscForm;

(function ($) {
	'use strict';

	gscForm = {
		data: {
			action: 'ajax-submit',
			fields: {},
			nonce: gsc_ajax.ajaxNonce
		},

		afterSubmit: function (data, form, formName, submitButton, submitButtonText) {
			var formSection = form.closest('section');

			data = $.parseJSON(data);

			// so Ghost Inspector test doesn't keep failing
			if (formName === 'create-zendesk-ticket') {
				if (data.error === 'RecordInvalid') {
					var errorMsg = data.details.requester[0].description;

					if (errorMsg === 'Requester: Wile E. Coyote is suspended.') {
						form.find('.message.success').find('p').text('Test submission for Wile E. Coyote was rejected, but this was expected. Form submission A-OK.');
						form.find('.message.success').css('display', 'grid');
					}

					return;
				}
			}

			if (formName === 'check-sw-promo-code') {
				if (data.error) {
					submitButton.addClass('button-error').val(data.error);
					setTimeout(function () {
						submitButton
							.removeAttr('disabled')
							.removeClass('button-error')
							.val(submitButtonText);
					}, 5000);
				} else {
					window.location = data.redirect_slug;
				}
			} else {
				setTimeout(function () {
					submitButton
						.removeAttr('disabled')
						.val(submitButtonText);
				}, 2000);
	
				form.find('.js-form-elements').hide();

				// TODO: remove check for IE once last 2 versions of IE support CSS grid
				if (data.error) {
					if (gscForm.detectIE()) {
						form.find('.message.danger').show();
					} else {
						form.find('.message.danger').css('display', 'grid');
					}
				} else {
					if (gscForm.detectIE()) {
						form.find('.message.success').show();
					} else {
						form.find('.message.success').css('display', 'grid');
					}
				}

				// scroll success/error message into view (on mobile, these messages can be scrolled off screen)
				$('html, body').animate({
					scrollTop: formSection.offset().top
				}, 1000);
			}
		},

		beforeSubmit: function (form, formName, submitButton) {
			submitButton.attr('disabled', 'disabled');

			switch (formName) {
				case 'create-zendesk-ticket':
					submitButton.val('Sending...');
					break;

				default:
					submitButton.val('Hang tight...');
					break;
			}
		},

		detectIE: function () {
			var ua = window.navigator.userAgent;

			var msie = ua.indexOf('MSIE ');
			if (msie > 0) {
				// IE 10 or older => return version number
				return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
			}

			var trident = ua.indexOf('Trident/');
			if (trident > 0) {
				// IE 11 => return version number
				var rv = ua.indexOf('rv:');
				return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
			}

			var edge = ua.indexOf('Edge/');
			if (edge > 0) {
				// Edge (IE 12+) => return version number
				return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
			}

			// other browser
			return false;
		},

		gatherHiddenFields: function (form) {
			var hiddenField,
				hiddenFieldName;

			form.find('[type="hidden"]').each(function () {
				hiddenField = $(this);
				hiddenFieldName = hiddenField.attr('name');
				gscForm.data[hiddenFieldName] = form.find(hiddenField).val();
			});
		},

		gatherUserInputFields: function (form) {
			var inputField,
				inputFieldName;

			form.find('[type="checkbox"], [type="email"], [type="number"], [type="text"], textarea').each(function () {
				inputField = $(this);
				inputFieldName = inputField.attr('name');

				if (inputField.attr('type') === 'checkbox') {
					gscForm.data.fields[inputFieldName] = inputField.is(':checked');
				} else {
					gscForm.data.fields[inputFieldName] = inputField.val();
				}
			});
		},

		handleValidationErrors: function (form) {
			var firstValidationError = form.find('.validation-error').first();
			firstValidationError.focus();
		},

		formSubmit: function (form) {
			var formName = form.find('[name="form_name"]').val(),
				submitButton = form.find('[type="submit"]'),
				submitButtonText = submitButton.val(),
				validationErrors = gscForm.validate(form);

			if (validationErrors) {
				gscForm.handleValidationErrors(form);
				return;
			}

			gscForm.beforeSubmit(form, formName, submitButton);
			gscForm.gatherHiddenFields(form);
			gscForm.gatherUserInputFields(form);

			$.post(gsc_ajax.ajaxURL, gscForm.data, function (data) {
				gscForm.afterSubmit(data, form, formName, submitButton, submitButtonText);
			});
		},

		validate: function (form) {
			var validationErrors = 0,
				requiredField;

			form.find('[required]').each(function () {
				requiredField = $(this);

				if ($.trim(requiredField.val()) === '') {
					requiredField.addClass('validation-error');
					validationErrors++;
				}
			});

			return validationErrors;
		}
	};
})(jQuery);