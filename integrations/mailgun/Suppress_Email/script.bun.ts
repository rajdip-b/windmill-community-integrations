type Mailgun = {
	apiKey: string
	domain: string
}

export async function main(
	resource: Mailgun,
	data: {
		address: string
		tags: string[]
		created_at?: string
	}[]
) {
	return (
		await fetch(`https://api.mailgun.net/v3/${resource.domain}/unsubscribes`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Basic ' + Buffer.from(`api:${resource.apiKey}`).toString('base64')
			},
			body: JSON.stringify(data)
		})
	).json()
}
