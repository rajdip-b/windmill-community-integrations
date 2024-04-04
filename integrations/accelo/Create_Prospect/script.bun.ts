type Accelo = {
	accessToken: string
	deployment: string
}

export async function main(
	resource: Accelo,
	data: {
		title: string
		affiliationId: number
		typeId: number
		statusId?: number
		comments?: string
		value?: number
		success?: 'yes' | 'no'
		staffId?: number
		dueDate?: string
		weighting?: number
		progress?: number
		probabilityId?: number
	}
) {
	const form = new URLSearchParams()
	form.append('title', data.title)
	form.append('affiliation_id', data.affiliationId.toString())
	form.append('type_id', data.typeId.toString())
	data.statusId && form.append('status_id', data.statusId.toString())
	data.comments && form.append('comments', data.comments)
	data.value && form.append('value', data.value.toString())
	data.success && form.append('success', data.success)
	data.staffId && form.append('staff_id', data.staffId.toString())
	data.dueDate && form.append('due_date', data.dueDate)
	data.weighting && form.append('weighting', data.weighting.toString())
	data.progress && form.append('progress', data.progress.toString())
	data.probabilityId && form.append('probability_id', data.probabilityId.toString())

	const res = await fetch(`https://${resource.deployment}.api.accelo.com/api/v0/prospects`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Bearer ${resource.accessToken}`
		},
		body: form
	})
	console.log('res', res)
	return res.json()
}
