# House You — Site Refactor (Structural)

This document extracts the **structural** changes from the May 2026 content/strategy
brief plus follow-up decisions. It excludes body copy (that lives in the content doc and
gets pasted into pages). What follows is information architecture, navigation, templates,
page inventory, and design changes.

See [architecture.md](architecture.md) for how the theme is built (FSE block theme).

> **Access / deploy:** Theme files auto-upload to **staging** via SFTP the instant they're
> written — there is no separate deploy step, so a theme edit is a live-on-staging change
> (build/verify first; preview risky changes on the Local site). Page/menu/DB content is
> edited on staging via WP-CLI over SSH
> (`ssh staging-ba32-houseyouorg.wordpress.com@ssh.wp.com "wp …"`). Staging → production is
> a manual "Push to production" in the WordPress.com dashboard. Two channels — see §6.

---

## Progress log

| Done (June 2026) | Notes |
|---|---|
| ✅ **Font swap** League Spartan→**Lexend** (headings/nav), Glacial Indifference→**Poppins** (body) | `theme.json`, `functions.php` @font-face + preloads, 6 woff2 in `assets/fonts/`. Old Red Hat/League/Glacial files kept (unused). |
| ✅ **Brand pink darkened** `#CB1EAA` → `#A8178C` | `theme.json` token + all `sass/theme.scss` uses. Aesthetic (original already passed AA ~4.9:1). |
| ✅ **Readability: prose measure + paragraph rhythm** | Scoped `max-width: 42rem` + spacing on `.wp-block-post-content` text blocks; excludes homepage/action/an-events. (Did NOT change global `contentSize`.) |
| ✅ **Reconciled SCSS drift** | Ported an orphaned volunteer-form CSS block back into `sass/theme.scss`. |
| ✅ **Doc debt** | `architecture.md` / `CLAUDE.md` updated for fonts + auto-deploy. |

**Up next (this plan):** conditional Events nav (§10), Campaigns page via `campaigns` tag
(§11), archive old pages (§12), then homepage decomposition + remaining new pages.

---

## 0. Current state (staging inventory, June 2026)

Most of the brief's structure **already exists as pages** — this is a
reorganise/decompose/archive job, not build-from-scratch.

| Brief target | Existing page(s) on staging (ID) | Template |
|---|---|---|
| Campaigns landing | `Actions` (2983) → rename to **Campaigns** | default |
| Petition / action pages | `tax-breaks` (2300), `mullum-public-housing` (3449), `the-housing-crisis-is-killing-people` (3489), `shift-the-conversation` (2654), `defend-public-housing` (182) | `action` (most) |
| Media landing | `Media` (3505) | default |
| Events landing | `Events` (2846) + `an-events` pages | default / `an-events` |
| Projects | `Housing Village` (229), `Disaster Preparedness` (3508), `disaster-workshops` (3128) | default |
| About / Our Story | `ABOUT` (274, slug `about-us`) | default |
| Contact | `Contact Us` (237) | default |
| Homepage | `Homepage` (2019) — front page | **`home-2026-test`** |

**Gotcha — live homepage is a DB template, not a theme file.** Front page = page **2019**
using custom template **`home-2026-test`**, stored in the *database*, not `block-templates/`.
The theme's `home.html` / `home-2026.html` are effectively dead. Homepage layout changes
happen in the Site Editor (or migrate that template into a theme file first).

**Active nav menu:** `New Header` (8 items, location `max_mega_menu_2`). Older `Header`
(5 items) is unused. `Footer` + `Socials` menus also exist.

