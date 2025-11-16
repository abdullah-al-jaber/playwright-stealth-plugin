import playwright.async_api
import _utils

async def run(playwright: playwright.async_api.Playwright):
    script = _utils.read_script(f"../javascript/{__name__.split(".")[-1]}.js")
    _utils.init_scripts.append(script)
    _utils.logger.info(f"RUN: {__name__}")
