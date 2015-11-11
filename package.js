Package.describe({
  name: 'nicolaslopezj:orion-exporter',
  summary: 'Export and import all your Orion data',
  version: '1.2.0',
  git: 'https://github.com/nicolaslopezj/orion-exporter'
});

Npm.depends({
  'body-parser': '1.13.3'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['meteor-platform', 'orionjs:base@1.4.0', 'orionjs:dictionary@1.4.0', 'orionjs:collections@1.4.0', 'nicolaslopezj:roles@1.2.0||2.0.0', 'meteorhacks:picker@1.0.3', 'http', 'matb33:collection-hooks@0.8.1']);

  api.use(['orionjs:bootstrap@1.4.0', 'orionjs:materialize@1.4.0', 'orionjs:pages@1.4.0'], 'client', { weak: true });

  api.addFiles('exporter.js');
  api.addFiles('exporter_server.js', 'server');
  api.addFiles(['exporter_bootstrap.html', 'exporter_materialize.html', 'exporter_client.js'], 'client');
});
