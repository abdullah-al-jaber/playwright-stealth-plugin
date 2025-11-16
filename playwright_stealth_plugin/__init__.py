import re
import sys

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


async def apply(playwright: playwright.async_api.Playwright | None):
    for name, module in sys.modules.items():
        if re.match(r"(evasions)\.(python)\.(.+)", name):
            await module.run(playwright)
    