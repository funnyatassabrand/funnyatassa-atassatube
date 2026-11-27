# AtassaTube — Next.js + Studio

AtassaTube only. Separate repo from funnyatassa.com main site.

- Public page: `/` = AtassaTube grid, tap cover to play, keyhole top-right
- Studio: press & hold keyhole 1 sec -> password login (Firebase Auth, session only) -> `/studio`
- Studio controls: site text, tagline, links, colors, font, header/footer, sections, videos, images, frame
- Studio saves site config to Supabase `app_config` id=1 when Supabase is connected in Studio -> Connect. Main site reads same `app_config` on every load, so one Studio controls both.
- Videos: Cloudinary Unsigned preset + Firestore `atassatube_videos` (same as tested). No secrets hardcoded. Paste keys only in Studio -> Connect on device.
- No rewrite-all to index.html. Do NOT add a vercel.json rewrite `/(.*)` -> `/index.html`.
