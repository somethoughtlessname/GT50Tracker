// ===== THE JOYSTICK JOURNAL GAME FILE =====
// Game: Life is Strange
// One nest, one PATH card per episode. Each path holds the episode's scenes in order, its major
// choices, and its 10 optional photos (missable: they drop off once you leave the scene they're in).
// Sources: https://life-is-strange.fandom.com/wiki/Choices_and_Consequences
//          https://segmentnext.com/life-is-strange-choices/
//          https://platget.com/guides/life-is-strange-collectible-guide
//          https://www.trueachievements.com/game/Life-Is-Strange/achievements
//          https://life-is-strange.fandom.com/wiki/Episode_1:_Chrysalis (and Episodes 2-5: checkpoints)
// Needs comp/comp-path.js (the PATH card).

(function () {
    if (!window.GT50 || !window.GT50.Imports) return;
    window.GT50.Imports.register({
        id: 'life-is-strange',
        name: 'Life is Strange',
        description: 'One path per episode: every scene, major choice, both endings and all 50 photos.',
        path: true,
        data: String.raw`===== WORKSPACE START =====
APP|The Joystick Journal

--- NEST 1 START: Life is Strange ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- PATH START: Episode 1: Chrysalis ---

path-node|1|||0
LIST|0|Nightmare

path-node|2|1||0
LIST|0|High School

path-node|3|2||0
RADIO|0|Nathan's Gun
radio-option|1|Report Nathan
radio-option|2|Hide the truth
dropdown|Talking to Principal Wells

path-node|4|3||0
LIST|0|Main Campus

path-node|5|4||0
LIST|0|Dormitories

path-node|6|5||0
RADIO|0|Victoria Outside the Dorm
radio-option|1|Make fun of her
radio-option|2|Comfort her
dropdown|On the dorm steps

path-node|7|6||0
LIST|0|Girls' Dormitories

path-node|8|7||0
LIST|0|Dormitories - With The Flash Drive

path-node|9|8||0
RADIO|0|Kate and David
radio-option|1|Take a photo
radio-option|2|Intervene

path-node|10|9||0
LIST|0|Parking Lot

path-node|11|10||0
LIST|0|Chloe's Truck

path-node|12|11||0
LIST|0|Chloe's House - Upstairs

path-node|13|12||0
RADIO|0|Chloe's Weed
radio-option|1|Take the blame
radio-option|2|Blame Chloe
radio-option|3|Stay hidden
radio-option|4|Stay hidden, then reveal to David
dropdown|In Chloe's room when David comes home

path-node|14|13||0
LIST|0|Chloe's House - Downstairs

path-node|15|14||0
LIST|0|Chloe's House - With The Tools

path-node|16|15||0
LIST|0|Cliff

path-node|17|16||0
LIST|0|Cliff - Nightmare
dropdown|Last scene of the episode. Trophy: Chrysalis

path-node|18|2|om|0
LIST|0|Photo #1 Macro Eyes
dropdown|Etching on a classroom table (High School). Trophy.

path-node|19|4|om|0
LIST|0|Photo #2 Wide Angles
dropdown|Founder statue, from the front (Main Campus). Trophy.

path-node|20|4|om|0
LIST|0|Photo #3 Telephotogenic
dropdown|Skater on the ground after a failed trick (Main Campus). Trophy.

path-node|21|5|om|0
LIST|0|Photo #4 Close-Ups
dropdown|Squirrel at a tree base by Kate's bench (Dormitories). Trophy.

path-node|22|7|om|0
LIST|0|Photo #5 Red Eye
dropdown|Mirror left of the door in Max's room. Trophy.

path-node|23|7|om|0
LIST|0|Photo #6 Focused
dropdown|Messed-up photos left of the door in Victoria's room. Trophy.

path-node|24|5|om|0
LIST|0|Photo #7 Zoomed In
dropdown|Smashed window after the football hits (Dormitories). Trophy.

path-node|25|10|om|0
LIST|0|Photo #8 Focal Pointed
dropdown|Drawing on the dirty RV window, far right (Parking Lot). Trophy.

path-node|26|16|om|0
LIST|0|Photo #9 Maximum Aperture
dropdown|Bird on a rock on the trail behind the start (Cliff). Trophy.

path-node|27|16|om|0
LIST|0|Photo #10 Light Leak
dropdown|Chloe on the lighthouse bench, from behind (Cliff). Trophy. All 10: Visionary.

--- PATH END ---

--- PATH START: Episode 2: Out of Time ---

path-node|1|||0
LIST|0|Girls' Dormitories

path-node|2|1||0
RADIO|0|Advice for Kate
radio-option|1|Go to the police
radio-option|2|Look for proof first
dropdown|In Kate's room

path-node|3|2||0
LIST|0|Dormitories - Morning

path-node|4|3||0
LIST|0|Main Campus - Morning

path-node|5|4||0
LIST|0|Bus

path-node|6|5||0
LIST|0|Diner

path-node|7|6||0
RADIO|0|Kate's Phone Call
radio-option|1|Answer it
radio-option|2|Don't answer

path-node|8|7||0
LIST|0|Junkyard

path-node|9|8||0
RADIO|0|Frank and the Gun
radio-option|1|Shoot (the gun is empty)
radio-option|2|Don't shoot

path-node|10|9||0
LIST|0|Railroad

path-node|11|10||0
LIST|0|Main Campus - Before Class

path-node|12|11||0
LIST|0|High School

path-node|13|12||0
LIST|0|Dormitories

path-node|14|13||0
RADIO|0|Kate on the Roof
radio-option|1|Kate is saved
radio-option|2|Kate jumps

path-node|15|14||0
LIST|0|Principal's Office

path-node|16|15||0
RADIO|0|Who to Blame
radio-option|1|Nathan
radio-option|2|David
radio-option|3|Jefferson

path-node|17|16||0
LIST|0|Main Campus - With Warren Graham
dropdown|Last scene of the episode. Trophy: Out of Time

path-node|18|1|om|0
LIST|0|Photo #1 Field of View
dropdown|Rabbit cage in Kate's room. Trophy.

path-node|19|3|om|0
LIST|0|Photo #2 Full Exposure
dropdown|Squirrel fed trash by the dorm benches. Trophy.

path-node|20|6|om|0
LIST|0|Photo #3 Processor
dropdown|Neon whale sign above the diner entrance. Trophy.

path-node|21|6|om|0
LIST|0|Photo #4 Image Stabilizer
dropdown|Man and dog at a fence down a side passage (Diner). Trophy.

path-node|22|6|om|0
LIST|0|Photo #5 Compressed
dropdown|Graffiti on the diner bathroom mirror. Trophy.

path-node|23|8|om|0
LIST|0|Photo #6 Pixelated
dropdown|Front of the yellow bus (Junkyard). Trophy.

path-node|24|8|om|0
LIST|0|Photo #7 Dynamic Range
dropdown|Doe in a clearing past the washing machine (Junkyard). Trophy.

path-node|25|8|om|0
LIST|0|Photo #8 Colorized
dropdown|Chloe on a car hood, from the left (Junkyard). Trophy.

path-node|26|12|om|0
LIST|0|Photo #9 Meter Made
dropdown|Warren's experiment in the science classroom. Trophy.

path-node|27|12|om|0
LIST|0|Photo #10 Resolution Revolution
dropdown|Alyssa by a window in Jefferson's class. Trophy. All 10: Lab Master.

--- PATH END ---

--- PATH START: Episode 3: Chaos Theory ---

path-node|1|||0
LIST|0|Girls' Dormitories

path-node|2|1||0
LIST|0|Dormitories

path-node|3|2||0
LIST|0|Main Campus - Evening

path-node|4|3||0
LIST|0|High School - Evening

path-node|5|4||0
RADIO|0|The Handicapped Fund
radio-option|1|Steal the money
radio-option|2|Leave it
dropdown|In the principal's office

path-node|6|5||0
LIST|0|Swimming Pool - Evening

path-node|7|6||0
LIST|0|Parking Lot - Evening

path-node|8|7||0
LIST|0|Chloe's House - Upstairs

path-node|9|8||0
RADIO|0|Chloe's Dare
radio-option|1|Kiss Chloe
radio-option|2|Don't kiss her

path-node|10|9||0
LIST|0|Chloe's House - Downstairs

path-node|11|10||0
RADIO|0|Confronting David
radio-option|1|Side with David
radio-option|2|Side with Chloe

path-node|12|11||0
LIST|0|Diner

path-node|13|12||0
RADIO|0|Pompidou's Bone
radio-option|1|Throw it onto the road (Pompidou hurt)
radio-option|2|Throw it in the parking lot (Pompidou safe)

path-node|14|13||0
RADIO|0|The Gun in Frank's RV
radio-option|1|Take the gun
radio-option|2|Leave it
radio-option|3|Didn't come up
dropdown|Doesn't come up on every playthrough

path-node|15|14||0
LIST|0|Chloe's Truck

path-node|16|15||0
LIST|0|Main Campus - Noon

path-node|17|16||0
LIST|0|Max's Room

path-node|18|17||0
LIST|0|Chloe's House - Focus

path-node|19|18||0
LIST|0|Alternative Main Campus
dropdown|Last scene of the episode. Trophy: Chaos Theory

path-node|20|1|om|0
LIST|0|Photo #1 Parallax View
dropdown|Statuette on the top shelf in Victoria's room. Trophy.

path-node|21|2|om|0
LIST|0|Photo #2 Lenscrafted
dropdown|Squirrel with fireflies on a bench (Dormitories). Trophy.

path-node|22|4|om|0
LIST|0|Photo #3 The Reflex
dropdown|Aquarium in the science classroom, turned on (night). Trophy.

path-node|23|4|om|0
LIST|0|Photo #4 Histogrammar
dropdown|Skeleton with a cigarette in a classroom corner (night). Trophy.

path-node|24|4|om|0
LIST|0|Photo #5 Bokeh
dropdown|Chloe at the principal's desk (night). Trophy.

path-node|25|8|om|0
LIST|0|Photo #6 Pinholed
dropdown|Bathroom mirror after getting dressed (Chloe's house). Trophy.

path-node|26|10|om|0
LIST|0|Photo #7 RAW Strength
dropdown|Bird on the backyard fence (Chloe's house). Trophy.

path-node|27|12|om|0
LIST|0|Photo #8 Viewfinder
dropdown|Trucker's red truck across the road (Diner). Trophy.

path-node|28|12|om|0
LIST|0|Photo #9 Optican
dropdown|Dead bird by trash cans in the alley (Diner). Trophy.

path-node|29|10|om|0
LIST|0|Photo #10 Flash!
dropdown|Camera beside Chloe during breakfast (Chloe's house). Trophy. All 10: Camera Eye.

--- PATH END ---

--- PATH START: Episode 4: Dark Room ---

path-node|1|||0
LIST|0|Alternative Beach

path-node|2|1||0
LIST|0|Alternative Chloe's Room

path-node|3|2||0
LIST|0|Alternative Chloe's House - Downstairs

path-node|4|3||0
LIST|0|Alternative Chloe's House - Upstairs

path-node|5|4||0
LIST|0|Alternative Chloe's House - Downstairs (again)

path-node|6|5||0
RADIO|0|Alternative Chloe's Last Wish
radio-option|1|Accept
radio-option|2|Refuse

path-node|7|6||0
LIST|0|Chloe's House - Focus

path-node|8|7||0
LIST|0|Chloe's House - Upstairs

path-node|9|8||0
LIST|0|Chloe's House - Downstairs

path-node|10|9||0
RADIO|0|Did You Save Kate? (Episode 2)
radio-option|1|Yes, Kate was saved
radio-option|2|No, Kate jumped
dropdown|Answer from your Episode 2 playthrough. The hospital visit only happens if Kate lived

path-node|11|10:1||0
LIST|0|Hospital

path-node|12|11,10||0
LIST|0|Dormitories

path-node|13|12||0
LIST|0|Boys' Dormitories

path-node|14|13||0
RADIO|0|Warren vs. Nathan
radio-option|1|Stop Warren
radio-option|2|Stay out of it

path-node|15|14||0
LIST|0|Main Campus

path-node|16|15||0
LIST|0|Beach

path-node|17|16||0
RADIO|0|Meeting with Frank
radio-option|1|Chloe kills Frank
radio-option|2|Chloe wounds Frank
radio-option|3|No one gets hurt
dropdown|Which outcomes you can reach depends on earlier choices

path-node|18|17||0
LIST|0|Chloe's House - Investigation

path-node|19|18||0
LIST|0|Old Barn

path-node|20|19||0
LIST|0|Junkyard

path-node|21|20||0
LIST|0|Parking Lot

path-node|22|21||0
LIST|0|Swimming Pool - Party

path-node|23|22||0
RADIO|0|Warning Victoria
radio-option|1|Victoria believes you
radio-option|2|Victoria doesn't believe you
radio-option|3|Didn't warn her
dropdown|Whether she believes you depends on how you treated her in Episode 1

path-node|24|23||0
LIST|0|Junkyard - Evening
dropdown|Last scene of the episode. Trophy: Dark Room

path-node|25|8|om|0
LIST|0|Photo #1 Ambient
dropdown|Chloe at her desk, back in the present (Chloe's house). Trophy.

path-node|26|9|om|0
LIST|0|Photo #2 Time-Lapsed
dropdown|Nest behind a plank in the garage (Chloe's house). Trophy.

path-node|27|15|om|0
LIST|0|Photo #3 Balance
dropdown|Rock cairn on the grass past the football players. Trophy.

path-node|28|12|om|0
LIST|0|Photo #4 Rangefinder
dropdown|Two squirrels together near Samuel (Dormitories). Trophy.

path-node|29|13|om|0
LIST|0|Photo #5 Gamma Value
dropdown|Footprints through the window at the hall's end (Boys' dorm). Trophy.

path-node|30|16|om|0
LIST|0|Photo #6 Dioptric Power
dropdown|Dead whale on the shore, right of the RV (Beach). Trophy.

path-node|31|19|om|0
LIST|0|Photo #7 Fisheye
dropdown|Bird on the fence near the barn (Old Barn). Trophy.

path-node|32|19|om|0
LIST|0|Photo #8 Manually Exposed
dropdown|Owl behind a box on the top platform (Old Barn). Trophy.

path-node|33|22|om|0
LIST|0|Photo #9 Slideshow
dropdown|Skeleton drawing on a restroom half-wall (Party). Trophy.

path-node|34|22|om|0
LIST|0|Photo #10 Tripod
dropdown|Two moons through the high windows by the pool (Party). Trophy. All 10: Shutterbug.

--- PATH END ---

--- PATH START: Episode 5: Polarized ---

path-node|1|||0
LIST|0|Dark Room

path-node|2|1||0
LIST|0|Dark Room - 1st Focus

path-node|3|2||0
LIST|0|Dark Room - After the Focus

path-node|4|3||0
LIST|0|Dark Room - 2nd Focus

path-node|5|4||0
LIST|0|Art Class - Focus

path-node|6|5||0
LIST|0|Plane - Between Realities

path-node|7|6||0
LIST|0|Art Gallery

path-node|8|7||0
LIST|0|Max's Room - Focus

path-node|9|8||0
LIST|0|Dark Room - Confrontation

path-node|10|9||0
LIST|0|Jefferson's Car

path-node|11|10||0
LIST|0|Diner

path-node|12|11||0
LIST|0|Parking Lot - Focus

path-node|13|12||0
LIST|0|Beach

path-node|14|13||0
LIST|0|Nightmare

path-node|15|14||0
RADIO|0|The Final Choice
radio-option|1|Sacrifice Chloe
radio-option|2|Sacrifice Arcadia Bay

path-node|16|15:1||0
LIST|0|Ending: Sacrifice Chloe
dropdown|Max lets Chloe die and the town is saved. Trophy: Polarized

path-node|17|15:2||0
LIST|0|Ending: Sacrifice Arcadia Bay
dropdown|Max and Chloe leave the wrecked town together. Trophy: Polarized

path-node|18|5|om|0
LIST|0|Photo #1 Incandescent
dropdown|Kate, after Max comforts her (Art Class). Trophy.

path-node|19|7|om|0
LIST|0|Photo #2 Night Vision
dropdown|Woman on a bench, with the camera behind her (Gallery). Trophy.

path-node|20|1|om|0
LIST|0|Photo #3 Framed
dropdown|From a dialogue choice after rewinding (Dark Room). Trophy.

path-node|21|11|om|0
LIST|0|Photo #4 Camera Obscura
dropdown|Whale blocking the road after stopping the explosion (Diner). Trophy.

path-node|22|11|om|0
LIST|0|Photo #5 Blowup
dropdown|Car on a roof at the end of the alley (Diner). Trophy.

path-node|23|14|om|0
LIST|0|Photo #6 Iris
dropdown|Classroom etching that now reads Chloe's name (Nightmare). Trophy.

path-node|24|14|om|0
LIST|0|Photo #7 Sensor
dropdown|Giant squirrels outside the shower room window (Nightmare). Trophy.

path-node|25|14|om|0
LIST|0|Photo #8 On Display
dropdown|Skeleton statue by the bathroom doors (Nightmare). Trophy.

path-node|26|14|om|0
LIST|0|Photo #9 Light Meter
dropdown|Warren's locker at a dead end (Nightmare). Trophy.

path-node|27|14|om|0
LIST|0|Photo #10 Silhouettes
dropdown|Shelf with six bottles, after the junkyard (Nightmare). Trophy. All 10: Selfie Awareness.

--- PATH END ---

--- NEST 1 END ---

===== WORKSPACE END =====`
    });
})();
