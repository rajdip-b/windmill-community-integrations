type Accelo = {
	accessToken: string
	deployment: string
}

export async function main(
	resource: Accelo,
	data: {
		title: string
		body: string
		typeId: number
		priorityId?: number
		source?: string
		leadId?: number
	} & (
		| { affiliationId: number }
		| {
				affiliation: {
					contact?: {
						firstName: string
						lastName: string
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
	const form = new URLSearchParams()
	form.append('title', data.title)
	form.append('body', data.body)
	form.append('type_id', data.typeId.toString())
	data.priorityId && form.append('priority_id', data.priorityId.toString())
	data.source && form.append('source', data.source)
	data.leadId && form.append('lead_id', data.leadId.toString())
	if ('affiliationId' in data) {
		form.append('affiliation_id', data.affiliationId.toString())
	} else {
		if (data.affiliation.contact) {
			form.append('affiliation_contact_firstname', data.affiliation.contact.firstName)
			form.append('affiliation_contact_lastname', data.affiliation.contact.lastName)
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
				Authorization: `Bearer ${resource.accessToken}`
			},
			body: form
		})
	).json()
}
