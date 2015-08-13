Options.init('showExportTab', false);
exportPages = _.has(Package, 'orionjs:pages');
var collections = [];

orion.collections.onCreated(function(collection) {
  collections.push(this);
})

if (exportPages) {
  var pages = orion.pages.collection;
}


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
RouterLayer.route('/admin/export', {
  layout: 'layout',
  template: 'orionExport',
  name: 'nicolaslopezj.orionExport',
  reactiveTemplates: true
});

/**
 * Ensure user is logged in
 */
orion.accounts.addProtectedRoute('nicolaslopezj.orionExport');
