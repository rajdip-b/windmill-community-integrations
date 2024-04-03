import { expect, test } from 'bun:test'
import { main } from './script.bun.ts'
import { resource } from '../resource.ts'

test('Push Notification', async () => {
	// Try to send an emergency push notification
	const response = (await main(resource, {
		message: 'Hello, World!',
		title: 'Test',
		retry: 30,
		expire: 60
	})) as any
	console.log(await response)
	expect(response.status).toBe(1)
})
