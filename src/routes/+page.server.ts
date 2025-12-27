import { API_URL } from '$env/static/private';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export type GuestbookApiResponse = Array<{
	timestamp: string;
	name: string;
	message: string;
	reply: string; // only guestbook entries with a reply are shown
}>;

const cache: { data: GuestbookApiResponse | null; timestamp: number } = {
	data: null,
	timestamp: 0
};
const CACHE_DURATION = 60 * 1000; // 1 minute

export const load: PageServerLoad = async () => {
	const now = Date.now();

	if (now - cache.timestamp < CACHE_DURATION && cache.data) {
		return { entries: cache.data };
	}

	const res = await fetch(API_URL);
	if (!res.ok) {
		throw new Error('Failed to fetch guestbook entries');
	}

	const data = (await res.json()) as GuestbookApiResponse;
	cache.data = data;
	cache.timestamp = now;

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

		if (!res.ok) {
			return { success: false, message: 'Failed to submit entry' };
		}

		return { success: true };
	}
} satisfies Actions;
