import logging
import typing
import json


logger = logging.getLogger("playwright_stealth_plugin")
variables: typing.Dict[str, typing.Any] = {}
scripts: typing.List[str] = []
options: typing.Dict[str, typing.Dict] = {
    "browser": {},
    "context": {},
}


def read_json(json_path: str) -> typing.Any:
    with open(json_path, "r") as json_file:
        return json.load(json_file)


def read_script(script_path: str) -> str:
    with open(script_path, "r") as script_file:
        return script_file.read()


async def run():
    script = read_script(f"../javascript/_utils.js")
    scripts.append(script)
    logger.info(f"RUN: {__name__}")
