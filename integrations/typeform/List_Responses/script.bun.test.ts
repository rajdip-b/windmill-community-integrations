import { expect, test } from 'bun:test'
import { main } from './script.bun.ts'
import { resource } from '../resource.ts'

/**
 * This test requires manual intervention to pass. Follow the steps below:
 * 1. Create a form in Typeform
 * 2. Set the TYPEFORM_MANUALLY_CREATED_FORM_ID environment variable to the form's ID
 * 3. Add any question to the form
 * 4. Publish the form
 * 5. Submit a response to the form
 * 6. Run the test
 */
test('List Responses', async () => {
	const response = await main(resource, {
		formId: process.env.TYPEFORM_MANUALLY_CREATED_FORM_ID!
	})
	expect(response).toBeDefined()
	expect(response.total_items).toBeGreaterThan(0)
})
