# PIXEL PATAKHA '26 --- Website Design System

> **Design direction:** Retro pixel-art arcade × Minecraft-inspired
> voxel worlds × modern UI/UX designathon portal\
> **Primary deliverable:** A complete, responsive landing page.
> Registration, submission, and judging workflows should follow the same
> design system.

------------------------------------------------------------------------

## 1. Project Overview

PIXEL PATAKHA is a 3-hour UI/UX designathon organized by DAS and ACM as
part of BVEST '26. The website should make the event feel like a
creative quest inside a retro pixel-art universe while keeping event
information, registration, and submissions clear and easy to use.

### Core goals

-   Explain the event and its format quickly.
-   Make team registration easy to find.
-   Communicate the timeline, allowed tools, equipment requirements, and
    originality rules.
-   Provide a clear path for registered teams to submit their final
    design/prototype.
-   Give authorized admins and judges a consistent interface for
    reviewing submissions.
-   Work well on desktop, tablet, and mobile.

### Design principles

1.  **Pixel identity, modern usability:** Use pixel styling for display
    elements and decoration, not at the expense of readable content.
2.  **Clear hierarchy:** Event title and registration CTA should be the
    first things visitors notice.
3.  **Dark cosmic canvas:** Keep the background dark and let cyan,
    purple, yellow, and pink accents carry the visual energy.
4.  **Consistent components:** Reuse the same buttons, borders, spacing,
    typography, and focus states across all pages.
5.  **Honest content:** Do not show fabricated submissions as real
    entries. Use labelled placeholders until approved work is available.

------------------------------------------------------------------------

## 2. Visual Direction

### Mood and references

-   8-bit / 16-bit arcade games
-   Minecraft-inspired floating voxel islands and block terrain
-   Starfields, pixel particles, coins, hearts, small creatures, and
    game-item sprites
-   Bold outlined pixel typography
-   Neon cyan and purple interface borders
-   Yellow arcade-style primary buttons
-   Compact game HUD labels and timeline markers

The design should feel energetic and playful without becoming visually
noisy. Decorative elements must never obscure headings, buttons, form
fields, or essential rules.

------------------------------------------------------------------------

## 3. Color Palette

Use the following palette consistently across the site.

  -----------------------------------------------------------------------
  Token                   Hex                     Intended use
  ----------------------- ----------------------- -----------------------
  Cosmic Black            `#030711`               Main page background

  Deep Navy               `#07152B`               Cards, panels,
                                                  navigation background

  Electric Cyan           `#00D9FF`               Borders, icons, focus
                                                  states, dividers

  Pixel Blue              `#087BFF`               Links, secondary
                                                  accents, selected
                                                  states

  Voxel Purple            `#6338F5`               Decorative gradients,
                                                  badges, alternate card
                                                  accents

  Arcade Yellow           `#FFE229`               Primary CTA, important
                                                  badges, timeline
                                                  highlights

  Pixel Pink              `#FF1493`               Warnings, hearts,
                                                  special callouts

  Cloud White             `#F4F7FF`               Main text and headings

  Muted Text              `#AAB8D0`               Supporting text and
                                                  secondary information

  Panel Border            `#203D65`               Low-emphasis separators
                                                  and card edges

  Success Green           `#48E08A`               Successful actions and
                                                  completed states only

  Error Red               `#FF5364`               Validation errors and
                                                  failed states
  -----------------------------------------------------------------------

### Color balance

As a rough visual guide:

-   60% dark backgrounds and panels
-   20% white and muted text
-   15% cyan, blue, and purple
-   5% yellow and pink high-impact accents

Yellow should be reserved for primary actions such as **Register Team**
and **Submit Design**. Pink should primarily signal warnings or special
highlights. Do not use every accent color on every component.

### Gradient guidance

Gradients may be used sparingly for hero artwork and decorative terrain,
for example:

-   Purple to blue: `#6338F5` → `#087BFF`
-   Cyan to blue: `#00D9FF` → `#087BFF`

Avoid gradients behind long blocks of text. Keep core interface panels
mostly solid and dark.

------------------------------------------------------------------------

## 4. Typography

Use three typefaces with distinct roles.

### Display font --- Pixelify Sans

