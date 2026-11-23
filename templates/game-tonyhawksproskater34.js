// ===== THE JOYSTICK JOURNAL GAME FILE =====
// Game: Tony Hawk's Pro Skater 3 + 4
// Sources: https://www.pushsquare.com/guides/tony-hawks-pro-skater-3-plus-4-guide-a-100percent-collectibles-walkthrough (and its level pages)
//          https://www.pushsquare.com/guides/tony-hawks-pro-skater-3-plus-4-trophy-guide-all-trophies-and-how-to-get-the-platinum
//          https://www.pushsquare.com/guides/tony-hawks-pro-skater-3-plus-4-all-unique-solo-tour-goals-for-every-skater-style
//          https://www.pushsquare.com/guides/tony-hawks-pro-skater-3-plus-4-all-bonus-skaters-and-how-to-unlock-them
//          https://www.altchar.com/guides/tony-hawks-pro-skater-3-4-all-skater-challenges-and-rewards-aanYx2N6DZ17
//          https://www.altchar.com/guides/tony-hawks-pro-skater-34-all-thps3-challenges-avND78X5FWRN
//          https://www.altchar.com/guides/tony-hawks-pro-skater-34-all-thps4-challenges-ahA8c5R2DYm8
//          https://www.altchar.com/guides/tony-hawks-pro-skater-34-all-expert-challenges-aNYn50Z9ro74
//          https://www.tonyhawkthegame.com/blog/2025/06/tony-hawk-pro-skater-three-four-returning-skaters
//          https://www.tonyhawkthegame.com/blog/2025/05/tony-hawk-pro-skater-three-four-new-skaters
// Install: save as templates/game-tonyhawksproskater34.js, then add
//          'game-tonyhawksproskater34.js' to the list in templates/list.js

