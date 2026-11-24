// ===== THE JOYSTICK JOURNAL GAME FILE =====
// Test: The Hollow Crown, a made-up 200-card story for stress-testing the PATH card.
// Six acts plus a finale. Every card type, option cards (nested, shared, threshold), option links
// as alternatives, cross-act links, thresholds, optional and missable cards, several endings.
// Needs comp/comp-path.js (the PATH card).

(function () {
    if (!window.GT50 || !window.GT50.Imports) return;
    window.GT50.Imports.register({
        id: 'test-hollow-crown',
        name: 'Test: The Hollow Crown (200 cards)',
        description: 'A tangled made-up story for testing paths: 200 cards of every type, shared options, thresholds, many endings.',
        path: true,
        data: String.raw`===== WORKSPACE START =====
APP|The Joystick Journal

--- NEST 1 START: Test: The Hollow Crown ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- PATH START: The Hollow Crown ---

path-node|1|||0
LIST|0|Prologue: The Lantern Goes Out

path-node|2|1||0
CHECKLIST|Pack for the road
checklist-item|0|Lantern
checklist-item|0|Map
checklist-item|0|Bread
checklist-item|0|Mother's ring

path-node|3|2||0
LIST|0|Act 1: Reach Ashfall Village

path-node|4|3||0
CHECKLIST|Scout Ashfall Village
checklist-item|0|Find a vantage point
checklist-item|0|Mark the patrols
checklist-item|0|Talk to a local

path-node|5|3|o|0
PROGRESS|0/6|Cinder Shards

path-node|6|4|om|0
LIST|0|Lore: the founding of Ashfall Village

path-node|7|4||0
RADIO|0|How to get into Ashfall Village
radio-option|1|Slip in quietly
radio-option|2|Break down the gate
radio-option|3|Parley at the door

path-node|8|7:1h|s|0
LIST|0|Slip in quietly

path-node|9|7:2h|s|0
PROGRESS|0/5|Break down the gate

path-node|10|7:3h|s|0
RADIO|0|Parley at the door
radio-option|1|Bribe the guard
radio-option|2|Threaten the guard

path-node|11|10:1h|s|0
CHECKLIST|Bribe the guard
checklist-item|0|Count the coin
checklist-item|0|Hand it over

path-node|12|8||0
LIST|0|Through the drain tunnels

path-node|13|9||0
CHECKLIST|Hold the breach
checklist-item|0|First wave
checklist-item|0|Second wave
checklist-item|0|Captain

path-node|14|10:2||0
LIST|0|The guard runs to warn the others

path-node|15|7:1,7:2,7:3||0
LIST|0|Inside Ashfall Village

path-node|16|15|om|0
LIST|0|Lore: a letter from the Ember Warden

path-node|17|15||0
CHECKLIST|Recruit Mira the smith
checklist-item|0|Find them
checklist-item|0|Earn their trust

path-node|18|15||0
PROGRESS|0/3|Recruit Old Tobin

path-node|19|15||0
LIST|0|Recruit The twins

path-node|20|15,12||0
RADIO|0|Recruit Brother Ash
radio-option|1|Ask kindly
radio-option|2|Make a deal

path-node|21|15,13||0
LIST|0|Recruit Kestrel

path-node|22|17,18,19,20,21||0
THRESHOLD|3|Rally 3 allies in Ashfall Village

path-node|23|22||0
RADIO|0|The fate of the Ember Warden
radio-option|1|Spare the Ember Warden
radio-option|2|Bind the Ember Warden
radio-option|3|Exile the Ember Warden

path-node|24|15||0
RADIO|0|Answer the oracle
radio-option|1|Spare the Ember Warden
radio-option|2|Lie to the oracle

path-node|25|23:1h,24:1h|s|0
LIST|0|Spare the Ember Warden

path-node|26|23:2h,17,18,19|s|0
THRESHOLD|2|Bind the Ember Warden

path-node|27|23:3||0
LIST|0|the Ember Warden walks into the dark

path-node|28|25||0
LIST|0|A debt of mercy

path-node|29|24:2||0
LIST|0|The oracle knows

path-node|30|26,12||0
LIST|0|The warden's bargain

path-node|31|23:1,23:2,23:3,24:2||0
PROGRESS|0/3|Seal the heart of Ashfall Village

path-node|32|31|om|0
LIST|0|Lore: what the Ember Warden left behind

path-node|33|31,22||0
LIST|0|Leave Ashfall Village

path-node|34|33||0
LIST|0|Act 2: Reach the Drowned Abbey

path-node|35|34||0
CHECKLIST|Scout the Drowned Abbey
checklist-item|0|Find a vantage point
checklist-item|0|Mark the patrols
checklist-item|0|Talk to a local

path-node|36|34|o|0
PROGRESS|0/6|Pearl Sigils

path-node|37|35||0
RADIO|0|How to get into the Drowned Abbey
radio-option|1|Slip in quietly
radio-option|2|Break down the gate
radio-option|3|Parley at the door

path-node|38|37:1h|s|0
LIST|0|Slip in quietly

path-node|39|37:2h|s|0
PROGRESS|0/5|Break down the gate

path-node|40|37:3h|s|0
RADIO|0|Parley at the door
radio-option|1|Bribe the guard
radio-option|2|Threaten the guard

path-node|41|40:1h|s|0
CHECKLIST|Bribe the guard
checklist-item|0|Count the coin
checklist-item|0|Hand it over

path-node|42|38||0
LIST|0|Through the drain tunnels

path-node|43|39||0
CHECKLIST|Hold the breach
checklist-item|0|First wave
checklist-item|0|Second wave
checklist-item|0|Captain

path-node|44|40:2||0
LIST|0|The guard runs to warn the others

path-node|45|37:1,37:2,37:3||0
LIST|0|Inside the Drowned Abbey

path-node|46|45|om|0
LIST|0|Lore: a letter from the Tide Abbess

path-node|47|45||0
PROGRESS|0/3|Recruit Sister Wren

path-node|48|45||0
LIST|0|Recruit The ferryman

path-node|49|45||0
RADIO|0|Recruit Choir of Bells
radio-option|1|Ask kindly
radio-option|2|Make a deal

path-node|50|45,42||0
LIST|0|Recruit Lio the diver

path-node|51|45,44||0
CHECKLIST|Recruit Abbot's ghost
checklist-item|0|Find them
checklist-item|0|Earn their trust

path-node|52|47,48,49,50,51||0
THRESHOLD|3|Rally 3 allies in the Drowned Abbey

path-node|53|52||0
RADIO|0|The fate of the Tide Abbess
radio-option|1|Spare the Tide Abbess
radio-option|2|Bind the Tide Abbess
radio-option|3|Exile the Tide Abbess

path-node|54|45||0
RADIO|0|Answer the oracle
radio-option|1|Spare the Tide Abbess
radio-option|2|Lie to the oracle

path-node|55|53:1h,54:1h|s|0
LIST|0|Spare the Tide Abbess

path-node|56|53:2h|s|0
CHECKLIST|Bind the Tide Abbess
checklist-item|0|Chain
checklist-item|0|Seal
checklist-item|0|Name

path-node|57|53:3||0
LIST|0|the Tide Abbess walks into the dark

path-node|58|55||0
LIST|0|A debt of mercy

path-node|59|54:2||0
LIST|0|The oracle knows

path-node|60|56,42||0
LIST|0|The warden's bargain

path-node|61|53:1,53:2,53:3,54:2||0
PROGRESS|0/3|Seal the heart of the Drowned Abbey

path-node|62|24:2,23:3|o|0
LIST|0|An echo of the last choice

path-node|63|61|om|0
LIST|0|Lore: what the Tide Abbess left behind

path-node|64|61,52||0
LIST|0|Leave the Drowned Abbey

path-node|65|64||0
LIST|0|Act 3: Reach Thornwood

path-node|66|65||0
CHECKLIST|Scout Thornwood
checklist-item|0|Find a vantage point
checklist-item|0|Mark the patrols
checklist-item|0|Talk to a local

path-node|67|65|o|0
PROGRESS|0/6|Antler Charms

path-node|68|66|om|0
LIST|0|Lore: the founding of Thornwood

path-node|69|66||0
RADIO|0|How to get into Thornwood
radio-option|1|Slip in quietly
radio-option|2|Break down the gate
radio-option|3|Parley at the door

path-node|70|69:1h|s|0
LIST|0|Slip in quietly

path-node|71|69:2h|s|0
PROGRESS|0/5|Break down the gate

path-node|72|69:3h|s|0
RADIO|0|Parley at the door
radio-option|1|Bribe the guard
radio-option|2|Threaten the guard

path-node|73|72:1h|s|0
CHECKLIST|Bribe the guard
checklist-item|0|Count the coin
checklist-item|0|Hand it over

path-node|74|70||0
LIST|0|Through the drain tunnels

path-node|75|71||0
CHECKLIST|Hold the breach
checklist-item|0|First wave
checklist-item|0|Second wave
checklist-item|0|Captain

path-node|76|72:2||0
LIST|0|The guard runs to warn the others

path-node|77|69:1,69:2,69:3||0
LIST|0|Inside Thornwood

path-node|78|77|om|0
LIST|0|Lore: a letter from the Briar King

path-node|79|77||0
LIST|0|Recruit The stag herd

path-node|80|77||0
RADIO|0|Recruit Hob the woodcutter
radio-option|1|Ask kindly
radio-option|2|Make a deal

path-node|81|77||0
LIST|0|Recruit Moss sprites

path-node|82|77,74||0
CHECKLIST|Recruit Ranger Vey
checklist-item|0|Find them
checklist-item|0|Earn their trust

path-node|83|77,75||0
PROGRESS|0/3|Recruit The hermit

path-node|84|79,80,81,82,83||0
THRESHOLD|3|Rally 3 allies in Thornwood

path-node|85|84||0
RADIO|0|The fate of the Briar King
radio-option|1|Spare the Briar King
radio-option|2|Bind the Briar King
radio-option|3|Exile the Briar King

path-node|86|77||0
RADIO|0|Answer the oracle
radio-option|1|Spare the Briar King
radio-option|2|Lie to the oracle

path-node|87|85:1h,86:1h|s|0
LIST|0|Spare the Briar King

path-node|88|85:2h,79,80,81|s|0
THRESHOLD|2|Bind the Briar King

path-node|89|85:3||0
LIST|0|the Briar King walks into the dark

path-node|90|87||0
LIST|0|A debt of mercy

path-node|91|86:2||0
LIST|0|The oracle knows

path-node|92|88,74||0
LIST|0|The warden's bargain

path-node|93|85:1,85:2,85:3,86:2||0
PROGRESS|0/3|Seal the heart of Thornwood

path-node|94|54:2,53:3|o|0
LIST|0|An echo of the last choice

path-node|95|93|om|0
LIST|0|Lore: what the Briar King left behind

path-node|96|93,84||0
LIST|0|Leave Thornwood

path-node|97|96||0
LIST|0|Act 4: Reach the Glass Citadel

path-node|98|97||0
CHECKLIST|Scout the Glass Citadel
checklist-item|0|Find a vantage point
checklist-item|0|Mark the patrols
checklist-item|0|Talk to a local

path-node|99|97|o|0
PROGRESS|0/6|Prism Lenses

path-node|100|98||0
RADIO|0|How to get into the Glass Citadel
radio-option|1|Slip in quietly
radio-option|2|Break down the gate
radio-option|3|Parley at the door

path-node|101|100:1h|s|0
LIST|0|Slip in quietly

path-node|102|100:2h|s|0
PROGRESS|0/5|Break down the gate

path-node|103|100:3h|s|0
RADIO|0|Parley at the door
radio-option|1|Bribe the guard
radio-option|2|Threaten the guard

path-node|104|103:1h|s|0
CHECKLIST|Bribe the guard
checklist-item|0|Count the coin
checklist-item|0|Hand it over

path-node|105|101||0
LIST|0|Through the drain tunnels

path-node|106|102||0
CHECKLIST|Hold the breach
checklist-item|0|First wave
checklist-item|0|Second wave
checklist-item|0|Captain

path-node|107|103:2||0
LIST|0|The guard runs to warn the others

path-node|108|100:1,100:2,100:3||0
LIST|0|Inside the Glass Citadel

path-node|109|108|om|0
LIST|0|Lore: a letter from the Mirror Regent

path-node|110|108||0
RADIO|0|Recruit Glazier's guild
radio-option|1|Ask kindly
radio-option|2|Make a deal

path-node|111|108||0
LIST|0|Recruit Prince Orrin

path-node|112|108||0
CHECKLIST|Recruit The reflection
checklist-item|0|Find them
checklist-item|0|Earn their trust

path-node|113|108,105||0
PROGRESS|0/3|Recruit Captain Sol

path-node|114|108,107||0
LIST|0|Recruit Lamplighters

path-node|115|110,111,112,113,114||0
THRESHOLD|3|Rally 3 allies in the Glass Citadel

path-node|116|115||0
RADIO|0|The fate of the Mirror Regent
radio-option|1|Spare the Mirror Regent
radio-option|2|Bind the Mirror Regent
radio-option|3|Exile the Mirror Regent

path-node|117|108||0
RADIO|0|Answer the oracle
radio-option|1|Spare the Mirror Regent
radio-option|2|Lie to the oracle

path-node|118|116:1h,117:1h|s|0
LIST|0|Spare the Mirror Regent

path-node|119|116:2h|s|0
CHECKLIST|Bind the Mirror Regent
checklist-item|0|Chain
checklist-item|0|Seal
checklist-item|0|Name

path-node|120|116:3||0
LIST|0|the Mirror Regent walks into the dark

path-node|121|118||0
LIST|0|A debt of mercy

path-node|122|117:2||0
LIST|0|The oracle knows

path-node|123|119,105||0
LIST|0|The warden's bargain

path-node|124|116:1,116:2,116:3,117:2||0
PROGRESS|0/3|Seal the heart of the Glass Citadel

path-node|125|86:2,85:3|o|0
LIST|0|An echo of the last choice

path-node|126|124|om|0
LIST|0|Lore: what the Mirror Regent left behind

path-node|127|124,115||0
LIST|0|Leave the Glass Citadel

path-node|128|127||0
LIST|0|Act 5: Reach the Saltmarsh

path-node|129|128||0
CHECKLIST|Scout the Saltmarsh
checklist-item|0|Find a vantage point
checklist-item|0|Mark the patrols
checklist-item|0|Talk to a local

path-node|130|128|o|0
PROGRESS|0/6|Bog Lanterns

path-node|131|129|om|0
LIST|0|Lore: the founding of the Saltmarsh

path-node|132|129||0
RADIO|0|How to get into the Saltmarsh
radio-option|1|Slip in quietly
radio-option|2|Break down the gate
radio-option|3|Parley at the door

path-node|133|132:1h|s|0
LIST|0|Slip in quietly

path-node|134|132:2h|s|0
PROGRESS|0/5|Break down the gate

path-node|135|132:3h|s|0
RADIO|0|Parley at the door
radio-option|1|Bribe the guard
radio-option|2|Threaten the guard

path-node|136|135:1h|s|0
CHECKLIST|Bribe the guard
checklist-item|0|Count the coin
checklist-item|0|Hand it over

path-node|137|133||0
LIST|0|Through the drain tunnels

path-node|138|134||0
CHECKLIST|Hold the breach
checklist-item|0|First wave
checklist-item|0|Second wave
checklist-item|0|Captain

path-node|139|135:2||0
LIST|0|The guard runs to warn the others

path-node|140|132:1,132:2,132:3||0
LIST|0|Inside the Saltmarsh

path-node|141|140|om|0
LIST|0|Lore: a letter from the Heron Witch

path-node|142|140||0
LIST|0|Recruit Eel-catchers

path-node|143|140||0
CHECKLIST|Recruit The heron chicks
checklist-item|0|Find them
checklist-item|0|Earn their trust

path-node|144|140||0
PROGRESS|0/3|Recruit Fen doctor

path-node|145|140,137||0
LIST|0|Recruit Reed singers

path-node|146|140,138||0
RADIO|0|Recruit Marsh smugglers
radio-option|1|Ask kindly
radio-option|2|Make a deal

path-node|147|142,143,144,145,146||0
THRESHOLD|3|Rally 3 allies in the Saltmarsh

path-node|148|147||0
RADIO|0|The fate of the Heron Witch
radio-option|1|Spare the Heron Witch
radio-option|2|Bind the Heron Witch
radio-option|3|Exile the Heron Witch

path-node|149|140||0
RADIO|0|Answer the oracle
radio-option|1|Spare the Heron Witch
radio-option|2|Lie to the oracle

path-node|150|148:1h,149:1h|s|0
LIST|0|Spare the Heron Witch

path-node|151|148:2h,142,143,144|s|0
THRESHOLD|2|Bind the Heron Witch

path-node|152|148:3||0
LIST|0|the Heron Witch walks into the dark

path-node|153|150||0
LIST|0|A debt of mercy

path-node|154|149:2||0
LIST|0|The oracle knows

path-node|155|151,137||0
LIST|0|The warden's bargain

path-node|156|148:1,148:2,148:3,149:2||0
PROGRESS|0/3|Seal the heart of the Saltmarsh

path-node|157|117:2,116:3|o|0
LIST|0|An echo of the last choice

path-node|158|156|om|0
LIST|0|Lore: what the Heron Witch left behind

path-node|159|156,147||0
LIST|0|Leave the Saltmarsh

path-node|160|159||0
LIST|0|Act 6: Reach the Hollow Crown

path-node|161|160||0
CHECKLIST|Scout the Hollow Crown
checklist-item|0|Find a vantage point
checklist-item|0|Mark the patrols
checklist-item|0|Talk to a local

path-node|162|160|o|0
PROGRESS|0/6|Crown Fragments

path-node|163|161||0
RADIO|0|How to get into the Hollow Crown
radio-option|1|Slip in quietly
radio-option|2|Break down the gate
radio-option|3|Parley at the door

path-node|164|163:1h|s|0
LIST|0|Slip in quietly

path-node|165|163:2h|s|0
PROGRESS|0/5|Break down the gate

path-node|166|163:3h|s|0
RADIO|0|Parley at the door
radio-option|1|Bribe the guard
radio-option|2|Threaten the guard

path-node|167|166:1h|s|0
CHECKLIST|Bribe the guard
checklist-item|0|Count the coin
checklist-item|0|Hand it over

path-node|168|164||0
LIST|0|Through the drain tunnels

path-node|169|165||0
CHECKLIST|Hold the breach
checklist-item|0|First wave
checklist-item|0|Second wave
checklist-item|0|Captain

path-node|170|166:2||0
LIST|0|The guard runs to warn the others

path-node|171|163:1,163:2,163:3||0
LIST|0|Inside the Hollow Crown

path-node|172|171|om|0
LIST|0|Lore: a letter from the Crowned Hollow

path-node|173|171||0
CHECKLIST|Recruit Every banner
checklist-item|0|Find them
checklist-item|0|Earn their trust

path-node|174|171||0
PROGRESS|0/3|Recruit The first warden

path-node|175|171||0
LIST|0|Recruit Your shadow

path-node|176|171,168||0
RADIO|0|Recruit The lost queen
radio-option|1|Ask kindly
radio-option|2|Make a deal

path-node|177|171,170||0
LIST|0|Recruit The crowd

path-node|178|173,174,175,176,177||0
THRESHOLD|3|Rally 3 allies in the Hollow Crown

path-node|179|178||0
RADIO|0|The fate of the Crowned Hollow
radio-option|1|Spare the Crowned Hollow
radio-option|2|Bind the Crowned Hollow
radio-option|3|Exile the Crowned Hollow

path-node|180|171||0
RADIO|0|Answer the oracle
radio-option|1|Spare the Crowned Hollow
radio-option|2|Lie to the oracle

path-node|181|179:1h,180:1h|s|0
LIST|0|Spare the Crowned Hollow

path-node|182|179:2h|s|0
CHECKLIST|Bind the Crowned Hollow
checklist-item|0|Chain
checklist-item|0|Seal
checklist-item|0|Name

path-node|183|179:3||0
LIST|0|the Crowned Hollow walks into the dark

path-node|184|181||0
LIST|0|A debt of mercy

path-node|185|180:2||0
LIST|0|The oracle knows

path-node|186|182,168||0
LIST|0|The warden's bargain

path-node|187|179:1,179:2,179:3,180:2||0
PROGRESS|0/3|Seal the heart of the Hollow Crown

path-node|188|149:2,148:3|o|0
LIST|0|An echo of the last choice

path-node|189|187|om|0
LIST|0|Lore: what the Crowned Hollow left behind

path-node|190|187,178||0
LIST|0|Leave the Hollow Crown

path-node|191|190||0
RADIO|0|Light the lantern
radio-option|1|Ending: Ashes and Dawn
radio-option|2|Wear the crown
radio-option|3|Give the crown away

path-node|192|191:1h|s|0
LIST|0|Ending: Ashes and Dawn

path-node|193|191:2h|s|0
CHECKLIST|Wear the crown
checklist-item|0|Take the throne
checklist-item|0|Name an heir

path-node|194|193||0
LIST|0|Ending: The New Hollow

path-node|195|191:3||0
LIST|0|Ending: The People's Lantern

path-node|196|5,36,67,99,130,162|o|0
THRESHOLD|4|Secret: 4 relic sets complete

path-node|197|196,191:1,191:3|o|0
LIST|0|Secret ending: The Lantern Remembers

path-node|198|28,58,90,121,153,184|o|0
THRESHOLD|5|Spared 5 of 6 foes

path-node|199|198|om|0
LIST|0|Epilogue: The Gentle Road

path-node|200|31|om|0
LIST|0|Side tale 1: Ferry fare

--- PATH END ---

--- NEST 1 END ---

===== WORKSPACE END =====`
    });
})();
