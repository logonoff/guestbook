import { API_URL } from '$env/static/private';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const config = {
	/** @see https://vercel.com/docs/incremental-static-regeneration */
	isr: {
		// Revalidate every 10 minutes
		expiration: 60 * 10
	}
};

export type GuestbookApiResponse = Array<{
	timestamp: string;
	name: string;
	message: string;
	reply: string; // only guestbook entries with a reply are shown
}>;

export const load: PageServerLoad = async () => {
	const res = await fetch(API_URL);
	if (!res.ok) {
		throw new Error('Failed to fetch guestbook entries');
	}

	const data = (await res.json()) as GuestbookApiResponse;

	return { entries: data };
};

export const actions = {
	default: async ({ request }) => {
		const res = await fetch(API_URL, {
			method: 'POST',
			body: await request.text(),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});

		const response = await res.text();

		if (response !== 'OK') {
			return { success: false, message: response };
		}

		return { success: true };
	}
} satisfies Actions;
