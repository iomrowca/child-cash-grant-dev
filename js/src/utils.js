/*  Utilities functions*/
Vis.utils = _.extend(Vis.DEFAULTS, {

  reset: function() {
    Vis.utils.clearTimer();
    $(".page-header").css("visibility", "visible");
    $("#narration").css("height", "250px");
    $(".footer").hide();
  },

  resetLayout: function() {
    Vis.utils.resetChartsCanvas();

    $(".outcomes").removeClass("col-md-12").addClass("col-md-8");
    $(".charts").show();
    $(".profile").show();
    $(".home").hide();
    $(".conclusion").hide();
    $(".child-empowerment").hide();
    Vis.utils.clearTimer();
    $(".page-header").css("visibility", "visible");
    $(".narration").show();
    Vis.Models.app.filterByChildren(null, true);
    $(".home-title").hide();
    $(".logos").css("visibility", "hidden");
    $(".footer").hide();
    $(".home .ui").css("visibility", "hidden");
  },

  resetRefactored: function() {
    $(".page-header").css("visibility", "visible");
  },

  clearTimer: function() {
    if (Vis.utils.chartDelay) clearTimeout(Vis.utils.chartDelay);
    if (Vis.utils.filterDelay) clearTimeout(Vis.utils.filterDelay);
  },

  resetChartsCanvas: function() {
    if (this.chart) this.chart = null;
    if(!d3.select("#main-chart svg").empty()) d3.selectAll("#main-chart svg").remove();
    d3.select("#main-chart #living-conditions").remove();
    d3.select("#main-chart #background-sample").remove();
    d3.select("#main-chart #coping-mechanisms").remove();
  },

  setTextContent: function(attr, animated) {
    if (typeof(animated) === "undefined") animated = true;
    var scenario = this.model.get("scenario"),
        id = this.model.getTemplateId(scenario.page, scenario.chapter, attr),
        template = _.template(Vis.Templates[attr][id]);

    if (attr == "main-text" && animated) $(".narration").animate({ opacity: 0 }, 0);
    $("#" + attr).html(template());
    if (attr == "main-text" && animated) $(".narration").animate({ opacity: 1 }, 1500);
  },

  chartDelay: null,

  filterDelay: null,

  // Timer: function(callback, delay) {
  //     var timerId, start, remaining = delay;
  //
  //     this.pause = function() {
  //         window.clearTimeout(timerId);
  //         remaining -= new Date() - start;
  //     };
  //
  //     this.resume = function() {
  //         start = new Date();
  //         window.clearTimeout(timerId);
  //         timerId = window.setTimeout(callback, remaining);
  //     };
  //
  //     this.clear = function() {
  //       window.clearTimeout(timerId);
  //     };
  //
  //     this.resume();
  // }
});
