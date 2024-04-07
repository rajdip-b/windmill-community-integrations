import { expect, test } from 'bun:test'
import { main } from './script.bun.ts'
import { resource } from '../resource.ts'

test('Create Prospect', async () => {
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

	// Create a contact
	const createContactFormData = new URLSearchParams()
	createContactFormData.append('firstname', 'John')
	createContactFormData.append('surname', 'Doe')
	createContactFormData.append('company_id', createCompanyResponse.response.id)
	const createContactResponse = (await (
		await fetch(`https://${resource.deployment}.api.accelo.com/api/v0/contacts`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Bearer ${accessToken}`
			},
			body: createContactFormData
		})
	).json()) as any

	// Create an affiliation
	const createAffiliationFormData = new URLSearchParams()
	createAffiliationFormData.append('contact_id', createContactResponse.response.id)
	createAffiliationFormData.append('company_id', createCompanyResponse.response.id)
	const createAffiliationResponse = (await (
		await fetch(`https://${resource.deployment}.api.accelo.com/api/v0/affiliations`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Bearer ${accessToken}`
			},
			body: createAffiliationFormData
		})
	).json()) as any

	// Create a prospect
	const response = (await main(resource, {
		title: 'Test Prospect',
		affiliation_id: createAffiliationResponse.response.id,
		type_id: 2
	})) as any
	expect(response.meta.status).toEqual('ok')
	expect(response.response.title).toEqual('Test Prospect')
	expect(response.response.id).toBeDefined()

	// Fetch the prospect
	const fetchProspectResponse = (await (
		await fetch(
			`https://${resource.deployment}.api.accelo.com/api/v0/prospects/${response.response.id}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		)
	).json()) as any
	expect(fetchProspectResponse.response.title).toEqual('Test Prospect')

	// Delete the prospect
	await fetch(
		`https://${resource.deployment}.api.accelo.com/api/v0/prospects/${response.response.id}`,
		{
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		}
	)

	// Delete the affiliation
	await fetch(
		`https://${resource.deployment}.api.accelo.com/api/v0/affiliations/${createAffiliationResponse.response.id}`,
		{
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		}
	)

	// Delete the contact
	await fetch(
		`https://${resource.deployment}.api.accelo.com/api/v0/contacts/${createContactResponse.response.id}`,
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
