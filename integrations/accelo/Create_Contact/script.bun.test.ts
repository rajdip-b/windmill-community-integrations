import { expect, test } from 'bun:test'
import { main } from './script.bun.ts'
import { resource } from '../resource.ts'

test('Create Contact', async () => {
	// Create a new contact
	const response = (await main(resource, {
		firstName: 'John',
		surName: 'Doe',
		companyId: +resource.companyId
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
					Authorization: `Bearer ${resource.accessToken}`
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
				Authorization: `Bearer ${resource.accessToken}`
			}
		}
	)
})
