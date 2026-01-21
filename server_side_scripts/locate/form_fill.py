from playwright.sync_api import sync_playwright, expect

def select_servicenow_multi_user(page, user_to_select="myuser1"):
    # 1. Locate the input field. ServiceNow multi-selects often use 
    # partial IDs like 'sys_display.u_additional_user' or 'glide_list_...'
    user_input = page.locator('input[id*="additional_user"]')

    # 2. Click to focus and then fill with the search term
    user_input.click()
    user_input.fill(user_to_select)

    # 3. Wait for the dynamic search result to appear in the results list.
    # ServiceNow typically uses '.ac_results li' for auto-complete results.
    # We use a locator with text to be precise.
    search_result = page.locator(".ac_results li", has_text=user_to_select)
    
    # 4. Explicitly wait for visibility (handles slow network/server response)
    search_result.wait_for(state="visible", timeout=15000)

    # 5. Click the matching result to add it to the list
    search_result.click()

    # 6. Stability Check: Verify the user appears as a 'pill' or 'tag' in the field
    # Most ServiceNow multi-selects render selected items in a 'glide-list-item' container
    selected_pill = page.locator(".glide-list-item, .input-tag", has_text=user_to_select)
    expect(selected_pill).to_be_visible()

# Example usage in a standard Playwright context
with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    # page.goto("your_servicenow_form_url")
    select_servicenow_multi_user(page, "myuser1")
    browser.close()
