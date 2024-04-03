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
		priority?: number
	}
) {
	const form = new URLSearchParams()
	form.append('token', resource.apiToken)
	form.append('user', resource.userKey)
	form.append('message', data.message)
	data.device && form.append('device', data.device)
	data.title && form.append('title', data.title)
	data.priority && form.append('priority', data.priority.toString())

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
