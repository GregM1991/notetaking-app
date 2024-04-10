import {
	getToastData,
	toastCookieName,
	toastOptionValues,
} from '$lib/server/sessions/toastSession'
import { logout } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'

export async function load({ cookies, locals }) {
	const toastCookieString = cookies.get(toastCookieName)
	const toast = toastCookieString ? getToastData(toastCookieString) : undefined
	// This essentially flashes the cookie. Not sure if this is the best way to
	// do this, but I couldn't find a flash method in the sveltekit cookies object
	// (I don't think the cookie package which SK wraps actually has a flash method)
	if (toast) {
		cookies.delete(toastCookieName, toastOptionValues)
	}

	const user = locals.userId
		? await prisma.user.findUnique({
				where: { id: locals.userId },
			})
		: null

	if (locals.userId && !user) {
		// This is strange, but could happen if the user was deleted. Logout to be safe.
		console.info('User drift')
		await logout(cookies, '/')
	}

	return { toast, user }
}