**Use for:** Main event title, section headings, card titles, and
navigation labels.

-   Google Fonts: https://fonts.google.com/specimen/Pixelify+Sans
-   Hero title: approximately 48--76 px on desktop, responsive down to
    36--48 px on small screens.
-   Section headings: 22--30 px.
-   Card titles: 16--20 px.

### Arcade label font --- Press Start 2P

**Use for:** Small game-like labels, counters, badges, and selected
button labels.

-   Google Fonts: https://fonts.google.com/specimen/Press+Start+2P
-   Small labels: approximately 8--11 px.
-   Buttons: approximately 10--12 px where legibility permits.

Press Start 2P is intentionally wide and pixelated. Do not use it for
paragraphs, FAQs, or long rules.

### Body font --- Space Mono

**Use for:** Paragraphs, rules, event details, forms, timestamps, and
dashboard information.

-   Google Fonts: https://fonts.google.com/specimen/Space+Mono
-   Body text: 14--16 px.
-   Secondary text: 12--14 px.
-   Form labels: 13--15 px.

### Typography rules

-   Use uppercase for short headings and compact labels, not entire
    paragraphs.
-   Keep line lengths comfortable for reading.
-   Use `Cloud White` for primary text and `Muted Text` for supporting
    copy.
-   Maintain readable contrast on all backgrounds.
-   Load fonts with sensible fallback fonts in case the web font is
    unavailable.

------------------------------------------------------------------------

## 5. Layout, Spacing, and Shape Language

### Layout

-   Use a centered content container with a maximum width of
    approximately 1200--1320 px.
-   Keep desktop section content aligned to a consistent grid.
-   Use generous spacing around the hero title and primary CTA.
-   Use responsive grids for feature cards, rules, and showcase items.
-   Avoid making every section the same height; let content determine
    section height.

### Spacing scale

Use a consistent 4 px base spacing system:

  Token         Value Example use
  ------- ----------- -------------------------------
  XS             4 px Icon-to-label gap
  S              8 px Compact internal spacing
  M             16 px Standard component spacing
  L             24 px Card padding and grid gaps
  XL            32 px Section subgroups
  2XL           48 px Section spacing
  3XL       64--96 px Major desktop section spacing

### Borders and corners

-   Prefer square or minimally rounded corners to match pixel art.
-   Use 1--2 px cyan or blue borders for prominent panels.
-   Use muted navy borders for lower-emphasis components.
-   Use hard offset shadows on pixel-style buttons and display elements.
-   Avoid excessive glassmorphism, blur, or soft rounded-pill
    components.

### Pixel decoration

Use pixel sprites, square particles, block corners, and voxel
illustrations as accents. Keep decoration out of the reading path and
provide a simpler static background on small screens if performance or
legibility requires it.

------------------------------------------------------------------------

## 6. Landing Page Structure

Build the landing page in the following order.

### 6.1 Announcement Strip

**Purpose:** Establish the event identity immediately.

Suggested content:

`★ BVEST '26 • DESIGN. BUILD. PLAY. ★`

Design requirements:

-   Thin strip at the very top.
-   Deep navy or black background.
-   Yellow pixel-style text and star icons.
-   Compact height with no unnecessary animation.

### 6.2 Navigation Bar

**Elements:**

-   Pixel-diamond logo and PIXEL PATAKHA wordmark
-   About
-   Timeline
-   Rules
-   FAQ
-   Primary **REGISTER TEAM** button

**Behavior:**

-   Navigation anchors scroll to the relevant landing-page section.
-   Register Team opens the registration flow or takes the user to the
    registration section.
-   The navbar may remain sticky while scrolling.
-   Mobile navigation should collapse into a simple accessible menu.
-   Show visible hover, focus, and active states.

### 6.3 Hero Section

**Purpose:** Communicate the event in a few seconds.

**Content:**

-   Large two-line title: `PIXEL PATAKHA`
-   Subtitle: `A 3-HOUR UI/UX DESIGNOTHON`
-   Supporting line:
    `Turn bold ideas into intuitive digital experiences.`
-   Primary CTA: `REGISTER YOUR TEAM`
-   Secondary CTA: `EXPLORE THE EVENT`
-   Quick facts:
    -   3 hours
    -   1--3 members
    -   Figma · Canva · Adobe XD

