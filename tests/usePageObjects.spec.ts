import { test } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';
import { faker } from '@faker-js/faker';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test('Navigate to form page @smoke @regression', async ({ page }) => {
    const pm = new PageManager(page);
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage();
    await pm.navigateTo().smartTablePage();
    await pm.navigateTo().toastrPage();
    await pm.navigateTo().tooltipPage();
});

test('parametized methods @smoke', async ({ page }) => {
    const pm = new PageManager(page);
    const randomFullName = faker.person.fullName();
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`;

    await pm.navigateTo().formLayoutsPage();
    await pm.onFormLayoutsPage().submitUsingTheGrigdFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 2');
    await page.screenshot({ path: 'screenshots/form-layouts-page.png' });
    const buffer = await page.screenshot();
    // console.log(buffer.toString('base64'));
    await pm.onFormLayoutsPage().sumbitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, false);
    await page.locator('nb-card', {hasText: "Inline form"}).screenshot({path: 'screenshots/inlineForm.png'});
    await pm.navigateTo().datepickerPage();
    await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(15);
    await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(15, 20);
})

test.only('Testing with argos ci', async ({ page }) => {
    const pm = new PageManager(page);
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage();
});