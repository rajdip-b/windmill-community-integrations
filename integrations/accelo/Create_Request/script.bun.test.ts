import { expect, test } from 'bun:test'
import { main } from './script.bun.ts'
import { resource } from '../resource.ts'

test('Create Request', async () => {
	// Fetch the access token
	const accessTokenResponse = (await (
		await fetch(`https://${resource.deployment}.api.accelo.com/oauth2/v0/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Basic ${Buffer.from(
					`${resource.clientId}:${resource.clientSecret}`
				).toString('base64')}`
			},
			body: new URLSearchParams({
				grant_type: 'client_credentials',
				scope: 'write(all)'
			})
		})
	).json()) as any
	const accessToken = accessTokenResponse.access_token

	// Create a request
	const response = (await main(resource, {
		title: 'Test Request',
		body: 'This is a test request',
		type_id: 2,
		affiliation: {
			contact: {
				firstname: 'John',
				lastname: 'Doe'
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
					Authorization: `Bearer ${accessToken}`
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
				Authorization: `Bearer ${accessToken}`
			}
		}
	)
})