**Artwork direction:**

-   Dark starfield background.
-   Minecraft-inspired floating islands and block terrain.
-   One or two pixel characters.
-   Small coins, hearts, stars, and pixel creatures.
-   A compact "Live Quest" card or event highlight.

**Layout:**

-   Desktop: text on the left, artwork on the right or behind the
    content.
-   Mobile: title and CTAs first, artwork below or as a simplified
    background.
-   Ensure the title and CTA remain legible even when artwork is hidden.

### 6.4 "Your Next Design Quest" Feature Cards

Create three cards:

1.  **Think Fast** --- Get an on-the-spot problem statement and start
    designing.
2.  **Build Smart** --- Create an intuitive UI/UX design and functional
    prototype.
3.  **Show Your Craft** --- Submit your work for review by the judges.

**Visual treatment:**

-   Deep navy card surfaces.
-   Cyan, purple, or yellow accent borders.
-   Pixel-art icon or sprite.
-   Short description and numbered badge.
-   Small hover lift or glow, with reduced-motion support.

### 6.5 "The 3-Hour Run" Timeline

Display the official competition milestones.

  -----------------------------------------------------------------------
  Time                    Stage                   Details
  ----------------------- ----------------------- -----------------------
  `00:00`                 Quest Start             Competition begins and
                                                  participants receive
                                                  the on-the-spot problem
                                                  statement.

  `01:00`                 Mentorship Check-in     Round 1 mentorship
                                                  check-in.

  `03:00`                 Final Submission        Round 2 final
                                                  submission via Google
                                                  Form.
  -----------------------------------------------------------------------

**Design:**

-   Connect stages using a dotted neon line.
-   Use a flag, mentorship/team icon, and star or submission icon.
-   Use a horizontal timeline on desktop and a vertical timeline on
    mobile.
-   Do not imply intermediate deadlines or judging stages that have not
    been confirmed by the organizers.

### 6.6 "Play Fair. Create Original." Rules Panel

Display these requirements clearly:

-   Team size: 1--3 members.
-   Allowed software: Figma, Canva, Adobe XD.
-   Participants must bring their own laptops and chargers.
-   Participants must bring a mobile hotspot; Wi-Fi and devices will not
    be provided.
-   Reference links for external assets, icons, and inspiration must be
    submitted with the final link.
-   Plagiarism and generative AI tools, including AI image generators
    and AI layout generators, are strictly prohibited.

**Layout:**

-   Checklist in a cyan-bordered panel.
-   Separate pink warning panel for the originality policy.
-   Use clear wording and readable body text.
-   Do not rely on color alone to communicate the AI-tool prohibition;
    include an explicit text warning and suitable icon.

### 6.7 "Your Creation, on the Board" Showcase and Submission CTA

**Purpose:** Explain how work will be submitted and reviewed.

**Elements:**

-   Gallery cards for approved showcase entries, if available.
-   Each card may include a thumbnail, project title, and category.
-   A short explanation that teams must register first and submit their
    final design/prototype link after the event.
-   A **TEAM REGISTRATION** button.

**Content integrity:**

-   Do not present mock projects as actual participant submissions.
-   If no approved submissions exist yet, use clearly labelled sample
    placeholders or hide the showcase gallery until real work is
    available.
-   Keep the final submission instructions consistent with the official
    Google Form process.

### 6.8 FAQ Accordion

Recommended questions:

-   Who can participate?
-   Which tools are allowed?
-   How do we register a team?
-   How do we submit our design?
-   Are generative AI tools allowed?
-   What equipment should we bring?
-   Do we need to submit external asset references?

**Interaction:**

-   Each row expands and collapses on activation.
-   Use keyboard-accessible buttons and clear focus indicators.
-   Keep answers concise and consistent with the official event rules.
-   Avoid inventing eligibility requirements that the organizers have
    not confirmed.

### 6.9 Footer

Include:

-   PIXEL PATAKHA branding
-   BVEST '26
-   "Organized by DAS × ACM"
-   Rules
-   Contact
-   Official Communication Group
-   Official social links, if provided

