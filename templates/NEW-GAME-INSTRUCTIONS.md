# Make a game tracker for The Joystick Journal

These are instructions for Claude. You will be given a game name ("Make a Joystick Journal tracker for *Ghost of Tsushima*"). You research the game and produce **one plain text file** that is ready to import: the user copies everything in it and pastes it into the app, and the game appears as a tracker.

You don't need to know the app beforehand. Everything you need is in this file. Read it all before you start.

---

## 1. The app in one minute

The Joystick Journal is a phone app for tracking progress in video games. Each game the user tracks looks like this:

- **A nest** is a folder for one game. It has a name and up to 6 **tabs** along the top (STORY, COLLECTIBLES, …).
- **Each tab holds cards**, in a list from top to bottom.
- **A card is one thing to track**: a mission to tick off, a set of items to collect, a counter, a choice. Section 4 lists every card type.
- **Progress:** each tab, and the nest, has a progress bar. Ticked boxes, counter units and picked options fill it. Dividers and notes don't count. The table in section 4 shows exactly how much each card adds.
- **A nest can hold other nests** (child nests). The user taps one to open it. That's how you track a list of characters that each have their own content.
- **Dropdown notes:** most cards can open to show a short note. Use it to say *how* to do the thing or *where* it is.

You write the game in a plain text format (section 7). The app reads that text and builds the nest.

---

## 2. What you hand over

One plain text file named after the game, `<Game Title>.txt` (`Ghost of Tsushima.txt`). The whole file is the game, written in the format from section 7, and nothing else:

```
===== WORKSPACE START =====
APP|The Joystick Journal

--- NEST 1 START: <Official game title> ---
...the game, written as in section 7...
--- NEST 1 END ---

===== WORKSPACE END =====
```

Rules for the file:
- The first line is `===== WORKSPACE START =====` and the last line is `===== WORKSPACE END =====`. Nothing comes before or after them: no title, no comments, no code fences, no sources. Sources go in your report (section 9), not in the file.
- There is exactly one `NEST 1`, named with the game's official title.
- If you can't create files, put the whole text in **one** code block in your reply instead, so the user can copy it in one go.

How the user imports it: **DATA → Import → Import data**, paste, **Import**. The game is added to their list as one tracker.

---

## 3. Research: web search only

**Use only the web search tool. Do not open, fetch or browse any page.** Opening a page makes the user approve each new website, and they don't want that. Search results show titles and text snippets, and that is your material.

How to search well:
- **One search per question,** short and specific: `Ghost of Tsushima all main missions list`, `Ghost of Tsushima how many Records`, `Ghost of Tsushima Records locations Izuhara`.
- **Use the words guides use:** "all missions in order", "trophy guide", "collectibles locations", "all choices", "checkpoints", "chapter select".
- **When a snippet is cut off,** search again with the words around the gap, or add a site name (`powerpyx`, `fandom`, `pushsquare`, `game8`, `ign`, `gamefaqs`).
- **If a search tool offers a deeper or extended mode,** use it for long lists. It returns more of each page.

What to find, in this order:
1. **The game's shape** (section 5): story missions, levels, episodes, characters, choices?
2. **Main story:** the full mission, chapter or scene list, in play order.
3. **Side content:** side quests and who gives them, or where they are.
4. **Collectibles:** every type and its exact total. Trophy and achievement guides are best for totals. For collectibles with one fixed spot per level or area, also find where each one is.
5. **Challenges:** the game's own challenge lists, tiered feats, trophies or achievements worth tracking.
6. **Choices:** the major choices (the ones the game lists itself), and anything missable.

**Checking facts:**
- A count or a name is **confirmed** when two different websites agree.
- If two sites disagree, use the one that matches the trophy or achievement wording, and add a note on the card saying sources differ.
- If you find something on **only one site**, you may still use it. List it under "One source only" in your report (section 9).
- **Never guess.** If you can't find something, leave it out and list it under "Not found".
- Use in-game names exactly as written, with their capitals, punctuation and numbers.
- Write locations and notes in **your own words**, in a few words each. Never copy sentences from a guide.

