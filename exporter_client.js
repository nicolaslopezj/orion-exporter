/**
 * Register the link
 */
Tracker.autorun(function() {
  var index = Options.get('showExportTab') ? 110 : undefined; // null to hide from the tabs
  orion.links.add({
    index: index,
    identifier: 'orion-export',
    title: 'Export/Import',
    routeName: 'nicolaslopezj.orionExport',
    activeRouteRegex: 'nicolaslopezj.orionExport',
    permission: 'nicolaslopezj.orionExport'
  });
});


ReactiveTemplates.onRendered('orionExport', function() {
  Session.set('orionExport_error', null);
  Session.set('orionExport_isLoading', false);
});

ReactiveTemplates.helpers('orionExport', {
  currentError: function() {
    return Session.get('orionExport_error');
  },
  isLoading: function() {
    return Session.get('orionExport_isLoading');
  }
});

ReactiveTemplates.events('orionExport', {
  'click .btn-export': function(event, template) {
    var key = Roles.keys.request(Meteor.userId());
    var url = '/admin/download-export/' + key;
    window.open(url);
  },
  'change .input-import': function(event, template) {
    Session.set('orionExport_isLoading', true);
    var key = Roles.keys.request(Meteor.userId());
    var url = '/admin/import-data/' + key;
    var file = event.currentTarget.files[0];

    if (file) {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function () {
        HTTP.post(url, {
          data: {
            json: reader.result
          }
        }, function(error, result) {
          if (error) {
            console.log(error);
            Session.set('orionExport_error', error);
          } else {
            if (result.content != 'ok') {
              Session.set('orionExport_error', new Meteor.Error('unknown-error', 'A unknown error has ocurred'));
            }
          }
          Session.set('orionExport_isLoading', false);
        })
      }
      reader.onerror = function (_event) {
        console.log(_event);
        Session.set('orionExport_error', _event);
        Session.set('orionExport_isLoading', false);
      }
    }
  }
});
