var bodyParser = Npm.require('body-parser'); // using meteorhacks:npm package
Picker.middleware(bodyParser.json({ limit: '100mb' }));

Picker.route('/admin/download-export-users/:key', function(params, req, res, next) {
  var userId = Roles.keys.getUserId(params.key);
  if (!userId || !Roles.userHasPermission(userId, 'nicolaslopezj.orionExport')) {
    res.end('The user is not authorized to perform this action');
    return;
  }

  var data = {};

  data.dictionary = orion.dictionary.findOne();
  if (exportPages) {
    data.pages = pages.find().fetch();
  }
  data.collections = {};

  _.each(collections, function(collection) {
    data.collections[collection._name] = collection.find().fetch();
  });

  data.users = Meteor.users.find().fetch();
  if (Roles._collection) {
    data.roles = Roles._collection.find().fetch();
  }

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=backup.orionexport');

  var json = JSON.stringify(data);
  res.end(json);
});

Picker.route('/admin/download-export/:key', function(params, req, res, next) {
  var userId = Roles.keys.getUserId(params.key);
  if (!userId || !Roles.userHasPermission(userId, 'nicolaslopezj.orionExport')) {
    throw new Meteor.Error('unauthorized', 'The user is not authorized to perform this action');
  }

  var data = {};

  data.dictionary = orion.dictionary.findOne();
  if (exportPages) {
    data.pages = pages.find().fetch();
  }
  data.collections = {};

  _.each(collections, function(collection) {
    data.collections[collection._name] = collection.find().fetch();
  });

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=backup.orionexport');

  var json = JSON.stringify(data);
  res.end(json);
});

Picker.route('/admin/import-data/:key', function(params, req, res, next) {
  var userId = Roles.keys.getUserId(params.key);
  if (!userId || !Roles.userHasPermission(userId, 'nicolaslopezj.orionExport')) {
    throw new Meteor.Error('unauthorized', 'The user is not authorized to perform this action');

  }

  try {
    var json = req.body.json;
    var data = JSON.parse(json);

    // import dictionary
    orion.dictionary.remove({});
    orion.dictionary.insert(data.dictionary);

    // import pages
    if (exportPages) {
      orion.pages.collection.remove({});
      data.pages.forEach(function(page) {
        orion.pages.collection.insert(page);
      });
    }

    // import collections
    _.each(collections, function(collection) {
      var collectionData = data.collections[collection._name];
      if (_.isArray(collectionData)) {
        if (collection.direct) {
          collection.direct.remove({});
        } else {
          collection.remove({});
        }
        _.each(collectionData, function(doc) {
          if (collection.direct && collection._c2) {
            collection.direct.insert(doc, { validate: false, filter: false, getAutoValues: false, removeEmptyStrings: false });
          } else {
            collection.insert(doc);
          }
        });
      }
    });

    var collectionData = null;

    if (_.has(data, 'users')) {
      collectionData = data.users;
      if (_.isArray(collectionData)) {
        if (Meteor.users.direct) {
          Meteor.users.direct.remove({});
        } else {
          Meteor.users.remove({});
        }
        _.each(collectionData, function(doc) {
          if (Meteor.users.direct && Meteor.users._c2) {
            Meteor.users.direct.insert(doc, { validate: false, filter: false, getAutoValues: false, removeEmptyStrings: false });
          } else {
            Meteor.users.insert(doc);
          }
        });
      }
    }

    if (_.has(data, 'roles')) {
      collectionData = data.roles;
      if (_.isArray(collectionData)) {
        if (Roles._collection) {
          Roles._collection.remove({});
          _.each(collectionData, function(doc) {
            Roles._collection.insert(doc);
          });
        } else {
          Roles._oldCollection.remove({});
          _.each(collectionData, function(doc) {
            Roles._oldCollection.insert(doc);
          });
        }

      }
    }

  } catch (e) {
    console.log(e);
    throw new Meteor.Error('parse-error', 'Error parsing the file');
  }
  res.end('ok');
});