Use a dark background, subtle top border, and small pixel decorations
along the edges.

------------------------------------------------------------------------

## 7. Shared UI Components

### Primary button

-   Background: Arcade Yellow `#FFE229`
-   Text: Cosmic Black `#030711`
-   Font: Press Start 2P or Pixelify Sans
-   Square or minimally rounded corners
-   Hard offset shadow
-   Hover: slight upward movement or brighter yellow
-   Focus: clearly visible cyan outline

### Secondary button

-   Transparent or Deep Navy background
-   Cyan border and text
-   Hover: subtle cyan fill or glow
-   Use for lower-priority actions such as Explore the Event

### Cards and panels

-   Background: Deep Navy `#07152B`
-   Border: Electric Cyan `#00D9FF` or Panel Border `#203D65`
-   Consistent padding and heading alignment
-   Optional pixel-corner accents
-   Avoid unnecessary shadows on every panel

### Forms and inputs

-   Dark background with white text
-   Muted borders at rest and cyan border on focus
-   Visible labels above inputs
-   Helpful validation messages
-   Required-field indicators and clear error states
-   Keyboard navigation and accessible field descriptions

### Badges and status indicators

-   Yellow: primary event milestone or important highlight
-   Cyan: informational status
-   Purple: secondary category
-   Green: successful or completed state
-   Pink/red: warning or error

Never communicate status using color alone. Pair colors with labels or
icons.

### Loading, empty, and error states

-   Loading: small pixel spinner or simple progress indicator.
-   Empty gallery: explain that approved submissions will appear when
    available.
-   Empty dashboard: explain what data will appear after registration or
    submission.
-   Error: clear message and an actionable next step.
-   Success: concise confirmation of the completed action.

------------------------------------------------------------------------

## 8. Responsive Behavior

### Desktop --- 1024 px and wider

-   Full navbar.
-   Large hero artwork with text-and-art composition.
-   Three-column feature and showcase cards where space allows.
-   Horizontal event timeline.
-   Two-column rules panel if it improves readability.

### Tablet --- 768--1023 px

-   Reduce hero title and artwork size.
-   Allow feature cards to wrap.
-   Keep buttons large enough to activate comfortably.
-   Use a simplified timeline if needed.

### Mobile --- below 768 px

-   Compact navigation with accessible menu.
-   Stack hero text, buttons, and facts.
-   Stack feature cards and rules panels.
-   Convert timeline to a vertical sequence.
-   Prevent horizontal scrolling.
-   Reduce decorative particles and hide nonessential artwork.
-   Use readable body text and adequately sized touch targets.
-   Ensure forms and submission instructions remain fully usable.

------------------------------------------------------------------------

## 9. Motion and Interaction

Keep animations subtle and purposeful.

Allowed examples:

-   Small pixel particles drifting slowly in the hero background.
-   A gentle floating effect on voxel islands.
-   Slight button lift on hover.
-   Border glow on focused or hovered cards.
-   Smooth scrolling for navigation anchors.

Requirements:

-   Respect the user's reduced-motion preference.
-   Avoid rapid flashing, excessive parallax, or distracting looping
    animations.
-   Do not make essential information available only through animation
    or hover.
-   Keep page interactions responsive on lower-powered devices.

------------------------------------------------------------------------

## 10. Accessibility and Readability

-   Maintain strong text/background contrast.
-   Use semantic heading order and landmarks.
-   Provide alt text for meaningful illustrations and empty alt text for
    purely decorative images.
-   Make all menus, accordions, forms, and buttons keyboard accessible.
-   Show visible focus states.
-   Do not use tiny pixel fonts for paragraphs or essential
    instructions.
-   Do not rely solely on color to convey errors, warnings, or status.
-   Ensure the design remains usable when decorative imagery or
    animation is disabled.

------------------------------------------------------------------------

## 11. Registration, Submission, and Judging Interfaces

These workflows come after the landing page, but should reuse the same
visual system.

### Participant registration

-   Team name and required participant details.
-   Support team sizes from 1 to 3 members.
-   Validate required fields.
-   Display a clear confirmation after successful registration.
-   Avoid duplicate team registrations where possible.

The exact participant fields and eligibility conditions should be
confirmed by the organizers before implementation.

