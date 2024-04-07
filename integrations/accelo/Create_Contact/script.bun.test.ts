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

	// Create a company
	const createCompanyBody = new URLSearchParams({
		name: 'Test Company'
	})
	const createCompanyResponse = (await (
		await fetch(`https://${resource.deployment}.api.accelo.com/api/v0/companies`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Bearer ${accessToken}`
			},
			body: createCompanyBody
		})
	).json()) as any

	// Create a new contact
	const response = (await main(resource, {
		firstname: 'John',
		surname: 'Doe',
		company_id: createCompanyResponse.response.id
	})) as any
	expect(response.meta.status).toEqual('ok')
	expect(response.response.id).toBeDefined()
	expect(response.response.firstname).toEqual('John')
	expect(response.response.surname).toEqual('Doe')

	// Fetch the contact
	const fetchContactResponse = (await (
		await fetch(
			`https://${resource.deployment}.api.accelo.com/api/v0/contacts/${response.response.id}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		)
	).json()) as any
	expect(fetchContactResponse.response.firstname).toEqual('John')
	expect(fetchContactResponse.response.surname).toEqual('Doe')

	// Delete the contact
	await fetch(
		`https://${resource.deployment}.api.accelo.com/api/v0/contacts/${response.response.id}`,
		{
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		}
	)

	// Delete the company
	await fetch(
		`https://${resource.deployment}.api.accelo.com/api/v0/companies/${createCompanyResponse.response.id}`,
		{
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		}
	)
})
