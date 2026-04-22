# House You Website — Content Editor's Guide

This guide covers the most common tasks you'll do as a content editor on the House You website. It is written for someone who is comfortable using a computer but hasn't necessarily managed a WordPress site before.

**The site is built on WordPress** using a custom theme called "House You Theme". It uses WordPress's modern block editor (called "Gutenberg") for all content editing. You do not need to write any code to manage content.

---

## Table of Contents

1. [How the theme works — big picture](#1-how-the-theme-works--big-picture)
2. [Logging in and finding your way around](#2-logging-in-and-finding-your-way-around)
3. [Adding a new page](#3-adding-a-new-page)
4. [Editing an existing page](#4-editing-an-existing-page)
5. [Choosing a page template](#5-choosing-a-page-template)
6. [Working with blocks](#6-working-with-blocks)
7. [Colours and section styles](#7-colours-and-section-styles)
8. [Changing the header menu](#8-changing-the-header-menu)
9. [Changing the footer](#9-changing-the-footer)
10. [Adding and editing blog posts](#10-adding-and-editing-blog-posts)
11. [Managing events](#11-managing-events)
12. [Managing action/petition pages](#12-managing-actionpetition-pages)
13. [The homepage](#13-the-homepage)
14. [Images and media](#14-images-and-media)
15. [Site settings (title, logo, etc.)](#15-site-settings-title-logo-etc)
16. [Deploying changes from staging to live](#16-deploying-changes-from-staging-to-live)
17. [Common questions and troubleshooting](#17-common-questions-and-troubleshooting)

---

## 1. How the theme works — big picture

### It's a "block theme"

The House You site uses a modern WordPress feature called **Full Site Editing (FSE)**. This means:

- Every part of the page — including the header and footer — is made of **blocks** (text, images, buttons, columns, etc.)
- There is no separate "theme customiser" like older WordPress sites. Instead, you use the **Site Editor** (Appearance → Editor) to change global things like the header and footer.
- Page content is edited using the regular **page editor** (Pages → Edit).

### What controls what

| What you want to change | Where to do it |
|---|---|
| Header (logo, navigation) | Appearance → Editor → Template Parts → Header |
| Footer | Appearance → Editor → Template Parts → Footer |
| A page's content | Pages → find the page → Edit |
| Navigation menu items | Appearance → Menus (for Max Mega Menu items) |
| Blog posts | Posts |
| Events | Pages → pages using the "AN Events" template |
| Colours, fonts, spacing | Controlled by the theme — contact the developer to change globally |

### The design system

The theme has a fixed set of **brand colours** available everywhere in the editor:

| Name | Use |
|---|---|
| Ash Grey | Dark backgrounds, body text |
| House You Pink | Buttons, highlight accents |
| White | Light section backgrounds |
| Hot Pink | Hover states, accents |
| Orange | Accent |
| Light Pink | Soft background tint |
| Lime Green | Accent |
| Purple | Accent |
| Logo Blue | Brand tertiary colour |

These colours appear in the colour picker anywhere you can set a colour in the block editor. **You don't need to type hex codes** — just pick from the palette.

---

## 2. Logging in and finding your way around

1. Go to `https://houseyou.org/wp-admin` (or the staging equivalent)
2. Log in with your username and password
3. You'll land on the **Dashboard**

The main navigation is on the left sidebar:

- **Posts** — blog articles
- **Pages** — all static pages (About, Contact, Events index, etc.)
- **Media** — uploaded images and files
- **Appearance** — theme settings, menus, Site Editor
- **Settings** — general site options

---

## 3. Adding a new page

1. In the left sidebar, click **Pages → Add New**
2. Click on "Add title" at the top and type your page title
3. Add content using blocks (see [Section 6](#6-working-with-blocks))
4. On the right-hand panel, check:
   - **Status:** Draft (while working) or Published (when ready to go live)
   - **Visibility:** Public (visible to everyone), Private (admins only), or Password Protected
   - **Template:** Choose the right template for this type of page (see [Section 5](#5-choosing-a-page-template))
   - **Featured Image:** Upload a hero image if the template uses one
5. Click **Publish** (or **Update** if editing an existing page)

### Adding the page to the navigation menu

Publishing a page does **not** automatically add it to the menu. See [Section 8](#8-changing-the-header-menu) to add it manually.

### Setting a page URL (slug)

The URL (called the "slug") is set automatically from the title. To change it:
1. Click on the page title area in the editor
2. In the right panel, look for **Permalink**
3. Edit the slug field

---

## 4. Editing an existing page

1. Go to **Pages** in the sidebar
2. Find the page (use the search bar at the top if needed)
3. Hover over the page title and click **Edit**
4. Make your changes
5. Click **Update** (top right)

> **Tip:** Changes are saved as a draft until you click Update. Use the **Preview** button (top right) to see how the page will look before publishing.

---

## 5. Choosing a page template

When you create or edit a page, you can choose a **template** from the right-hand panel (under "Template" or "Page Attributes"). Templates control the overall layout — what surrounds the content.

| Template name | What it does | When to use it |
|---|---|---|
| **Default template (page.html)** | Standard page — header, your content, footer | Most pages (About, News, Contact, etc.) |
| **AN Events** | Two-column layout — content on left, RSVP form on right | Individual event pages |
| **Action** | Two-column layout — content on left, petition/letter form on right | Petition, letter campaign, or survey pages |
| **Blank** | No header or footer — just your content | Landing pages with custom headers, embedded pages |
| **Header and Footer Only** | Header + footer with no constraints on content | Advanced full-width layouts |

> **Note:** The homepage uses a separate template managed in the Site Editor — see [Section 13](#13-the-homepage).

---

## 6. Working with blocks

WordPress content is built with **blocks**. Every paragraph, heading, image, button, and column is a block.

### Adding a block

1. Click anywhere in the content area
2. Press the **`+`** button (appears on the left of empty lines, or in the top toolbar)
3. Search for the block type you want (e.g. "heading", "image", "button", "columns")
4. Click to insert it

### Common blocks

| Block | Use it for |
|---|---|
| **Paragraph** | Body text |
| **Heading** | Section titles (H1–H6) |
| **Image** | A single photo |
| **Buttons** | Call-to-action links |
| **Columns** | Side-by-side layout |
| **Group** | Wrapping blocks together so you can apply a background colour or style to them as a section |
| **Cover** | Image with text overlay |
| **List** | Bullet points or numbered lists |
| **Separator** | Horizontal dividing line |
| **Shortcode** | Embeds special functionality (events listing, Action Network forms) |

### Moving blocks

- Hover over a block — a drag handle (⠿) appears on the left. Drag it up or down.
- Or use the **up/down arrows** in the floating toolbar above the block.

### Selecting a block vs. typing inside it

- **Single click** on a block to select it (shows the blue outline + toolbar)
- **Double click** (or press Enter while selected) to enter the block and type

### Deleting a block

Select the block, then click the three-dot menu (⋮) in the toolbar → **Remove block**. Or press **Backspace** when the block is selected (not in editing mode).

### Patterns — pre-built layouts

The site has a set of **block patterns** — pre-designed sections you can insert in one click. To use them:

1. Click the **+** button
2. Click the **Patterns** tab
3. Browse categories: Featured, Columns, Images, Text, Query
4. Click a pattern to insert it

---

## 7. Colours and section styles

### Changing the colour of a single block

Select a block → look in the right panel for **Color** settings. You'll see the brand colour palette — click any swatch to apply it.

### Creating a coloured section (the right way)

To create a full-width coloured band (like the dark, pink, or light sections on the homepage):

1. Add a **Group** block
2. Put your content blocks inside it
3. With the Group selected, look in the right panel for **Styles**
4. Choose one of the preset section styles:

| Style | Background | Text |
|---|---|---|
| **Dark Section** | Ash Grey (almost black) | White |
| **Light Section** | White | Ash Grey |
| **Pink Section** | House You Pink | White |

These styles apply the correct brand colours automatically — you don't need to set background and text colours separately.

### Making a section span the full page width

By default, content has side margins. To make a Group block stretch edge-to-edge:

1. Select the Group block
2. In the toolbar at the top, click the **Align** icon (looks like left/right arrows)
3. Choose **Full Width**

This is how the homepage hero, dark sections, and footer achieve their full-bleed look.

---

## 8. Changing the header menu

The site uses a plugin called **Max Mega Menu** for the main navigation. This gives it features like dropdown menus, icons, and mobile responsiveness.

### To add or edit menu items

1. Go to **Appearance → Menus** in the WordPress sidebar
2. Select the menu called something like "Main Navigation" or "max_mega_menu_2" from the dropdown
3. To **add a page**: find it in the left panel under "Pages" and tick it, then click "Add to Menu"
4. To **add a custom link**: expand "Custom Links", enter the URL and link text, click "Add to Menu"
5. To **create a dropdown**: drag a menu item slightly to the right underneath another item — it becomes a child (sub-item)
6. To **rename a menu item**: click the item's arrow to expand it, edit the "Navigation Label" field
7. To **remove a menu item**: expand it, click "Remove"
8. Click **Save Menu** when done

### To add social media icons to the header

Social icons in the header are regular menu items styled to show an icon instead of text. Each icon is triggered by the URL (Facebook, Instagram):

1. Add a custom link with the full social media URL (e.g. `https://www.facebook.com/houseyouorg`)
2. Set the Navigation Label to the platform name (e.g. "Facebook")
3. Expand the item → look for **CSS Classes** (you may need to enable this via Screen Options at the top right)
4. Enter `social-icon` as the CSS class
5. Save the menu — the icon will appear automatically

### To configure Max Mega Menu behaviour

Go to **Max Mega Menu → General Settings** to adjust the mobile breakpoint, animation, and other options. This is rarely needed.

---

## 9. Changing the footer

The footer is a **template part** — a global block that appears on every page. To edit it:

1. Go to **Appearance → Editor** (this opens the Site Editor)
2. In the left panel, click **Template Parts**
3. Click **Footer**
4. Edit just like a normal page — add/remove blocks, change text, update links
5. Click **Save** when done — this updates the footer on every page of the site

### Footer structure

The footer has three columns:
- **Left column:** navigation links (footer nav left)
- **Centre column:** the House You logo
- **Right column:** secondary/social navigation links

Below the columns is the First Nations acknowledgement text.

To change footer navigation links, edit the navigation blocks inside the footer template part, or go to **Appearance → Menus** and edit the footer nav menus directly.

---

## 10. Adding and editing blog posts

Blog posts are different from pages — they appear in the news/blog feed and have categories, tags, and dates.

### To add a post

1. Go to **Posts → Add New**
2. Write your title and content using blocks
3. In the right panel, set:
   - **Categories:** tick an existing category or create a new one
   - **Tags:** add relevant keywords
   - **Featured Image:** this image appears at the top of the post and in the blog listing
   - **Excerpt:** a short summary (if left blank, WordPress uses the first 55 words)
4. Click **Publish**

### Post template

All single blog posts use the `single.html` template automatically — you don't need to select it. This shows:
- Post title (large H1)
- Full-width featured image
- Post content
- Author and date at the bottom
- Comments section

---

## 11. Managing events

Events use a special **AN Events** page template that displays event details on the left and an RSVP form on the right.

### To create a new event page

1. Go to **Pages → Add New**
2. Title the page with the event name
3. In the right panel, under **Template**, select **AN Events**
4. Add your event description as content
5. Add a **Featured Image** — this shows in the right column above the RSVP form
6. Scroll down in the right panel to find the **Action Network Embed Code** field (or look in the ACF section). Paste the Action Network embed code here.
7. Scroll further to the **Event Details** box. You can:
   - Fill in the date, time, and location manually, OR
   - Click **Sync from Action Network** if the API is set up (note: this may not work — see below)
8. Publish the page

### To show events on a listing page

Use the shortcode `[events_listing]` inside a Shortcode block on any page. This automatically shows all upcoming events (pages using the AN Events template with a future date).

### Events listing fields

The listing card shows:
- Featured image
- Event title
- Date and time
- Location
- Short excerpt (first 15 words of the page content)

If no date is set on the event, the card shows a warning — always fill in the Event Details fields.

### Known issue: Event sync

The "Sync from Action Network" button in the Event Details box currently has a bug — it may not retrieve event data automatically. As a workaround, fill in the date, time, and location fields manually. The RSVP form itself will still work fine.

---

## 12. Managing action/petition pages

Action pages display a campaign description on the left and an Action Network petition, letter, or survey form on the right.

### To create an action page

1. Go to **Pages → Add New**
2. Title it with the campaign name
3. Under **Template**, select **Action**
4. Write your campaign description and call to action as the page content
5. Scroll down to the **Action Network Embed Code** field (in the ACF section) and paste the embed code from Action Network
6. Add a **Featured Image** — shown in the right column above the form
7. Publish

### Getting the embed code from Action Network

1. Log into your Action Network account
2. Find the petition, letter, or event
3. Go to its settings and find "Embed this action"
4. Copy the script embed code
5. Paste it into the Action Network Embed Code field in WordPress

The form will appear on the right side of the page automatically when the page loads.

---

## 13. The homepage

The homepage is managed differently from other pages. It uses a dedicated template called `home-2026.html` which is built directly in the Site Editor (not the regular page editor).

### Why the homepage is different

The homepage content is embedded in the template itself — so editing it works differently:

1. Go to **Appearance → Editor**
2. Click **Templates**
3. Find **Home 2026** (or similar)
4. Edit the sections directly in the Site Editor
5. Click **Save**

### Homepage structure

The homepage has four full-width coloured sections:
1. **Hero section** — dark background, large headline, Action Network letter campaign form
2. **Light section** — white background, supporting content
3. **Pink section** — House You Pink background, call to action
4. **Dark section** — dark background, further content

Each section uses the "Full Width" alignment, so they span edge-to-edge across the page.

### Changing the homepage letter campaign

The letter campaign embed is placed directly in the hero section of the homepage template. To replace it with a different campaign:
1. Edit the homepage template in the Site Editor
2. Find the shortcode or script block in the hero section
3. Replace the embed code with the new campaign's code from Action Network

> **Note:** The homepage has JavaScript that customises the letter form's labels and adds a custom thank-you message. If you change the campaign, contact the developer to update the JavaScript if the form fields are different.

---

## 14. Images and media

### Uploading images

1. When you click an Image block, you can upload directly from your computer, or click **Media Library** to use an already-uploaded image
2. Alternatively, go to **Media → Add New** to upload images in bulk before using them

### Image sizes and quality

- Upload images at **1200–2000px wide** for full-width sections; smaller for thumbnails
- Use **JPEG** for photos, **PNG** for graphics with transparency, **SVG** for logos and icons
- The site supports SVG uploads (enabled by a plugin)
- Compress images before uploading — tools like [Squoosh](https://squoosh.app) or [TinyPNG](https://tinypng.com) work well

### Organising media

The **FileBird** plugin allows you to create folders in the Media Library. Use folders to keep images organised by campaign, year, or content type.

### Featured images

Featured images are used by several templates:
- **Blog posts** — shown at the top of the post and in blog listing cards
- **Event pages** — shown in the right column above the RSVP form
- **Action pages** — shown in the right column above the petition form

Always add a featured image to posts and event/action pages.

### Duotone image filters

The theme includes coloured duotone filters you can apply to images to match the brand palette:

| Filter | Colours |
|---|---|
| Default filter | Black → Lime Green |
| White Filter | Black → White |
| Red Filter | Black → Soft Pink/Red |
| Blue Filter | Black → Light Blue |
| Blue/Cream Filter | Dark Blue → Cream |
| Green/Pink Filter | Dark Green → Pink |

To apply a duotone: select an Image or Cover block → in the right panel, look for **Filters** or **Duotone**.

---

## 15. Site settings (title, logo, etc.)

### Changing the site title or tagline

Go to **Settings → General** and update the Site Title and Tagline fields.

### Changing the logo

1. Go to **Appearance → Editor**
2. Click on **Template Parts → Header**
3. Click on the logo block
4. In the right panel, click **Replace** to upload or select a new logo image
5. Adjust the width (currently 153px) if needed
6. Click **Save**

The same logo block appears in the footer — update it there too if needed:
1. Go to **Appearance → Editor → Template Parts → Footer**
2. Click the logo and replace it

### Changing the site favicon (browser tab icon)

Go to **Appearance → Editor → Site Icon** (sometimes accessible via Settings → General → Site Icon), or check **Appearance → Customize** if available.

---

## 16. Deploying changes from staging to live

The site has two environments:
- **Staging** — a test site where you can safely make and preview changes
- **Production (live)** — the real site at `houseyou.org`

### Workflow

Changes are made on **staging first**, then pushed to live:

1. Make your changes on the staging site
2. Preview them to confirm everything looks right
3. Go to the WordPress.com dashboard for the staging site
4. Use the **"Push to production"** or **"Deploy to live"** button
5. This copies both the files and database from staging to production

> **Important:** Do not make changes directly on the live site if you can avoid it — always use staging first so you can test without risk.

### What gets deployed

When you push staging to production, everything is copied:
- All page content, posts, and events
- Menu settings
- Media uploads
- Plugin settings
- ACF field data (embed codes, event details)

---

## 17. Common questions and troubleshooting

### Why can't I see my changes on the live site?

1. Did you click **Update/Publish**? (Your browser may still show an old draft)
2. Try a hard refresh: **Ctrl + Shift + R** (Windows) or **Cmd + Shift + R** (Mac)
3. If editing the header or footer, make sure you clicked **Save** in the Site Editor
4. If on staging, check whether changes have been pushed to production

### Why is the page layout broken?

This usually means a block is misconfigured. Try:
1. Click the block that looks wrong
2. Check the right panel for unexpected settings (wrong alignment, missing background colour)
3. If a Group block is missing its colour, re-apply the Section Style (Dark/Light/Pink Section)

### Why is the Action Network form not showing?

1. Check the **Action Network Embed Code** field (in the ACF panel on the right when editing the page) — it must contain a valid embed code
2. Make sure the page is using the correct template (**Action** or **AN Events**)
3. If the field is empty and you're an admin, you'll see a yellow warning box where the form should be — this is expected; add the embed code to fix it

### Why are there no events on the events listing page?

1. Check that the event pages exist and are **Published** (not Draft)
2. Check each event page has an **Event Date** set in the Event Details box (in the right panel when editing the event page)
3. Make sure the date is in the future — past events are hidden automatically

### How do I change the font or globally change colours?

The font (Red Hat Display) and colour palette are set in the theme code (`theme.json`). This is not editable through the WordPress admin — contact the developer to change it.

### How do I change the text in the First Nations acknowledgement in the footer?

1. Go to **Appearance → Editor → Template Parts → Footer**
2. Find the paragraph at the bottom
3. Edit the text directly
4. Click **Save**

### How do I add a redirect (e.g. old URL to new URL)?

The **Redirection** plugin is installed:
1. Go to **Tools → Redirection**
2. Click **Add New**
3. Enter the old URL (Source URL) and the new URL (Target URL)
4. Click **Add Redirect**

### How do I back up the site?

The WordPress.com Business plan includes automatic backups via Jetpack. Go to **Jetpack → Backup** to see backups and restore if needed.

---

## Quick reference

| Task | Where |
|---|---|
| Add/edit page | Pages → Add New / Edit |
| Add/edit blog post | Posts → Add New / Edit |
| Add event | Pages → Add New → Template: AN Events |
| Add action/petition page | Pages → Add New → Template: Action |
| Change header menu | Appearance → Menus |
| Edit header (logo, layout) | Appearance → Editor → Template Parts → Header |
| Edit footer | Appearance → Editor → Template Parts → Footer |
| Edit homepage | Appearance → Editor → Templates → Home 2026 |
| Upload images | Media → Add New |
| Change site title | Settings → General |
| Change logo | Appearance → Editor → Template Parts → Header |
| Add a redirect | Tools → Redirection |
| Push staging to live | WordPress.com dashboard → Push to production |

---

*This guide covers the House You theme as of April 2026. The theme uses WordPress Full Site Editing (FSE) with the House You Theme (version 1.0.128), Max Mega Menu, Advanced Custom Fields, and Action Network integration.*
