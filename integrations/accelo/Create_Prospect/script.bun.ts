type Accelo = {
	clientId: string
	clientSecret: string
	deployment: string
}

export async function main(
	resource: Accelo,
	data: {
		title: string
		affiliation_id: number
		type_id: number
		status_id?: number
		comments?: string
		value?: number
		success?: 'yes' | 'no'
		staff_id?: number
		due_date?: string
		weighting?: number
		progress?: number
		probability_id?: number
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
		await fetch(`https://${resource.deployment}.api.accelo.com/api/v0/prospects`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Bearer ${accessToken}`
			},
			body: form
		})
	).json()
}
