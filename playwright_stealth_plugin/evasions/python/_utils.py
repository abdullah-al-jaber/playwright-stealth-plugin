import logging
import typing
import json

import playwright.async_api

logger = logging.getLogger("playwright_stealth_plugin")
variables: typing.Dict[str, typing.Any] = {}
scripts: typing.List[str] = []
options_modifiers: typing.List[typing.Callable] = []

def read_json(json_path: str) -> typing.Any:
    with open(json_path, "r") as json_file:
        return json.load(json_file)

def read_script(script_path: str) -> str:
    with open(script_path, "r") as script_file:
        return script_file.read()

async def run(playwright: playwright.async_api.Playwright):
    script = read_script(f"../javascript/_utils.js")
    scripts.append(script)
    logger.info(f"RUN: {__name__}")