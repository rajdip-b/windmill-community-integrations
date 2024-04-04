type Accelo = {
	accessToken: string
	deployment: string
}

export async function main(
	resource: Accelo,
	data: {
		contactId: number
		firstName?: string
		surName?: string
		middleName?: string
		userName?: string
		password?: string
		title?: string
		comments?: string
		status?: number
		standing?: string
	}
) {
	const form = new URLSearchParams()
	data.firstName && form.append('firstname', data.firstName)
	data.surName && form.append('surname', data.surName)
	data.middleName && form.append('middlename', data.middleName)
	data.userName && form.append('username', data.userName)
	data.password && form.append('password', data.password)
	data.title && form.append('title', data.title)
	data.comments && form.append('comments', data.comments)
	data.status && form.append('status', data.status.toString())
	data.standing && form.append('standing', data.standing)

	return (
		await fetch(`https://${resource.deployment}.api.accelo.com/api/v0/contacts/${data.contactId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Bearer ${resource.accessToken}`
			},
			body: form
		})
	).json()
}
