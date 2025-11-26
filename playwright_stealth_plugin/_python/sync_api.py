import os
import sys
import typing

import playwright.sync_api
import playwright_stealth_plugin._python.config

scripts_contents: typing.List[str] = []
browser_options = playwright_stealth_plugin._python.config.browser_options
context_options = playwright_stealth_plugin._python.config.context_options

original_new_page: typing.Callable[..., playwright.sync_api.Page]
original_new_context: typing.Callable[..., playwright.sync_api.BrowserContext]

original_launch: typing.Callable[..., playwright.sync_api.Browser]
original_launch_persistent_context: typing.Callable[..., playwright.sync_api.BrowserContext]


def plugin_code(context_or_page: playwright.sync_api.Page | playwright.sync_api.BrowserContext):
    for script_content in scripts_contents:
        context_or_page.add_init_script(script_content)


def custom_new_page(self: playwright.sync_api.Browser | playwright.sync_api.BrowserContext, *args: typing.Any, **kwargs: typing.Any):
    kwargs = {**context_options, **kwargs}
    page = original_new_page(self, *args, **kwargs)
    plugin_code(page)
    return page


def custom_launch(self: playwright.sync_api.BrowserType, *args: typing.Any, **kwargs: typing.Any):
    kwargs = {**browser_options, **kwargs}
    browser = original_launch(self, *args, **kwargs)
    global original_new_context, original_new_page
    original_new_context = type(browser).new_context
    original_new_page = type(browser).new_page
    type(browser).new_page = custom_new_page
    type(browser).new_context = custom_new_context
    return browser


def custom_new_context(self: playwright.sync_api.Browser, *args: typing.Any, **kwargs: typing.Any):
    kwargs = {**context_options, **kwargs}
    context = original_new_context(self, *args, **kwargs)
    plugin_code(context)
    return context


def custom_launch_persistent_context(self: playwright.sync_api.BrowserType, *args: typing.Any, **kwargs: typing.Any):
    kwargs = {**browser_options, **context_options, **kwargs}
    context = original_launch_persistent_context(self, *args, **kwargs)
    global original_new_page, original_new_cdp_session
    original_new_page = type(context).new_page
    original_new_cdp_session = type(context).new_cdp_session
    type(context).new_page = custom_new_page
    return context


def apply(playwright: playwright.sync_api.Playwright):
    for script_name in playwright_stealth_plugin._python.config.script_names:
        relative_path = os.path.join(os.path.dirname(sys.__file__), playwright_stealth_plugin._python.config.script_folder, script_name)
        absolute_path = os.path.abspath(relative_path)
        with open(absolute_path, mode="r", encoding="utf-8") as script_file:
            script_content = script_file.read()
            scripts_contents.append(script_content)
    global original_launch, original_launch_persistent_context
    original_launch = type(playwright.chromium).launch
    original_launch_persistent_context = type(playwright.chromium).launch_persistent_context
    type(playwright.chromium).launch = custom_launch
    type(playwright.chromium).launch_persistent_context = custom_launch_persistent_context
