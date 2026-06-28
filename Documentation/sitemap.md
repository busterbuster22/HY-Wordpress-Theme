# House You — Site Map, Gap Analysis & Alignment Plan

Snapshot of staging (June 2026) vs. the May 2026 content brief, plus a plan to bring pages
into line with [style-guide.md](style-guide.md). Companion to [refactor.md](refactor.md).

Legend: ✅ done · 🟡 partial / needs work · ❌ missing · 🗑 archived (draft)

---

## 1. Site map

### Homepage blocks
| Block | Short (homepage) | Long / linked page |
|---|---|---|
| 1 Hero / Sign-up | 🟡 hero exists (verify copy + AN volunteer-form-22 two-step) | n/a |
| 2 No Homes No Future | 🟡 verify on homepage | ❌ `/no-homes-no-future` long page **missing** |
| 3 What's Driving the Crisis (5 graphics) | 🟡 card row exists but **wrong set** (see below) | see petitions |
| 4 Housing First: The Solution | 🟡 verify on homepage | ❌ `/housing-first` long page **missing** |
| 5 Our Story | 🟡 About exists | ❌ `/team` page **missing** |
| 6 Acknowledgement (footer) | 🟡 footer ack exists | ❌ "shorter" version not done |
| — extra brief sections | ❌ "How we Get Everybody a House", "How we End House Hoarding", social-media feed | all missing |

**Header nav (`max_mega_menu_2`):**
`EVENTS · CAMPAIGNS · ARTICLES · ABOUT` (dropdown: Our Story, Contact, In the Media) `· FB · INSTA`

```
Homepage (2019, /)
│
├─ EVENTS (2846)                              ← [events_listing]
│  ├─ Disaster Preparedness (3508)            ⚠ filed under Media, reassign to Events
│  ├─ Workshop: Preparedness (3128)           ⚠ filed under Media, reassign to Events
│  └─ TEST EVENT — Card Preview (3560)        🗑 delete
│
├─ CAMPAIGNS (2983, /campaigns)               ← [content_cards tax="campaign"]
│  ├─ Scrap the Tax Breaks (2300)             action
│  ├─ Defend & Extend Public Housing (182)    ⚠ default template → move to action
│  ├─ Shift the Conversation (2654)           action
│  └─ Mullumbimby Hospital Site (3449)        action
│
├─ ARTICLES                                    🟡 page exists in nav, no content yet
│
├─ ABOUT (274, /about-us)
│  ├─ Our Story                               ← the About page itself
│  ├─ Contact (237)
│  └─ In the Media (3505, /media)             ← [content_cards parent="current"]  🟡 empty page ready for press coverage
│
├─ Privacy Policy (1434)
├─ Terms of Use (1439)
│
└─ Standalone / in-progress:
   ├─ The Housing Crisis Is Killing People (3489, action)
   ├─ Housing Village (229)                   ⚠ mis-filed under Campaigns
   ├─ Conversation Training: House Hoarding 101 (3081)
   └─ Conversations Training Feedback (3289, survey)
```

**Archive (draft) 🗑:** Joint Statement Budget 2026 ×2 (3398, 3477); 9 past events
(workshops, conversation trainings, SOLD screening, Mullum forum, Grinch).

### Known structural problems
- **In the Media page (3505) is empty** — its children (Disaster Preparedness, Workshop,
  Mullumbimby) belong under Events and Campaigns respectively. Reassign them, then the page
  is ready to receive actual press coverage.
- **`Defend & Extend Public Housing` (182)** is on the `default` template, not `action`
  (no petition form layout) — brief flags it as "need to recreate."
- **Deep parent nesting** (About/Contact/Privacy under Homepage; Village under Campaigns)
  creates messy URLs.
- **Test event (3560)** still live.

---

## 3. Gap analysis — brief content NOT yet implemented

What the brief specified, mapped to what exists.

### Homepage blocks
| Block | Short (homepage) | Long / linked page |
|---|---|---|
| 1 Hero / Sign-up | 🟡 hero exists (verify copy + AN volunteer-form-22 two-step) | n/a |
| 2 No Homes No Future | 🟡 verify on homepage | ❌ `/no-homes-no-future` long page **missing** |
| 3 What's Driving the Crisis (5 graphics) | 🟡 card row exists but **wrong set** (see below) | see petitions |
| 4 Housing First: The Solution | 🟡 verify on homepage | ❌ `/housing-first` long page **missing** |
| 5 Our Story | 🟡 About exists | ❌ `/team` page **missing** |
| 6 Acknowledgement (footer) | 🟡 footer ack exists | ❌ "shorter" version not done |
| — extra brief sections | ❌ "How we Get Everybody a House", "How we End House Hoarding", social-media feed | all missing |

