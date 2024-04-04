type Accelo = {
	accessToken: string
	deployment: string
}

export async function main(
	resource: Accelo,
	data: {
		firstName: string
		surName: string
		companyId: number
		middleName?: string
		userName?: string
		password?: string
		title?: string
		comments?: string
		status?: number
		standing?: string
		email?: string
		countryId?: number
		physicalAddressId?: number
		postalAddressId?: number
		phone?: string
		fax?: string
		position?: string
		communication?: string
		invoiceMethod?: string
	}
) {
	const form = new URLSearchParams()
	form.append('firstname', data.firstName)
	form.append('surname', data.surName)
	form.append('company_id', data.companyId.toString())
	data.middleName && form.append('middlename', data.middleName)
	data.userName && form.append('username', data.userName)
	data.password && form.append('password', data.password)
	data.title && form.append('title', data.title)
	data.comments && form.append('comments', data.comments)
	data.status && form.append('status', data.status.toString())
	data.standing && form.append('standing', data.standing)
	data.email && form.append('email', data.email)
	data.countryId && form.append('country_id', data.countryId.toString())
	data.physicalAddressId && form.append('physical_address_id', data.physicalAddressId.toString())
	data.postalAddressId && form.append('postal_address_id', data.postalAddressId.toString())
	data.phone && form.append('phone', data.phone)
	data.fax && form.append('fax', data.fax)
	data.position && form.append('position', data.position)
	data.communication && form.append('communication', data.communication)
	data.invoiceMethod && form.append('invoice_method', data.invoiceMethod)

	return (
		await fetch(`https://${resource.deployment}.api.accelo.com/api/v0/contacts`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Bearer ${resource.accessToken}`
			},
			body: form
		})
	).json()
}
