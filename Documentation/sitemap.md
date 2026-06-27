# House You — Site Map

How the site is structured **as it currently functions on staging** (June 2026), plus what's
still missing against the May 2026 content brief. Companion to [refactor.md](refactor.md) and
[style-guide.md](style-guide.md).

Legend: ✅ live · 🟡 live but empty / needs content · ❌ missing · 🗑 draft (archived) · 🔮 future

---

## 1. Site map (current)

**Header nav** (Max Mega Menu — the `new-header` menu):

```
1  EVENTS            (2846)   ← conditional: only appears when an active event exists
2  CAMPAIGNS         (2983)
3  ARTICLES          (3563)
4  ABOUT             (custom #, dropdown)
   ├─ OUR STORY      (274)
   ├─ CONTACT        (237)
   └─ IN THE MEDIA   (3564)
5  FB                (external)
6  INSTA             (external)
```

### Page tree

```
Homepage (2019, /)                              ← DB-built landing page
│
├─ EVENTS (2846, /events)                       ← [events_listing] → cards, template "an-events"
│  └─ TEST EVENT — Card Preview (3560)           🗑 delete; it's the only "active" event,
│                                                   so deleting it hides the EVENTS nav item
│
├─ CAMPAIGNS (2983, /campaigns)                 ← [content_cards tax="campaign"] · 5 cards
│  ├─ The Housing Crisis Is Killing People (3489)   action ✅
│  ├─ Mullumbimby Hospital Site (3449)              action ✅  (page-nested under Media, shown here via campaign tag)
│  ├─ Shift the Conversation (2654)                 action ✅
│  ├─ Scrap the Tax Breaks (2300)                   action ✅
│  └─ Defend and Extend Public Housing (182)        action ✅  (now on the action template)
│
├─ ARTICLES (3563, /articles)                   ← [content_cards parent="current"]  🟡 no child pages yet
│
├─ ABOUT (274, /about-us)
│  ├─ Our Story            ← the About page itself
│  ├─ Contact (237)
│  └─ IN THE MEDIA (3564, /in-the-media)         ← [content_cards parent="current"]  🟡 no press items yet
│
├─ Privacy Policy (1434)   ·  Terms of Use (1439)   (URL-nested under Homepage)
│
└─ Not in nav (legacy / standalone):
   ├─ Media (3505, /media)                       🟡 orphaned old page → see Projects below
   │  ├─ Disaster Preparedness (3508)             project
   │  ├─ Workshop: Preparedness for you (3128)    project
   │  └─ Mullumbimby Hospital Site (3449)         project (also a campaign)
   ├─ Housing Village (229)                       ⚠ nested under Campaigns but NOT campaign-tagged → doesn't list
   ├─ Conversation Training: House Hoarding 101 (3081)   was an event; standalone, not in nav
   └─ Conversations Training Feedback + Action (3289)    survey; standalone
```

**Archive 🗑 (draft):** Joint Statement Budget 2026 ×2 (3398, 3477); past events — Preparedness
Workshops Mullum/Lismore/Tweed (3159, 3132, 3115), Conversation Trainings (3061, 3059, 3046),
SOLD! Screening (2868), Mullumbimby Forum (2851), Grinch convo training (2479).

### How the card lists work
All grids run through the one `[content_cards]` engine in `functions.php`:
- **Campaigns** = `tax="campaign"` (anything tagged with the `campaigns` term, regardless of page parent).
- **Events** = `[events_listing]` → `template="an-events"` (pages on the `an-events` template).
- **Articles / In the Media** = `parent="current"` (child pages of that page).

So to add a campaign you tag it; to add an article you make it a child of Articles; to add a
press item you make it a child of In the Media.

---

## 2. Future: Projects page under About Us  🔮

We want a **Projects** page sitting under **About Us** (alongside Our Story, Contact, In the
Media) to house the on-the-ground project pages that currently hang off the orphaned **Media**
page (3505):

- Disaster Preparedness (3508)
- Workshop: Preparedness for you (3128)
- Mullumbimby Hospital Site (3449) — note this is *also* a campaign, so decide whether it lives
  as a Project, a Campaign, or is cross-listed.

Plan when we build it: create a `Projects` page (child cards via `[content_cards parent="current"]`,
same as Articles/Media), re-parent the project pages onto it, add it to the ABOUT dropdown, then
retire the old Media (3505) page.

---

## 3. Gap analysis — brief content not yet implemented

What the May 2026 brief specified, vs. what's live.

### Homepage blocks
| Block | Homepage teaser | Long / linked page |
|---|---|---|
| 1 Hero / Sign-up | 🟡 hero exists (verify copy + two-step volunteer form) | n/a |
| 2 No Homes No Future | 🟡 verify on homepage | ❌ long page missing → Articles |
| 3 What's Driving the Crisis (5 graphics) | 🟡 card row exists, wrong set | see campaigns |
| 4 Housing First: The Solution | 🟡 verify on homepage | ❌ long page missing → Articles |
| 5 Our Story | ✅ About exists | ❌ Team page + bios missing |
| 6 Acknowledgement (footer) | 🟡 ack exists, long | ❌ shorter version not done |

### Whole sections still missing
| Brief item | Status |
|---|---|
| Articles content (No Homes, Housing First, Team, bios) | 🟡 section live, no pages yet |
| In the Media content (press / media releases) | 🟡 section live, no items yet |
| Team page + bios (Chels, Emily, Jacob) | ❌ |
| Partners page (Housing Justice National Alliance + logos) | ❌ |
| Take Action location pages (Wagga, Northern Rivers, National) | ❌ (3489 covers one) |
| Projects page under About | 🔮 planned (§2) |
| Donate in nav | ❌ (need URL) |
| SEO (titles/meta; doesn't rank for "housing campaign") | ❌ |

### Done ✅
Lexend + Poppins fonts · brand pink darkened (#A8178C) · readability measure · unified
shadow-box card system + `[content_cards]` engine · Campaigns page + `campaign` taxonomy + nav ·
all 5 campaign pages on the `action` template · conditional Events nav · Articles + In the Media
sections created · archived stale pages/events · style guide.

---

## 4. Remaining work (unblocked vs. blocked)

**Unblocked**
1. Delete test event 3560.
2. Fill **Articles** with long-form pages (No Homes No Future, Housing First) as child pages.
3. Build the **Projects** page under About (§2) and re-parent the Media children.

**Blocked on inputs**
- **Jacob:** approve copy; Jacob's bio; Donate URL.
- **Assets:** featured images; Partner logos; team photos.
- **Decisions:** In-the-Media layout; Mullum as Project vs Campaign; Featured Experts.
- **Action Network:** any new petition URLs.

**Later**
- Homepage decomposition into teasers + campaign card row; shorten footer ack.
- Header/footer restyle to the style guide; alternating section bands.
- SEO pass.
