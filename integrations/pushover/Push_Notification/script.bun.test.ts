import { expect, test } from 'bun:test'
import { main } from './script.bun.ts'
import { resource } from '../resource.ts'

test('Push Notification', async () => {
	// Try to send a push notification
	const response = (await main(resource, {
		message: 'Hello, World!',
		title: 'Test'
	})) as any
	console.log(response)
	expect(response.status).toBe(1)
})
