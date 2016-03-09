// Background view -- 1
Vis.Views.TimeLineNavigation = Backbone.View.extend({
    el: '#time-line-navigation',

    clock: null,
    cursor: 0,
    timer: null,
    last: false,
    progressLine: null,
    duration: 0,

    events: {
      "click button": "clickHandler",
    },
    initialize: function () {
      var that = this;
      this.initChart();
      this.btnToPause($("#time-line-navigation .btn"));

      var milestone = this.findMilestone();
      this.cursor = milestone.time.getMilliseconds();

      // this.model.on("change:scenario", function() {
      Backbone.on("view:rendered", function() {

        if (this.hasProgressLineContainer()) this.initProgressLine();

        if(!this.isPaused() && this.hasProgressLineContainer()) this.progressLine.animate(1, {duration: this.getDuration()});

        var milestone = this.findMilestone();
        this.cursor = milestone.time.getMilliseconds();

        that.render();
        if(this.isLast()) {
          this.btnToPause($("#time-line-navigation .btn"));
          this.stop()
          this.cursor = 0;
        }
        },this);
    },

    initChart: function() {
      var that = this,
          data = this.getData();

      this.chart = d3.timeLineNavigation()
        .width(800).height(60)
        .margins({top: 30, right: 50, bottom: 10, left: 40})
        .data(data)
        .x(d3.time.scale().domain(d3.extent(data, function(d) { return d.time; })))
        .on("browsing", function(scenario) {
          Vis.Routers.app.navigate("page/" + scenario.page + "/chapter/" + scenario.chapter, {trigger: true});
        })

      this.render();
    },

    render: function() {
      this.chart
        .data(this.getData())
        .elapsed(this.model.get("scenario"));
      d3.select(this.el).select(".chart").call(this.chart);
    },

    getData: function() {
      return this.model.getMilestones();
    },

    start: function() {
      if (this.hasProgressLineContainer()) this.progressLine.animate(1, {duration: this.getDuration()});
      var that = this,
          milestone = this.findMilestone();
      if(!this.clock) {
        // this.cursor = milestone.time.getMilliseconds();
        this.clock = setInterval(
          function() {
            var idx = that.getTimes().indexOf(that.cursor);
            if (idx !== -1) {
              var milestone = that.getData()[idx];
              Vis.Routers.app.navigate("#page/" + milestone.page + "/chapter/" + milestone.chapter, {trigger: true});
            }
            that.cursor += 1;
          }
          , 1500);
      }
    },

    stop: function() {
      if (this.hasProgressLineContainer()) this.progressLine.stop();
      window.clearInterval(this.clock);
      this.clock = null;
    },

    clickHandler: function(e) {
      e.preventDefault();
      var btn = $(e.currentTarget);
      btn.blur();

      if (btn.hasClass("play")) {
        this.btnToPause(btn);
        this.stop();
      } else {
        this.btnToPlay(btn);
        if(this.isLast()) {
          Vis.Routers.app.navigate("#page/1/chapter/1", {trigger: true});
        }
        this.start();
      }
    },

    btnToPause: function(btn) {
      btn.removeClass("play").addClass("pause");
      btn.find("span").html("Play");
      btn.find("i").removeClass("fa-pause").addClass("fa-play");
    },

    btnToPlay: function(btn) {
      btn.removeClass("pause").addClass("play");
      btn.find("span").html("Pause");
      btn.find("i").removeClass("fa-play").addClass("fa-pause");
    },

    isPaused: function() {
      return $("#time-line-navigation .btn").hasClass("pause");
    },

    isLast: function() {
      var page = this.model.get("scenario").page,
          chapter = this.model.get("scenario").chapter,
          idx = _.findIndex(this.getData(), function(d) {
            return +d.chapter === chapter && +d.page === page ; } );

      return (idx === this.getData().length - 1);
    },

    getTimes: function() {
      return this.getData().map(function(d) { return d.time.getMilliseconds(); });
    },

    findMilestone: function() {
      var page = this.model.get("scenario").page,
          chapter = this.model.get("scenario").chapter;

          return this.getData().filter(function(d) {
            return +d.chapter === chapter && +d.page === page ; })[0];
    },

    getDuration: function() {
      var duration = 0,
          milestone = this.findMilestone(),
          id = milestone.id,
          elapsed = this.progressLine.value();

      if (id == this.model.data.milestones.length -1) {
        duration = 0;
        this.progressLine.set(1);
      }  else {
        duration = this.model.data.milestones.filter(function(d) { return d.id == id+1 })[0].time.getMilliseconds()
          - milestone.time.getMilliseconds();
        duration = duration * 1500 * (1 - elapsed);
      }
      return parseInt(duration);
    },

    initProgressLine: function() {
        if(this.progressLine) this.progressLine.destroy();
        this.progressLine = new ProgressBar.Line(Vis.DEFAULTS.SELECTORS.PROGRESS_LINE, {
           color: "#888",
          //  strokeWidth: 0.4,
          //  strokeWidth: 0.2,
           strokeWidth: 0.3,
           duration: 1500,
           trailColor: "#ccc",
          //  trailWidth: 0.2
           trailWidth: 0.3
        });
        this.progressLine.set(0);
        d3.selectAll("#line-down path").style("shape-rendering", "crispEdges");
        d3.select(Vis.DEFAULTS.SELECTORS.PROGRESS_LINE + " svg").attr("viewBox", "0 -1 100 10")
      // }
    },

    hasProgressLineContainer: function() {
      return $(Vis.DEFAULTS.SELECTORS.PROGRESS_LINE).length > 0 ? true : false;
    }
});
