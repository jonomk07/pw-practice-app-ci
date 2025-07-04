import { test } from '../test-options'
import { faker } from '@faker-js/faker';

test('parametized methods', async ({ pageManager }) => {
   
    const randomFullName = faker.person.fullName();
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`;

    await pageManager.onFormLayoutsPage().submitUsingTheGrigdFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 2');
    // await pageManager.onFormLayoutsPage().submitInkineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, false);
})