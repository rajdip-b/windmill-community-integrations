import { expect, test } from 'bun:test'
import { main } from './script.bun.ts'
import { resource } from '../resource.ts'

test('Create Request', async () => {
	// Create a request
	const response = (await main(resource, {
		title: 'Test Request',
		body: 'This is a test request',
		typeId: 2,
		affiliation: {
			contact: {
				firstName: 'John',
				lastName: 'Doe'
			}
		}
	})) as any
	expect(response.meta.status).toEqual('ok')
	expect(response.response.title).toEqual('Test Request')
	expect(response.response.id).toBeDefined()

	// Fetch the request
	const fetchRequestResponse = (await (
		await fetch(
			`https://${resource.deployment}.api.accelo.com/api/v0/requests/${response.response.id}`,
			{
				headers: {
					Authorization: `Bearer ${resource.accessToken}`
				}
			}
		)
	).json()) as any
	expect(fetchRequestResponse.response.title).toEqual('Test Request')

	// Delete the request
	await fetch(
		`https://${resource.deployment}.api.accelo.com/api/v0/requests/${response.response.id}`,
		{
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${resource.accessToken}`
			}
		}
	)
})