(function () {
    if (!window.GT50 || !window.GT50.Imports) return;
    window.GT50.Imports.register({
        id: 'tony-hawks-pro-skater-3-4',
        name: 'Tony Hawk\'s Pro Skater 3 + 4',
        description: 'Both tours, pro goals, every Solo Tour, pandas and challenges.',
        data: String.raw`===== WORKSPACE START =====
APP|The Joystick Journal

--- NEST 1 START: Tony Hawk's Pro Skater 3 + 4 ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|1
nest-summary-mode|tab-bars

--- TAB 1.1 START: THPS3 TOUR ---
tab-color|4

DIVIDER|FOUNDRY

CHECKLIST|Foundry Goals
checklist-item|0|High Score (10,000)
checklist-item|0|Pro Score (30,000)
checklist-item|0|Sick Score (60,000)
checklist-item|0|High Combo (7,500)
checklist-item|0|Collect SKATE Letters
checklist-item|0|Indy Over the Half Pipe
checklist-item|0|Soak the Foreman
checklist-item|0|Grind the Molten Bucket
checklist-item|0|Un-Jam 5 Valves
checklist-item|0|Get the Secret Tape

CHECKLIST|Foundry Pro Goals
checklist-item|0|Platinum Score
checklist-item|0|Collect COMBO Letters
checklist-item|0|Double Kickflip the Stomp the Presses Gap
checklist-item|0|Froggy Grind Down the Helix Room
checklist-item|0|Collect the 5 Forged Tonys
dropdown|Pro goals open after every regular goal in every level

DIVIDER|CANADA

CHECKLIST|Canada Goals
checklist-item|0|High Score (35,000)
checklist-item|0|Pro Score (70,000)
checklist-item|0|Sick Score (120,000)
checklist-item|0|High Combo (10,000)
checklist-item|0|Collect SKATE Letters
checklist-item|0|Nosegrind Around the Horn
checklist-item|0|Get Chuck Unstuck
checklist-item|0|Bury That Bully!
checklist-item|0|Impress the Skaters
checklist-item|0|Get the Secret Tape

CHECKLIST|Canada Pro Goals
checklist-item|0|Platinum Score (500,000)
checklist-item|0|Collect COMBO Letters
checklist-item|0|Bluntslide the Mandatory Videogame Mine Cart Ride
checklist-item|0|Stiffy Over the Hill
checklist-item|0|Bring Peter His Thermos
dropdown|Pro goals open after every regular goal in every level

DIVIDER|RIO

RADIO|0|Rio Medal
radio-option|1|Gold
radio-option|2|Silver
radio-option|3|Bronze
dropdown|Competition: your best two runs count

LIST|0|Rio Platinum Goal: Christ Air Over the Bank
dropdown|Pro goal: do it in any heat and place first

DIVIDER|SUBURBIA

CHECKLIST|Suburbia Goals
checklist-item|0|High Score (55,000)
checklist-item|0|Pro Score (110,000)
checklist-item|0|Sick Score (200,000)
checklist-item|0|High Combo (15,000)
checklist-item|0|Collect SKATE Letters
checklist-item|0|Nosegrab Between the Ramps
checklist-item|0|Help the Thin Man
checklist-item|0|Restore Power to the Dish
checklist-item|0|Squash 5 Pumpkins
checklist-item|0|Get the Secret Tape

CHECKLIST|Suburbia Pro Goals
checklist-item|0|Platinum Score (600,000)
checklist-item|0|Collect COMBO Letters
checklist-item|0|Manual Around the Sac
checklist-item|0|Pizza Guy in the Abyss
checklist-item|0|Impress the Skaters
dropdown|Pro goals open after every regular goal in every level

DIVIDER|AIRPORT

CHECKLIST|Airport Goals
checklist-item|0|High Score (75,000)
checklist-item|0|Pro Score (150,000)
checklist-item|0|Sick Score (300,000)
checklist-item|0|High Combo (20,000)
checklist-item|0|Collect SKATE Letters
checklist-item|0|Airwalk Over an Escalator
checklist-item|0|Visit 10 Countries
checklist-item|0|Get the Tickets to Your Skate Buddy
checklist-item|0|Stop the Pickpockets
checklist-item|0|Get the Secret Tape

CHECKLIST|Airport Pro Goals
checklist-item|0|Platinum Score (700,000)
checklist-item|0|Collect COMBO Letters
checklist-item|0|Combo from Start to Finish
checklist-item|0|540 Shove-It Over the Gate Transfer Gap
checklist-item|0|Collect 5 Passports
dropdown|Pro goals open after every regular goal in every level

DIVIDER|SKATER ISLAND

RADIO|0|Skater Island Medal
radio-option|1|Gold
radio-option|2|Silver
radio-option|3|Bronze
dropdown|Competition: your best two runs count

LIST|0|Skater Island Platinum Goal: Lip Trick Near the Pirate
dropdown|Pro goal: do it in any heat and place first

DIVIDER|LOS ANGELES

CHECKLIST|Los Angeles Goals
checklist-item|0|High Score (100,000)
checklist-item|0|Pro Score (190,000)
checklist-item|0|Sick Score (400,000)
checklist-item|0|High Combo (40,000)
checklist-item|0|Collect SKATE Letters
checklist-item|0|One Foot Japan the Tower Poppin' Transfer
checklist-item|0|Free Ballin'
checklist-item|0|Start the Earthquake
checklist-item|0|Stop the Car Chase
checklist-item|0|Get the Secret Tape

CHECKLIST|Los Angeles Pro Goals
checklist-item|0|Platinum Score (800,000)
checklist-item|0|Collect COMBO Letters
checklist-item|0|Monty or Smith Grind a Wire Ridin' Gap
checklist-item|0|Wallride the Passin' Gas Gap
checklist-item|0|Scatter All the Seagulls
dropdown|Pro goals open after every regular goal in every level

DIVIDER|TOKYO

RADIO|0|Tokyo Medal
radio-option|1|Gold
radio-option|2|Silver
radio-option|3|Bronze
dropdown|Competition: your best two runs count

LIST|0|Tokyo Platinum Goal: Sal Flip the Chanko Nabe Gap
dropdown|Pro goal: do it in any heat and place first

DIVIDER|CRUISE SHIP

CHECKLIST|Cruise Ship Goals
checklist-item|0|High Score (150,000)
checklist-item|0|Pro Score (225,000)
checklist-item|0|Sick Score (500,000)
checklist-item|0|High Combo (50,000)
checklist-item|0|Collect SKATE Letters
checklist-item|0|Impress the Pro Skaters
checklist-item|0|Invert the High Wires
checklist-item|0|Help Raise the Ferry
checklist-item|0|Complete the Stunt Gauntlet
checklist-item|0|Get the Secret Tape

CHECKLIST|Cruise Ship Pro Goals
checklist-item|0|Platinum Score (900,000)
checklist-item|0|Collect COMBO Letters
checklist-item|0|Rocket Air Over the Crazy Lifeboat Transfer
checklist-item|0|Cannonball Into the Pool from Up High
checklist-item|0|Collect 5 Energy Drinks
dropdown|Pro goals open after every regular goal in every level

--- TAB 1.1 END ---

--- TAB 1.2 START: THPS4 TOUR ---
tab-color|4

DIVIDER|COLLEGE

CHECKLIST|College Goals
checklist-item|0|High Score (10,000)
checklist-item|0|Pro Score (30,000)
checklist-item|0|Sick Score (60,000)
checklist-item|0|High Combo (7,500)
checklist-item|0|Collect SKATE Letters
checklist-item|0|Boneless Spine Transfer Between the Courts
checklist-item|0|Get Back at the Frat
checklist-item|0|Skitch the Professor's Car
checklist-item|0|Grind Down Officer Dick's Banners
checklist-item|0|Get the Secret Tape

CHECKLIST|College Pro Goals
checklist-item|0|Platinum Score (300,000)
checklist-item|0|Collect COMBO Letters
checklist-item|0|Collect the Pink Elephants
checklist-item|0|Impress the Skaters
checklist-item|0|Gap Between the Floats
dropdown|Pro goals open after every regular goal in every level

DIVIDER|SAN FRANCISCO

CHECKLIST|San Francisco Goals
checklist-item|0|High Score (35,000)
checklist-item|0|Pro Score (65,000)
checklist-item|0|Sick Score (110,000)
checklist-item|0|High Combo (10,000)
checklist-item|0|Collect SKATE Letters
checklist-item|0|BS Boneless a Pier Sign
checklist-item|0|Collect the 5 Missing Packages
checklist-item|0|Manual the Overhead Walkway
checklist-item|0|Save Painter Neal!!!
checklist-item|0|Get the Secret Tape

CHECKLIST|San Francisco Pro Goals
checklist-item|0|Platinum Score (400,000)
checklist-item|0|Collect COMBO Letters
checklist-item|0|Manual the Setup
checklist-item|0|Retrieve the Stolen Camera
checklist-item|0|Get Rid of the Rude Dudes
dropdown|Pro goals open after every regular goal in every level

DIVIDER|MOVIE STUDIO

RADIO|0|Movie Studio Medal
radio-option|1|Gold
radio-option|2|Silver
radio-option|3|Bronze
dropdown|Competition: your best two runs count

LIST|0|Movie Studio Platinum Goal: Collect 3 Movie Reels
dropdown|Pro goal: do it in any heat and place first

DIVIDER|ALCATRAZ

CHECKLIST|Alcatraz Goals
checklist-item|0|High Score (55,000)
checklist-item|0|Pro Score (100,000)
checklist-item|0|Sick Score (175,000)
checklist-item|0|High Combo (15,000)
checklist-item|0|Collect SKATE Letters
checklist-item|0|Nosegrind the Foghorn Rail
checklist-item|0|Photobomb 3 Groups of Tourists
checklist-item|0|Spine Transfer into the Water Tower
checklist-item|0|Release the Prisoner
checklist-item|0|Get the Secret Tape

CHECKLIST|Alcatraz Pro Goals
checklist-item|0|Platinum Score (500,000)
checklist-item|0|Collect COMBO Letters
checklist-item|0|Sal Flip Over the Bulldozer
checklist-item|0|Double Heelflip the Massive Crumbling Stairset
checklist-item|0|Listen to Ranger Ron's Story
dropdown|Pro goals open after every regular goal in every level

DIVIDER|WATERPARK

CHECKLIST|Waterpark Goals
checklist-item|0|High Score (75,000)
checklist-item|0|Pro Score (135,000)
checklist-item|0|Sick Score (250,000)
checklist-item|0|High Combo (20,000)
checklist-item|0|Collect SKATE Letters
checklist-item|0|Hardflip the Castle and Fountain Gap
checklist-item|0|Smash 5 Mascot Cutouts
checklist-item|0|Drain Pirate's Bay
checklist-item|0|Restore Power to the Arcade
checklist-item|0|Get the Secret Tape

CHECKLIST|Waterpark Pro Goals
checklist-item|0|Platinum Score (600,000)
checklist-item|0|Collect COMBO Letters
checklist-item|0|Impress the Pro Skaters
checklist-item|0|Collect 5 Tokens for the Arcade
checklist-item|0|Get Back at Eric Sparrow
dropdown|Pro goals open after every regular goal in every level

DIVIDER|KONA

RADIO|0|Kona Medal
radio-option|1|Gold
radio-option|2|Silver
radio-option|3|Bronze
dropdown|Competition: your best two runs count

LIST|0|Kona Platinum Goal: Save 4 Bird Groups
dropdown|Pro goal: do it in any heat and place first

DIVIDER|SHIPYARD

CHECKLIST|Shipyard Goals
checklist-item|0|High Score (100,000)
checklist-item|0|Pro Score (170,000)
checklist-item|0|Sick Score (325,000)
checklist-item|0|High Combo (30,000)
checklist-item|0|Collect SKATE Letters
checklist-item|0|Hardflip off the Buoy
checklist-item|0|Collect 7 Rivets
checklist-item|0|Deliver Lunch to 5 Welders
checklist-item|0|Manual Combo the Train
checklist-item|0|Get the Secret Tape

CHECKLIST|Shipyard Pro Goals
checklist-item|0|Platinum Score (700,000)
checklist-item|0|Collect COMBO Letters
checklist-item|0|Ollie North Across the Warehouse Roofs
checklist-item|0|Judo Across the Containers
checklist-item|0|Gap all of the Vent Rails
dropdown|Pro goals open after every regular goal in every level

DIVIDER|LONDON

CHECKLIST|London Goals
checklist-item|0|High Score (125,000)
checklist-item|0|Pro Score (200,000)
checklist-item|0|Sick Score (400,000)
checklist-item|0|High Combo (40,000)
checklist-item|0|Collect SKATE Letters
checklist-item|0|Benihana Over the Fountains
checklist-item|0|Grab 4 Copper Hats
checklist-item|0|Wallride 2 Buses in One Combo
checklist-item|0|Free Stompy the Elephant
checklist-item|0|Get the Secret Tape

CHECKLIST|London Pro Goals
checklist-item|0|Platinum Score (800,000)
checklist-item|0|Collect COMBO Letters
checklist-item|0|Grind the Full Southbank Lights Gap
checklist-item|0|Impress the Pro Skaters
checklist-item|0|Collect the Stompy Plushies
dropdown|Pro goals open after every regular goal in every level

DIVIDER|ZOO

RADIO|0|Zoo Medal
radio-option|1|Gold
radio-option|2|Silver
radio-option|3|Bronze
dropdown|Competition: your best two runs count

LIST|0|Zoo Platinum Goal: Collect 5 Stuffed Penguins
dropdown|Pro goal: do it in any heat and place first

DIVIDER|PINBALL

CHECKLIST|Pinball Goals
checklist-item|0|High Score (150,000)
checklist-item|0|Pro Score (225,000)
checklist-item|0|Sick Score (500,000)
checklist-item|0|High Combo (50,000)
checklist-item|0|Collect SKATE Letters
checklist-item|0|Sack Tap Through the Slime
checklist-item|0|Drop the Tombstone Targets
checklist-item|0|Collect 5 Arcade Tokens
checklist-item|0|Wallplant the Multiball Targets
checklist-item|0|Get the Secret Tape

CHECKLIST|Pinball Pro Goals
checklist-item|0|Platinum Score (1,000,000)
checklist-item|0|Collect COMBO Letters
checklist-item|0|Grind the Wire Rails Top to Bottom
checklist-item|0|Triple Kickflip Between the Flippers
checklist-item|0|Do the 900 on the Arch Ramp
dropdown|Pro goals open after every regular goal in every level

--- TAB 1.2 END ---

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

LIST|0|Tony Hawk, Pro Skater
dropdown|250k+ combo with The 900, as Tony Hawk

--- TAB 1.3.1.1 END ---

--- TAB 1.3.1.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: Indy Over the Halfpipe
checklist-item|0|Canada: Melon Grab Over the Blade
checklist-item|0|Suburbia: Nosegrab Between the Ramps
checklist-item|0|Airport: Airwalk Over an Escalator
checklist-item|0|Los Angeles: One Foot Japan the Tower Poppin' Transfer
checklist-item|0|Cruise Ship: Invert the High Wires
checklist-item|0|College: Boneless Spine Transfer Between the Courts
checklist-item|0|San Francisco: BS Boneless a Pier Sign
checklist-item|0|Alcatraz: Tailgrab Between the Pipes
checklist-item|0|Waterpark: Switcheroo on the Billboard
checklist-item|0|Shipyard: Stiffy Over the Solo Container
checklist-item|0|London: Benihana Over the Fountains
checklist-item|0|Pinball: Sack Tap Through the Slime
dropdown|Vert goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.1.2 END ---

--- NEST 1.3.1 END ---

--- NEST 1.3.2 START: Bob Burnquist ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.2.1 START: CHALLENGES ---
tab-color|7

LIST|0|Bob Burnquist, Pro Skater
dropdown|250k+ combo with Lein Tailslide, as Bob Burnquist

--- TAB 1.3.2.1 END ---

--- TAB 1.3.2.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: Indy Over the Halfpipe
checklist-item|0|Canada: Melon Grab Over the Blade
checklist-item|0|Suburbia: Nosegrab Between the Ramps
checklist-item|0|Airport: Airwalk Over an Escalator
checklist-item|0|Los Angeles: One Foot Japan the Tower Poppin' Transfer
checklist-item|0|Cruise Ship: Invert the High Wires
checklist-item|0|College: Boneless Spine Transfer Between the Courts
checklist-item|0|San Francisco: BS Boneless a Pier Sign
checklist-item|0|Alcatraz: Tailgrab Between the Pipes
checklist-item|0|Waterpark: Switcheroo on the Billboard
checklist-item|0|Shipyard: Stiffy Over the Solo Container
checklist-item|0|London: Benihana Over the Fountains
checklist-item|0|Pinball: Sack Tap Through the Slime
dropdown|Vert goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.2.2 END ---

--- NEST 1.3.2 END ---

--- NEST 1.3.3 START: Bucky Lasek ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.3.1 START: CHALLENGES ---
tab-color|7

LIST|0|Bucky Lasek, Pro Skater
dropdown|250k+ combo with Misty Flip, as Bucky Lasek

--- TAB 1.3.3.1 END ---

--- TAB 1.3.3.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: Indy Over the Halfpipe
checklist-item|0|Canada: Melon Grab Over the Blade
checklist-item|0|Suburbia: Nosegrab Between the Ramps
checklist-item|0|Airport: Airwalk Over an Escalator
checklist-item|0|Los Angeles: One Foot Japan the Tower Poppin' Transfer
checklist-item|0|Cruise Ship: Invert the High Wires
checklist-item|0|College: Boneless Spine Transfer Between the Courts
checklist-item|0|San Francisco: BS Boneless a Pier Sign
checklist-item|0|Alcatraz: Tailgrab Between the Pipes
checklist-item|0|Waterpark: Switcheroo on the Billboard
checklist-item|0|Shipyard: Stiffy Over the Solo Container
checklist-item|0|London: Benihana Over the Fountains
checklist-item|0|Pinball: Sack Tap Through the Slime
dropdown|Vert goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.3.2 END ---

--- NEST 1.3.3 END ---

--- NEST 1.3.4 START: Steve Caballero ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.4.1 START: CHALLENGES ---
tab-color|7

LIST|0|Steve Caballero, Pro Skater
dropdown|250k+ combo with FS 540, as Steve Caballero

--- TAB 1.3.4.1 END ---

--- TAB 1.3.4.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: Indy Over the Halfpipe
checklist-item|0|Canada: Melon Grab Over the Blade
checklist-item|0|Suburbia: Nosegrab Between the Ramps
checklist-item|0|Airport: Airwalk Over an Escalator
checklist-item|0|Los Angeles: One Foot Japan the Tower Poppin' Transfer
checklist-item|0|Cruise Ship: Invert the High Wires
checklist-item|0|College: Boneless Spine Transfer Between the Courts
checklist-item|0|San Francisco: BS Boneless a Pier Sign
checklist-item|0|Alcatraz: Tailgrab Between the Pipes
checklist-item|0|Waterpark: Switcheroo on the Billboard
checklist-item|0|Shipyard: Stiffy Over the Solo Container
checklist-item|0|London: Benihana Over the Fountains
checklist-item|0|Pinball: Sack Tap Through the Slime
dropdown|Vert goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.4.2 END ---

--- NEST 1.3.4 END ---

--- NEST 1.3.5 START: Rune Glifberg ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.5.1 START: CHALLENGES ---
tab-color|7

LIST|0|Rune Glifberg, Pro Skater
dropdown|250k+ combo with Heelflip Handflip, as Rune Glifberg

--- TAB 1.3.5.1 END ---

--- TAB 1.3.5.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: Indy Over the Halfpipe
checklist-item|0|Canada: Melon Grab Over the Blade
checklist-item|0|Suburbia: Nosegrab Between the Ramps
checklist-item|0|Airport: Airwalk Over an Escalator
checklist-item|0|Los Angeles: One Foot Japan the Tower Poppin' Transfer
checklist-item|0|Cruise Ship: Invert the High Wires
checklist-item|0|College: Boneless Spine Transfer Between the Courts
checklist-item|0|San Francisco: BS Boneless a Pier Sign
checklist-item|0|Alcatraz: Tailgrab Between the Pipes
checklist-item|0|Waterpark: Switcheroo on the Billboard
checklist-item|0|Shipyard: Stiffy Over the Solo Container
checklist-item|0|London: Benihana Over the Fountains
checklist-item|0|Pinball: Sack Tap Through the Slime
dropdown|Vert goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.5.2 END ---

--- NEST 1.3.5 END ---

--- NEST 1.3.6 START: Rodney Mullen ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.6.1 START: CHALLENGES ---
tab-color|7

LIST|0|Rodney Mullen, Pro Skater
dropdown|250k+ combo with Rusty Slide Manual, as Rodney Mullen

--- TAB 1.3.6.1 END ---

--- TAB 1.3.6.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: Kickflip between the Generator Transfer
checklist-item|0|Canada: Nose Manual the Manual Transmission Gap
checklist-item|0|Suburbia: Impossible the Chainlink Gap
checklist-item|0|Airport: Double Heelflip the Mulin Gap
checklist-item|0|Los Angeles: Airwalk Over the Yellow Stone Shack
checklist-item|0|Cruise Ship: 540 Sal Flip Over the Planter
checklist-item|0|College: Tuck-knee Invert the Champions Banner
checklist-item|0|San Francisco: One Foot Tail Grab Over the Street
checklist-item|0|Alcatraz: Pop Shove-It Over the Crumbled Wall
checklist-item|0|Waterpark: Hardflip the Castle and Fountain Gap
checklist-item|0|Shipyard: Varial Heelflip the Shack Water Gap
checklist-item|0|London: Feeble Grind the Double Parked Car
checklist-item|0|Pinball: One Foot Invert the Mausoleum
dropdown|Freestyle goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.6.2 END ---

--- NEST 1.3.6 END ---

--- NEST 1.3.7 START: Andy Anderson ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.7.1 START: CHALLENGES ---
tab-color|7

LIST|0|Andy Anderson, Pro Skater
dropdown|250k+ combo with Carousel, as Andy Anderson

--- TAB 1.3.7.1 END ---

--- TAB 1.3.7.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: Kickflip between the Generator Transfer
checklist-item|0|Canada: Nose Manual the Manual Transmission Gap
checklist-item|0|Suburbia: Impossible the Chainlink Gap
checklist-item|0|Airport: Double Heelflip the Mulin Gap
checklist-item|0|Los Angeles: Airwalk Over the Yellow Stone Shack
checklist-item|0|Cruise Ship: 540 Sal Flip Over the Planter
checklist-item|0|College: Tuck-knee Invert the Champions Banner
checklist-item|0|San Francisco: One Foot Tail Grab Over the Street
checklist-item|0|Alcatraz: Pop Shove-It Over the Crumbled Wall
checklist-item|0|Waterpark: Hardflip the Castle and Fountain Gap
checklist-item|0|Shipyard: Varial Heelflip the Shack Water Gap
checklist-item|0|London: Feeble Grind the Double Parked Car
checklist-item|0|Pinball: One Foot Invert the Mausoleum
dropdown|Freestyle goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.7.2 END ---

--- NEST 1.3.7 END ---

--- NEST 1.3.8 START: Lizzie Armanto ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.8.1 START: CHALLENGES ---
tab-color|7

LIST|0|Lizzie Armanto, Pro Skater
dropdown|250k+ combo with Hoho, as Lizzie Armanto

--- TAB 1.3.8.1 END ---

--- TAB 1.3.8.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: Kickflip between the Generator Transfer
checklist-item|0|Canada: Nose Manual the Manual Transmission Gap
checklist-item|0|Suburbia: Impossible the Chainlink Gap
checklist-item|0|Airport: Double Heelflip the Mulin Gap
checklist-item|0|Los Angeles: Airwalk Over the Yellow Stone Shack
checklist-item|0|Cruise Ship: 540 Sal Flip Over the Planter
checklist-item|0|College: Tuck-knee Invert the Champions Banner
checklist-item|0|San Francisco: One Foot Tail Grab Over the Street
checklist-item|0|Alcatraz: Pop Shove-It Over the Crumbled Wall
checklist-item|0|Waterpark: Hardflip the Castle and Fountain Gap
checklist-item|0|Shipyard: Varial Heelflip the Shack Water Gap
checklist-item|0|London: Feeble Grind the Double Parked Car
checklist-item|0|Pinball: One Foot Invert the Mausoleum
dropdown|Park goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.8.2 END ---

--- NEST 1.3.8 END ---

--- NEST 1.3.9 START: Nora Vasconcellos ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.9.1 START: CHALLENGES ---
tab-color|7

LIST|0|Nora Vasconcellos, Pro Skater
dropdown|250k+ combo with Blunt Fingerflip Noseslide, as Nora Vasconcellos

--- TAB 1.3.9.1 END ---

--- TAB 1.3.9.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: Kickflip between the Generator Transfer
checklist-item|0|Canada: Nose Manual the Manual Transmission Gap
checklist-item|0|Suburbia: Impossible the Chainlink Gap
checklist-item|0|Airport: Double Heelflip the Mulin Gap
checklist-item|0|Los Angeles: Airwalk Over the Yellow Stone Shack
checklist-item|0|Cruise Ship: 540 Sal Flip Over the Planter
checklist-item|0|College: Tuck-knee Invert the Champions Banner
checklist-item|0|San Francisco: One Foot Tail Grab Over the Street
checklist-item|0|Alcatraz: Pop Shove-It Over the Crumbled Wall
checklist-item|0|Waterpark: Hardflip the Castle and Fountain Gap
checklist-item|0|Shipyard: Varial Heelflip the Shack Water Gap
checklist-item|0|London: Feeble Grind the Double Parked Car
checklist-item|0|Pinball: One Foot Invert the Mausoleum
dropdown|Park goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.9.2 END ---

--- NEST 1.3.9 END ---

--- NEST 1.3.10 START: Zion Wright ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.10.1 START: CHALLENGES ---
tab-color|7

LIST|0|Zion Wright, Pro Skater
dropdown|250k+ combo with Real Chill, as Zion Wright

--- TAB 1.3.10.1 END ---

--- TAB 1.3.10.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: Kickflip between the Generator Transfer
checklist-item|0|Canada: Nose Manual the Manual Transmission Gap
checklist-item|0|Suburbia: Impossible the Chainlink Gap
checklist-item|0|Airport: Double Heelflip the Mulin Gap
checklist-item|0|Los Angeles: Airwalk Over the Yellow Stone Shack
checklist-item|0|Cruise Ship: 540 Sal Flip Over the Planter
checklist-item|0|College: Tuck-knee Invert the Champions Banner
checklist-item|0|San Francisco: One Foot Tail Grab Over the Street
checklist-item|0|Alcatraz: Pop Shove-It Over the Crumbled Wall
checklist-item|0|Waterpark: Hardflip the Castle and Fountain Gap
checklist-item|0|Shipyard: Varial Heelflip the Shack Water Gap
checklist-item|0|London: Feeble Grind the Double Parked Car
checklist-item|0|Pinball: One Foot Invert the Mausoleum
dropdown|Park goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.10.2 END ---

--- NEST 1.3.10 END ---

--- NEST 1.3.11 START: Bam Margera ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.11.1 START: CHALLENGES ---
tab-color|7

LIST|0|Bam Margera, Pro Skater
dropdown|250k+ combo with 540 Whirlybird, as Bam Margera

--- TAB 1.3.11.1 END ---

--- TAB 1.3.11.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: Kickflip between the Generator Transfer
checklist-item|0|Canada: Nose Manual the Manual Transmission Gap
checklist-item|0|Suburbia: Impossible the Chainlink Gap
checklist-item|0|Airport: Double Heelflip the Mulin Gap
checklist-item|0|Los Angeles: Airwalk Over the Yellow Stone Shack
checklist-item|0|Cruise Ship: 540 Sal Flip Over the Planter
checklist-item|0|College: Tuck-knee Invert the Champions Banner
checklist-item|0|San Francisco: One Foot Tail Grab Over the Street
checklist-item|0|Alcatraz: Pop Shove-It Over the Crumbled Wall
checklist-item|0|Waterpark: Hardflip the Castle and Fountain Gap
checklist-item|0|Shipyard: Varial Heelflip the Shack Water Gap
checklist-item|0|London: Feeble Grind the Double Parked Car
checklist-item|0|Pinball: One Foot Invert the Mausoleum
dropdown|Park goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.11.2 END ---

--- NEST 1.3.11 END ---

--- NEST 1.3.12 START: Jamie Thomas ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.12.1 START: CHALLENGES ---
tab-color|7

LIST|0|Jamie Thomas, Pro Skater
dropdown|250k+ combo with 540 Flip, as Jamie Thomas

--- TAB 1.3.12.1 END ---

--- TAB 1.3.12.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: 50-50 TC's Rail
checklist-item|0|Canada: Nosegrind Around the Horn
checklist-item|0|Suburbia: Heelflip the Trailer Hop
checklist-item|0|Airport: Crooked Grind Around Baggage Claim
checklist-item|0|Los Angeles: Varial Kickflip the Tower Rails Gap
checklist-item|0|Cruise Ship: Noseblunt Slide an Awning
checklist-item|0|College: 5-0 Grind around the Flagpole
checklist-item|0|San Francisco: Tailslide the Waterside Railing
checklist-item|0|Alcatraz: Nosegrind the Foghorn Rail
checklist-item|0|Waterpark: Overcrook the Bowl Slide Pipe
checklist-item|0|Shipyard: Hardflip Off the Buoy
checklist-item|0|London: Monty or Smith Grind Around the Archway
checklist-item|0|Pinball: Bluntslide Out of the Swamp
dropdown|Street goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.12.2 END ---

--- NEST 1.3.12 END ---

--- NEST 1.3.13 START: Chad Muska ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.13.1 START: CHALLENGES ---
tab-color|7

LIST|0|Chad Muska, Pro Skater
dropdown|250k+ combo with Muska Nose Manual, as Chad Muska

--- TAB 1.3.13.1 END ---

--- TAB 1.3.13.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: 50-50 TC's Rail
checklist-item|0|Canada: Nosegrind Around the Horn
checklist-item|0|Suburbia: Heelflip the Trailer Hop
checklist-item|0|Airport: Crooked Grind Around Baggage Claim
checklist-item|0|Los Angeles: Varial Kickflip the Tower Rails Gap
checklist-item|0|Cruise Ship: Noseblunt Slide an Awning
checklist-item|0|College: 5-0 Grind around the Flagpole
checklist-item|0|San Francisco: Tailslide the Waterside Railing
checklist-item|0|Alcatraz: Nosegrind the Foghorn Rail
checklist-item|0|Waterpark: Overcrook the Bowl Slide Pipe
checklist-item|0|Shipyard: Hardflip Off the Buoy
checklist-item|0|London: Monty or Smith Grind Around the Archway
checklist-item|0|Pinball: Bluntslide Out of the Swamp
dropdown|Street goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.13.2 END ---

--- NEST 1.3.13 END ---

--- NEST 1.3.14 START: Elissa Steamer ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.14.1 START: CHALLENGES ---
tab-color|7

LIST|0|Elissa Steamer, Pro Skater
dropdown|250k+ combo with Indy Backflip, as Elissa Steamer

--- TAB 1.3.14.1 END ---

--- TAB 1.3.14.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: 50-50 TC's Rail
checklist-item|0|Canada: Nosegrind Around the Horn
checklist-item|0|Suburbia: Heelflip the Trailer Hop
checklist-item|0|Airport: Crooked Grind Around Baggage Claim
checklist-item|0|Los Angeles: Varial Kickflip the Tower Rails Gap
checklist-item|0|Cruise Ship: Noseblunt Slide an Awning
checklist-item|0|College: 5-0 Grind around the Flagpole
checklist-item|0|San Francisco: Tailslide the Waterside Railing
checklist-item|0|Alcatraz: Nosegrind the Foghorn Rail
checklist-item|0|Waterpark: Overcrook the Bowl Slide Pipe
checklist-item|0|Shipyard: Hardflip Off the Buoy
checklist-item|0|London: Monty or Smith Grind Around the Archway
checklist-item|0|Pinball: Bluntslide Out of the Swamp
dropdown|Street goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.14.2 END ---

--- NEST 1.3.14 END ---

--- NEST 1.3.15 START: Eric Koston ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.15.1 START: CHALLENGES ---
tab-color|7

LIST|0|Eric Koston, Pro Skater
dropdown|250k+ combo with Fandangle, as Eric Koston

--- TAB 1.3.15.1 END ---

--- TAB 1.3.15.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: 50-50 TC's Rail
checklist-item|0|Canada: Nosegrind Around the Horn
checklist-item|0|Suburbia: Heelflip the Trailer Hop
checklist-item|0|Airport: Crooked Grind Around Baggage Claim
checklist-item|0|Los Angeles: Varial Kickflip the Tower Rails Gap
checklist-item|0|Cruise Ship: Noseblunt Slide an Awning
checklist-item|0|College: 5-0 Grind around the Flagpole
checklist-item|0|San Francisco: Tailslide the Waterside Railing
checklist-item|0|Alcatraz: Nosegrind the Foghorn Rail
checklist-item|0|Waterpark: Overcrook the Bowl Slide Pipe
checklist-item|0|Shipyard: Hardflip Off the Buoy
checklist-item|0|London: Monty or Smith Grind Around the Archway
checklist-item|0|Pinball: Bluntslide Out of the Swamp
dropdown|Street goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.15.2 END ---

--- NEST 1.3.15 END ---

--- NEST 1.3.16 START: Geoff Rowley ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.16.1 START: CHALLENGES ---
tab-color|7

LIST|0|Geoff Rowley, Pro Skater
dropdown|250k+ combo with Rowley Darkslide, as Geoff Rowley

--- TAB 1.3.16.1 END ---

--- TAB 1.3.16.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: 50-50 TC's Rail
checklist-item|0|Canada: Nosegrind Around the Horn
checklist-item|0|Suburbia: Heelflip the Trailer Hop
checklist-item|0|Airport: Crooked Grind Around Baggage Claim
checklist-item|0|Los Angeles: Varial Kickflip the Tower Rails Gap
checklist-item|0|Cruise Ship: Noseblunt Slide an Awning
checklist-item|0|College: 5-0 Grind around the Flagpole
checklist-item|0|San Francisco: Tailslide the Waterside Railing
checklist-item|0|Alcatraz: Nosegrind the Foghorn Rail
checklist-item|0|Waterpark: Overcrook the Bowl Slide Pipe
checklist-item|0|Shipyard: Hardflip Off the Buoy
checklist-item|0|London: Monty or Smith Grind Around the Archway
checklist-item|0|Pinball: Bluntslide Out of the Swamp
dropdown|Street goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.16.2 END ---

--- NEST 1.3.16 END ---

--- NEST 1.3.17 START: Kareem Campbell ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.17.1 START: CHALLENGES ---
tab-color|7

LIST|0|Kareem Campbell, Pro Skater
dropdown|250k+ combo with Ghetto Bird, as Kareem Campbell

--- TAB 1.3.17.1 END ---

--- TAB 1.3.17.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: 50-50 TC's Rail
checklist-item|0|Canada: Nosegrind Around the Horn
checklist-item|0|Suburbia: Heelflip the Trailer Hop
checklist-item|0|Airport: Crooked Grind Around Baggage Claim
checklist-item|0|Los Angeles: Varial Kickflip the Tower Rails Gap
checklist-item|0|Cruise Ship: Noseblunt Slide an Awning
checklist-item|0|College: 5-0 Grind around the Flagpole
checklist-item|0|San Francisco: Tailslide the Waterside Railing
checklist-item|0|Alcatraz: Nosegrind the Foghorn Rail
checklist-item|0|Waterpark: Overcrook the Bowl Slide Pipe
checklist-item|0|Shipyard: Hardflip Off the Buoy
checklist-item|0|London: Monty or Smith Grind Around the Archway
checklist-item|0|Pinball: Bluntslide Out of the Swamp
dropdown|Street goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.17.2 END ---

--- NEST 1.3.17 END ---

--- NEST 1.3.18 START: Andrew Reynolds ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.18.1 START: CHALLENGES ---
tab-color|7

LIST|0|Andrew Reynolds, Pro Skater
dropdown|250k+ combo with Quad Heelflip, as Andrew Reynolds

--- TAB 1.3.18.1 END ---

--- TAB 1.3.18.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: 50-50 TC's Rail
checklist-item|0|Canada: Nosegrind Around the Horn
checklist-item|0|Suburbia: Heelflip the Trailer Hop
checklist-item|0|Airport: Crooked Grind Around Baggage Claim
checklist-item|0|Los Angeles: Varial Kickflip the Tower Rails Gap
checklist-item|0|Cruise Ship: Noseblunt Slide an Awning
checklist-item|0|College: 5-0 Grind around the Flagpole
checklist-item|0|San Francisco: Tailslide the Waterside Railing
checklist-item|0|Alcatraz: Nosegrind the Foghorn Rail
checklist-item|0|Waterpark: Overcrook the Bowl Slide Pipe
checklist-item|0|Shipyard: Hardflip Off the Buoy
checklist-item|0|London: Monty or Smith Grind Around the Archway
checklist-item|0|Pinball: Bluntslide Out of the Swamp
dropdown|Street goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.18.2 END ---

--- NEST 1.3.18 END ---

--- NEST 1.3.19 START: Aori Nishimura ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.19.1 START: CHALLENGES ---
tab-color|7

LIST|0|Aori Nishimura, Pro Skater
dropdown|250k+ combo with Hardflip BS Nose Pick, as Aori Nishimura

--- TAB 1.3.19.1 END ---

--- TAB 1.3.19.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: 50-50 TC's Rail
checklist-item|0|Canada: Nosegrind Around the Horn
checklist-item|0|Suburbia: Heelflip the Trailer Hop
checklist-item|0|Airport: Crooked Grind Around Baggage Claim
checklist-item|0|Los Angeles: Varial Kickflip the Tower Rails Gap
checklist-item|0|Cruise Ship: Noseblunt Slide an Awning
checklist-item|0|College: 5-0 Grind around the Flagpole
checklist-item|0|San Francisco: Tailslide the Waterside Railing
checklist-item|0|Alcatraz: Nosegrind the Foghorn Rail
checklist-item|0|Waterpark: Overcrook the Bowl Slide Pipe
checklist-item|0|Shipyard: Hardflip Off the Buoy
checklist-item|0|London: Monty or Smith Grind Around the Archway
checklist-item|0|Pinball: Bluntslide Out of the Swamp
dropdown|Street goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.19.2 END ---

--- NEST 1.3.19 END ---

--- NEST 1.3.20 START: Leo Baker ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.20.1 START: CHALLENGES ---
tab-color|7

LIST|0|Leo Baker, Pro Skater
dropdown|250k+ combo with Nose Manual Nollie Inward Heel, as Leo Baker

--- TAB 1.3.20.1 END ---

--- TAB 1.3.20.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: 50-50 TC's Rail
checklist-item|0|Canada: Nosegrind Around the Horn
checklist-item|0|Suburbia: Heelflip the Trailer Hop
checklist-item|0|Airport: Crooked Grind Around Baggage Claim
checklist-item|0|Los Angeles: Varial Kickflip the Tower Rails Gap
checklist-item|0|Cruise Ship: Noseblunt Slide an Awning
checklist-item|0|College: 5-0 Grind around the Flagpole
checklist-item|0|San Francisco: Tailslide the Waterside Railing
checklist-item|0|Alcatraz: Nosegrind the Foghorn Rail
checklist-item|0|Waterpark: Overcrook the Bowl Slide Pipe
checklist-item|0|Shipyard: Hardflip Off the Buoy
checklist-item|0|London: Monty or Smith Grind Around the Archway
checklist-item|0|Pinball: Bluntslide Out of the Swamp
dropdown|Street goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.20.2 END ---

--- NEST 1.3.20 END ---

--- NEST 1.3.21 START: Leticia Bufoni ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.21.1 START: CHALLENGES ---
tab-color|7

LIST|0|Leticia Bufoni, Pro Skater
dropdown|250k+ combo with Cab Flip, as Leticia Bufoni

--- TAB 1.3.21.1 END ---

--- TAB 1.3.21.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: 50-50 TC's Rail
checklist-item|0|Canada: Nosegrind Around the Horn
checklist-item|0|Suburbia: Heelflip the Trailer Hop
checklist-item|0|Airport: Crooked Grind Around Baggage Claim
checklist-item|0|Los Angeles: Varial Kickflip the Tower Rails Gap
checklist-item|0|Cruise Ship: Noseblunt Slide an Awning
checklist-item|0|College: 5-0 Grind around the Flagpole
checklist-item|0|San Francisco: Tailslide the Waterside Railing
checklist-item|0|Alcatraz: Nosegrind the Foghorn Rail
checklist-item|0|Waterpark: Overcrook the Bowl Slide Pipe
checklist-item|0|Shipyard: Hardflip Off the Buoy
checklist-item|0|London: Monty or Smith Grind Around the Archway
checklist-item|0|Pinball: Bluntslide Out of the Swamp
dropdown|Street goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.21.2 END ---

--- NEST 1.3.21 END ---

--- NEST 1.3.22 START: Nyjah Huston ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.22.1 START: CHALLENGES ---
tab-color|7

LIST|0|Nyjah Huston, Pro Skater
dropdown|250k+ combo with Cab Flip FS Boardslide, as Nyjah Huston

--- TAB 1.3.22.1 END ---

--- TAB 1.3.22.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: 50-50 TC's Rail
checklist-item|0|Canada: Nosegrind Around the Horn
checklist-item|0|Suburbia: Heelflip the Trailer Hop
checklist-item|0|Airport: Crooked Grind Around Baggage Claim
checklist-item|0|Los Angeles: Varial Kickflip the Tower Rails Gap
checklist-item|0|Cruise Ship: Noseblunt Slide an Awning
checklist-item|0|College: 5-0 Grind around the Flagpole
checklist-item|0|San Francisco: Tailslide the Waterside Railing
checklist-item|0|Alcatraz: Nosegrind the Foghorn Rail
checklist-item|0|Waterpark: Overcrook the Bowl Slide Pipe
checklist-item|0|Shipyard: Hardflip Off the Buoy
checklist-item|0|London: Monty or Smith Grind Around the Archway
checklist-item|0|Pinball: Bluntslide Out of the Swamp
dropdown|Street goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.22.2 END ---

--- NEST 1.3.22 END ---

--- NEST 1.3.23 START: Riley Hawk ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.23.1 START: CHALLENGES ---
tab-color|7

LIST|0|Riley Hawk, Pro Skater
dropdown|250k+ combo with Hardflip Crail, as Riley Hawk

--- TAB 1.3.23.1 END ---

--- TAB 1.3.23.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: 50-50 TC's Rail
checklist-item|0|Canada: Nosegrind Around the Horn
checklist-item|0|Suburbia: Heelflip the Trailer Hop
checklist-item|0|Airport: Crooked Grind Around Baggage Claim
checklist-item|0|Los Angeles: Varial Kickflip the Tower Rails Gap
checklist-item|0|Cruise Ship: Noseblunt Slide an Awning
checklist-item|0|College: 5-0 Grind around the Flagpole
checklist-item|0|San Francisco: Tailslide the Waterside Railing
checklist-item|0|Alcatraz: Nosegrind the Foghorn Rail
checklist-item|0|Waterpark: Overcrook the Bowl Slide Pipe
checklist-item|0|Shipyard: Hardflip Off the Buoy
checklist-item|0|London: Monty or Smith Grind Around the Archway
checklist-item|0|Pinball: Bluntslide Out of the Swamp
dropdown|Street goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.23.2 END ---

--- NEST 1.3.23 END ---

--- NEST 1.3.24 START: Shane O'Neill ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.24.1 START: CHALLENGES ---
tab-color|7

LIST|0|Shane O'Neill, Pro Skater
dropdown|250k+ combo with 360 Double Flip, as Shane O'Neill

--- TAB 1.3.24.1 END ---

--- TAB 1.3.24.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: 50-50 TC's Rail
checklist-item|0|Canada: Nosegrind Around the Horn
checklist-item|0|Suburbia: Heelflip the Trailer Hop
checklist-item|0|Airport: Crooked Grind Around Baggage Claim
checklist-item|0|Los Angeles: Varial Kickflip the Tower Rails Gap
checklist-item|0|Cruise Ship: Noseblunt Slide an Awning
checklist-item|0|College: 5-0 Grind around the Flagpole
checklist-item|0|San Francisco: Tailslide the Waterside Railing
checklist-item|0|Alcatraz: Nosegrind the Foghorn Rail
checklist-item|0|Waterpark: Overcrook the Bowl Slide Pipe
checklist-item|0|Shipyard: Hardflip Off the Buoy
checklist-item|0|London: Monty or Smith Grind Around the Archway
checklist-item|0|Pinball: Bluntslide Out of the Swamp
dropdown|Street goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.24.2 END ---

--- NEST 1.3.24 END ---

--- NEST 1.3.25 START: Tyshawn Jones ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.25.1 START: CHALLENGES ---
tab-color|7

LIST|0|Tyshawn Jones, Pro Skater
dropdown|250k+ combo with Kickflip So Good, as Tyshawn Jones

--- TAB 1.3.25.1 END ---

--- TAB 1.3.25.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: 50-50 TC's Rail
checklist-item|0|Canada: Nosegrind Around the Horn
checklist-item|0|Suburbia: Heelflip the Trailer Hop
checklist-item|0|Airport: Crooked Grind Around Baggage Claim
checklist-item|0|Los Angeles: Varial Kickflip the Tower Rails Gap
checklist-item|0|Cruise Ship: Noseblunt Slide an Awning
checklist-item|0|College: 5-0 Grind around the Flagpole
checklist-item|0|San Francisco: Tailslide the Waterside Railing
checklist-item|0|Alcatraz: Nosegrind the Foghorn Rail
checklist-item|0|Waterpark: Overcrook the Bowl Slide Pipe
checklist-item|0|Shipyard: Hardflip Off the Buoy
checklist-item|0|London: Monty or Smith Grind Around the Archway
checklist-item|0|Pinball: Bluntslide Out of the Swamp
dropdown|Street goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.25.2 END ---

--- NEST 1.3.25 END ---

--- NEST 1.3.26 START: Jamie Foy ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.26.1 START: CHALLENGES ---
tab-color|7

LIST|0|Jamie Foy, Pro Skater
dropdown|250k+ combo with Nova Balance, as Jamie Foy

--- TAB 1.3.26.1 END ---

--- TAB 1.3.26.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: 50-50 TC's Rail
checklist-item|0|Canada: Nosegrind Around the Horn
checklist-item|0|Suburbia: Heelflip the Trailer Hop
checklist-item|0|Airport: Crooked Grind Around Baggage Claim
checklist-item|0|Los Angeles: Varial Kickflip the Tower Rails Gap
checklist-item|0|Cruise Ship: Noseblunt Slide an Awning
checklist-item|0|College: 5-0 Grind around the Flagpole
checklist-item|0|San Francisco: Tailslide the Waterside Railing
checklist-item|0|Alcatraz: Nosegrind the Foghorn Rail
checklist-item|0|Waterpark: Overcrook the Bowl Slide Pipe
checklist-item|0|Shipyard: Hardflip Off the Buoy
checklist-item|0|London: Monty or Smith Grind Around the Archway
checklist-item|0|Pinball: Bluntslide Out of the Swamp
dropdown|Street goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.26.2 END ---

--- NEST 1.3.26 END ---

--- NEST 1.3.27 START: Yuto Horigome ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.27.1 START: CHALLENGES ---
tab-color|7

LIST|0|Yuto Horigome, Pro Skater
dropdown|250k+ combo with Yutornado, as Yuto Horigome

--- TAB 1.3.27.1 END ---

--- TAB 1.3.27.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: 50-50 TC's Rail
checklist-item|0|Canada: Nosegrind Around the Horn
checklist-item|0|Suburbia: Heelflip the Trailer Hop
checklist-item|0|Airport: Crooked Grind Around Baggage Claim
checklist-item|0|Los Angeles: Varial Kickflip the Tower Rails Gap
checklist-item|0|Cruise Ship: Noseblunt Slide an Awning
checklist-item|0|College: 5-0 Grind around the Flagpole
checklist-item|0|San Francisco: Tailslide the Waterside Railing
checklist-item|0|Alcatraz: Nosegrind the Foghorn Rail
checklist-item|0|Waterpark: Overcrook the Bowl Slide Pipe
checklist-item|0|Shipyard: Hardflip Off the Buoy
checklist-item|0|London: Monty or Smith Grind Around the Archway
checklist-item|0|Pinball: Bluntslide Out of the Swamp
dropdown|Street goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.27.2 END ---

--- NEST 1.3.27 END ---

--- NEST 1.3.28 START: Chloe Covell ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.28.1 START: CHALLENGES ---
tab-color|7

LIST|0|Chloe Covell, Pro Skater
dropdown|250k+ combo with Kickflip 180 Nosegrind, as Chloe Covell

--- TAB 1.3.28.1 END ---

--- TAB 1.3.28.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: 50-50 TC's Rail
checklist-item|0|Canada: Nosegrind Around the Horn
checklist-item|0|Suburbia: Heelflip the Trailer Hop
checklist-item|0|Airport: Crooked Grind Around Baggage Claim
checklist-item|0|Los Angeles: Varial Kickflip the Tower Rails Gap
checklist-item|0|Cruise Ship: Noseblunt Slide an Awning
checklist-item|0|College: 5-0 Grind around the Flagpole
checklist-item|0|San Francisco: Tailslide the Waterside Railing
checklist-item|0|Alcatraz: Nosegrind the Foghorn Rail
checklist-item|0|Waterpark: Overcrook the Bowl Slide Pipe
checklist-item|0|Shipyard: Hardflip Off the Buoy
checklist-item|0|London: Monty or Smith Grind Around the Archway
checklist-item|0|Pinball: Bluntslide Out of the Swamp
dropdown|Street goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.28.2 END ---

--- NEST 1.3.28 END ---

--- NEST 1.3.29 START: Rayssa Leal ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.29.1 START: CHALLENGES ---
tab-color|7

LIST|0|Rayssa Leal, Pro Skater
dropdown|250k+ combo with Blunt Shove-It Bluntslide, as Rayssa Leal

--- TAB 1.3.29.1 END ---

--- TAB 1.3.29.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: 50-50 TC's Rail
checklist-item|0|Canada: Nosegrind Around the Horn
checklist-item|0|Suburbia: Heelflip the Trailer Hop
checklist-item|0|Airport: Crooked Grind Around Baggage Claim
checklist-item|0|Los Angeles: Varial Kickflip the Tower Rails Gap
checklist-item|0|Cruise Ship: Noseblunt Slide an Awning
checklist-item|0|College: 5-0 Grind around the Flagpole
checklist-item|0|San Francisco: Tailslide the Waterside Railing
checklist-item|0|Alcatraz: Nosegrind the Foghorn Rail
checklist-item|0|Waterpark: Overcrook the Bowl Slide Pipe
checklist-item|0|Shipyard: Hardflip Off the Buoy
checklist-item|0|London: Monty or Smith Grind Around the Archway
checklist-item|0|Pinball: Bluntslide Out of the Swamp
dropdown|Street goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.29.2 END ---

--- NEST 1.3.29 END ---

--- NEST 1.3.30 START: Margielyn Didal ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.30.1 START: CHALLENGES ---
tab-color|7

LIST|0|Margielyn Didal, Pro Skater
dropdown|250k+ combo with Late Backfoot Heelflip, as Margielyn Didal

--- TAB 1.3.30.1 END ---

--- TAB 1.3.30.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: 50-50 TC's Rail
checklist-item|0|Canada: Nosegrind Around the Horn
checklist-item|0|Suburbia: Heelflip the Trailer Hop
checklist-item|0|Airport: Crooked Grind Around Baggage Claim
checklist-item|0|Los Angeles: Varial Kickflip the Tower Rails Gap
checklist-item|0|Cruise Ship: Noseblunt Slide an Awning
checklist-item|0|College: 5-0 Grind around the Flagpole
checklist-item|0|San Francisco: Tailslide the Waterside Railing
checklist-item|0|Alcatraz: Nosegrind the Foghorn Rail
checklist-item|0|Waterpark: Overcrook the Bowl Slide Pipe
checklist-item|0|Shipyard: Hardflip Off the Buoy
checklist-item|0|London: Monty or Smith Grind Around the Archway
checklist-item|0|Pinball: Bluntslide Out of the Swamp
dropdown|Street goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.30.2 END ---

--- NEST 1.3.30 END ---

--- NEST 1.3.31 START: Aurelien Giraud ---
nest-color|GRAY
nest-auto-sort|0
nest-show-summary|0
nest-summary-child-progress|0
nest-summary-mode|0

--- TAB 1.3.31.1 START: CHALLENGES ---
tab-color|7

LIST|0|Aurelien Giraud, Pro Skater
dropdown|250k+ combo with Hardflip Late Pressure Flip, as Aurelien Giraud

--- TAB 1.3.31.1 END ---

--- TAB 1.3.31.2 START: SOLO TOUR ---
tab-color|4

CHECKLIST|Solo Tour
checklist-item|0|Foundry: 50-50 TC's Rail
checklist-item|0|Canada: Nosegrind Around the Horn
checklist-item|0|Suburbia: Heelflip the Trailer Hop
checklist-item|0|Airport: Crooked Grind Around Baggage Claim
checklist-item|0|Los Angeles: Varial Kickflip the Tower Rails Gap
checklist-item|0|Cruise Ship: Noseblunt Slide an Awning
checklist-item|0|College: 5-0 Grind around the Flagpole
checklist-item|0|San Francisco: Tailslide the Waterside Railing
checklist-item|0|Alcatraz: Nosegrind the Foghorn Rail
checklist-item|0|Waterpark: Overcrook the Bowl Slide Pipe
checklist-item|0|Shipyard: Hardflip Off the Buoy
checklist-item|0|London: Monty or Smith Grind Around the Archway
checklist-item|0|Pinball: Bluntslide Out of the Swamp
dropdown|Street goals. Opens after career mode. Every tour: Flying Solo trophy

--- TAB 1.3.31.2 END ---

--- NEST 1.3.31 END ---

--- TAB 1.3 END ---

--- TAB 1.4 START: COLLECTIBLES ---
tab-color|6

CHECKLIST|Panda Plushies
checklist-item|0|Foundry: back left corner, quarter pipe up onto a raised platform
checklist-item|0|Canada: by the tree on a raised platform, past the start ramp
checklist-item|0|Rio: across the road, left corner of the small fountain patio
checklist-item|0|Suburbia: behind the spooky house: left-wall quarter pipe, grind the top
checklist-item|0|Airport: top of the narrow Tokyo quarter pipe at the far end
checklist-item|0|Skater Island: outside left of the beach, behind the small boat
checklist-item|0|Los Angeles: inside the grated quarter pipes near the start, once open
checklist-item|0|Tokyo: drop off the ramp's right edge to a ledge, turn around
checklist-item|0|Cruise Ship: covered area on the right, grind rails to a planter box
checklist-item|0|College: upper car park: grind the wire, hop the purple rail to the roof
checklist-item|0|San Francisco: roof of the big building by the pier (quarter pipes)
checklist-item|0|Movie Studio: silver quarter pipe to the upper bowl, grind toward scaffolding
checklist-item|0|Alcatraz: small platform by the water tower's wire
checklist-item|0|Waterpark: drop from the bucket ramp's top right corner to a ledge
checklist-item|0|Kona: behind a dumpster past the large half pipe
checklist-item|0|Shipyard: Rooftops vent, then quarter pipe to a nearby platform
checklist-item|0|London: car park past the arch, against the right-hand wall
checklist-item|0|Zoo: far right corner: quarter pipes, then grind the wall top
checklist-item|0|Pinball: past the first launch pad, wallride left up the black structure
dropdown|One per level. All of them unlock Constable Richard in the Secrets Shop

PROGRESS|0/50|Stat Points
dropdown|Shared by every skater. 25 per tour, none in Cruise Ship or Pinball. Trophy: Final Form

--- TAB 1.4 END ---

--- TAB 1.5 START: CHALLENGES ---
tab-color|7

DIVIDER|GENERAL

LIST|0|New Challenger
dropdown|Create a skater in Create-A-Skater

LIST|0|Fresh Dipped
dropdown|Edit a created skater's clothes in Appearance

LIST|0|The World is Yours
dropdown|Save a new park to your collection

PROGRESS|0/25|Watch Out Now
dropdown|Place 25 props or dynamic props in Create-a-Park

PROGRESS|0/100|One Hundred
dropdown|Place 100 objects in Create-a-Park

PROGRESS|0/5|World Tourist
dropdown|Play in 5 parks made by other players

LIST|0|The Player, Pro Skater
dropdown|100k+ combo with fewer than 10 tricks, any skater

DIVIDER|THPS3

LIST|0|Rollin' Around
dropdown|Foundry: Roll-In Hop + Round the Bend gaps, one combo

LIST|0|Manuahhhl
dropdown|Canada: Manual Transmission + Ahhh! My Head! gaps, one combo

LIST|0|Bridge is Over
dropdown|Rio: 2-Wheeled Whoopty + Take It To Da Bridge gaps, one combo

LIST|0|Brick by Brick
dropdown|Suburbia: On Site Construction, Chainlink, Wall Hoppin' gaps, one combo

LIST|0|TSA Pre-Check
dropdown|Airport: Walkway Ride + 0 the S gaps, one combo

LIST|0|Smoldering!
dropdown|Skater Island: Flame Transfer + A Burning Sensation gaps, one combo

LIST|0|Map Ref. 41°N93°W
dropdown|Los Angeles: 4 Wire gaps in one combo

LIST|0|Winter Hotpot
dropdown|Tokyo: Shabu Shabu + Chanko Nabe gaps, one combo

LIST|0|Foundry Par
dropdown|Foundry speedrun under 3:00

LIST|0|Canada Par
dropdown|Canada speedrun under 2:50

LIST|0|Suburbia Par
dropdown|Suburbia speedrun under 3:30

LIST|0|Airport Par
dropdown|Airport speedrun under 4:15

LIST|0|Los Angeles Par
dropdown|Los Angeles speedrun under 3:45

LIST|0|You Found It
dropdown|Skater Island: Lip trick off the How's You Find That? gap

LIST|0|Road to Nowhere
dropdown|Los Angeles: Grab trick off the Overpass Aftershock gap

LIST|0|To Die For
dropdown|Tokyo: Grind trick off the Fugu gap

LIST|0|Supervised
dropdown|Foundry: Lip trick off the Catwalk Tight Lip gap

LIST|0|Good One, Young Buck
dropdown|Canada: Flip trick off the Buck Wild gap

LIST|0|Clube da Esquina
dropdown|Rio: Grind trick on the Corner Stomp gap

LIST|0|Who's Out There?
dropdown|Suburbia: Grab trick off the Ding Dong Ditch Transfer gap

LIST|0|Layover, the Musical!
dropdown|Airport: Flatland trick on the Musical Chairs gap

CHECKLIST|Gap Tourist
checklist-item|0|Foundry Gaps
checklist-item|0|Canada Gaps
checklist-item|0|Rio Gaps
checklist-item|0|Suburbia Gaps
checklist-item|0|Airport Gaps
checklist-item|0|Skater Island Gaps
checklist-item|0|Los Angeles Gaps
checklist-item|0|Tokyo Gaps
dropdown|Each: land a trick off every gap in that park. All of them: Gap Tourist

LIST|0|THPS Tour Complete
dropdown|Every THPS3 goal and every competition medal. Unlocks THPS3 Classic

DIVIDER|THPS4

LIST|0|Gap Year
dropdown|College: Clock Tower + Coliseum Transfer gaps, one combo

LIST|0|Over the Top
dropdown|San Francisco: Over the Walkway + TC's Roof gaps, one combo

LIST|0|Movie Time!
dropdown|Movie Studio: the 3 Lights, Camera, Action gaps, one combo

LIST|0|Get Up to Get Down
dropdown|Alcatraz: Skylight-2-Skylight + Down The Hatch gaps, one combo

LIST|0|Where? There?
dropdown|Waterpark: Out of Nowhere + Over Here gaps, one combo

LIST|0|Western Blue Line
dropdown|Kona: all 4 Blue Line gaps in one combo

LIST|0|Infrastructure Gaps
dropdown|Shipyard: Ledge 2 Ledge, Ledge 2 Rail, Rail 2 Rail gaps

LIST|0|Mega Mega
dropdown|London: 'Round the Arches + Shell Mega Wire gaps, one combo

LIST|0|Sezaru?
dropdown|Zoo: Speak, Hear and See No Evil gaps, one combo

LIST|0|College Par
dropdown|College speedrun under 3:30

LIST|0|San Francisco Par
dropdown|San Francisco speedrun under 4:00

LIST|0|Alcatraz Par
dropdown|Alcatraz speedrun under 3:30

LIST|0|Shipyard Par
dropdown|Shipyard speedrun under 4:35

LIST|0|London Par
dropdown|London speedrun under 6:00

LIST|0|Waterpark Par
dropdown|Waterpark speedrun under 4:45

LIST|0|Coffee for Professor Benedict
dropdown|College: Grind trick off the Get Roasted! gap

LIST|0|Men at Work
dropdown|San Francisco: Flip trick off the Mechanic Pop gap

LIST|0|Mysterious Stroud
dropdown|Alcatraz: Grab trick off the Broken Walk gap

LIST|0|Over the Hut
dropdown|Kona: Flip trick over the Big Hut gap

LIST|0|QP QT
dropdown|Shipyard: Grab trick off the Conveyor QP Transfer gap

LIST|0|Top o' the Evening
dropdown|London: Grind trick off the Top o' the Gallery gap

LIST|0|Elephants Rock!
dropdown|Zoo: Grab trick off the Over the Elephant Rock gap

LIST|0|Save Stompy!
dropdown|Waterpark: Lip trick on the Last Splash gap

LIST|0|Trained Professional
dropdown|Movie Studio: Grab trick off the Stunt Double, Please? gap

CHECKLIST|Gap Traveller
checklist-item|0|College Gaps
checklist-item|0|San Francisco Gaps
checklist-item|0|Movie Studio Gaps
checklist-item|0|Alcatraz Gaps
checklist-item|0|Waterpark Gaps
checklist-item|0|Kona Gaps
checklist-item|0|Shipyard Gaps
checklist-item|0|London Gaps
checklist-item|0|Zoo Gaps
dropdown|Each: land a trick off every gap in that park. All of them: Gap Traveller

LIST|0|THPS4 Tour Complete
dropdown|Every THPS4 goal and every competition medal

DIVIDER|EXPERT 1

CHECKLIST|THPS3 Speedruns
checklist-item|0|Foundry Hard (1:45)
checklist-item|0|Canada Hard (1:40)
checklist-item|0|Suburbia Hard (2:15)
checklist-item|0|Airport Hard (2:50)
checklist-item|0|Los Angeles Hard (2:30)
checklist-item|0|Cruise Ship Hard (3:00)
dropdown|Each: finish that speedrun within the time

CHECKLIST|THPS4 Speedruns
checklist-item|0|College Hard (2:30)
checklist-item|0|San Francisco Hard (2:45)
checklist-item|0|Alcatraz Hard (2:20)
checklist-item|0|Shipyard Hard (3:00)
checklist-item|0|London Hard (4:45)
checklist-item|0|Waterpark Hard (3:15)
checklist-item|0|Pinball Hard (3:00)
dropdown|Each: finish that speedrun within the time

CHECKLIST|THPS3 Legend
checklist-item|0|Foundry (2,600,000)
checklist-item|0|Canada (2,250,000)
checklist-item|0|Rio (2,150,000)
checklist-item|0|Suburbia (2,400,000)
checklist-item|0|Airport (2,100,000)
checklist-item|0|Skater Island (2,050,000)
checklist-item|0|Los Angeles (2,150,000)
checklist-item|0|Tokyo (2,000,000)
checklist-item|0|Cruise Ship (2,300,000)
dropdown|Each: that score in a 2-minute run or one combo

CHECKLIST|THPS4 Legend
checklist-item|0|College (2,000,000)
checklist-item|0|San Francisco (2,450,000)
checklist-item|0|Movie Studio (2,150,000)
checklist-item|0|Alcatraz (2,100,000)
checklist-item|0|Waterpark (2,000,000)
checklist-item|0|Kona (2,300,000)
checklist-item|0|Shipyard (3,000,000)
checklist-item|0|London (2,350,000)
checklist-item|0|Zoo (2,200,000)
checklist-item|0|Pinball (2,200,000)
dropdown|Each: that score in a 2-minute run or one combo

DIVIDER|EXPERT 2

CHECKLIST|THPS3 Hard Gap Combos
checklist-item|0|6-Piece Chicken: Foundry, 600k via Deep Fried Transfer
checklist-item|0|Unless?: Canada, 1M via We Don't Need No Steeenking Rails
checklist-item|0|Tunnel Vision: Rio, 1.2M via Tunnel Gap
checklist-item|0|True Skillz: Suburbia, 1.4M via Whose House? Skillz House!
checklist-item|0|Carry On: Airport, 1.5M via X-Ray Gap
checklist-item|0|Jolliest Rodger: Skater Island, 1.6M via Skull N' Bones
checklist-item|0|Fresh: Los Angeles, 1.7M via Squeaky Clean
checklist-item|0|Hungry Bug: Tokyo, 1.8M via Gyoza Gap
checklist-item|0|True Captain: Cruise Ship, 1.9M via Captain's Gap
dropdown|Each: a combo of that size that includes the named gap

CHECKLIST|THPS4 Hard Gap Combos
checklist-item|0|Higher Ed: College, 800k via Masters in Engineering Lip
checklist-item|0|Green Thumb: San Francisco, 1.1M via Into the Bowl
checklist-item|0|Boarding Pass: Alcatraz, 1.3M via Ferry Transfer
checklist-item|0|Ride the Snake: Kona, 1.7M via Snake-Head 2 Tail!
checklist-item|0|Battle Barge: Shipyard, 1.8M via More Barge Fun
checklist-item|0|Stiff Upper Lip: London, 1.9M via Admiralty Gap
checklist-item|0|Driving Me Apes-Ma: Zoo, 1.9M via You Drive Me Ape!
checklist-item|0|Dry Docked: Waterpark, 1.5M via Morning Captain!
checklist-item|0|Hot Butter: Movie Studio, 1.2M via Popcorn!
checklist-item|0|Flip Out: Pinball, 2M via Flipper Jump
dropdown|Each: a combo of that size that includes the named gap

LIST|0|Magnificent
dropdown|Land any combo over 1,000,000

LIST|0|Unprecedented
dropdown|10,000,000 points in any single park

LIST|0|Brave
dropdown|1,000,000 combo that includes skitching

LIST|0|Reckless
dropdown|2,000,000 combo skitching 2+ vehicles

LIST|0|Cruise Ship Par
dropdown|Cruise Ship speedrun under 4:30

LIST|0|Sir Duke
dropdown|Cruise Ship: Grab off the Blind Faith!! gap

LIST|0|Let it Slide
dropdown|Cruise Ship: 3 manual-slide gaps in one combo

LIST|0|Cruise Ship Gaps
dropdown|Land a trick off every gap in Cruise Ship

LIST|0|Pinball Par
dropdown|Pinball speedrun under 5:00

LIST|0|Down the Hatch
dropdown|Pinball: Grab off the Acid Slime Drop gap

LIST|0|Kill the Brain, Kill the Ghoul
dropdown|Pinball: Brain + Ghoul gaps in one combo

LIST|0|Pinball Gaps
dropdown|Land a trick off every gap in Pinball

--- TAB 1.5 END ---

--- TAB 1.6 START: EXTRAS ---
tab-color|2

DIVIDER|SECRET SKATERS

LIST|0|Andy Anderson
dropdown|Secrets Shop, $5,000

LIST|0|Bam Margera
dropdown|Secrets Shop, $5,000

LIST|0|Michelangelo
dropdown|Secrets Shop, $10,000

LIST|0|Constable Richard
dropdown|Find every Panda Plushie, then Secrets Shop, $5,000

LIST|0|Birdman
dropdown|Do 'Wallplant the Multiball Targets' (Pinball), then Strange Feathers, $5,000

DIVIDER|TROPHIES

CHECKLIST|Trophies
checklist-item|0|I am the Pro Skater now
checklist-item|0|OBMOC
checklist-item|0|You Look Like Tony Hawk
checklist-item|0|That Was a Nice One
checklist-item|0|There's More?
checklist-item|0|The Solo Acts Begin
checklist-item|0|Flying Solo
checklist-item|0|Ok NOW You're Ready for the Skate Shop
checklist-item|0|In It for the Long Haul
checklist-item|0|It's Not Too Grindy
checklist-item|0|Wall to Wall
checklist-item|0|Do a Kickflip!
checklist-item|0|900 the 900
checklist-item|0|Thanks 4 the Memories
checklist-item|0|3rd Time's the Charm
checklist-item|0|Kickflip the Abyss
checklist-item|0|Tilt
checklist-item|0|Skater Challenger
checklist-item|0|Omelette du Fromage
checklist-item|0|Tricks Challenger
checklist-item|0|THPS3 Challenger
checklist-item|0|THPS4 Challenger
checklist-item|0|Expert Challenger
checklist-item|0|Fine Feathered Friends
checklist-item|0|Wizard Mode
checklist-item|0|Final Form
checklist-item|0|Versatile
checklist-item|0|Extra Ball
checklist-item|0|Unprecedented
checklist-item|0|Taxi! Taxi!
checklist-item|0|Tutorialized
checklist-item|0|Multiplication
checklist-item|0|Chaos Reigns

--- TAB 1.6 END ---

--- NEST 1 END ---

===== WORKSPACE END =====`
    });
})();
