import { expect, test } from 'bun:test'
import { main } from './script.bun.ts'
import { resource } from '../resource.ts'

test('Create Contact', async () => {
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

	// Create a new company
	const response = (await main(resource, {
		name: 'Test Company'
	})) as any
	expect(response.meta.status).toEqual('ok')
	expect(response.response.id).toBeDefined()
	expect(response.response.name).toEqual('Test Company')

	// Fetch the company
	const fetchContactResponse = (await (
		await fetch(
			`https://${resource.deployment}.api.accelo.com/api/v0/companies/${response.response.id}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		)
	).json()) as any
	expect(fetchContactResponse.response.id).toEqual(response.response.id)
	expect(fetchContactResponse.response.name).toEqual('Test Company')

	// Delete the company
	await fetch(
		`https://${resource.deployment}.api.accelo.com/api/v0/companies/${response.response.id}`,
		{
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		}
	)
})
