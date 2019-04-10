/**
 * JS for company values, which live at:
 * https://gospotcheck.com/values
 */

var gscValues;

jQuery(function() {
  gscValues.init();
});

(function($) {
  "use strict";

  gscValues = {
    init: function() {
      var locationHash = window.location.hash;

      if (locationHash) {
        $("input" + locationHash).attr("checked", "checked");
      } else {
        $("input#cover").attr("checked", "checked");
      }

      if ($("body").hasClass("values")) {
        $(document).keydown(function(e) {
          gscValues.bindKeys(e);
        });
      }

      $("#slides")
        .find("label")
        .click(function() {
          gscValues.changeHash($(this));
        });
    },

    bindKeys: function(e) {
      var slidesWrapper = $(".slides-window"),
        currentSlide = slidesWrapper.find(window.location.hash),
        nextSlide = currentSlide.next().attr("id"),
        prevSlide = currentSlide.prev().attr("id");

      switch (e.which) {
        // left arrow
        case 37:
          // if on first slide, switch to last
          if (prevSlide === undefined) {
            window.location.hash = slidesWrapper
              .find(".value-slide:last-of-type")
              .attr("id");
          } else {
            window.location.hash = "#" + prevSlide;
          }
          break;

        // right arrow
        case 39:
          // if on first slide, skip #cover and move to 2nd slide
          if (window.location.hash.length <= 1) {
            window.location.hash = slidesWrapper
              .find(".value-slide:nth-of-type(2)")
              .attr("id");

            // if on last slide, switch to first
          } else if (nextSlide === undefined) {
            window.location.hash = slidesWrapper
              .find(".value-slide:first-of-type")
              .attr("id");

            // else move to next slide
          } else {
            window.location.hash = "#" + nextSlide;
          }
          break;
      }
    },

    changeHash: function(label) {
      window.location.hash = label.attr("for");
    }
  };
})(jQuery);
