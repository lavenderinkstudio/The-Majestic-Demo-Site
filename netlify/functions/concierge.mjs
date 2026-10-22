/* POST /api/concierge on Netlify: the same concierge as api/concierge.js (used on Vercel),
   served as a Netlify Function. Set ANTHROPIC_API_KEY in the site's environment variables
   to switch on AI mode; without it the page answers with its local matcher. */

import { POST, GET } from "../../api/concierge.js";

export default async request => (request.method === "POST" ? POST(request) : GET());

export const config = { path: "/api/concierge" };