**Net new work:** Partners page; Take Action location pages (Wagga, Northern Rivers,
National/Green Bans); long-form pages (No Homes No Future, Housing First, Team); 2 missing
petitions (Climate-Ready Housing, Renters' Rights); homepage campaign-card row; the three
new behaviours in §10–§12.

---

## 1. Goals

1. **Reduce the homepage** — short teasers + Read-more links to dedicated pages.
2. **Real navigation** — add **Campaigns**, make **Events conditional** (§10), turn
   **Media** into a real landing page (no dropdown), fix dead links.
3. **Tag-driven listings** — a `campaigns` tag aggregates all actions/campaigns onto one
   Campaigns page (§11); reuse the same card grid for Media/Projects.
4. **Add missing pages** — Partners, Take Action location pages, long-form read-more pages,
   2 missing petitions.
5. **Archive stale pages** (§12) so nav and search stay clean.
6. **Design & SEO** — ✅ fonts/pink/readability done; continue with card grid + polish.

---

## 2. Information Architecture (target nav)

```
ACTION · CAMPAIGNS · [EVENTS*] · PROJECTS · NEWS/MEDIA · ABOUT · CONTACT     [DONATE] [socials]
                       *shown only when an active/upcoming event exists (§10)
```

| Nav item | Type | Destination | Status |
|---|---|---|---|
| Action | Landing | Take Action hub (Wagga, Northern Rivers, National) | NEW; `Actions` content can seed |
| Campaigns | **Tag listing** | Campaigns page listing everything tagged `campaigns` (§11) | `Actions` (2983) → rename `campaigns`; ADD to header |
| Events | Landing | `Events` (2846) + `[events_listing]` | **CONDITIONAL** — hide when no active event (§10) |
| Projects | Landing | Group `Housing Village` (229), `Disaster Preparedness` (3508), `disaster-workshops` (3128) | EXISTS as separate pages |
| News/Media | Landing | `Media` (3505) — remove dropdown | CHANGE |
| About | Landing | `ABOUT` (274) + Team + Partners | CHANGE |
| Contact | Page | `Contact Us` (237) | EXISTS |
| Donate | Button | External / Action Network | EXISTS |

Edit the **`New Header`** menu (`max_mega_menu_2`). All nav edits are DB (WP-CLI / MMM admin).

---

## 3. Homepage decomposition

Live homepage = page **2019** via DB template **`home-2026-test`** (see §0). Reorganise
into short teasers with Read-more links:

| Block | Homepage (short) | Links to |
|---|---|---|
| 1 | Hero / Sign-up (AN letter embed) | — (inline) |
| 2 | No Homes No Future — "Everything Crisis" | `/no-homes-no-future` **NEW** |
| 3 | What's Driving the Crisis — campaign cards | Campaigns page / petition pages (most EXIST) |
| 4 | Housing First / The Solution | `/housing-first` **NEW** |
| 5 | Our Story | `/about-us` (EXISTS) + `/team` **NEW** |
| 6 | Footer acknowledgement (shorter) | footer part |

Block 3 = a **campaign-card row** using the same card grid as §5 / §11 (cards for content
tagged `campaigns`), echoing the existing Media "3 squares".

---

## 4. Pages: existing vs. new

### 4a. Campaign / petition pages (`action` template)
Tag all of these `campaigns` (§11). Most exist:

| Brief petition | Page (ID) |
|---|---|
| End Tax Handouts to Property Hoarders | `tax-breaks` (2300) ✅ |
| Defend & Extend Public Housing | `defend-public-housing` (182) ✅ / `mullum-public-housing` (3449) |
| Climate-Ready Housing for All | ❌ CREATE |
| Renters' Rights Now | ❌ CREATE |
| Housing Is a Right, Not Profit | ❌ CREATE |

### 4b. Long-form "Read more" pages (`page` template) — NEW
- `/no-homes-no-future`, `/housing-first`, `/team` (Our Story = existing `/about-us`).

### 4c. New / grouped sections
- **Partners** — ❌ NEW (Housing Justice National Alliance, logos).
- **Projects landing** — ❌ NEW; groups existing 229 / 3508 / 3128.
- **Take Action** — ❌ NEW location pages (Wagga, Northern Rivers, National).

---

## 5. Theme work — reusable listing + card grid

Replaces the earlier parent/child idea with a **tag-driven** approach (more flexible, and
matches the `campaigns` requirement).

| Need | Implementation |
|---|---|
| Card grid | Generalise existing `.events-grid`/`.event-card` (`sass/theme.scss`) into reusable `.card-grid`/`.card`. |
| Tag-driven listing | `[content_cards tag="campaigns" post_type="page,post" limit="-1"]` shortcode in `functions.php`, modelled on `houseyou_events_listing_shortcode()`; renders `.card-grid` of featured image + title + excerpt for all content with the term. Powers Campaigns (§11), and can power Media/Projects. |
| Homepage campaign row | Same shortcode, `limit="6"`, dropped into the home template. |
| Read-more buttons | Editor buttons in homepage blocks 2/4/5 — no new template. |

---

## 6. What lives where (two channels)

**Theme files (git + auto-SFTP to staging):** templates, patterns, `functions.php`
(shortcodes, tag taxonomy, conditional-nav filter), `sass/theme.scss` (card grid),
`theme.json`, fonts.

**DB / Site-Editor (WP-CLI over SSH; redo per environment, NOT in git):** Max Mega Menu
nav (add Campaigns, conditional Events, remove Media dropdown), page content/copy, the
`campaigns` term + tagging pages, ACF `action_embed_code` values, the `home-2026-test`
template, archiving page statuses (§12).

---

## 7. Design & readability

### 7a. Done
- ✅ Prose measure (`max-width: 42rem`) + paragraph rhythm on `.wp-block-post-content`.
- ✅ Fonts → Lexend + Poppins. ✅ Brand pink → `#A8178C`.

### 7b. Remaining / optional
1. **Global `contentSize`** is still 1400px (only prose is capped). Optional: lower it if
   wide default content feels too loose — but verify designed pages first.
2. **Excess uppercase** on nav/h4–h6/labels — fine for short strings; avoid on article
   subheadings.
3. **Palette text-safety** — orange/lime/blues fail as text on white; document
   "accent-only" colours.
4. Card grid + section polish; header/footer redesign.

---

## 8. SEO
- Titles / meta descriptions per page; clean heading hierarchy (copy already structured).
- Internal linking (homepage teasers → pages → petitions).
- Use the **Redirection** plugin (active) for 301s on archived URLs (§12).

---

## 9. Out of scope (flagged)
- Social media feed / rolling Instagram; AN form/list wiring (`volunteer-form-22`);
  domain/DNS; final copy approval.

---

## 10. Conditional Events nav item

**Goal:** show **Events** in the header only when at least one upcoming event exists;
otherwise hide it.

**Detection (theme — `functions.php`):**
- `houseyou_has_active_events()` — reuse the `events_listing` query: published pages with
  template `an-events` where `_event_date >= today`. Cache the boolean in a **transient**
  (e.g. 1h) since it runs on every page load for the menu; bust it on `save_post`.

**Hiding the item:**
1. In the menu (DB), give the Events item a CSS class flag, e.g. `nav-requires-event`
   (MMM/Menus → item → CSS Classes).
2. In `functions.php`, filter `wp_nav_menu_objects` — when `! houseyou_has_active_events()`,
   unset any item whose classes include `nav-requires-event`. (Max Mega Menu runs through
   `wp_nav_menu`, so this filter applies; verify on staging.)

**Effort:** functions.php helper + filter (theme), plus one DB step (add the class to the
Events item). Past events drop out of `[events_listing]` automatically by date, so when the
nav item hides the Events page still shows "no upcoming events".

**Optional:** WP-Cron to auto-set `an-events` pages to draft a grace period after their date
(ties into §12 archiving).

---

## 11. Campaigns page via `campaigns` tag

**Goal:** one Campaigns page that lists **all actions and campaigns**, driven by a
`campaigns` tag; surface Campaigns in the header.

**Taxonomy (theme — `functions.php`):** pages don't support tags by default. Either:
- enable core tags on pages: `register_taxonomy_for_object_type( 'post_tag', 'page' )`, then
  use a `campaigns` tag; **or**
- register a dedicated `campaign` taxonomy for `page`+`post` (cleaner, avoids mixing with
  post tags). *Recommended:* dedicated taxonomy, but `post_tag` on pages is fine if you
  prefer the literal "#campaigns tag".

**Listing:** the `[content_cards tag="campaigns" …]` shortcode (§5) on the Campaigns page
renders every published item carrying the term as a card grid.

**Setup (DB):**
1. Create/confirm the `campaigns` term.
2. Tag all action/campaign pages (`tax-breaks` 2300, `defend-public-housing` 182,
   `mullum-public-housing` 3449, `the-housing-crisis-is-killing-people` 3489,
   `shift-the-conversation` 2654, + new petitions) with `campaigns`.
3. Rename `Actions` (2983) → **Campaigns** (slug `campaigns`), put the shortcode in it.
4. Add **Campaigns** to the `New Header` menu.

**Effort:** taxonomy registration + shortcode (theme); tagging + menu (DB).

---

## 12. Archive plan for old pages

**Why:** stale event pages, duplicates, and one-off feedback pages clutter nav, search,
and the upcoming tag listings.

### Candidates (verified June 2026, today = 2026-06-27)

**Past events** (all `an-events`, `_event_date` in the past → archive):

| ID | Date | Title |
|---|---|---|
| 3159 | 2026-04-23 | Preparedness Workshop: Mullumbimby |
| 3132 | 2026-05-01 | Preparedness Workshop: Lismore |
| 3115 | 2026-05-02 | Preparedness Workshop: Tweed |
| 3061 | 2026-03-31 | Conversation Training: House Hoarding 101 |
| 3059 | 2026-03-27 | Conversation Training: House Hoarding 101 |
| 3046 | 2026-03-19 | Conversation Training: House Hoarding 101 |
| 2868 | 2026-03-04 | SOLD! Documentary Screening |
| 2851 | 2026-02-23 | Mullumbimby Hospital Site Public Forum |
| 2479 | 2025-12-16 | Convo Training: How the Grinch Stole Housing |

**Duplicates / one-offs:**
- `3398` **and** `3477` are both "Joint Statement Budget 2026" (both published) → keep one,
  archive the other (confirm which is canonical first).
- `3289` "Conversations Training Feedback + Action" (survey) → archive once the training run
  it served is over (confirm with Chels/Emily).

**Keep** (do not archive): all `action`/campaign pages, Media, Events, About, Contact,
Privacy, Terms, Homepage, Housing Village, Disaster Preparedness, disaster-workshops, and
the Conversation/Preparedness **hub** pages (3128, 3081) that aren't dated events.

### Method (per page, decide before acting)
- **Draft** (`wp post update <id> --post_status=draft`) — default; removes from front-end &
  nav, fully reversible. Best for past events and the duplicate.
- **Trash** — only for true junk (recoverable ~30 days).
- **Keep + de-list** — if a past event must stay reachable by direct link for records, leave
  published but remove from nav and `noindex` it.
- **Redirect** — for any archived URL with inbound links/traffic, add a 301 via the
  **Redirection** plugin (e.g. past event → `/events`, dup statement → the kept one).

### Process
1. Confirm canonical Joint Statement + whether 3289 is finished (human decision).
2. On **staging**, batch-draft the 9 past events + the duplicate:
   `for id in 3159 3132 3115 3061 3059 3046 2868 2851 2479 <dup>; do wp post update $id --post_status=draft; done`
3. Add 301 redirects for any of those that rank/are linked.
4. Verify: no broken nav links, `[events_listing]` still correct, Campaigns/Media listings
   exclude drafts automatically.
5. Push staging → production.

### Optional automation
WP-Cron job: set `an-events` pages to `draft` N days after `_event_date` passes — keeps the
events list and nav self-cleaning. Ties into the conditional Events nav (§10).
