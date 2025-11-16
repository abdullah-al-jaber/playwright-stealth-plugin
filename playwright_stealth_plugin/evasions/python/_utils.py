import logging
import typing

import playwright.async_api

logger = logging.getLogger("playwright_stealth_plugin")
variables: typing.Dict[str, str] = {}
scripts: typing.List[str] = []
options_modifiers: typing.List[typing.Callable] = []


def read_script(script_path: str) -> str:
    with open(script_path, "r") as script:
        return script.read()

async def run(playwright: playwright.async_api.Playwright):
    script = read_script(f"../javascript/.js")
    scripts.append(script)
    logger.info(f"RUN: {__name__}")