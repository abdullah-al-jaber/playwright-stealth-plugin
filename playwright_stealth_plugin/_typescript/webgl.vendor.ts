const getParameterProxyHandler = {
  apply: function (target: Function, ctx: any, args: any[]) {
    const param = (args || [])[0];
    if (param === 37445) {
      return opts.webgl_vendor || "Intel Inc.";
    }
    if (param === 37446) {
      return opts.webgl_renderer || "Intel Iris OpenGL Engine";
    }
    return utils.cache.Reflect.apply(target, ctx, args);
  },
};

const addProxy = (obj: any, propName: string) => {
  utils.replaceWithProxy(obj, propName, getParameterProxyHandler);
};

addProxy(WebGLRenderingContext.prototype, "getParameter");
addProxy(WebGL2RenderingContext.prototype, "getParameter");
