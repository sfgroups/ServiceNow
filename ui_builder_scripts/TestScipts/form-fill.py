from playwright.sync_api import sync_playwright, TimeoutError

instance_url = "https://your-instance.service-now.com"
username = "your_username"
password = "your_password"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()

    # Login to ServiceNow
    page.goto(f"{instance_url}/login.do")
    page.fill("input#user_name", username)
    page.fill("input#user_password", password)
    page.click("button#sysverb_login")
    page.wait_for_url("**/navpage.do", timeout=10000)

    # Navigate to change request list view
    page.goto(f"{instance_url}/change_request_list.do")
    page.wait_for_selector('button.list_header_button', timeout=10000)

    # Click Refresh List button (top-left corner usually)
    refresh_button = page.locator('button[aria-label="Refresh list"]')
    refresh_button.click()

    # Wait for table data to reload
    page.wait_for_selector('table.list2_table', timeout=10000)

    # Ensure table has at least two rows
    rows = page.locator('table.list2_table tbody tr')
    row_count = rows.count()

    if row_count >= 2:
        print("Found at least two rows, clicking first column links")

        for i in range(2):
            row = rows.nth(i)
            # Click the first column (reference link)
            first_col_link = row.locator("td:nth-child(3) a")  # adjust to nth-child(2) if your layout differs
            first_col_link.click()

            # Wait for form view to load and go back
            page.wait_for_url("**.do", timeout=10000)
            page.go_back()
            page.wait_for_selector('table.list2_table', timeout=10000)
    else:
        print("Less than two rows of data found.")

    browser.close()
