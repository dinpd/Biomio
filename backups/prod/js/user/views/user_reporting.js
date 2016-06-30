//Main view for User Resources
App.Views.UserReportsMain = Backbone.View.extend({
  el: $("#content"),
  initialize:function () {
  },
  render:function () {
      var template = render('UserReportsView', {});
      this.$el.html( template );
      user_reports_date
      $('#user_reports_date').datetimepicker({
        pickTime: false
      });
  }
});

//View for one resource
App.Views.UserReport = Backbone.View.extend({
    tagName: 'div class="row"',
    initialize: function () {
      this.render();
      this.model.on('change', this.render, this);
      this.model.on('change:status', this.render, this);
      this.model.on('destroy', this.remove, this);
      this.model.on('error', this.error, this);
    },
    render: function () {
      var template = render('forms/UserReportsList', this.model.toJSON());
      return template;
    },
});

//View of the list of resources
App.Views.UserReports = Backbone.View.extend({
    initialize: function () {
      this.collection.on('add', this.addOne, this);
      this.collection.on('reset', this.render, this);
    },
    render: function () {
      this.collection.each(this.addOne, this);
      return this;
    },
    addOne: function (report) {
      var reportView = new App.Views.UserReport ({ model: report });
      $("#user_reports").append(reportView.render());
    }
 });