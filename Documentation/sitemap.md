# House You — Site Map

Audited staging site at `staging-ba32-houseyouorg.wpcomstaging.com` (June 2026).

---

## Phase 1 — Current state

### Header nav

**Top-level items:** `EVENTS · CAMPAIGNS · OUR WORK` (dropdown) `· [FB] · [INSTA]`

**OUR WORK dropdown:**
- Our Story *(not a linked page — 404s)*
- CONTACT (`/contact/`)
- IN THE MEDIA (`/media/`)
- ARTICLES (`/articles/`)

---

### Homepage block order (top → bottom)

| # | Block | Content |
|---|---|---|
| 1 | Hero | "EVERYBODY GETS A HOUSE" headline + body copy |
| 2 | Campaigns | 3 card grid (Housing Crisis Is Killing People, Mullumbimby Hospital Site, Shift the Conversation) + "See more" link |
| 3 | Events | 1 event card (TEST EVENT) + "See more" link |
| 4 | In the Media | Row present, appears empty |
| 5 | Our Story | "FROM EVICTION TO MOVEMENT BUILDING" blurb + "Read more" link |
| 6 | Footer | FB · IG · Privacy Policy · Terms of Use · Donate |
| 7 | Acknowledgement | First Nations acknowledgement text |

---

### Page tree

```
Homepage (/)
│
├─ EVENTS (/events/)                       ← [events_listing]
│  └─ TEST EVENT — Card Preview
│
├─ CAMPAIGNS (/campaigns/)                 ← [content_cards tax="campaign"]
│  ├─ Scrap the Tax Breaks (p=2300)        action page, full content
│  ├─ Defend and Extend Public Housing (p=182)   action page, no body content
│  ├─ Shift the Conversation (p=2654)      action page, full content
│  └─ Mullumbimby Hospital Site (p=3449)   action page, full content
│
├─ OUR WORK                                ← dropdown parent, no linked page
│  ├─ (Our Story)                          ← label only — no slug, 404s
│  ├─ CONTACT (/contact/)                  ← contact form page
│  ├─ IN THE MEDIA (/media/)               ← [content_cards] — shows misplaced pages
│  │  ├─ Disaster Preparedness (p=3508)    empty page
│  │  ├─ Mullumbimby Hospital Site (p=3449)*    ← duplicated from campaigns
│  │  └─ Workshop: Preparedness (p=3128)   event info page
│  └─ ARTICLES (/articles/)                ← empty ("No articles yet.")
│
├─ ABOUT (/about-us/)                      ← org story page
│
├─ Standalone pages:
│  ├─ The Housing Crisis Is Killing People (p=3489)   action + letter form
│  ├─ Housing Village (p=229)                        empty page
│  ├─ Conversation Training: House Hoarding 101 (p=3081)
│  └─ Conversations Training Feedback (p=3289)       survey page
│
├─ Privacy Policy (/privacy-policy/)
├─ Terms of Use (/terms-of-use/)
│
└─ (no Donate link in nav — footer only)
```

---

## Phase 2 — Next (dev work, no external content)

### Nav restructure

**Top-level items:** `EVENTS · CAMPAIGNS · OUR WORK` (dropdown) `· [✉] · [FB] · [INSTA]`

- **Contact Us** moves from OUR WORK dropdown → becomes an email icon (`[✉]`) in the nav bar, alongside FB/INSTA social icons. Links to `/contact/`.
- **OUR WORK** dropdown becomes (same items, minus CONTACT):

```
OUR WORK
├─ OUR STORY       (/about-us/)
├─ IN THE MEDIA    (/media/)
└─ ARTICLES        (/articles/)
```

### Homepage additions

- **Latest Instagram Posts** row — new block on the homepage between Campaigns and In The Media sections.

## Phase 3 — Needs content from Jacob

New pages requiring copy/assets from outside:

| Page | Slug | Purpose |
|---|---|---|
| Projects | `/projects/` | Showcase campaigns, actions, and initiatives |
| Resources | `/resources/` | Downloads, toolkits, conversation training materials |
| Our Team | `/team/` | Staff/volunteer bios (currently no team page exists) |

Once content is ready, add these as dropdown items under OUR WORK.
