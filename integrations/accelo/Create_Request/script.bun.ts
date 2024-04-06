type Accelo = {
	clientId: string
	clientSecret: string
	deployment: string
}

export async function main(
	resource: Accelo,
	data: {
		title: string
		body: string
		type_id: number
		priority_id?: number
		source?: string
		leadId?: number
	} & (
		| { affiliation_id: number }
		| {
				affiliation: {
					contact?: {
						firstname: string
						lastname: string
					}
					company?: {
						name: string
						phone: string
					}
					email?: string
					phone?: string
				}
		  }
	)
) {
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

	const form = new URLSearchParams()
	form.append('title', data.title)
	form.append('body', data.body)
	form.append('type_id', data.type_id.toString())
	data.priority_id && form.append('priority_id', data.priority_id.toString())
	data.source && form.append('source', data.source)
	data.leadId && form.append('lead_id', data.leadId.toString())
	if ('affiliation_id' in data) {
		form.append('affiliation_id', data.affiliation_id.toString())
	} else {
		if (data.affiliation.contact) {
			form.append('affiliation_contact_firstname', data.affiliation.contact.firstname)
			form.append('affiliation_contact_lastname', data.affiliation.contact.lastname)
		} else if (data.affiliation.company) {
			form.append('affiliation_company_name', data.affiliation.company.name)
			form.append('affiliation_company_phone', data.affiliation.company.phone)
		} else {
			form.append('affiliation_email', data.affiliation.email!)
			form.append('affiliation_phone', data.affiliation.phone!)
		}
	}

	return (
		await fetch(`https://${resource.deployment}.api.accelo.com/api/v0/requests`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Bearer ${accessToken}`
			},
			body: form
		})
	).json()
}
