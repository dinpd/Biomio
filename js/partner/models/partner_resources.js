App.Models.PartnerResources = Backbone.Model.extend({

    defaults: {
    },

    initialize: function () {
    },

    getData: function(){
        $.post('php/getData.php', 
        {   cmd : 'partner_resources'
        },
        function(data){
            var policies = new Array();
                policies[0] = "Member access only";
                policies[1] = "Stuff with adress match";
                policies[2] = "Something else";

            var table = "";
            data.forEach(function(entry) {

                var id = entry.name.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
                var id_group = id+"_group";
                var id_form = id+"_form";
                var id_select = id+"_select";
                var id_submit = id+"_submit";
                var id_cancel = id+"_cancel";

                table += "<div id= '" + id_group + "' class='control-group'>" +
                  "<label class='control-label' for='" + id_select + "'><div class='blackbox'></div></label>" +
                  "<div class='controls'>" +
                    "<div class='align font16'>" + entry.name + "</div>" +
                        "<div id='" + id + "' class='link partner-resources-change'>" + entry.policy + "</div>" +
                        "<div id='" + id_form + "' class='hide'>" +
                            "<select id='" + id_select + "' name='" + id_select + "' class='input-xlarge partner_resources_select'>";
                    policies.forEach(function(entry2) {
                        if (entry2 == entry.policy)
                            table += "<option selected>" + entry2 + "</option>";
                        else
                            table += "<option>" + entry2 + "</option>";
                    });
                table += "</select>" +
                            "<br/>" +
                            "<input type='button' id='" + id_submit + "' class='btn btn-success partner-resources-submit' value='Submit' /> " +
                            "<input type='button' id='" + id_cancel + "' class='btn btn-inverce partner-resources-cancel' value='Cancel' />" +
                        "</div>" +
                  "</div>" +
                "</div>";
            });
            
            var list = "";
            policies.forEach(function(entry) {
                list = list + "<option>" + entry + "</option>";
            });

            $("#partner_resources form fieldset").append(table);
            $("#partner_resources_policy").append(list);
        },"json");
    },

    changeData: function(id){

        var policy = $('#'+id+'_select').val();
        var oldPolicy = $('#'+id).html();

        $.ajax({
            type: 'POST',
            url: 'php/updateData.php',
            data: {cmd: "partner_resources_change_policy", old: oldPolicy, object: 'policy', data: policy},
            success: function(data) {
                if (data.search("done")!=-1) {
                    $('#'+id+"_form").addClass('hide');

                    $('#'+id).removeClass('hide');

                    alert(data);
                } else {
                    $('#'+id+'_group').addClass("error");
                }
            }
        });
    },

    saveData: function(){
        var name = $("#partner_resources_name").val();
        var policy = $("#partner_resources_policy").val();

        if (name.length < 3) {
            $('.span-partner-resources-save').addClass("red").text('The name is not long enough');
        } else {
            $.ajax({
                type: 'POST',
                url: 'php/updateData.php',
                data: {cmd: "partner_resources_save_resource", name: name, policy: policy},
                success: function(data) {
                    if (data.search("done")!=-1) {
                        $("#partner_resources_form").addClass('hide');

                        $(".partner-resources-add").removeClass('hide');

                        $.proxy(function () { 
                            this.getData();
                        }, this);
                        alert(data);
                    } else {
                        $('.span-partner-resources-save').addClass("red").html(data);
                    }
                }
            });
        }
    }
});