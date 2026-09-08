# Studio: what confuses people, and what to change

A review of the Studio flow as shipped on 2026-09-04, prompted by two
complaints: "Generate imagery" runs for a long time with nothing to look at,
and the workflow as a whole is hard to follow because nothing on the pages
explains it. The first is a symptom of the second. Both are fixable in the
UI without touching the generation tier.

The flow today:

1. `/studio`: describe the business, optionally add photos, then one of
   three actions ("Generate websites", "Make my website", "Match from the
   library").
2. `/studio/results`: three cards, each with Preview, Download, "Make this
   one" and "Generate imagery".
3. `/studio/site`: the workspace. An editor (Words, Colours, Pictures), a
   request box ("ask for a change"), history, download.
4. `/account`: sites, uploads, usage.

## Part 1: the imagery wait

### What happens now

- The click sets one shared `imaging` index. The button label becomes
  "Making..." and every card's imagery button is disabled. Nothing else on
  the page changes.
- The call is one upstream image generation (`gpt-image-2`, 1536x1024,
  quality low, transparent) with a 120 second timeout and one retry, so the
  wait is anywhere from 20 seconds to four minutes, with no signal from the
  server in between.
- Success swaps the pattern preview for the picture. Failure shows a notice
  at the bottom of the page, under all three cards, with no link back to the
  card it belongs to.
- Leaving the page loses the client's wait, but the server finishes anyway
  and stores the key on the generation row, so the picture appears on the
  next load. Nothing tells the person this.

### What to change, in order of payoff

1. **Show the wait where the picture will appear.** Replace the card's
   preview area with an in-place generating state: the pattern dimmed under
   a shimmer, and a status line beneath it. The button is the least visible
   place on the card to report progress; the 16:10 preview is the most.
   The shimmer needs the `prefers-reduced-motion` override every other
   animation on the site has.

2. **Set the expectation before the click, and keep it honest during.**
   Under the button, or as its title: "About a minute. One picture per
   direction, twelve a day." After the click, staged copy driven by elapsed
   time, since the server has no real progress to report:
   - 0 to 5 s: "Sending your brief"
   - 5 to 60 s: "Painting a still life for {stance}"
   - 60 s and on: "Taking longer than usual, still working"
   plus an elapsed counter. Staged copy is not fake progress: each stage
   says something true about what is happening.

3. **Stop locking the other cards.** `disabled={imaging !== null}` disables
   all three imagery buttons for one card's wait. Per-card busy state is
   enough; the burst gate (4 a minute) already stops a scripted click. If
   the intent is to stop people spending three images at once, say so on
   the disabled buttons rather than leaving them grey.

4. **Say that leaving is safe.** One line under the status: "You can keep
   looking around. The picture will be here when you come back." That is
   already true of the server; the UI just does not admit it. On return,
   the card should show the same generating state if the key is still null
   (poll `GET /api/studio/generations/:id` every 10 s while any direction
   is pending), so a refresh does not look like the request was lost.

5. **Put errors on the card.** Keep the error next to the button it came
   from, with a Retry, and keep it there until the next attempt. The shared
   notice at the bottom of the page is easy to miss and impossible to tie
   to a card.

6. **Say what will be made.** The prompt is derived from the description,
   the stance and the palette. A single line ("A still life in your palette,
   no text, transparent background, for the hero of the page") tells people
   why it takes a minute and what to expect, and cuts the "why is it a
   picture of a vase" surprise.

7. **Longer term: take the wait out of the request.** Return 202 with the
   generation id immediately, do the upstream call under `ctx.waitUntil`,
   and have the client poll the generation for the key. This survives the
   tab closing, lets the results page show "in progress" on any reload, and
   frees the browser from a four-minute fetch. A Queue or a Durable Object
   is the shape after that, not before.

"Make this one" has the same wait with the same silence ("Writing the
page..." then a redirect), and a full document on a 300-slot template is
the longest call in the tier. The same treatment applies: expectation
before the click ("Writes every word on the page for {brand}. About a
minute."), staged status, and a redirect to the workspace that shows the
page as soon as the first revision exists.

## Part 2: the workflow

### Why it reads as confusing

1. **The words do not match the things.** The form's primary button says
   "Generate websites" and then reports "Generating your directions". The
   results page is titled "Three websites, ready to use", but what a card
   holds is a template with a brand name, a headline, a tagline and a
   palette. The *website* only exists after "Make this one", which is the
   least explained button on the page. A person who believes they already
   have three websites has no reason to click it, and one who clicks it
   cannot tell what it will add.

2. **Three ways in, explained after the fact.** "Generate websites", "Make
   my website" and "Match from the library" are told apart in a small
   paragraph at the bottom of the form. The paragraph is good; its position
   is not. Two of the three need an account and cost quota, one is free and
   instant, and nothing above the fold says which.

3. **The card mixes free, paid, instant and slow in one row.** Preview
   (instant, free), Download (instant, free, and it downloads the *blank*
   template, not the branded one the card shows), Make this one (paid,
   about a minute), Generate imagery (paid, about a minute). All four are
   drawn the same. The Download mismatch is the worst of these: the card
   says "ready to use" and hands over a zip with the plant shop's copy in
   it.

4. **No sense of place.** There is no indication of where a person is in
   describe, choose, make, refine, download. Every page starts cold.

5. **Sign-in arrives as a surprise.** The photo dropzone and the generate
   button both bounce to sign-in when signed out. The draft survives the
   trip (good), but the button did not warn.

6. **The workspace has no orientation.** Three editor tabs, a request box,
   a history list and a download button, with no sentence saying what the
   page is for or that every change is a revision you can go back to. The
   fallback notice ("only the brand name, headline and tagline have been
   applied") says what went wrong and not what to do.

7. **Card metadata reads as noise.** "Tinting / Cobalt" is the pattern name
   and the palette name, unlabelled. To a first-time visitor they are two
   random words.

8. **Photos are collected before their purpose is known.** The form asks
   for photos of the team, work, products or space, and they are only used
   as references for imagery later. Nothing says so, so people expect them
   to appear on the site.

### What to change

1. **One vocabulary, used everywhere.** A *direction* is a template, a
   palette and three lines of brand copy. A *site* is a full page written
   for the business. Then:
   - Form button: "Show me three directions" (keeps the free "Match from
     the library" as the instant, no-account alternative under it).
   - Results title: "Three directions for {business}" with a one-line lede:
     "Each is a finished template restyled for you. Pick one and Studio
     writes every word on it."
   - Card primary action: "Write the full site on this one", with the cost
     and time under it. Make it the one filled button on the card.
   - Workspace title: "{brand}, built on {template}", with "Your site" as
     the section label in the header.

2. **A four-step strip in `StudioHeader`.** Describe, Choose, Make, Refine.
   The current step highlighted, the others linked where they exist (Choose
   links back to the generation, Refine to the site). It costs one row and
   answers "where am I" on every page.

3. **Explain the three paths above the fold, briefly.** Three short lines
   under the description box, each with its price tag: "Three directions
   to choose from (account, about 30 seconds)", "One site, Studio picks
   (account, about a minute)", "Match from the library (free, instant)".
   Move the long paragraph into a "How Studio works" disclosure.

4. **Signed-out state on the buttons themselves.** "Sign in to generate"
   on the paid buttons; the free path unchanged. The daily caps belong
   here too, once: "Free while in preview: 40 directions, 10 sites and 12
   images a day."

5. **Regroup the card's actions.** Primary: Make. Secondary: Preview.
   Tertiary: Generate imagery, with its explanation. Drop Download from
   the card, or relabel it "Download the blank template"; the branded
   download belongs on the workspace, where the site it describes exists.

6. **Label the recipe.** "Pattern: Tinting. Palette: Cobalt." Or hide both
   behind the swatches, which already carry the information that matters.

7. **Tell people what the photos are for.** Under the dropzone: "Used as
   references when Studio makes pictures for your site. They do not go on
   the page as they are."

8. **Give the workspace a first line.** Above the editor for a site's
   first visit: "This is your site. Change any text on the left or ask for
   a change in plain words. Every change is saved as a revision you can go
   back to." Make the fallback notice actionable: "Ask for a full rewrite"
   as a button that sends "Rewrite every section for this business" to the
   request box.

9. **Make retry obvious after a fallback.** The "library's own best
   matches" notice on the results page should carry "Try again" and a hint
   ("name the industry and the tone; shorter is better").

10. **Consider folding "Make my website" into the results page.** With the
    recommended direction pre-selected and "Make this one" as the primary
    action, the third path becomes a default rather than a fork, and the
    first screen has two choices instead of three.

### Order of work

Vocabulary (1), the step strip (2) and the imagery in-place state (Part 1,
items 1 to 3) are each a small change to one or two components and remove
most of the confusion. The card regrouping and the Download relabel follow.
The 202-and-poll shape for long calls is the one piece that touches the
Worker and can wait until the rest has landed.