### Submission portal

-   Accessible to registered teams.
-   Accept the required design/prototype link.
-   Collect external asset, icon, and inspiration reference links.
-   Validate required fields and link formats.
-   Display submission status and a clear success/error message.
-   Keep the final submission process aligned with the official Google
    Form if that remains the required method.

### Admin dashboard

-   List registered teams and participants.
-   Show submission status and submitted links.
-   Search, filter, and sort records.
-   Provide controlled access to administrative actions.
-   Keep private information out of public pages.

### Judge review interface

-   Show the submission link and any approved preview.
-   Provide scoring and feedback fields according to a rubric supplied
    by the organizers.
-   Record review status.
-   Restrict access to authorized judges.
-   Do not invent judging criteria or score weights before they are
    approved.

### Security requirements

-   Enforce role-based access control on the server, not only in the UI.
-   Validate user input and submission links.
-   Protect administrative routes and sensitive participant data.
-   Use secure authentication and appropriate session handling.
-   Validate and restrict file uploads if file uploads are introduced.
-   Avoid exposing private judging feedback on public pages.

------------------------------------------------------------------------

## 12. Asset Guidelines

### Preferred assets

-   Original pixel-art sprites and icons.
-   Minecraft-inspired voxel environments that do not misuse protected
    logos or imply official affiliation.
-   Pixel stars, hearts, coins, block terrain, flags, trophies, and UI
    symbols.
-   Optimized background artwork with sufficient contrast behind text.

### Asset consistency

-   Use one consistent pixel-art style.
-   Avoid mixing realistic photography with pixel illustrations.
-   Prefer crisp edges; disable smoothing where appropriate for small
    pixel sprites.
-   Compress large images and use appropriate image dimensions.
-   Keep decorative art separate from functional controls.

The event prohibits generative AI tools for participant design work.
Confirm the organizers' policy before using any AI-generated imagery in
official event materials. The website's visual style must not encourage
participants to violate the event rules.

------------------------------------------------------------------------

## 13. Suggested Implementation Order

1.  Establish the color tokens, fonts, spacing, and reusable components.
2.  Build the announcement strip and responsive navbar.
3.  Complete the hero section and its pixel-art composition.
4.  Build the feature cards, timeline, rules panel, showcase, FAQ, and
    footer.
5.  Add mobile layouts, keyboard navigation, focus states, and
    reduced-motion support.
6.  Review the landing page against the supplied visual reference and
    official event information.
7.  Implement team registration.
8.  Implement submission handling and admin/judge dashboards.
9.  Test authentication, permissions, validation, empty states, and
    responsive behavior.

------------------------------------------------------------------------

## 14. Landing Page Acceptance Checklist

-   [ ] The PIXEL PATAKHA identity and event purpose are immediately
    clear.
-   [ ] The hero includes both registration and event-exploration CTAs.
-   [ ] The palette follows the documented color tokens.
-   [ ] Pixel fonts are used for display elements, not long paragraphs.
-   [ ] The timeline shows the start, 1-hour mentorship check-in, and
    3-hour final submission.
-   [ ] All official equipment, team-size, software, reference-link, and
    originality rules are present.
-   [ ] The AI-tool prohibition is explicit and prominent.
-   [ ] The showcase does not misrepresent placeholders as real
    submissions.
-   [ ] Navigation, FAQ, and buttons work with keyboard and touch.
-   [ ] The layout works on desktop, tablet, and mobile without
    horizontal overflow.
-   [ ] Reduced-motion preferences are respected.
-   [ ] Text remains readable when decorative effects are disabled.
-   [ ] Registration and submission CTAs lead to the correct
    destinations.
-   [ ] No unconfirmed event requirements, judging rules, or participant
    claims have been invented.

------------------------------------------------------------------------

## Final Design Summary

Build PIXEL PATAKHA as a dark, cosmic, pixel-art designathon experience
with Minecraft-inspired floating islands, bold outlined titles, cyan and
purple borders, and yellow arcade CTAs. Keep the visual treatment
playful and memorable, but make event details, rules, registration, and
submissions straightforward and accessible. The landing page is the
first milestone; all later participant, admin, and judge interfaces
should reuse the same design system.
