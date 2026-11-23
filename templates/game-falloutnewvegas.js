// ===== THE JOYSTICK JOURNAL GAME FILE =====
// Game: Fallout: New Vegas
// One nest with a PATH card for the main quest: the shared opening, then the choice of side,
// with each faction's questline as its own branch ending at Hoover Dam.
// Sources: https://fallout.fandom.com/wiki/Fallout:_New_Vegas_quests (quest lists)
//          https://game8.co/games/Fallout-New-Vegas/archives/454049 (story walkthrough, what fails what)
//          https://segmentnext.com/fallout-new-vegas/walkthrough (main quest on all four routes)
// Needs comp/comp-path.js (the PATH card).

(function () {
    if (!window.GT50 || !window.GT50.Imports) return;
    window.GT50.Imports.register({
        id: 'fallout-new-vegas',
        name: 'Fallout: New Vegas',
        description: 'The main quest as a path: Goodsprings to The Tops, then House, NCR, Legion or Yes Man to the dam.',
        path: true,
        data: String.raw`===== WORKSPACE START =====
APP|The Joystick Journal

--- NEST 1 START: Fallout: New Vegas ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- PATH START: Main Quest ---

path-node|1|||0
LIST|0|Ain't That a Kick in the Head
dropdown|Character creation in Doc Mitchell's house, Goodsprings

path-node|2|1|o|0
LIST|0|Back in the Saddle
dropdown|Optional shooting tutorial with Sunny Smiles. Tutorials must be done in order

path-node|3|2|o|0
LIST|0|By a Campfire on the Trail
dropdown|Optional Survival tutorial with Sunny Smiles

path-node|4|1|om|0
LIST|0|Trudy's Radio Repair
dropdown|Talk to Trudy at the saloon before finishing They Went That-a-Way, or the job is gone

path-node|5|1||0
CHECKLIST|They Went That-a-Way
checklist-item|0|Primm
checklist-item|0|Nipton
checklist-item|0|Boulder City
dropdown|Follow Benny's trail. You can skip it by heading straight north to The Tops, but that road is deadly at low level

path-node|6|5||0
RADIO|0|Ring-a-Ding-Ding!
radio-option|1|Benny dies
radio-option|2|Benny escapes
dropdown|Confront Benny at The Tops and get the Platinum Chip

path-node|7|6||0
RADIO|0|Choose Your Side
radio-option|1|Mr. House
radio-option|2|NCR
radio-option|3|Caesar's Legion
radio-option|4|Yes Man (Independent Vegas)
dropdown|You can work for several factions for a while, but some quests fail other factions' lines. Pick the one you finish with

path-node|8|7:1||0
LIST|0|The House Always Wins I
dropdown|Lucky 38. Hand the Platinum Chip to Mr. House

path-node|9|8||0
LIST|0|The House Always Wins II
dropdown|The Fort: upgrade the Securitrons in the bunker

path-node|10|9||0
LIST|0|The House Always Wins III
dropdown|Nellis Air Force Base: befriend or kill the Boomers

path-node|11|10||0
LIST|0|The House Always Wins IV
dropdown|Gomorrah: deal with the Omertas (How Little We Know). Fails the Legion and NCR lines

path-node|12|11||0
LIST|0|The House Always Wins V
dropdown|Hidden Valley: destroy the Brotherhood of Steel

path-node|13|12||0
LIST|0|The House Always Wins VI
dropdown|Hoover Dam: You'll Know It When It Happens

path-node|14|13||0
LIST|0|The House Always Wins VII
dropdown|El Dorado substation: install House's override module

path-node|15|14||0
LIST|0|The House Always Wins VIII
dropdown|Report back to the penthouse

path-node|16|15||0
LIST|0|All or Nothing
dropdown|Final quest at Hoover Dam. Point of no return. Mr. House ending

path-node|17|7:2||0
LIST|0|Things That Go Boom
dropdown|Nellis Air Force Base: complete Volare! for the Boomers

path-node|18|17||0
LIST|0|King's Gambit
dropdown|Freeside: stop the violence with the Kings

path-node|19|18||0
CHECKLIST|For the Republic, Part 2
checklist-item|0|Great Khans
checklist-item|0|Omertas (How Little We Know)
checklist-item|0|Get rid of Mr. House
checklist-item|0|Brotherhood of Steel: alliance or destroy
dropdown|Tasks from Colonel Moore at Hoover Dam. Killing Mr. House fails his line

path-node|20|19||0
LIST|0|You'll Know It When It Happens
dropdown|Protect President Kimball at Hoover Dam

path-node|21|20||0
LIST|0|Eureka!
dropdown|Final quest at Hoover Dam. Point of no return. NCR ending

path-node|22|7:3||0
CHECKLIST|Render Unto Caesar
checklist-item|0|Destroy House's bunker at The Fort
checklist-item|0|Boomers (Volare!)
checklist-item|0|White Glove Society (Beyond the Beef)
checklist-item|0|Brotherhood of Steel (Still in the Dark)
dropdown|Tasks from Caesar at The Fort. Destroying the Securitrons fails the House line

path-node|23|22||0
RADIO|0|Et Tumor, Brute?
radio-option|1|Cure Caesar
radio-option|2|Kill Caesar
dropdown|Caesar's brain tumor. Kill him and Lucius gives your next orders

path-node|24|23||0
LIST|0|Arizona Killer
dropdown|Assassinate President Kimball at Hoover Dam. Failing it ends the Legion line

path-node|25|24||0
LIST|0|Veni, Vidi, Vici
dropdown|Final quest at Hoover Dam. Point of no return. Legion ending

path-node|26|7:4||0
LIST|0|Wild Card: Ace in the Hole
dropdown|Find Yes Man in Benny's suite at The Tops

path-node|27|26||0
LIST|0|Wild Card: Change in Management
dropdown|Kill or disable Mr. House and put Yes Man in the Lucky 38 mainframe. The Wild Card quests can be done in any order

path-node|28|26||0
LIST|0|Wild Card: You and What Army?
dropdown|Upgrade the Securitrons in the bunker at The Fort

path-node|29|26||0
CHECKLIST|Wild Card: Side Bets
checklist-item|0|Boomers
checklist-item|0|Brotherhood of Steel
checklist-item|0|Great Khans
checklist-item|0|Omertas
checklist-item|0|White Glove Society
dropdown|Decide who is spared in the battle for the dam. With Change in Management done, it locks you out of the NCR and Legion

path-node|30|27,28,29||0
LIST|0|Wild Card: Finishing Touches
dropdown|Persuade Julie Farkas, then use the override at the El Dorado substation. Fails the NCR line

path-node|31|30||0
LIST|0|No Gods, No Masters
dropdown|Final quest at Hoover Dam. Point of no return. Independent Vegas ending

--- PATH END ---

--- NEST 1 END ---

===== WORKSPACE END =====`
    });
})();
