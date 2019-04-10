/**
 * JS for initializing Highcharts graphs (currently only needed on the industries pages)
 */

var gscHighcharts;

jQuery(function () {
	gscHighcharts.init();
});

(function ($) {
	'use strict';

	// to avoid using absolute paths, assign path of this script (custom.js) to a variable
	var scriptsLoaded = document.getElementsByTagName('script'),
		thisScript = scriptsLoaded[scriptsLoaded.length - 1],
		thisScriptPath = thisScript.src,
		thisScriptURL = thisScriptPath.substr(0, thisScriptPath.lastIndexOf('/') + 1);

	gscHighcharts = {
		init: function () {
			$('.js-highcharts-wrapper').each(function () {
				var chartWrapper = $(this);

				$.ajax({
					url: thisScriptURL + chartWrapper.attr('data-highcharts-src'),
					dataType: 'JSONP',
					jsonpCallback: 'processJSON' + chartWrapper.attr('data-count'),
					type: 'GET',
					success: function (data) {
						chartWrapper.highcharts(data);
					}
				});
			});
		}
	};
})(jQuery);