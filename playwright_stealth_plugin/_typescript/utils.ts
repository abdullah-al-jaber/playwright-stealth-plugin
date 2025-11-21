const utils: any = {};

utils.stripProxyFromErrors = (handler: Record<string, any> = {}) => {
  const handler_name = (Math.random() + 1).toString(36).substring(2);
  (window as any)[handler_name] = {};
  const traps = Object.getOwnPropertyNames(handler);
  traps.forEach((trap) => {
    (window as any)[handler_name][trap] = function () {
      try {
        return handler[trap].apply(this, arguments || []);
      } catch (err: any) {
        if (!err || !err.stack || !err.stack.includes(`at `)) {
          throw err;
        }

        const stripWithBlacklist = (stack: string) => {
          const blacklist = [
            `at Reflect.${trap} `,
            `at Object.${trap} `,
            `at window.<computed>.<computed> [as ${trap}] `,
          ];
          return err.stack
            .split("\n")
            .filter((line, index) => index !== 1)
            .filter(
              (line) => !blacklist.some((bl) => line.trim().startsWith(bl)),
            )
            .join("\n");
        };

        const stripWithAnchor = (stack: string) => {
          const stackArr = stack.split("\n");
          const anchor = `at window.<computed>.<computed> [as ${trap}] `;
          const anchorIndex = stackArr.findIndex((line) =>
            line.trim().startsWith(anchor),
          );
          if (anchorIndex === -1) {
            return false;
          }
          stackArr.splice(1, anchorIndex);
          return stackArr.join("\n");
        };

        err.stack = stripWithAnchor(err.stack) || stripWithBlacklist(err.stack);

        throw err;
      }
    };
  });
  return (window as any)[handler_name];
};

utils.stripErrorWithAnchor = (err: any, anchor: string) => {
  const stackArr = err.stack.split("\n");
  const anchorIndex = stackArr.findIndex((line) =>
    line.trim().startsWith(anchor),
  );
  if (anchorIndex === -1) {
    return err;
  }
  stackArr.splice(1, anchorIndex);
  err.stack = stackArr.join("\n");
  return err;
};

utils.replaceProperty = (
  obj: any,
  propName: string,
  descriptorOverrides: Record<string, any> = {},
) => {
  return Object.defineProperty(obj, propName, {
    ...(Object.getOwnPropertyDescriptor(obj, propName) || {}),
    ...descriptorOverrides,
  });
};

utils.preloadCache = () => {
  if (utils.cache) {
    return;
  }
  utils.cache = {
    Reflect: {
      get: Reflect.get.bind(Reflect),
      apply: Reflect.apply.bind(Reflect),
    },
    nativeToStringStr: Function.toString.toString(),
  };
};

utils.makeNativeString = (name: string = "") => {
  utils.preloadCache();
  return utils.cache.nativeToStringStr.replace("toString", name || "");
};

utils.patchToString = (obj: any, str: string = "") => {
  utils.preloadCache();
  const toStringProxy = new Proxy(Function.prototype.toString, {
    apply: function (target, ctx) {
      if (ctx === Function.prototype.toString) {
        return utils.makeNativeString("toString");
      }
      if (ctx === obj) {
        return str || utils.makeNativeString(obj.name);
      }
      const hasSameProto = Object.getPrototypeOf(
        Function.prototype.toString,
      ).isPrototypeOf(ctx.toString);
      if (!hasSameProto) {
        return ctx.toString();
      }
      return target.call(ctx);
    },
  });
  utils.replaceProperty(Function.prototype, "toString", {
    value: toStringProxy,
  });
};

utils.patchToStringNested = (obj: any = {}) => {
  return utils.execRecursively(obj, ["function"], utils.patchToString);
};

utils.redirectToString = (proxyObj: any, originalObj: any) => {
  utils.preloadCache();
  const toStringProxy = new Proxy(Function.prototype.toString, {
    apply: function (target, ctx) {
      if (ctx === Function.prototype.toString) {
        return utils.makeNativeString("toString");
      }
      if (ctx === proxyObj) {
        const fallback = () =>
          originalObj && originalObj.name
            ? utils.makeNativeString(originalObj.name)
            : utils.makeNativeString(proxyObj.name);
        return originalObj + "" || fallback();
      }
      const hasSameProto = Object.getPrototypeOf(
        Function.prototype.toString,
      ).isPrototypeOf(ctx.toString);
      if (!hasSameProto) {
        return ctx.toString();
      }
      return target.call(ctx);
    },
  });
  utils.replaceProperty(Function.prototype, "toString", {
    value: toStringProxy,
  });
};

utils.replaceWithProxy = (
  obj: any,
  propName: string,
  handler: Record<string, any>,
) => {
  utils.preloadCache();
  const originalObj = obj[propName];
  const proxyObj = new Proxy(
    obj[propName],
    utils.stripProxyFromErrors(handler),
  );
  utils.replaceProperty(obj, propName, { value: proxyObj });
  utils.redirectToString(proxyObj, originalObj);
  return true;
};

utils.mockWithProxy = (
  obj: any,
  propName: string,
  pseudoTarget: any,
  handler: Record<string, any>,
) => {
  utils.preloadCache();
  const proxyObj = new Proxy(pseudoTarget, utils.stripProxyFromErrors(handler));
  utils.replaceProperty(obj, propName, { value: proxyObj });
  utils.patchToString(proxyObj);
  return true;
};

utils.createProxy = (pseudoTarget: any, handler: Record<string, any>) => {
  utils.preloadCache();
  const proxyObj = new Proxy(pseudoTarget, utils.stripProxyFromErrors(handler));
  utils.patchToString(proxyObj);
  return proxyObj;
};

utils.splitObjPath = (objPath: string) => ({
  objName: objPath.split(".").slice(0, -1).join("."),
  propName: objPath.split(".").slice(-1)[0],
});

utils.replaceObjPathWithProxy = (
  objPath: string,
  handler: Record<string, any>,
) => {
  const { objName, propName } = utils.splitObjPath(objPath);
  const obj = eval(objName);
  return utils.replaceWithProxy(obj, propName, handler);
};

utils.execRecursively = (
  obj: any = {},
  typeFilter: string[] = [],
  fn: Function,
) => {
  function recurse(obj: any) {
    for (const key in obj) {
      if (obj[key] === undefined) continue;
      if (obj[key] && typeof obj[key] === "object") {
        recurse(obj[key]);
      } else {
        if (obj[key] && typeFilter.includes(typeof obj[key])) {
          fn.call(this, obj[key]);
        }
      }
    }
  }
  recurse(obj);
  return obj;
};

utils.stringifyFns = (
  fnObj: Record<string, Function> = { hello: () => "world" },
) => {
  return Object.fromEntries(
    Object.entries(fnObj)
      .filter(([_, value]) => typeof value === "function")
      .map(([key, value]) => [key, value.toString()]),
  );
};

utils.materializeFns = (
  fnStrObj: Record<string, string> = { hello: "() => 'world'" },
) => {
  return Object.fromEntries(
    Object.entries(fnStrObj).map(([key, value]) => {
      if (value.startsWith("function")) {
        return [key, eval(`() => ${value}`)()];
      } else {
        return [key, eval(value)];
      }
    }),
  );
};

utils.arrayEqual = (arr1: any[], arr2: any[]) =>
  arr1.length === arr2.length && arr1.every((v, i) => v === arr2[i]);

(window as any).utils = utils;
