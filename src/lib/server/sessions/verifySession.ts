import { redirect, type Cookies } from '@sveltejs/kit'
import {
	decryptCookie,
	encryptAndSignCookieValue,
} from '$lib/server/sessions/secureCookie'
import { onboardingEmailSessionKey } from '$lib/auth/onboarding'
import { safeRedirect } from '$lib/utils/misc'
import { z } from 'zod'

interface HandleNewVerificationArgs {
	cookies: Cookies
	target: string
	redirectTo: string
}

export const VerifySessionSchema = z.object({
	[onboardingEmailSessionKey]: z.string().nullable(),
})

export const verifySessionCookieName = 'dn_verification'
export const verifySessionCookieOptions = {
	sameSite: 'lax' as const,
	path: '/',
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	maxAge: 60 * 10, // ten mins
}

export async function handleNewVerification({
	cookies,
	target,
	redirectTo,
}: HandleNewVerificationArgs) {
	const encryptedCookieString = encryptAndSignCookieValue({
		[onboardingEmailSessionKey]: target,
	})
	cookies.set(verifySessionCookieName, encryptedCookieString, {
		...verifySessionCookieOptions,
	})

	throw redirect(303, safeRedirect(redirectTo))
}

export function getVerifySessionData(sessionCookie: string | undefined) {
	if (!sessionCookie) return null
	const decryptedSessionValue = decryptCookie(sessionCookie) // TODO: Need to stop this being any (I tried safeParse but it returned expected string but got undefined error)
	return decryptedSessionValue[onboardingEmailSessionKey] ?? null
}