---

## 4. The cards

Pick the card by asking: *what does the player actually check off?*

| Card | What it looks like | Use it for | What it adds to the progress bar |
|---|---|---|---|
| `DIVIDER` | a heading line across the list | acts, chapters, episodes, levels, regions, quest givers | nothing |
| `LIST` | one row with a tick box | one mission, scene, quest, goal or challenge | 1, when ticked |
| `LIST` with items | a row that opens into 2–8 small tick boxes | a mission with a few separate steps worth ticking | 1, filled in part as steps are ticked |
| `CHECKLIST` | a row that opens into a list of tick boxes, with a count (3/10) | a named set: collectibles, a level's goals, "all of these" | 1 per item |
| `PROGRESS` | a counter with − and + buttons (12/50) | a big set with no useful names, or "do X of something" | 1 per unit (a 0/50 counter weighs 50) |
| `TIER` | a counter with ranks (10 / 25 / 50) | ranked challenges | 1 per rank reached |
| `THRESHOLD` | a set of options where only some are needed | "any 3 of these 5" | 1, filled in part as options are ticked |
| `RADIO` | a row that opens into options; you pick one | a choice, an ending, a medal | 1, as soon as any option is picked |
| `ACCUMULATION` | an open counter with no total | counting with no end (fish caught) | nothing |
| `TEXT` | a block of text to read | warnings, tips | nothing |

Because checklists and counters count every item, a big counter (0/500 driftwood) outweighs everything else on its tab. That's fine, but it's one more reason to keep collectibles on their own tab instead of mixing them into the story.

Any card except a divider can have a **dropdown note**: one short line under 90 characters that says how to do it, where it is, what it unlocks, or `MISSABLE:`.

---

## 5. Pick the game's shape

Most games are one of these. Some mix two. Use what fits.

### A. Story game (missions in order)
*Ghost of Tsushima, Spider-Man 2, Uncharted 2.*
- **STORY tab:** one `LIST` per mission, in play order, under a `DIVIDER` per act or chapter (only if the game has them).
- A mission with a few steps worth ticking gets `list-item`s. Most missions don't need them.

### B. Level-based game (parks, tours, stages)
*Tony Hawk's Pro Skater, platformers, racing cups.*
- **One tab per campaign or tour** (`THPS1 TOUR`, `WORLD 1`), with a `DIVIDER` per level, in unlock order.
- **Under each level:** one `CHECKLIST` of that level's goals (include score targets in the item: `High Score (10,000)`).
- A level with extra or post-game goals gets a second `CHECKLIST` (`Foundry Pro Goals`).
- **Competition or medal levels:** a `RADIO` with `Gold`, `Silver`, `Bronze`.
- Put unlock rules in the level's notes: `6 goals unlock Mall`.

