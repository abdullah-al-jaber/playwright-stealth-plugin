import playwright.sync_api
import playwright_stealth_plugin


def main():
    with playwright.sync_api.sync_playwright() as pw:
        playwright_stealth_plugin.sync_apply(pw)
        browser = pw.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()
