Package.describe({
  name: 'nicolaslopezj:orion-exporter',
  summary: 'Export and import all your Orion data',
  version: '1.3.3',
  git: 'https://github.com/nicolaslopezj/orion-exporter'
});

Npm.depends({
  'body-parser': '1.13.3'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['blaze-html-templates@1.0.1',
    'ecmascript@0.1.6', 'orionjs:base@1.4.0', 'orionjs:dictionary@1.4.0', 'orionjs:collections@1.4.0', 'nicolaslopezj:roles@1.2.0||2.0.0', 'meteorhacks:picker@1.0.3', 'http', 'matb33:collection-hooks@0.8.1']);

  api.use(['orionjs:bootstrap@1.4.0', 'orionjs:materialize@1.4.0', 'orionjs:pages@1.4.0', 'aldeed:simple-schema@1.3.3', 'matb33:collection-hooks@0.8.1'], 'client', { weak: true });

  api.addFiles('exporter.js');
  api.addFiles('exporter_server.js', 'server');
  api.addFiles(['exporter_bootstrap.html', 'exporter_materialize.html', 'exporter_client.js'], 'client');
});
