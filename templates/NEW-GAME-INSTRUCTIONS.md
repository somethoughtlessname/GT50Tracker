# Make a game tracker for The Joystick Journal

These are instructions for Claude. Give them a game name ("Make a Joystick Journal tracker for *Ghost of Tsushima*") and they produce one file, `game-<slug>.js`, that drops into the app's `templates/` folder and shows up under **Create New → Import**.

---

## 1. What you are making

One plug-in file that registers one game. The game's content is written in the app's **GT50 text format** (section 5), wrapped like this:

```js
// ===== THE JOYSTICK JOURNAL GAME FILE =====
// Game: Ghost of Tsushima
// Sources: <the pages you used, one per line>
// Install: save as templates/game-ghostoftsushima.js, then add
//          'game-ghostoftsushima.js' to the list in templates/list.js

(function () {
    if (!window.GT50 || !window.GT50.Imports) return;
    window.GT50.Imports.register({
        id: 'ghost-of-tsushima',
        name: 'Ghost of Tsushima',
        description: 'One short line about the game, under 80 characters.',
        data: String.raw`===== WORKSPACE START =====
APP|The Joystick Journal

--- NEST 1 START: Ghost of Tsushima ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.1 START: STORY ---
tab-color|4

...cards...

--- TAB 1.1 END ---

--- NEST 1 END ---

===== WORKSPACE END =====`
    });
})();
```

