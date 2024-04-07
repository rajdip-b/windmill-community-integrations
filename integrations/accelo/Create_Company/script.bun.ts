type Accelo = {
	clientId: string
	clientSecret: string
	deployment: string
}

export async function main(
	resource: Accelo,
	data: {
		name: string
		parent_id?: number
		status_id?: number
		custom_id?: string
		website?: string
		phone?: string
		fax?: string
		comments?: string
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
		await fetch(`https://${resource.deployment}.api.accelo.com/api/v0/companies`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Bearer ${accessToken}`
			},
			body: form
		})
	).json()
}
