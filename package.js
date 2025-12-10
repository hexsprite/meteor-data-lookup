Package.describe({
  name    : "sylido:data-lookup",
  summary : "Reactively lookup a field in the object",
  version : "0.4.0",
  git     : "https://github.com/sylido/meteor-data-lookup.git"
});

Package.onUse(function (api) {
  api.versionsFrom(["2.3", "3.0"]);

  // Core dependencies.
  api.use([
    "ecmascript",
    "underscore",
    "tracker"
  ]);

  // 3rd party dependencies.
  api.use([
    "sylido:computed-field"
  ]);

  api.export("DataLookup");

  api.mainModule("lib.js");
});

Package.onTest(function (api) {
  api.versionsFrom(["2.3", "3.0"]);

  // Core dependencies.
  api.use([
    "ecmascript",
    "random",
    "underscore",
    "reactive-var"
  ]);

  // Internal dependencies.
  api.use([
    "sylido:data-lookup"
  ]);

  api.addFiles([
    "tests.js"
  ]);
});
