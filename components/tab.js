/**
 * Tabs (currently only needed on the industries pages)
 */

var gscTab;

jQuery(function() {
  gscTab.init();
});

(function($) {
  "use strict";

  gscTab = {
    init: function() {
      $(".tabs__pane--current").animate({ opacity: 1 });

      $(".tabs__tab").click(function() {
        var tab = $(this),
          targetPane = tab
            .closest(".tabs")
            .find(
              '.tabs__pane[data-tab-pane="' + tab.attr("data-tab-target") + '"]'
            ),
          currentPane = $(".tabs__pane--current");

        currentPane.animate({ opacity: 0 }, function() {
          tab.siblings().removeClass("tabs__tab--current");
          tab.addClass("tabs__tab--current");

          targetPane.siblings().removeClass("tabs__pane--current");
          targetPane.addClass("tabs__pane--current").animate({ opacity: 1 });
        });
      });
    }
  };
})(jQuery);
