'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var execa = _interopDefault(require('execa'));
var enquirer = require('enquirer');
var colors = _interopDefault(require('ansi-colors'));
var writePackage = _interopDefault(require('write-pkg'));
var updateNotifier = _interopDefault(require('update-notifier'));
var sortKeys = _interopDefault(require('sort-keys'));
var fs = require('fs');
var path = require('path');
var isPathInside = _interopDefault(require('is-path-inside'));
var isPathInCwd = _interopDefault(require('is-path-in-cwd'));
var readPkg = require('read-pkg');
var cpFile = _interopDefault(require('cp-file'));
var latestVersion = _interopDefault(require('latest-version'));

const TOOLS_DIR = path.join(__dirname, '../tools/');
const CWD = process.cwd();

function fileParser(file, directory) {
  if (typeof file === 'string') {
    file = {
      source: file
    };
  }

  let _file = file,
      source = _file.source,
      _file$dest = _file.dest,
      destination = _file$dest === void 0 ? source : _file$dest;
  source = path.join(directory, source);

  if (!isPathInside(source, directory) || !fs.existsSync(source)) {
    return null;
  }

  destination = path.join(CWD, destination);

  if (!isPathInCwd(destination)) {
    return null;
  }

  const exists = fs.existsSync(destination);
  return {
    file: path.relative(directory, source),
    source,
    sourceRelative: path.relative(directory, source),
    dest: destination,
    destRelative: path.relative(CWD, destination),
    exists
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

const package_ = readPkg.sync({
  normalize: false
});

const hasOwnProperty = Object.prototype.hasOwnProperty;

const _package_$dependencie = package_.dependencies,
      dependencies = _package_$dependencie === void 0 ? {} : _package_$dependencie,
      _package_$devDependen = package_.devDependencies,
      developmentDependencies = _package_$devDependen === void 0 ? {} : _package_$devDependen;
const packageDependencies = {
  any: _objectSpread2({}, dependencies, {}, developmentDependencies),
  dependencies,
  devDependencies: developmentDependencies
};

function isDependencyListed(dependency, type) {
  return hasOwnProperty.call(packageDependencies[type || 'any'], dependency);
}

function dependencyParser(dependency) {
  if (typeof dependency === 'string') {
    dependency = {
      name: dependency
    };
  }

  const _dependency = dependency,
        name = _dependency.name,
        _dependency$version = _dependency.version,
        version = _dependency$version === void 0 ? null : _dependency$version,
        _dependency$type = _dependency.type,
        type = _dependency$type === void 0 ? null : _dependency$type;
  const exists = isDependencyListed(name, type);
  return {
    name,
    version,
    type,
    exists
  };
}

function isUndefined(x) {
  return typeof x === 'undefined';
}

function getPathSegments(keys) {
  if (Array.isArray(keys)) {
    return keys;
  }

  const re = /(?:\[(['"`]?)(.*?)\1\])|(?:(?:^|\.)([^.]+?)(?=$|\.|\[))/g;
  const parts = [];
  let result;

  while (result = re.exec(keys)) {
    let property = result[2];

    if (isUndefined(property)) {
      property = result[3];
    }

    parts.push(property);
  }

  return parts;
}

function isNull(x) {
  return x === null;
}

function isObject(x) {
  const type = typeof x;
  return !isNull(x) && (type === 'object' || type === 'function');
}

function hasProperty(object, path) {
  if (!isObject(object)) {
    return false;
  }

  const seg = getPathSegments(path);
  const length = seg.length;

  for (let i = 0; i < length; i += 1) {
    if (!isObject(object)) {
      return false;
    }

    const property = seg[i];

    if (!(property in object)) {
      return false;
    }

    object = object[property];
  }

  return true;
}

function getValue(object, path) {
  if (!isObject(object)) {
    return null;
  }

  const seg = getPathSegments(path);
  const length = seg.length;

  for (let i = 0; i < length; i += 1) {
    const property = seg[i];

    if (i === length - 1) {
      return object[property];
    }

    if (!isObject(object[property])) {
      return null;
    }

    object = object[property];
  }

  return object;
}

function packageParser({
  key,
  value
}) {
  const segments = getPathSegments(key);
  const exists = hasProperty(package_, segments);
  const original = getValue(package_, segments);
  key = segments.map(seg => `[${JSON.stringify(seg)}]`).join('');
  const equal = JSON.stringify(original) === JSON.stringify(value);
  return {
    key,
    segments,
    value,
    exists,
    original,
    equal
  };
}

function toArray(x) {
  return Array.isArray(x) ? x : [x];
}

function packageToArray(package_) {
  return Array.isArray(package_) ? package_ : Object.keys(package_).reduce((all, key) => [...all, {
    key,
    value: package_[key]
  }], []);
}

function effectsParser(effects, directory) {
  let _effects$files = effects.files,
      files = _effects$files === void 0 ? [] : _effects$files,
      _effects$dependencies = effects.dependencies,
      dependencies = _effects$dependencies === void 0 ? [] : _effects$dependencies,
      _effects$packageJson = effects['package.json'],
      package_ = _effects$packageJson === void 0 ? [] : _effects$packageJson;
  files = toArray(files).map(file => fileParser(file, directory)).filter(Boolean);
  dependencies = toArray(dependencies).map(dependencyParser).filter(Boolean);
  package_ = packageToArray(package_).map(packageParser).filter(Boolean);
  return {
    files,
    dependencies,
    pkg: package_
  };
}

function hasEffects({
  files,
  dependencies,
  pkg: package_
}) {
  return files.length > 0 || dependencies.length > 0 || package_.length > 0;
}

function isExists({
  exists
}) {
  return exists;
}

function isInstalled({
  pkg: package_,
  files,
  dependencies
}) {
  return package_.some(isExists) || files.some(isExists) || dependencies.some(isExists);
}

function _empty() {}

const copyFiles = _async(function (files) {
  return _awaitIgnored(Promise.all(files.map(({
    source,
    dest: destination
  }) => cpFile(source, destination))));
});

function _awaitIgnored(value, direct) {
  if (!direct) {
    return value && value.then ? value.then(_empty) : Promise.resolve();
  }
}

function _async(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

function notExists(x) {
  return !isExists(x);
}

function setValue(object, path, value) {
  if (!isObject(object)) {
    return object;
  }

  const seg = getPathSegments(path);
  const length = seg.length;
  const root = object;

  for (let i = 0; i < length; i += 1) {
    const property = seg[i];

    if (i === length - 1) {
      object[property] = value;
      return root;
    }

    if (!isObject(object[property])) {
      object[property] = {};
    }

    object = object[property];
  }

  return root;
}

function updatePackage(data) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      const _step$value = _step.value,
            key = _step$value.key,
            value = _step$value.value;
      setValue(package_, key, value);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

function _empty$1() {}

const updateDependencies = _async$1(function (dependencies) {
  return _awaitIgnored$1(Promise.all(dependencies.filter(notExists).map(updateDependency)));
});

const updateDependency = _async$1(function ({
  type,
  name
}) {
  const key = [type || 'devDependencies', name];
  return _await(latestVersion(name), function (version) {
    const value = version ? `${version}` : 'latest';
    updatePackage([{
      key,
      value
    }]);
  });
});

function _async$1(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

function _awaitIgnored$1(value, direct) {
  if (!direct) {
    return value && value.then ? value.then(_empty$1) : Promise.resolve();
  }
}

function install({
  effects
}) {
  const files = effects.files,
        dependencies = effects.dependencies,
        package_ = effects.pkg;
  return Promise.all([copyFiles(files), updateDependencies(dependencies), updatePackage(package_)]);
}

const helpers = {
  exists: isExists
};

function getToolConfig(directoryName) {
  const directory = path.join(TOOLS_DIR, directoryName);

  const config = require(directory);

  const _config$name = config.name,
        name = _config$name === void 0 ? directoryName : _config$name,
        _config$install = config.install,
        install$1 = _config$install === void 0 ? install : _config$install;
  const effects = effectsParser(config.effects, directory);
  const isInstalled$1 = (config.isInstalled || isInstalled)(effects, helpers);
  const hasEffects$1 = hasEffects(effects);
  return {
    id: directory,
    name,
    dirName: directoryName,
    dir: directory,
    effects,
    isInstalled: isInstalled$1,
    install: install$1,
    hasEffects: hasEffects$1
  };
}

const directories = fs.readdirSync(TOOLS_DIR).sort();
const tools = directories.map(getToolConfig);

function mergeEffectsByKey(tools, key) {
  return tools.reduce((all, {
    effects
  }) => all.concat(effects[key]), []);
}

function sortBy(key) {
  return (l, r) => l[key] > r[key] ? 1 : -1;
}

function notEqualFilter({
  equal
}) {
  return !equal;
}

function printEffects(tools) {
  const files = mergeEffectsByKey(tools, 'files').sort(sortBy('dest'));
  const dependencies = mergeEffectsByKey(tools, 'dependencies').sort(sortBy('name'));
  const package_ = mergeEffectsByKey(tools, 'pkg').filter(notEqualFilter).sort(sortBy('key'));

  if (files.length !== 0) {
    console.log(colors.yellowBright(`${files.length} file${files.length > 1 ? 's' : ''}`));
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const _step$value = _step.value,
              sourceRelative = _step$value.sourceRelative,
              destinationRelative = _step$value.destRelative,
              exists = _step$value.exists;
        console.log(` - ${destinationRelative}${exists ? colors.red(' (overwrite)') : ''}`); // console.log(`    from ${colors.gray(sourceRelative)}`)
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    console.log('');
  }

  if (dependencies.length !== 0) {
    console.log(colors.yellowBright(`${dependencies.length} ${files.length > 1 ? 'dependencies' : 'dependency'} add to package.json`));
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = dependencies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        const _step2$value = _step2.value,
              name = _step2$value.name,
              version = _step2$value.version,
              type = _step2$value.type,
              exists = _step2$value.exists;
        console.log(` - ${name}${exists ? colors.red(' (overwrite)') : ''}`);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    console.log('');
  }

  if (package_.length !== 0) {
    console.log(colors.yellowBright(`${package_.length} change${package_.length > 1 ? 's' : ''} in package.json`));
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = package_[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        const _step3$value = _step3.value,
              key = _step3$value.key,
              segments = _step3$value.segments,
              original = _step3$value.original,
              value = _step3$value.value,
              exists = _step3$value.exists,
              equal = _step3$value.equal;
        console.log(` - ${segments.join('.')}${exists ? colors.red(' (overwrite)') : ''}`);

        if (!equal) {
          if (original) {
            console.log(`    from: ${colors.gray(JSON.stringify(original))}`);
            console.log(`      to: ${colors.gray(JSON.stringify(original))}`);
          } else {
            console.log(`    ${colors.gray(JSON.stringify(original))}`);
          }
        }
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    console.log('');
  }

  return {
    files,
    dependencies,
    pkg: package_
  };
}

function _call(body, then, direct) {
  if (direct) {
    return then ? then(body()) : body();
  }

  try {
    var result = Promise.resolve(body());
    return then ? result.then(then) : result;
  } catch (e) {
    return Promise.reject(e);
  }
}

const run = _async$2(function () {
  return _call(selectTools, function (selectedTools) {
    let _exit3 = false;

    if (selectedTools.length === 0) {
      console.log('nothing to install.');
      return false;
    }

    const _printEffects = printEffects(selectedTools),
          files = _printEffects.files,
          dependencies = _printEffects.dependencies,
          package_$1 = _printEffects.pkg;

    return _invoke(function () {
      if (files.length !== 0 || dependencies.length !== 0 || package_$1.length !== 0) {
        return _await$1(enquirer.prompt({
          type: 'confirm',
          name: 'confirmed',
          message: `confirmed effects above?`,
          initial: true
        }), function ({
          confirmed
        }) {
          if (!confirmed) {
            _exit3 = true;
            return false;
          }
        });
      }
    }, function (_result3) {
      return _exit3 ? _result3 : _await$1(Promise.all(selectedTools.map(tool => tool.install(tool))), function () {
        for (var _i = 0, _arr = ['dependencies', 'scripts', 'devDependencies']; _i < _arr.length; _i++) {
          const key = _arr[_i];

          if (package_[key]) {
            package_[key] = sortKeys(package_[key]);
          }
        }

        return _await$1(writePackage(package_), function () {
          return _invoke(function () {
            if (dependencies.length !== 0) {
              return _callIgnored(installPackages);
            }
          }, function () {
            return true;
          });
        });
      });
    });
  });
});

function _invoke(body, then) {
  var result = body();

  if (result && result.then) {
    return result.then(then);
  }

  return then(result);
}

const installPackages = _async$2(function () {
  return _await$1(enquirer.prompt({
    type: 'confirm',
    name: 'confirmed',
    message: `run ${NPM_CLIENT} to install?`,
    initial: false
  }), function ({
    confirmed
  }) {
    if (!confirmed) {
      return;
    }

    const arguments_ =  [] ;
    return _awaitIgnored$2(execa(NPM_CLIENT, arguments_).stdout.pipe(process.stdout));
  });
});

function _await$1(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

const selectTools = _async$2(function () {
  const choices = tools.map(({
    id,
    name,
    isInstalled
  }, index, {
    length
  }) => {
    const maxIndexLength = String(length).length + 1;
    const message = [colors.gray(`${index + 1}.`.padStart(maxIndexLength)), isInstalled ? colors.red('[installed]') : '', colors.bold(name)].filter(Boolean).join(' ');
    return {
      name,
      value: id,
      message
    };
  });
  return _await$1(enquirer.prompt({
    type: 'multiselect',
    name: 'selectedIds',
    message: 'select config(s) you want install:',
    choices,
    pageSize: Math.min(choices.length, 15)
  }), function ({
    selectedIds
  }) {
    let _exit = false;
    return _invoke(function () {
      if (selectedIds.length === 0) {
        return _call(selectTools, function (selected) {
          _exit = true;
          return selected;
        });
      }
    }, function (_result) {
      if (_exit) return _result;
      // FIXME: currently enquirer returns names instead of values
      // issue: https://github.com/enquirer/enquirer/issues/121
      const selected = tools.filter(({
        name
      }) => selectedIds.includes(name)); // const selected = tools.filter(({id}) => selectedIds.includes(id))

      const names = selected.map(({
        name
      }) => name);
      return _await$1(enquirer.prompt({
        type: 'confirm',
        name: 'confirmed',
        message: `install ${selected.length} selected config(s): ${names.join(',')}?`,
        initial: true
      }), function ({
        confirmed
      }) {
        let _exit2 = false;
        return _invoke(function () {
          if (!confirmed) {
            return _call(selectTools, function (selected) {
              _exit2 = true;
              return selected;
            });
          }
        }, function (_result2) {
          return _exit2 ? _result2 : selected;
        });
      });
    });
  });
});

function _async$2(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
} // const HAS_YARN = hasYarn()
// const NPM_CLIENT = HAS_YARN ? 'yarn' : 'npm'


function _empty$2() {}

function _awaitIgnored$2(value, direct) {
  if (!direct) {
    return value && value.then ? value.then(_empty$2) : Promise.resolve();
  }
}

function _callIgnored(body, direct) {
  return _call(body, _empty$2, direct);
}

updateNotifier({
  pkg: require('../package.json')
}).notify();
const NPM_CLIENT = 'yarn';
run();
var cli = {
  run
};

module.exports = cli;
