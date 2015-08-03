var collections = [];

orion.collections.onCreated(function(collection) {
  collections.push(this);
})

/**
 * Init the template name variable
 */
ReactiveTemplates.request('orionExport', 'nicolaslopezj_orionExporter_bootstrap');

if (_.has(Package, 'orionjs:materialize')) {
  ReactiveTemplates.set('orionExport', 'nicolaslopezj_orionExporter_materialize');
}

/**
 * Init the role action
 */
Roles.registerAction('nicolaslopezj.orionExport', true);

/**
 * Register the route
 */
Router.route('/admin/export', function() {
  this.layout(ReactiveTemplates.get('layout'));
  this.render(ReactiveTemplates.get('orionExport'));
}, { name: 'nicolaslopezj.orionExport' });

/**
 * Ensure user is logged in
 */
orion.accounts.addProtectedRoute('nicolaslopezj.orionExport');

Router.route('/admin/download-export/:key', function() {
  var userId = Roles.keys.getUserId(this.params.key);
  if (!userId || !Roles.userHasPermission(userId, 'nicolaslopezj.orionExport')) {
    throw new Meteor.Error('unauthorized', 'The user is not authorized to perform this action');
  }

  var data = {};

  data.dictionary = orion.dictionary.findOne();
  data.collections = {};

  _.each(collections, function(collection) {
    data.collections[collection._name] = collection.find().fetch();
  });

  this.response.setHeader('Content-Type', 'application/json');
  this.response.setHeader('Content-Disposition', 'attachment; filename=backup.orionexport');

  var json = JSON.stringify(data);
  this.response.end(json);

}, { name: 'nicolaslopezj.orionExport.download', where: 'server' });

Router.route('/admin/import-data/:key', function() {
  var userId = Roles.keys.getUserId(this.params.key);
  if (!userId || !Roles.userHasPermission(userId, 'nicolaslopezj.orionExport')) {
    throw new Meteor.Error('unauthorized', 'The user is not authorized to perform this action');
  }

  try {
    var json = this.request.body.json;
    var data = JSON.parse(json);

    // import dictionary
    orion.dictionary.remove({});
    orion.dictionary.insert(data.dictionary, { validate: false });

    // import collections
    _.each(collections, function(collection) {
      var collectionData = data.collections[collection._name];
      if (_.isArray(collectionData)) {
        collection.remove({});
        _.each(collectionData, function(doc) {
          collection.insert(doc, { validate: false });
        });
      }
    });
  } catch (e) {
    console.log(e);
    throw new Meteor.Error('parse-error', 'Error parsing the file');
  }
  this.response.end('ok');
}, { name: 'nicolaslopezj.orionExport.import', where: 'server' });
