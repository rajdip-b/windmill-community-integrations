import { expect, test } from 'bun:test'
import { main } from './script.bun.ts'
import { resource } from '../resource.ts'

test('Create Prospect', async () => {
	// Create a contact
	const createContactFormData = new URLSearchParams()
	createContactFormData.append('firstname', 'John')
	createContactFormData.append('surname', 'Doe')
	createContactFormData.append('company_id', resource.companyId)
	const createContactResponse = (await (
		await fetch(`https://${resource.deployment}.api.accelo.com/api/v0/contacts`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Bearer ${resource.accessToken}`
			},
			body: createContactFormData
		})
	).json()) as any

	// Create an affiliation
	const createAffiliationFormData = new URLSearchParams()
	createAffiliationFormData.append('contact_id', createContactResponse.response.id)
	createAffiliationFormData.append('company_id', resource.companyId)
	const createAffiliationResponse = (await (
		await fetch(`https://${resource.deployment}.api.accelo.com/api/v0/affiliations`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Bearer ${resource.accessToken}`
			},
			body: createAffiliationFormData
		})
	).json()) as any

	// Create a prospect
	const response = (await main(resource, {
		title: 'Test Prospect',
		affiliationId: createAffiliationResponse.response.id,
		typeId: 2
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
					Authorization: `Bearer ${resource.accessToken}`
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
				Authorization: `Bearer ${resource.accessToken}`
			}
		}
	)

	// Delete the affiliation
	await fetch(
		`https://${resource.deployment}.api.accelo.com/api/v0/affiliations/${createAffiliationResponse.response.id}`,
		{
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${resource.accessToken}`
			}
		}
	)

	// Delete the contact
	await fetch(
		`https://${resource.deployment}.api.accelo.com/api/v0/contacts/${createContactResponse.response.id}`,
		{
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${resource.accessToken}`
			}
		}
	)
})
