// ===== THE JOYSTICK JOURNAL GAME FILE =====
// Game: Undertale
// One nest with a PATH card per route: Neutral, True Pacifist and Genocide.
// Sources: https://undertale.wiki/w/True_Pacifist , https://undertale.wiki/w/Genocide_Route ,
//          https://undertale.wiki/w/Neutral_Run , https://undertale.fandom.com/wiki/Category:Endings
//          https://jcoxeye.github.io/genoguide/genoguide.html (kill counts)
// Needs comp/comp-path.js (the PATH card).

(function () {
    if (!window.GT50 || !window.GT50.Imports) return;
    window.GT50.Imports.register({
        id: 'undertale',
        name: 'Undertale',
        description: 'A path for each route: Neutral, True Pacifist and Genocide.',
        path: true,
        data: String.raw`===== WORKSPACE START =====
APP|The Joystick Journal

--- NEST 1 START: Undertale ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- PATH START: Neutral Route ---

path-node|1|||0
LIST|0|Fall into the Underground
dropdown|Meet Flowey

path-node|2|1||0
LIST|0|Ruins

path-node|3|2||0
RADIO|0|Toriel
radio-option|1|Spare her
radio-option|2|Kill her

path-node|4|3||0
LIST|0|Snowdin

path-node|5|4||0
RADIO|0|Papyrus
radio-option|1|Spare him
radio-option|2|Kill him

path-node|6|5:1|om|0
LIST|0|Hang Out with Papyrus
dropdown|Visit his house in Snowdin after sparing him

path-node|7|5||0
LIST|0|Waterfall

path-node|8|7||0
RADIO|0|Undyne
radio-option|1|Run from her (spare)
radio-option|2|Kill her
dropdown|Run to Hotland. If she collapses, giving her water from the cooler opens her hangout

path-node|9|8||0
LIST|0|Hotland

path-node|10|9|o|0
LIST|0|Muffet
dropdown|Optional depending on how you handle the spiders

path-node|11|9||0
RADIO|0|Mettaton EX
radio-option|1|Spare him
radio-option|2|Kill him

path-node|12|11||0
LIST|0|CORE

path-node|13|12||0
LIST|0|New Home

path-node|14|13||0
LIST|0|Sans's Judgment
dropdown|The Last Corridor

path-node|15|14||0
LIST|0|Asgore
dropdown|He destroys the MERCY button. Can't be spared

path-node|16|15||0
RADIO|0|Photoshop Flowey
radio-option|1|Spare Flowey
radio-option|2|Kill Flowey
dropdown|Sparing him sets up his hint for the True Pacifist Route

path-node|17|16||0
LIST|0|Neutral Ending
dropdown|Sans's phone call. Who rules the Underground depends on who you spared and killed

--- PATH END ---

--- PATH START: True Pacifist Route ---

path-node|1|||0
LIST|0|Kill No One
dropdown|Stay at LV 1 with 0 EXP the whole way. One kill and you get a Neutral ending instead

path-node|2|1||0
LIST|0|Ruins

path-node|3|2||0
LIST|0|Spare Toriel

path-node|4|3||0
LIST|0|Snowdin

path-node|5|4||0
LIST|0|Spare Papyrus

path-node|6|5||0
LIST|0|Hang Out with Papyrus
dropdown|At his house in Snowdin

path-node|7|6||0
LIST|0|Waterfall

path-node|8|7||0
LIST|0|Run from Undyne

path-node|9|8||0
LIST|0|Give Undyne Water
dropdown|When she collapses in Hotland, pour water from the cooler on her. Skipping this locks you out of this route

path-node|10|9||0
LIST|0|Hotland

path-node|11|10||0
LIST|0|Spare Mettaton EX

path-node|12|11||0
LIST|0|CORE

path-node|13|12||0
LIST|0|Asgore

path-node|14|13||0
LIST|0|Photoshop Flowey
dropdown|Spare him. This finishes the Neutral Route you need first

path-node|15|14||0
LIST|0|Reload After the Neutral Ending
dropdown|No reset needed if you killed no one. Load your save and backtrack

path-node|16|15||0
LIST|0|Hang Out with Undyne
dropdown|Her house in Waterfall, next to Napstablook's. Papyrus sends you

path-node|17|16||0
LIST|0|Date Alphys
dropdown|Slide Undyne's letter under the door of Alphys's lab. Only possible after the Neutral ending

path-node|18|17||0
LIST|0|Papyrus's Call
dropdown|After the date he tells you to meet Alphys at her lab

path-node|19|18||0
CHECKLIST|True Lab
checklist-item|0|Key 1
checklist-item|0|Key 2
checklist-item|0|Key 3
checklist-item|0|Key 4
dropdown|Take the elevator in Alphys's "bathroom". Find all four colored keys to get out

path-node|20|19||0
LIST|0|Asriel Dreemurr
dropdown|The fight with Asgore is stopped before it starts

path-node|21|20||0
LIST|0|True Pacifist Ending

--- PATH END ---

--- PATH START: Genocide Route ---

path-node|1|||0
PROGRESS|0/20|Ruins Kill Counter
dropdown|Kill until no encounters are left. Stop short in any area and the route turns Neutral

path-node|2|1||0
LIST|0|Kill Toriel

path-node|3|2||0
PROGRESS|0/16|Snowdin Kill Counter

path-node|4|3||0
LIST|0|Kill Papyrus

path-node|5|4||0
PROGRESS|0/18|Waterfall Kill Counter

path-node|6|5||0
LIST|0|Undyne the Undying
dropdown|Triggered by choosing FIGHT against Monster Kid

path-node|7|6||0
PROGRESS|0/40|Hotland and CORE Kill Counter

path-node|8|7||0
LIST|0|Mettaton NEO

path-node|9|8||0
LIST|0|New Home

path-node|10|9||0
LIST|0|Sans
dropdown|The Last Corridor. The hardest fight in the game

path-node|11|10||0
LIST|0|Asgore and Flowey
dropdown|Asgore falls in one hit, then Flowey

path-node|12|11||0
LIST|0|Genocide Ending
dropdown|Afterward, every later True Pacifist ending changes

--- PATH END ---

--- NEST 1 END ---

===== WORKSPACE END =====`
    });
})();
