import re
import sys
import typing
import json

import playwright.async_api
import evasions.python._utils
import evasions.python.chrome_csi
import evasions.python.chrome_app
import evasions.python.chrome_load_times
import evasions.python.chrome_runtime
import evasions.python.default_args
import evasions.python.iframe_content_window
import evasions.python.media_codecs
import evasions.python.navigator_hardware_concurrency
import evasions.python.navigator_languages
import evasions.python.navigator_permissions
import evasions.python.navigator_plugins
import evasions.python.navigator_vendor
import evasions.python.navigator_webdriver
import evasions.python.source_url
import evasions.python.user_agent_override
import evasions.python.web_gl_vendor
import evasions.python.window_outer_dimension


async def plugin_code(context: playwright.async_api.BrowserContext):
    for variable_name, variable_value in evasions.python._utils.variables.items():
        script = f"window.{variable_name} = {json.dumps(variable_value)};"
        await context.add_init_script(script)
    for script in evasions.python._utils.scripts:
        await context.add_init_script(script)


async def custom_launch(self, *args: typing.Any, **kwargs: typing.Any) -> playwright.async_api.Browser:
    browser: playwright.async_api.Browser = await original_launch(self, *args, **kwargs)
    global original_new_context
    original_new_context = type(browser).new_context
    type(browser).new_context = custom_new_context
    return browser


async def custom_new_context(self, *args: typing.Any, **kwargs: typing.Any) -> playwright.async_api.BrowserContext:
    context: playwright.async_api.BrowserContext = await original_new_context(self, *args, **kwargs)
    await plugin_code(context)
    return context


async def custom_launch_persistent_context(self, *args: typing.Any, **kwargs: typing.Any) -> playwright.async_api.BrowserContext:
    context: playwright.async_api.BrowserContext = await original_launch_persistent_context(self, *args, **kwargs)
    await plugin_code(context)
    return context


async def apply(playwright: playwright.async_api.Playwright):
    for name, module in sys.modules.items():
        if re.match(r"(evasions)\.(python)\.(.+)", name):
            await module.run(playwright)

    global original_launch, original_launch_persistent_context
    original_launch = type(playwright.chromium).launch
    original_launch_persistent_context = type(playwright.chromium).launch_persistent_context

    type(playwright.chromium).launch = custom_launch
    type(playwright.chromium).launch_persistent_context = custom_launch_persistent_context


# [line-length : 150]
