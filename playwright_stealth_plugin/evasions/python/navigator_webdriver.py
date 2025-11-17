import playwright.async_api
import _utils

async def run(playwright: playwright.async_api.Playwright):
    script = _utils.read_script(f"../javascript/{__name__.split(".")[-1]}.js")
    _utils.scripts.append(script)
    _utils.logger.info(f"RUN: {__name__}")

function beforeLaunch(options) {
  // If disable-blink-features is already passed, append the AutomationControlled switch
  const idx = options.args.findIndex((arg) =>
    arg.startsWith("--disable-blink-features=")
  );
  if (idx !== -1) {
    const arg = options.args[idx];
    options.args[idx] = `${arg},AutomationControlled`;
  } else {
    options.args.push("--disable-blink-features=AutomationControlled");
  }
}