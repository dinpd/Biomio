//View for one avaliable policies
App.Views.AvaliablePolicy = Backbone.View.extend({
  initialize: function () {
  },
  render: function () {
    var template = render('forms/AvaliablePolicies', this.model.toJSON());
    return template;
  },
});

//View of the list of avaliable policies
App.Views.AvaliablePolicies = Backbone.View.extend({
  initialize: function () {
    this.collection.on('reset', this.render, this);
    this.collection.on('add', this.addOne, this);
  },
  render: function (element, activePolicy) {
    this.element = element;
    this.activePolicy = activePolicy;
    this.collection.each(this.addOne, this);
  },
  addOne: function (policy) {
    var policyView = new App.Views.AvaliablePolicy ({ model: policy });
    $("." + this.element + " .location_policy").append(policyView.render());
    if (policy.id == this.activePolicy) {
      $("." + this.element + " .location_policy").val(policy.id);
    }

    /*
      $('.policy').each(function() {
        $(this).find(".avaliable-policies").append(policyView.render());
        if(parseInt($(this).find("span").html()) == parseInt(policy.id)) {
          $(this).find("span").html(policy.get("name"));
          $(this).find(".avaliable-policies").val(policy.id);
          $(this).find("span").removeClass("hide");
        }
      });
    */
  }
});