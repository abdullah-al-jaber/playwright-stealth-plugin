import playwright.sync_api
import playwright_stealth_plugin

with playwright.sync_api.sync_playwright() as pw:
    playwright_stealth_plugin.sync_apply(pw)
    browser = pw.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto("https://google.com/")
    input("PRESS ENTER")