const handler = {
  apply: function (target: Function, ctx: any, args: any[]) {
    const param = (args || [])[0];

    if (param && param.name === "notifications") {
      const result = { state: Notification.permission };
      Object.setPrototypeOf(result, PermissionStatus.prototype);
      return Promise.resolve(result);
    }

    return utils.cache.Reflect.apply(...arguments);
  },
};

utils.replaceWithProxy(
  (window.navigator.permissions as any).__proto__,
  "query",
  handler,
);
