import { API_URL } from '$env/static/private';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// isr is broken with form actions https://github.com/sveltejs/kit/pull/17011

// export const config = {
// 	/** @see https://vercel.com/docs/incremental-static-regeneration */
// 	isr: {
// 		// Revalidate every 10 minutes
// 		expiration: 60 * 10
// 	}
// };

export type GuestbookApiResponse = Array<{
	timestamp: string;
	name: string;
	message: string;
	reply: string; // only guestbook entries with a reply are shown
}>;

const cache: { data: GuestbookApiResponse | null; timestamp: number; revalidating: boolean } = {
	data: null,
	timestamp: 0,
	revalidating: false
};
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

async function revalidate() {
	if (cache.revalidating) return;
	cache.revalidating = true;
	try {
		const res = await fetch(API_URL);
		if (res.ok) {
			cache.data = (await res.json()) as GuestbookApiResponse;
			cache.timestamp = Date.now();
		}
	} finally {
		cache.revalidating = false;
	}
}

export const load: PageServerLoad = async () => {
	const stale = Date.now() - cache.timestamp >= CACHE_DURATION;

	if (cache.data && stale) {
		revalidate();
		return { entries: cache.data };
	}

	else if (cache.data && !stale) {
		return { entries: cache.data };
	}

	await revalidate();
	if (!cache.data) {
		throw new Error('Failed to fetch guestbook entries');
	}

	return { entries: cache.data };
};

export const actions = {
	default: async ({ request }) => {
		const headers = new Headers(request.headers);
		headers.set('Content-Type', 'application/x-www-form-urlencoded');

		const res = await fetch(API_URL, {
			method: 'POST',
			body: await request.text(),
			headers
		});

		if (!res.ok) {
			return { success: false, message: `didn't get a successful response, http ${res.status}` };
		}

		const response = await res.text();

		if (response !== 'OK') {
			return { success: false, message: response };
		}

		return { success: true };
	}
} satisfies Actions;
