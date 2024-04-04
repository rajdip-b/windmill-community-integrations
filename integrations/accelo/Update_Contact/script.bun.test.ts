import { expect, test } from 'bun:test'
import { main } from './script.bun.ts'
import { resource } from '../resource.ts'

test('Update Contact', async () => {
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

	// Update the contact
	const response = (await main(resource, {
		contactId: createContactResponse.response.id,
		firstName: 'Jane',
		surName: 'Smith'
	})) as any
	expect(response.meta.status).toEqual('ok')
	expect(response.response.firstname).toEqual('Jane')
	expect(response.response.surname).toEqual('Smith')

	// Fetch the contact
	const fetchContactResponse = (await (
		await fetch(
			`https://${resource.deployment}.api.accelo.com/api/v0/contacts/${response.response.id}`,
			{
				headers: {
					Authorization: `Bearer ${resource.accessToken}`
				}
			}
		)
	).json()) as any
	expect(fetchContactResponse.response.firstname).toEqual('Jane')
	expect(fetchContactResponse.response.surname).toEqual('Smith')

	// Delete the contact
	await fetch(
		`https://${resource.deployment}.api.accelo.com/api/v0/contacts/${response.response.id}`,
		{
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${resource.accessToken}`
			}
		}
	)
})
