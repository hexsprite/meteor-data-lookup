export class DataLookup {
  static lookup(obj, path) {
    if (_.isString(path)) {
      path = path.split('.');
    }

    if (_.isFunction(obj)) {
      obj = obj();
    }

    if (!_.isArray(path)) {
      return obj;
    }

    while (path.length > 0) {
      const segment = path.shift();
      if (_.isObject(obj) && segment in obj) {
        obj = obj[segment];
        if (_.isFunction(obj)) {
          obj = obj();
        }
      } else {
        return undefined;
      }
    }

    return obj;
  }

  static get(obj, path, equalsFunc) {
    if (!Tracker.active) {
      return this.lookup(obj, path);
    }

    const result = new ComputedField(() => {
      return this.lookup(obj, path);
    }, equalsFunc);

    return result();
  }
}

