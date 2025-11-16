import evasions.chrome_csi
import evasions.chrome_app
import evasions.chrome_load_times
import evasions.chrome_runtime
import evasions.default_args
import evasions.iframe_content_window
import evasions.media_codecs
import evasions.navigator_hardware_concurrency
import evasions.navigator_languages
import evasions.navigator_permissions
import evasions.navigator_plugins
import evasions.navigator_vendor
import evasions.navigator_webdriver
import evasions.source_url
import evasions.user_agent_override
import evasions.web_gl_vendor
import evasions.window_outer_dimension


import playwright.sync_api
import playwright.async_api

def sync_apply(playwright: playwright.sync_api.Playwright):
    print(playwright)

async def async_apply(playwright: playwright.async_api.Playwright):
    print(playwright)