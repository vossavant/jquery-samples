/**
 * Main project JS. These methods are used sitewide.
 */

// @codekit-prepend "components/form.js"
// @codekit-append "components/highcharts.js"
// @codekit-append "components/app.js"
// @codekit-append "components/tab.js"
// @codekit-append "components/values.js"

var docready, retinajs, __adroll;

jQuery(function () {
	docready.init();
});

(function ($) {
	'use strict';

	docready = {
		init: function () {
			var body = document.body;
			var type = body.getAttribute('data-type');
			var slug = body.getAttribute('data-slug');

			// call common methods
			docready.exec('common');

			// call type methods (e.g., post or page)
			docready.exec(type);

			// call page-specific methods
			docready.exec(type, slug);
		},

		exec: function (type, slug) {
			slug = (slug === undefined) ? 'init' : slug;

			if (type !== '' && gsc[type] && gsc[type][slug]) {
				if (typeof gsc[type][slug] === 'function') {
					gsc[type][slug]();
				} else if (typeof gsc[type][slug].init === 'function') {
					gsc[type][slug].init();
				}
			}
		}
	};

	var gsc = {
		hoverDelay: 500,
		viewport: $(window),

		common: {
			init: function () {
				retinajs();

				this.toggleMegaMenuOnClick();

				$('form').submit(function (e) {
					var form = $(this),
						searchField = form.find('[name="s"]');

					if (searchField.length) {
						if (searchField.val().length === 0) {
							return false;
						}
					}

					if (form.attr('data-ajax-submit') !== 'no') {
						e.preventDefault();
						gscForm.formSubmit(form);
					}
				});

				$('.js-clickable').click(function () {
					var target = $(this).find('a').attr('href');

					if ($(this).hasClass('js-open-new-tab')) {
						window.open(target);
					} else {
						window.location = target;
					}
				});

				$('.js-open-new-tab').find('a').click(function (e) {
					e.preventDefault();
				});

				$('.table__scroll-wrapper').each(function () {
					gsc.common.makeTableScrollable($(this));
				});

				if ($('[data-autoplay="scroll"]').length) {
					gsc.common.playVideoWhenScrolledIntoView();
				}

				$('.smooth-scroll').click(function () {
					gsc.common.smoothScrollToAnchor(this);
				});

				$('.js-device-toggle').click(function (e) {
					e.preventDefault();
					gsc.common.toggleDeviceScreen($(this));
				});

				$('[data-reveal]').click(function() {
					var revealBtn = $(this),
						revealID = revealBtn.attr('data-reveal');
					revealBtn.hide();
					$('#' + revealID).slideDown();
				});

				// AdRoll tracking
				$('#hj-signin').click(function () {
					try {
						__adroll.record_user({'adroll_segments': '99d059c2'});
					} catch (err) {
						console.log(err);
					}
				});

				// TODO: consider moving how-to guides scripts to separate file or object
				$('.wysiwyg--how-to').find('.wp-caption-text').click(function () {
					var caption = $(this);
					gsc.common.toggleImageCaptionWrapperHeight(caption);
				});

				if ($('.page-template-page-case-study').length) {
					var ceros_iframe_wrapper = $('.page-template-page-case-study').find('iframe'),
						ceros_iframe_source = ceros_iframe_wrapper.attr('src'),
						utm_params = window.location.search;

					ceros_iframe_wrapper.attr('src', ceros_iframe_source + utm_params);
				}
			},

			makeTableScrollable: function (tableWrapper) {
				var table = tableWrapper.find('table');

				if (table.outerWidth() > tableWrapper.outerWidth()) {
					tableWrapper.addClass('table__scroll-wrapper--has-scroll');
				} else {
					tableWrapper.removeClass('table__scroll-wrapper--has-scroll');
				}

				gsc.viewport.on('resize orientationchange', function () {
					if (table.outerWidth() > tableWrapper.outerWidth()) {
						tableWrapper.addClass('table__scroll-wrapper--has-scroll');
					} else {
						tableWrapper.removeClass('table__scroll-wrapper--has-scroll');
					}
				});
			},

			playVideoWhenScrolledIntoView: function () {
				var video = $('[data-autoplay="scroll"]');

				gsc.viewport.scroll(function () {
					if (!video.hasClass('js-played')) {
						if (parseInt(gsc.viewport.scrollTop() + gsc.viewport.height()) >= video.offset().top) {
							video.get(0).play();
							video.addClass('js-played');
						}
					}
				});
			},

			smoothScrollToAnchor: function (anchor) {
				if (location.pathname.replace(/^\//, '') === anchor.pathname.replace(/^\//, '') && location.hostname === anchor.hostname) {
					var target = $(anchor.hash);
					target = target.length ? target : $('[name=' + anchor.hash.slice(1) + ']');
					if (target.length) {
						$('html, body').animate({
							scrollTop: target.offset().top
						}, 1000);
						return false;
					}
				}
			},

			toggleDeviceScreen: function (clicked) {
				clicked.closest('.columns').toggleClass('js-hidden');
				clicked.closest('.columns').siblings().toggleClass('js-hidden');

				clicked.closest('.content__col').find('.content__header').toggleClass('js-hidden');

				var clickedIndustry = clicked.closest('[data-industry]').attr('data-industry'),
					deviceWrapper = clicked.closest('section').find('[data-toggle-device]').find('[data-industry="' + clickedIndustry + '"]'),
					swapOut = deviceWrapper.find(':first-child').detach();

				deviceWrapper.append(swapOut);
			},

			toggleImageCaptionWrapperHeight: function (caption) {
				var captionWrapper = caption.closest('.wp-caption');

				captionWrapper.toggleClass('wp-caption--open');

				if (captionWrapper.hasClass('wp-caption--open')) {
					caption.text('Click to hide full image');
				} else {
					caption.text('Click to show full image');
				}
			},

			toggleMegaMenuOnClick: function () {
				$('.nav__link--dropdown').click(function (e) {
					var clicked = $(this);
					e.preventDefault();

					clicked
						.closest('.nav__item')
						.siblings()
						.find('.nav__link')
						.removeClass('nav__link--active');
					clicked
						.closest('.nav__item')
						.siblings()
						.find('.mega-menu')
						.removeClass('mega-menu--visible');

					clicked.toggleClass('nav__link--active');
					clicked.next().toggleClass('mega-menu--visible');
				});

				// keep mega menu open when hovering over mega menu panel
				$('.mega-menu').mouseenter(function () {
					clearTimeout($(this).data('timeoutId'));
				}).mouseleave(function () {
					var someElement = $(this);
					var timeoutId = setTimeout(function () {
						if (someElement.parent().find(".nav__link--active:hover").length !== 1) {
							someElement.prev().removeClass('nav__link--active');
							someElement.removeClass('mega-menu--visible');
						}
					}, gsc.hoverDelay);
					someElement.data('timeoutId', timeoutId);
				});
			}
		},

		page: {
			// Field Days "about" page
			about: {
				init: function () {

				}
			},

			field_days: {
				init: function () {
					$('.agenda__item').click(function () {
						if (!$(this).hasClass('agenda__item--no-desc')) {
							gsc.page.field_days.showAgendaItemDetailsInline($(this));
						}
					});

					// show details of first agenda item on page load
					$('.tabs__pane--current').find('.agenda__item--first').trigger('click');
				},

				showAgendaItemDetailsInline: function (agendaItem) {
					if (agendaItem.hasClass('agenda__item--active')) {
						agendaItem
							.removeClass('agenda__item--active')
							.find('.agenda__details')
							.slideUp();
					}

					else if (agendaItem.hasClass('agenda__item--speaker')) {
						agendaItem
							.siblings()
							.removeClass('agenda__item--active')
							.find('.agenda__details')
							.slideUp();
						agendaItem
							.addClass('agenda__item--active')
							.find('.agenda__details')
							.slideDown();
					}
				}
			},

			product_tour: {
				init: function () {
					$('.menu').find('[data-industry]').click(function () {
						gsc.page.product_tour.showProductTourContentForIndustry($(this));
					});

					$('.js-launch-demo-app').click(function (e) {
						gsc.page.product_tour.loadDemoApp($(this), e);
					});

					gsc.page.product_tour.autoplayVideosOnMobile();
				},

				autoplayVideosOnMobile: function () {
					$('#ec-tour-iphone').find('video').each(function () {
						var userAgent = navigator.userAgent || navigator.vendor || window.opera;
						if (/android/i.test(userAgent) || (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)) {
							$(this).attr('autoplay', 'autoplay');
						}
					});
				},

				loadDemoApp: function (clicked, e) {
					e.preventDefault();

					var launchAppLink,
						currentIndustry = clicked.closest('div').attr('data-industry'),
						currentIndustryAppWrapper = $('#ec-tour-iphone').find('[data-industry="' + currentIndustry + '"]');

					if (clicked.hasClass('js-animated')) {
						return;
					}

					currentIndustryAppWrapper.find('video').fadeOut(function () {
						currentIndustryAppWrapper.find('.app-outer-wrap').fadeIn(function () {
							$('#ec-tour-iphone').addClass('shake-lr');
						});

						clicked.animate({'opacity': 0}, function () {
							launchAppLink = $(this);
							launchAppLink.text('Click on the phone to start your sample mission');
							launchAppLink.animate({'opacity': 1});
							launchAppLink.addClass('js-animated');
						});
					});
				},

				showProductTourContentForIndustry: function (clicked) {
					clicked.siblings().removeClass('menu__item--active');
					clicked.addClass('menu__item--active');

					$('.js-product-tour-content').slideDown(function () {
						var productTourWrapper = $(this),
							currentIndustry = clicked.attr('data-industry'),
							deviceWrapper = $('#ec-tour-laptop').find('[data-industry="' + currentIndustry + '"]'),
							mobileAppWrapper = $('#ec-tour-iphone'),
							reportingSection = $('.tour-reporting'),
							swapOut = deviceWrapper.find(':first-child'),
							industryVideo = mobileAppWrapper.find('[data-industry="' + currentIndustry + '"]').find('video');

						// show industry-specific copy
						productTourWrapper.find('[data-industry]').hide();
						productTourWrapper.find('[data-industry*="' + currentIndustry + '"]:not(.columns)').show();
						productTourWrapper.find('[data-industry*="' + currentIndustry + '"].columns').css('display', 'flex');

						reportingSection.find('.js-photo-viewer').addClass('js-hidden');
						reportingSection.find('.js-dashboard').removeClass('js-hidden');
						reportingSection.find('.content__header.js-photo-viewer').addClass('js-hidden');
						reportingSection.find('.content__header.js-dashboard').removeClass('js-hidden');

						// in reporting section, if photo viewer is showing and industry is changed, swap back to dashboard view
						if (swapOut.hasClass('device__screen--photo-viewer')) {
							swapOut.detach();
							deviceWrapper.append(swapOut);
						}

						// in mobile app section, auto play video when scrolled into view
						mobileAppWrapper.find('video').removeAttr('data-autoplay');
						industryVideo.removeClass('js-played').attr('data-autoplay', 'scroll').show();
						industryVideo[0].currentTime = 0;
						industryVideo[0].load();
						mobileAppWrapper.find('[data-industry="' + currentIndustry + '"]').find('.app-outer-wrap').hide();
						$('#ec-product-demo-tour-text').find('[data-industry="' + currentIndustry + '"]').find('.link--more').text('Complete a Sample Mission').removeClass('js-animated');
						gsc.common.playVideoWhenScrolledIntoView();

						productTourWrapper.removeClass('js-hidden');
						$('html, body').animate({
							scrollTop: productTourWrapper.offset().top
						}, 1000);
					});
				}
			}
		}
	};
})(jQuery);