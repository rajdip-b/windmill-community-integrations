type Accelo = {
	clientId: string
	clientSecret: string
	deployment: string
}

export async function main(
	resource: Accelo,
	data: {
		contact_id: number
		firstname?: string
		surname?: string
		middlename?: string
		username?: string
		password?: string
		title?: string
		comments?: string
		status?: number
		standing?: string
	}
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
	Object.entries(data).forEach(([key, value]) => value && form.append(key, value + ''))

	return (
		await fetch(
			`https://${resource.deployment}.api.accelo.com/api/v0/contacts/${data.contact_id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: `Bearer ${accessToken}`
				},
				body: form
			}
		)
	).json()
}
