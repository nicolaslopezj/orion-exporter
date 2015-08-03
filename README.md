Orion Exporter
==============

Export and import all your Orion data.

It can export all the collections and the dictionary.

When importing it will remove all documents stored.

The ids of the documents will be kept.

### Installing

```
meteor add nicolaslopezj:orion-exporter
```

Now you will see the tab in the admin panel.

#### Security

Orion Exportes uses [```nicolaslopezj:roles```](http://github.com/nicolaslopezj/roles) to secure the import and export. The name of the action is ```nicolaslopezj.orionExport```.