### C. Choice-driven story (choices change the outcome)
*Life is Strange, Telltale games, Until Dawn.*
- **STORY tab:** one `LIST` per scene or chapter, in order (search for the game's chapter select or checkpoint list).
- **Each major choice is a `RADIO` placed right after the scene it happens in.** Only the major choices: the ones the game lists itself, such as its end-of-episode choice screen. Leave out small dialogue choices.
- **A choice that only comes up because of an earlier choice:** add a last option `Didn't come up`, and a note saying when it happens. Without it, the card could never be closed and the tab could never reach 100%.
- **A scene that only happens in some playthroughs:** a `LIST` with the note `Only if <condition>. Check it off either way`.
- **When the result depends on earlier choices** (whether someone believes you, who survives): write the options as the outcomes, and say in the note what decides them.
- **The ending:** a `RADIO` right before the last scene.

### D. Characters with their own content
*Skaters, companions, party members, vehicles.* Use this inside any of the shapes above.
- **One tab** (`SKATERS`, `COMPANIONS`) holding **one child nest per character** (section 7 shows how).
- **Each child nest has the same tabs, in the same order.** Put first the tab the player uses most (usually `CHALLENGES`). A character with only one kind of content gets one tab.
- **On the game's nest, turn on child progress in tab-bars mode** (`nest-summary-child-progress|1` and `nest-summary-mode|tab-bars`). Each character card then shows one bar per tab, so the user sees at a glance who is finished.

### Not supported yet: branching that locks content
*Fallout: New Vegas factions, games where a choice removes whole questlines.* The app can't hide or skip cards. Tell the user this game isn't a good fit yet, and offer to build it with each route in its own section for them to delete the routes they don't take.

---

## 6. Sorting rules

### Tabs
Use only the tabs the game needs, at most 6, in this order and with these colors:

| Tab | `tab-color` | Holds |
|---|---|---|
| `STORY` (or one tab per campaign) | `4` | missions, scenes, levels |
| `SIDE QUESTS` | `5` | side quests, contracts, errands |
| a character tab (`SKATERS`) | `5` | child nests, one per character |
| `COLLECTIBLES` | `6` | everything you find or gather |
| `CHALLENGES` | `7` | challenges, feats, skill tests |
| `EXTRAS` | `2` | unlockables, DLC, post-game, trophies |

Tab names are short and in capitals. **Never leave a tab empty.** If the game has no side quests, leave that tab out.

### Side quests
Group them under `DIVIDER`s by quest giver, region or type, whichever the game uses. A quest chain with named steps is one `CHECKLIST` with one item per step.

### Collectibles
- **Big sets, or pieces with no names:** `PROGRESS|0/305|Blast Shards`.
- **Named pieces, up to about 40:** a `CHECKLIST` with one item each.
- **Collectibles with one fixed spot per level or area:** write each item as `Place: where it is`, in a few words of your own: `Streets: roof of the diner (wallride up its left side)`.
- **Never one card per collectible.**

### Challenges: one card each
Every challenge the game tracks on its own gets its own card. Never put challenges together as items in one checklist. Pick the card by how the challenge is completed:
- **One thing, done or not** (a combo, a trick, a goal): `LIST|0|<name>`.
- **Any X of these Y** (beat a score on any 5 parks): `THRESHOLD|X|<name>`, with the Y options as items.
- **A count of things with no names** (complete 10 gap challenges): `PROGRESS|0/10|<name>`.
- **All of these** (gold on every competition park): `CHECKLIST|<name>`, with each one as an item.
- **Ranked steps** (10 / 25 / 50): `TIER`.

Give every challenge a note saying what it takes, because a challenge's name rarely says: `20k combo on Streets, no Grinds or Specials`.

### Don't track one thing twice
- **Card already covers a challenge or trophy:** leave out the challenge or trophy that only repeats it. If a 0/50 Stat Points counter exists, drop "Collect 50 stat points".
- **Trophy matches a card:** put the trophy's name in that card's note instead (`Trophy: Gap Master`).
- **Trophies list:** only list trophies that nothing else in the nest already tracks.

### Numbers
- Everything starts empty: `0` for ticks, `0/N` for counters.
- A `PROGRESS` total is a real number above 0 (`0/42`, never `0/0`).
- A `THRESHOLD` number is no bigger than its number of items.
- A `TIER` has at least 2 levels. **Each level's amount is how many more it takes after the level before.** For "Defeat 10 / 25 / 50" the amounts are `10`, `15`, `25`, and `tier-progress` is `0/50`.

### Size
Most games land between 40 and 200 cards. If you're past 300, group more of the story and collectibles (checklists, counters). Challenges stay one card each even then. A game with many characters can run to several hundred cards in its child nests, and that's fine.

---

## 7. The text format, line by line

Plain lines. Blank lines are ignored. Fields are separated by `|`. **Only the lines shown here are allowed**: anything else is ignored or breaks the import.

### The game's nest

```
--- NEST 1 START: <Game title> ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.1 START: STORY ---
tab-color|4
   ...cards...
--- TAB 1.1 END ---

--- TAB 1.2 START: COLLECTIBLES ---
tab-color|6
   ...cards...
--- TAB 1.2 END ---

--- NEST 1 END ---
```

- Tabs are numbered `1.1`, `1.2`, `1.3`… in order, and every `START` line has a matching `END` line with the same number.
- Keep `nest-show-summary|0`. It's a bar at the top of the page that the user doesn't want.
- Only when the game has character child nests (shape D), use these two lines instead:
  ```
  nest-summary-child-progress|1
  nest-summary-mode|tab-bars
  ```

### Child nests (shape D)
A child nest sits inside a tab and is numbered from that tab. Its own tabs add one more number:

```
--- TAB 1.3 START: SKATERS ---
tab-color|5

--- NEST 1.3.1 START: Tony Hawk ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.1.1 START: CHALLENGES ---
tab-color|7
   ...cards...
--- TAB 1.3.1.1 END ---

--- TAB 1.3.1.2 START: STAT POINTS ---
tab-color|6
PROGRESS|0/50|Stat Points
--- TAB 1.3.1.2 END ---

--- NEST 1.3.1 END ---

--- NEST 1.3.2 START: Bob Burnquist ---
   ...same tabs, numbered 1.3.2.1 and 1.3.2.2...
--- NEST 1.3.2 END ---

--- TAB 1.3 END ---
```

### Cards
Each card is a first line, then its own detail lines right below it.

```
DIVIDER|<heading>

LIST|0|<name>                        one thing, done or not
dropdown|<note>                      optional, on any card except DIVIDER

LIST|<name>                          a thing with steps (no 0 here)
list-item|0|<step>
list-item|0|<step>

CHECKLIST|<name>
checklist-item|0|<item>
checklist-item|0|<item>

PROGRESS|0/<total>|<name>

TIER|<name>
tier-progress|0/<top level's number>
tier-level|1|<amount>|<level name>
tier-level|2|<how many MORE>|<level name>

THRESHOLD|<how many needed>|<name>
threshold-item|0|<option>
threshold-item|0|<option>

RADIO|0|<name>
radio-option|1|<option>
radio-option|2|<option>

ACCUMULATION|0|<what to count>

TEXT|<title>
text-content|<the text; write \n for a new line>
```

### Escaping
Inside any name, item or note:
- write a `|` as `\|`
- write a `\` as `\\`
- write a new line as `\n`

Nothing else needs escaping. Commas, quotes and apostrophes are fine as they are.

---

## 8. A complete small example

This made-up game shows a story with choices, two characters, a collectible set with locations and challenge cards. Copy its patterns. This is the whole file, `Harbor Lights.txt`:

```
===== WORKSPACE START =====
APP|The Joystick Journal

--- NEST 1 START: Harbor Lights ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|1
nest-summary-mode|tab-bars

--- TAB 1.1 START: STORY ---
tab-color|4

DIVIDER|CHAPTER 1 - THE DOCKS

LIST|0|Arrival

LIST|0|The Fish Market

RADIO|0|The Stolen Net
radio-option|1|Tell the harbormaster
radio-option|2|Keep quiet

LIST|Lighthouse Repairs
list-item|0|Find the lens
list-item|0|Fix the lamp
dropdown|MISSABLE: the shell on the balcony is gone after this

RADIO|0|The Harbormaster's Favor
radio-option|1|Accept
radio-option|2|Refuse
radio-option|3|Didn't come up
dropdown|Only if you told the harbormaster about the net

LIST|0|The Storm
dropdown|Last scene of the chapter. Trophy: Weathered

--- TAB 1.1 END ---

--- TAB 1.2 START: CREW ---
tab-color|5

--- NEST 1.2.1 START: Mara ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.2.1.1 START: CHALLENGES ---
tab-color|7

LIST|0|Knot Master
dropdown|Tie all 5 knots without a mistake, as Mara

PROGRESS|0/10|Deep Diver
dropdown|Find 10 pearls while playing as Mara

--- TAB 1.2.1.1 END ---

--- NEST 1.2.1 END ---

--- NEST 1.2.2 START: Ollie ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.2.2.1 START: CHALLENGES ---
tab-color|7

THRESHOLD|2|Market Regular
threshold-item|0|Buy from the baker
threshold-item|0|Buy from the fishmonger
threshold-item|0|Buy from the tinker
dropdown|Buy from any 2 market stalls as Ollie

--- TAB 1.2.2.1 END ---

--- NEST 1.2.2 END ---

--- TAB 1.2 END ---

--- TAB 1.3 START: COLLECTIBLES ---
tab-color|6

CHECKLIST|Rare Shells
checklist-item|0|Docks: under the third pier, at low tide
checklist-item|0|Lighthouse: on the balcony rail
checklist-item|0|Cove: inside the wreck \| left side
dropdown|All 3: Shell Seeker trophy

PROGRESS|0/120|Driftwood
dropdown|Spread across every area. Trophy: Beachcomber

--- TAB 1.3 END ---

--- TAB 1.4 START: CHALLENGES ---
tab-color|7

TIER|Catch Fish
tier-progress|0/50
tier-level|1|10|Catch 10 Fish
tier-level|2|15|Catch 25 Fish
tier-level|3|25|Catch 50 Fish

CHECKLIST|Every Harbor
checklist-item|0|Docks
checklist-item|0|Cove
dropdown|Dock the boat at every harbor

--- TAB 1.4 END ---

--- NEST 1 END ---

===== WORKSPACE END =====
```

---

## 9. Before you hand it over

Check every line of this list and fix anything that fails:

- [ ] I used web search only and didn't open any pages.
- [ ] The game's shape (section 5) is the right one, and the tabs follow section 6.
- [ ] Story missions or scenes are in play order, with none missing.
- [ ] Every major choice is a `RADIO` right after its scene. Choices that might not come up have `Didn't come up` and a note.
- [ ] Every challenge is its own card, with a note saying what it takes.
- [ ] Collectibles with one fixed spot per area say where that spot is.
- [ ] Nothing is tracked twice.
- [ ] Character child nests (if any) have the same tabs in the same order, the most-used one first, and the game's nest uses `tab-bars`.
- [ ] No empty tabs, no `Untitled` cards, no blank items or options.
- [ ] Every `PROGRESS` total is above 0. Every `THRESHOLD` number is no bigger than its item count. Every `TIER` has 2+ levels whose amounts add up to its total.
- [ ] Every line is one from section 7. Every `START` has its `END` with the same number.
- [ ] Every `|` inside text is `\|`.
- [ ] `nest-show-summary|0` on every nest.
- [ ] The file starts with `===== WORKSPACE START =====`, ends with `===== WORKSPACE END =====`, and has nothing outside them.

Then reply with the file and a short report:
1. **How to import:** DATA → Import → Import data, paste the whole file, Import.
2. **Tabs**, and how many cards each has.
3. **Sources:** the search result URLs you used.
4. **One source only:** anything you used that only one site confirmed.
5. **Not found:** anything you left out because you couldn't confirm it.

---

## 10. For the user: other ways to use the file

- **Import it:** DATA → Import → Import data, paste the whole file, Import. It's added to your list as one tracker.
- **Make it a built-in game** that shows in Create New → Import for every fresh install: ask Claude in the app's repo to turn the `.txt` into `templates/game-<slug>.js` and add it to `templates/list.js`. Adding `testing: true,` to that file shows it only in Create New → Testing until you're happy with it.
- **Turn a tracker you built in the app into a file like this:** open the game card's actions (next to Clone and Move), tap Export and pick the **GT50** format.