### Campaigns in progress
| Campaign | Page | Status |
|---|---|---|
| Property Investors / End Tax Handouts | tax-breaks (2300) | ✅ exists |
| Defend & Extend Public Housing | defend-public-housing (182) | 🟡 exists, needs `action` template |

→ 1 campaign to rebuild on the `action` template, plus copy review. (Remaining 3 brief
petitions deferred — not finished.)

### Whole pages / sections missing
| Brief item | Status |
|---|---|
| Partners page (Housing Justice National Alliance + logos) | ❌ missing |
| Take Action: Wagga, Northern Rivers, National (Green Bans) | ❌ missing (3489 = Wagga letter exists) |
| In the Media (press coverage / media releases) | ❌ missing (current Media page misused) |
| Articles section (long-form: No Homes, Housing First, Team, bios) | ❌ missing |
| Team page + bios (Chels, Emily, Jacob) | ❌ missing (bios in brief) |
| Featured Contributors/Experts (Darran SCU, Tahlia) | ❌ missing |
| Donate in nav | ❌ missing (need URL) |
| SEO (titles/meta; "doesn't rank for housing campaign") | ❌ not started |

### Done since the brief ✅
Lexend + Poppins fonts · brand pink darkened · readability measure · unified shadow-box
card system · `[content_cards]` engine · Campaigns page + taxonomy + nav item · conditional
Events nav · archived stale pages/dead nav link · Media page rendering fixed · style guide.

---

## 4. Style-guide audit (existing pages)

Theme-level tokens (fonts, colour, buttons, cards, forms) are already aligned, so every page
inherits the system. Remaining gaps are **page-/template-level**:

| Area | Finding | Action |
|---|---|---|
| Homepage (2019) | Long single scroll on a DB template; not decomposed; not using shadow-box section rhythm | Decompose into teasers + Read-more + campaign card row (§5 plan) |
| Header / Footer | Functional but plain; don't yet use the shadow-box/Lexend identity; footer ack is long | Restyle to style guide; shorten ack |
| Campaign/action pages | Body copy varies; cards lack featured images; 182 on wrong template | Add images + curated excerpts (excerpts ✅); move 182 to `action` |
| Section colour use | Inconsistent use of `is-style-dark/light/pink-section` bands | Apply alternating bands per style guide |
| Long-form pages | Don't exist yet (No Homes/Housing First/Team) — build them on the prose measure | Create with brief copy |
| Imagery | Few featured images; no shadow-box on inline images | Add images; apply shadow-box treatment |
| Misc | Emoji/grey boxes removed from cards ✅; check none remain in page content | Spot-fix any in page bodies |

No off-brand fonts/colours found at the theme level (global tokens enforce them). The risk
is in **page content blocks** authored before the system existed — those need a visual pass
in the Site Editor.

---

## 5. Alignment plan (phased)

Ordered by value and by what's unblocked. Many items need inputs (flagged).

**Phase A — Structure & cleanup (mostly unblocked, low risk)**
1. Delete test event 3560.
2. Move 182 (Defend & Extend) to the `action` template; fix deep parent nesting where it
   harms URLs.
3. Create the **Articles** section (long-form: No Homes No Future, Housing First, Team,
   bios). Build on prose measure per style guide.
4. Repurpose **Media → In the Media** for press only; move mis-filed children out; place
   In the Media under About in the nav.

**Phase B — Fill content gaps (needs brief copy = Jacob sign-off)**
5. Create long-form pages: `/no-homes-no-future`, `/housing-first`, `/team` (copy in brief).
6. Create **Partners** + **Take Action** location pages. *(Needs logos, organiser details.)*

**Phase C — Homepage decomposition** (needs B's pages to link to)
8. Trim homepage to teasers + Read-more; insert campaign card row; shorten footer ack.

**Phase D — Design polish**
9. Header/footer restyle to the style guide; alternating section bands; add featured images
   (needs image assets); shadow-box on key images.

**Phase E — Decisions / external**
10. Add Donate URL to nav; SEO pass.

### Blocked on inputs
- **Jacob:** approve copy ("need to chat with Jacob"); Jacob's bio; Donate URL.
- **Assets:** featured images; Partner logos; team photos.
- **Action Network:** live action URL for rebuilt Defend campaign.
- **Decisions:** In-the-Media layout; confirm Featured Experts.
