Package.describe({
  name: 'nicolaslopezj:orion-exporter',
  summary: 'Export and import all your Orion data',
  version: '1.0.0',
  git: 'https://github.com/nicolaslopezj/orion-exporter'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['meteor-platform', 'orionjs:base', 'orionjs:dictionary', 'orionjs:collections', 'nicolaslopezj:roles@1.2.0', 'http']);

  api.use(['orionjs:bootstrap', 'orionjs:materialize'], 'client', { weak: true });

  api.addFiles('exporter.js');
  api.addFiles('exporter_server.js', 'server');
  api.addFiles(['exporter_bootstrap.html', 'exporter_materialize.html', 'exporter_client.js'], 'client');
});
