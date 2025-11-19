import typing
import playwright.async_api

browser_options = ...
context_options = ...
original_launch: typing.Callable[..., typing.Awaitable[playwright.async_api.Browser]]
original_new_context: typing.Callable[..., typing.Awaitable[playwright.async_api.BrowserContext]]
original_launch_persistent_context: typing.Callable[..., typing.Awaitable[playwright.async_api.BrowserContext]]
async def plugin_code(context: playwright.async_api.BrowserContext): # -> None:
    ...

async def custom_launch(self: playwright.async_api.BrowserType, *args: typing.Any, **kwargs: typing.Any): # -> Browser:
    ...

async def custom_new_context(self: playwright.async_api.Browser, *args: typing.Any, **kwargs: typing.Any): # -> BrowserContext:
    ...

async def custom_launch_persistent_context(self: playwright.async_api.BrowserType, *args: typing.Any, **kwargs: typing.Any): # -> BrowserContext:
    ...

async def apply(playwright: playwright.async_api.Playwright): # -> None:
    ...

__all__ = ["apply"]
