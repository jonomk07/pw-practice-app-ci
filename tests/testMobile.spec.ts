import { test, expect } from "@playwright/test";


test('input fields', async ({page}, testInfo) => {

    await page.goto('/')
    if (testInfo.project.name == 'mobile') {
        await page.locator('.sidebar-toggle').click();
    }
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
      if (testInfo.project.name == 'mobile') {
        await page.locator('.sidebar-toggle').click();
    }
    const usingGridEmailInput = page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: 'Email' });
    await usingGridEmailInput.fill('test@test.com');
    await usingGridEmailInput.clear();
    await usingGridEmailInput.type('test2@test.com');
})