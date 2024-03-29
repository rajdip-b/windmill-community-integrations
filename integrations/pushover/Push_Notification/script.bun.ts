type Pushover = {
	apiToken: string
	userKey: string
}

export async function main(
	resource: Pushover,
	data: {
		message: string
		device?: string
		title?: string
	}
) {
	const form = new URLSearchParams()
	form.append('token', resource.apiToken)
	form.append('user', resource.userKey)
	form.append('message', data.message)
	data.device && form.append('device', data.device)
	data.title && form.append('title', data.title)

	return (
		await fetch('https://api.pushover.net/1/messages.json', {
			method: 'POST',
			body: form,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})
	).json()
}
