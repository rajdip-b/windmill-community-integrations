import { expect, test } from 'bun:test'
import { main } from './script.bun.ts'
import { resource } from '../resource.ts'

test('Suppress Email', async () => {
	// Unsubscribe address
	const response = await main(resource, [
		{
			address: 'test@example.com',
			tags: ['example']
		}
	])
	expect(response).toBeDefined()

	// Fetch the particular unsubscribe address
	const fetchUnsubscribeResponse = (await (
		await fetch(`https://api.mailgun.net/v3/${resource.domain}/unsubscribes/test@example.com`, {
			headers: {
				Authorization: 'Basic ' + Buffer.from(`api:${resource.apiKey}`).toString('base64')
			}
		})
	).json()) as any
	expect(fetchUnsubscribeResponse).toBeDefined()
	expect(fetchUnsubscribeResponse.address).toBe('test@example.com')
	expect(fetchUnsubscribeResponse.tags).toEqual(['example'])

	// Delete the unsubscribed list
	await fetch(`https://api.mailgun.net/v3/${resource.domain}/unsubscribes`, {
		method: 'DELETE',
		headers: {
			Authorization: 'Basic ' + Buffer.from(`api:${resource.apiKey}`).toString('base64')
		}
	})
})
