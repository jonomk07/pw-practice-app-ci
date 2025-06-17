import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
    await page.goto('/')
});

// The callback is the function that will be executed before each test which is defined in the test.describe block
test.describe('Form Layout Page @block', () => {
    test.describe.configure({ retries: 0 });
     test.describe.configure({ mode: 'serial' });
     
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    });

    test('input fields', async ({ page }, testInfo) => {

        if(testInfo.retry) {
            // do something before retry
            console.log(`Retrying test: ${testInfo.title}, attempt: ${testInfo.retry}`);
        }

        const usingGridEmailInput = page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: 'Email' });

        await usingGridEmailInput.fill('test@test.com');
        await usingGridEmailInput.clear();
        await usingGridEmailInput.pressSequentially('test2@test.com', { delay: 500 });

        //generic assertion
        const inputValue = await usingGridEmailInput.inputValue();
        expect(inputValue).toEqual('test2@test.com');

        // locator assertion
        await expect(usingGridEmailInput).toHaveValue('test2@test.com')
    })

    test.only('radiobuttons', async ({ page }) => {
        const usingGridFrom = page.locator('nb-card', { hasText: 'Using the Grid' })

        // await usingGridFrom.getByLabel('Option 1').check({force: true});
        await usingGridFrom.getByRole('radio', { name: 'Option 1' }).check({ force: true });
        const radioStatus = await usingGridFrom.getByRole('radio', { name: 'Option 1' }).isChecked();
        await expect(usingGridFrom).toHaveScreenshot({maxDiffPixels:100});
        // expect(radioStatus).toBeTruthy();
        // await expect(usingGridFrom.getByRole('radio', { name: 'Option 1' })).toBeChecked();

        // await usingGridFrom.getByRole('radio', { name: 'Option 2' }).check({ force: true });
        // expect(await usingGridFrom.getByRole('radio', { name: 'Option 1' }).isChecked()).toBeFalsy();
        // expect(await usingGridFrom.getByRole('radio', { name: 'Option 2' }).isChecked()).toBeTruthy();

    })
})

test('Checkboxes', async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('toastr').click();

    await page.getByRole('checkbox', { name: 'Hide on click' }).uncheck({ force: true });
    await page.getByRole('checkbox', { name: 'Prevent arising of duplicate toast' }).check({ force: true });

    const allBoxes = page.getByRole('checkbox')
    for (const box of await allBoxes.all()) {

        // expect is used to assert the checkbox is checked and to log the status
        // await box.check({ force: true });
        // expect(await box.isChecked()).toBeTruthy();
        
        await box.uncheck({ force: true });
        expect(await box.isChecked()).toBeFalsy();

        console.log(`Checkbox with label "${await box.getAttribute('aria-label')}" is checked.`);
    }
})

test('Lists and dropdowns', async ({ page }) => {
    const dropdownsMenu = page.locator('ngx-header nb-select')
    await dropdownsMenu.click();

    page.getByRole('list') // when the list has a UL tag
    page.getByRole('listitem') // when the list has a li tag

    // const optionList = page.getByRole('list').locator('nb-option');
    const optionList = page.locator('nb-option-list nb-option');
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);
    await optionList.filter({hasText: 'Cosmic'}).click();
    const header = page.locator('nb-layout-header');
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)'); 

    const colors= {
        'Light': 'rgb(255, 255, 255)',
        'Dark': 'rgb(34, 34, 34)',
        'Cosmic': 'rgb(50, 50, 89)',
        'Corporate': 'rgb(255, 255, 255)'
    }
    await dropdownsMenu.click();
    for(const color in colors) {
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if (color != 'Corporate') {
             await dropdownsMenu.click()
        }
    }
})

test('Tooltips', async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipsCard = page.locator('nb-card', { hasText: 'Tooltip Placements' })
    await toolTipsCard.getByRole('button', { name: 'Top' }).hover()

    page.getByRole('tooltip') // if you have a role tooltip created 
    const tooltip = await page.locator('nb-tooltip').textContent();
    expect(tooltip).toEqual('This is a tooltip');
})

test('Dialogs box', async ({ page }) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    page.on('dialog', dialog => {
        expect(dialog.message()).toBe('Are you sure you want to delete?');
        dialog.accept();
    })

    await page.getByRole('table').locator('tr', {hasText: "fat@yandex.ru"}).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText('fat@yandex.ru')
})

test('Web table', async ({ page }) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    // 1 get the row by any test in this row
    const targetRow = page.getByRole('row', { name: 'twitter@outlook.com' })
    await targetRow.locator('.nb-edit').click();
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    await page.locator('.nb-checkmark').click();

    // 2 get the row based on the value in the scpacific column
    await page.locator('ng2-smart-table-pager').getByText('2').click();
    const targetRowById = page.getByRole('row', { name: '11' }).filter({ has: page.locator('td').nth(1).getByText('11') });
    await targetRowById.locator('.nb-edit').click();
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com');
    await page.locator('.nb-checkmark').click();
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

    // 3 test filter of the table

    const ages= ['20', '30', '40', '200'];

    for (let age of ages) {
         await page.locator('input-filter').getByPlaceholder('Age').clear()
         await page.locator('input-filter').getByPlaceholder('Age').fill(age);
         await page.waitForTimeout(500); 
         const ageRow = page.locator('tbody tr')

         for (let row of await ageRow.all()) {
            const cellValue = await row.locator('td').last().textContent();
            if (age == '200') {
                expect( await page.getByRole('table').textContent()).toContain('No data found');
            } else{
                expect(cellValue).toEqual(age);
            }
         }
    }
})

test('Datepicker', async ({ page }) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay
    let date = new Date();
    date.setDate(date.getDate() + 7);
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('En-US', { month: 'short' });
    const expectedMontLong = date.toLocaleString('En-US', { month: 'long' });
    const expectedYear = date.getFullYear().toString();
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
    const expectedMonthAndYear = ` ${expectedMontLong} ${expectedYear} `;

    while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
    await expect(calendarInputField).toHaveValue(dateToAssert)
})

test('Sliders', async ({ page }) => {
    // Update attributes 
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle');

    await tempGauge.evaluate(node => {
        node.setAttribute('cx', '232.630');
        node.setAttribute('cy', '232.630');
    })
    await tempGauge.click()

    // Mouse movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle');
    await tempBox.scrollIntoViewIfNeeded();

    const box = await tempBox.boundingBox()
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x +100, y);
    await page.mouse.move(x+100, y+100)
    await page.mouse.up();
    await expect(tempBox).toContainText('30');
})
