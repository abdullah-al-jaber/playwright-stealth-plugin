import playwright.sync_api
import playwright_stealth_plugin

with playwright.sync_api.sync_playwright() as p:
    playwright_stealth_plugin.sync_apply(p)
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto("https://example.com")
    print(page.title())
    input("Press Enter to close the browser...")
    browser.close()