Rules for the wrapper:
- `String.raw` must stay. It keeps the `\|` escapes intact.
- The text must not contain a backtick (`` ` ``) or `${`. Write `'` instead of a backtick.
- `id` is lowercase words joined by hyphens. `name` is the game's official title. Escape any `'` in `name` or `description` as `\'`.
- The file name is `game-` plus the title in lowercase letters and digits only (`game-ghostoftsushima.js`).

---

## 2. Research

Do the research yourself, with web search, before writing anything. Search for each part separately rather than in one query.

1. **Main story.** Find the full mission list in play order, with its acts, chapters or episodes. Good sources are the game's Fandom or official wiki, PowerPyx, IGN or GameFAQs walkthroughs, and Game8.
2. **Side content.** Look for side quests, contracts and errands, and who gives them or where they are.
3. **Collectibles.** Get every type and its exact total count. Trophy and achievement guides (PowerPyx, PSNProfiles, TrueAchievements) are the most reliable for totals.
4. **Challenges.** Look for tiered challenges, feats, and the "do X times" achievements that are worth tracking.
5. **Choices and missables.** Note branching choices, missable content, and DLC that is separate from the base game.

Check every count against a second source. If two sources disagree, use the one that matches the trophy or achievement description, and add a dropdown note on the card saying the count varies by source. Never guess a number. If you can't confirm one, leave that card out and list it under "Unconfirmed" when you report back.

Use in-game names exactly as written, including their capitals, punctuation and numbering.

---

## 3. How to lay out the game

### Tabs

Use only the tabs the game actually needs, in this order and with these colors. Tab names are short and in capitals.

| Tab | Color | Holds |
|---|---|---|
| `STORY` | `4` | the main missions, in play order |
| `SIDE QUESTS` | `5` | side quests, contracts, errands, characters |
| `COLLECTIBLES` | `6` | everything you find or gather |
| `CHALLENGES` | `7` | tiered challenges, feats, skill tests |
| `EXTRAS` | `2` | unlockables, endings, DLC, post-game |

The limit is 6 tabs. Don't create an empty tab: if a game has no side quests, leave that tab out.

A game can use its own tab names when its structure calls for it (two campaigns as `THPS1 TOUR` and `THPS2 TOUR`, a `SKATERS` tab of child nests). Keep the colors by what the tab holds: story-like content `4`, characters or people `5`, collectibles `6`, challenges `7`, extras `2`.

### Repeating sets: one child nest each

When a game has several characters (skaters, companions, vehicles, party members) that each have the same kind of content, give each one its own **child nest** inside one tab:

- Each child nest gets the same tabs, in the same order. Put first the tab the player will use most (usually `CHALLENGES`). The nest opens on that tab, and its bar comes first on the card.
- Turn on child progress in **tab-bars** mode on the game's nest (`nest-summary-child-progress|1` and `nest-summary-mode|tab-bars`). Every character card in the list then shows one bar per tab, so you can see how far along each one is.
- A character that only has one kind of content gets a single tab and one bar. Don't add an empty second tab to match the others.
- Child nests are written as `--- NEST 1.3.1 START: Name ---` inside the tab, with their own tabs numbered `1.3.1.1`, `1.3.1.2` (section 5).

### Which card for what

Pick the card by asking what the player actually checks off.

| The thing | Card | Example |
|---|---|---|
| One mission or quest, done or not | `LIST` (no items) | `LIST|0|The Heist` |
| A mission whose separate parts are worth ticking, 2–8 of them | `LIST` with `list-item`s | a quest with three stages |
| A group heading: act, chapter, episode, region, quest giver | `DIVIDER` | `DIVIDER|ACT 1 - ARRIVAL` |
| A named set to find, with each piece named (up to about 40) | `CHECKLIST` with `checklist-item`s | Skill Books, Keys, Suits |
| A counted set where the pieces have no useful names | `PROGRESS` | `PROGRESS|0/305|Blast Shards` |
| A challenge with ranks (5 / 10 / 20…) | `TIER` with `tier-level`s | Defeat 10/20/40 Spiders |
| "Finish any X of these Y" | `THRESHOLD` with `threshold-item`s | Complete 3 of 5 trials |
| One choice out of several (karma, faction, ending) | `RADIO` with `radio-option`s | Good / Evil choice |
| An open-ended count with no total | `ACCUMULATION` | Fish caught |
| A note to read (missables, tips) | `TEXT` | "Point of no return after…" |

Rules for sorting:
- **Story:** put one `LIST` per mission, in play order. Put a `DIVIDER` before each act, chapter or episode, but only when the game has them. Don't add items to every mission; use `list-item`s only for missions with distinct parts the player would want to track.
- **Side quests:** group them under `DIVIDER`s by quest giver, region or type, whichever the game itself uses. A quest chain with named steps becomes one `CHECKLIST` (the chain), with one item per step.
- **Collectibles:** use `PROGRESS` when the count is large or the pieces are unnamed. Use `CHECKLIST` when each piece has a name worth seeing. Never make one card per individual collectible.
- **Where collectibles are:** when a collectible has one fixed spot per map or level (one hidden plushie per level, hidden packages), write each checklist item as `Place: where it is`, in a few words of your own: `Streets: roof of Margo's Diner (wallride up its left side)`. Check each spot against two guides. If they disagree, use the more specific one, or combine them when they describe the same spot.
- **Challenges, one card each:** every challenge the game tracks separately is its own card, never an item grouped into a checklist. Pick the card by how it is completed:
  - one thing, done or not (a combo, a trick, a single goal): `LIST|0|<name>`
  - "any X of these Y" (beat a score on any 5 parks, win any 1 medal): `THRESHOLD|X|<name>`, with the Y options as `threshold-item`s
  - a count of unnamed things (complete 10 gap challenges): `PROGRESS|0/N|<name>`
  - "all of these" (a gold on every competition park): `CHECKLIST|<name>`, with each one as an item
  - ranked steps (10 / 25 / 50): `TIER`
  
  Give each challenge card a dropdown note saying what it takes, in a few words: `20k combo on Streets, no Grinds or Specials`. A challenge's name alone rarely says what to do.
- **Don't track one thing twice:** if a card already tracks something (a 0/50 stat points bar), leave out the challenge that only repeats it ("collect 50 stat points"). Say so in that card's dropdown note.
- **Totals:** a `PROGRESS` must have a real total (`0/42`, never `0/0`). A `THRESHOLD` number must be less than or equal to its item count.
- **Tiers:** a `TIER` needs at least two levels. Each level's amount is how many **more** it takes after the level before. For "Defeat 10 / 25 / 50", the amounts are `10`, `15`, `25`, and `tier-progress` is `0/50`. Level names keep the game's wording ("Defeat 25 Wolves").
- **Dropdown notes** (`dropdown|...`) go on a card when it helps: where to find it, what unlocks it, what it rewards, or "MISSABLE". Keep them under 90 characters, and leave the line out when there's nothing worth saying.
- **Choices:** a story choice is a `RADIO` placed in the story where it happens, titled with the mission's name. Each option is the choice as the game words it. Every `RADIO` needs a title and at least two options with text; never leave one "Untitled" or with blank options.
- Everything starts unchecked: `0` for done flags and `0/N` for counts.
- Size: most games land between 40 and 200 cards. If you're past 300, group more of the collectibles and story (checklists, progress) instead of listing every piece. Challenges stay one card each even then; a game with many characters can run to several hundred cards in its child nests, and that's fine.

---

## 4. Before you hand it over

Go through this list and fix anything that fails:

- [ ] Every count matches a second source, or the card's dropdown note says it varies.
- [ ] The story missions are in play order, and none are missing between acts.
- [ ] There are no empty tabs, no `Untitled` cards and no blank items or options.
- [ ] Every `PROGRESS` total is above 0, and every `THRESHOLD` number is no more than its item count.
- [ ] Every `TIER` has 2 or more levels, its amounts are steps (not running totals), and they add up to the number in `tier-progress`.
- [ ] Every line is one of the lines in section 5, with nothing else in it.
- [ ] Any `|` inside a name is written `\|`. There are no backticks and no `${`.
- [ ] Each `START` line has its matching `END` line with the same number.
- [ ] Tab numbers count up 1.1, 1.2, 1.3…
- [ ] The game's nest has `nest-show-summary|0`. The bar at the top of the page stays off unless the user asks for it.
- [ ] Every challenge is its own card (LIST, THRESHOLD, PROGRESS, CHECKLIST or TIER), with a note saying what it takes.
- [ ] Collectibles with one fixed spot per level say where that spot is.
- [ ] Characters with repeating content are child nests, with the most-used tab first and child progress set to `tab-bars`.
- [ ] Nothing is tracked twice.

Then reply with the file, plus a short note: the tabs and how many cards each has, the sources you used, and anything you left out as unconfirmed.

---

## 5. GT50 text format, line by line

The file is plain lines. Blank lines are ignored. Fields are separated by `|`. Only these lines are recognized:

```
===== WORKSPACE START =====
APP|The Joystick Journal

--- NEST 1 START: <Game name> ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.1 START: <TAB NAME> ---
tab-color|<4, 5, 6, 7 or 2>
   ...cards...
--- TAB 1.1 END ---

--- TAB 1.2 START: <TAB NAME> ---
tab-color|5
   ...cards...
--- TAB 1.2 END ---

--- NEST 1 END ---
===== WORKSPACE END =====
```

Nest settings (same lines for the game's nest and for child nests):

```
nest-show-summary|0                 0 = no bar at the top of the page (default)
nest-summary-child-progress|1       1 = child nest cards show progress
nest-summary-mode|tab-bars          tab-bars, first-tab or all-tabs; 0 when child progress is off
```

A child nest sits inside a tab, numbered from that tab, with its own tabs below it:

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
   ...
--- NEST 1.3.2 END ---

--- TAB 1.3 END ---
```

Cards, each followed by its own detail lines:

```
DIVIDER|<heading>

LIST|0|<mission>                    a mission with no parts
dropdown|<note>                     optional, on any card

LIST|<mission>                      a mission with parts (no 0 here)
list-item|0|<part>
list-item|0|<part>

CHECKLIST|<set name>
checklist-item|0|<piece>
checklist-item|0|<piece>

PROGRESS|0/<total>|<what>

TIER|<challenge>
tier-progress|0/<the top level's number>
tier-level|1|<how many for this level>|<level name>
tier-level|2|<how many MORE for this level>|<level name>
                                    each amount is the step from the level before,
                                    so the amounts add up to the top level's number

THRESHOLD|<how many needed>|<name>
threshold-item|0|<option>
threshold-item|0|<option>

RADIO|0|<choice name>
radio-option|1|<option>
radio-option|2|<option>

ACCUMULATION|0|<what to count>

TEXT|<title>
text-content|<the note; use \n for a new line>
```

Escaping, inside any name or note:
- A literal `|` is written `\|`.
- A literal `\` is written `\\`.
- A new line is written `\n`.
- Nothing else needs escaping. Commas, quotes and apostrophes are fine as they are.

---

## 6. A small, complete example

```js
// ===== THE JOYSTICK JOURNAL GAME FILE =====
// Game: Example Quest
// Sources: https://example.fandom.com/wiki/Walkthrough
// Install: save as templates/game-examplequest.js, then add
//          'game-examplequest.js' to the list in templates/list.js

(function () {
    if (!window.GT50 || !window.GT50.Imports) return;
    window.GT50.Imports.register({
        id: 'example-quest',
        name: 'Example Quest',
        description: 'A short sample showing every common card.',
        data: String.raw`===== WORKSPACE START =====
APP|The Joystick Journal

--- NEST 1 START: Example Quest ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.1 START: STORY ---
tab-color|4

DIVIDER|ACT 1 - THE ROAD

LIST|0|Wake Up

LIST|Escape the Fort
list-item|0|Find the key
list-item|0|Open the gate
dropdown|MISSABLE: the chest in the cell is gone after this

RADIO|0|The Bridge
radio-option|1|Spare the guard
radio-option|2|Cut the rope

--- TAB 1.1 END ---

--- TAB 1.2 START: COLLECTIBLES ---
tab-color|6

PROGRESS|0/40|Feathers
dropdown|Trophy: Birdwatcher

CHECKLIST|Old Maps
checklist-item|0|Map 1: Harbor \| Docks
checklist-item|0|Map 2: Mill

--- TAB 1.2 END ---

--- TAB 1.3 START: CHALLENGES ---
tab-color|7

TIER|Defeat Wolves
tier-progress|0/50
tier-level|1|10|Defeat 10 Wolves
tier-level|2|15|Defeat 25 Wolves
tier-level|3|25|Defeat 50 Wolves

--- TAB 1.3 END ---

--- NEST 1 END ---

===== WORKSPACE END =====`
    });
})();
```

---

## 7. Other ways to bring a game in

- **Try it before it goes in the Import list:** add `testing: true,` to the `register({...})` call. The file then shows only in **Create New → Testing**, a tab that appears while such a file is loaded. Delete the line when it's ready to move to the Import tab.

- **Without adding a file:** paste just the part from `===== WORKSPACE START =====` to `===== WORKSPACE END =====` into **DATA → Import → Import data**. It's added to your list as one tracker.
- **Turn a tracker you built in the app into a file:** export it with the **IMPORT.JS** format and save it as `templates/game-<slug>.js`.
