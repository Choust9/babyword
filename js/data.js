/*
 * curriculum.js — the developmental "spine" of Baby Word of the Day.
 *
 * Words are grouped into STAGES keyed to speech-and-language milestones
 * (ASHA / CDC "Learn the Signs" ranges, plus general SLP guidance).
 * Each stage carries an age window in months, a plain-language summary of
 * what's happening in the baby's brain, and a bank of target words.
 *
 * Every word has:
 *   word      - the target word to focus on
 *   category  - grouping for filtering / stats
 *   ipa       - broad phonetic transcription (General American), so a parent
 *               can see how it actually sounds
 *   say       - a "how it sounds" plain-English hint (no IPA needed)
 *   why       - one line on why this word suits this stage
 *   activities- concrete, do-it-today ways to reinforce the word, written for
 *               the *baby's* stage (a 6-month-old can't repeat, so we coach
 *               narration; a 2-year-old can, so we coach turn-taking)
 *
 * This is intentionally a plain data file with no framework imports so it can
 * be reused verbatim by a Capacitor build or transcribed into a Swift model.
 */

const STAGES = [
  {
    id: 'newborn',
    label: 'Newborn',
    minMonths: 0,
    maxMonths: 3,
    headline: 'Soaking up the melody of your voice',
    summary:
      'Your baby cannot form words yet, but they are tuning into the rhythm, ' +
      'pitch and melody of speech. "Parentese" — that slow, sing-song, ' +
      'high-pitched voice — literally builds the language centres of the brain. ' +
      "Every word here is really about exposure: you talk, they absorb.",
    milestones: [
      'Startles or calms to your voice',
      'Makes cooing / gurgling sounds',
      'Watches your face intently when you talk',
    ],
    words: [
      { word: 'Mama', category: 'People', ipa: '/ˈmɑ.mɑ/', say: 'MAH-mah', why: 'Repetitive, easy sounds are the first the brain maps.', activities: ['Say it slowly and warmly every time your face comes close during feeds and cuddles.', 'Exaggerate the melody — draw out "maaa-maaa" in a sing-song lilt.'] },
      { word: 'Dada', category: 'People', ipa: '/ˈdɑ.dɑ/', say: 'DAH-dah', why: '"D" and "M" are early, easy consonant sounds.', activities: ['Point to dad (or the other parent) and repeat it during nappy changes.', 'Pair the word with a big smile so it carries positive emotion.'] },
      { word: 'Hello', category: 'Social', ipa: '/həˈloʊ/', say: 'huh-LOH', why: 'Greetings are said constantly, giving huge repetition.', activities: ['Say "hello" and wait — hold eye contact for 3 seconds as if they might reply.', 'Use it every single time you re-enter their view.'] },
      { word: 'Milk', category: 'Food', ipa: '/mɪlk/', say: 'MILK', why: 'Naming a strong daily experience builds the sound-to-meaning link.', activities: ['Say "milk?" just before every feed so the word predicts the event.', 'Keep it to the single word — short and clear.'] },
      { word: 'Sleep', category: 'Routine', ipa: '/sliːp/', say: 'SLEEP', why: 'Anchoring routine words builds predictability and calm.', activities: ['Whisper "sleep time" in the same soft tone at every nap.', 'Pair with dimming the lights so the word and the cue arrive together.'] },
      { word: 'Light', category: 'World', ipa: '/laɪt/', say: 'LYTE', why: 'Newborns are drawn to light and contrast — great for shared attention.', activities: ['Carry them to a window: "Look — light!" and let them gaze.', 'Turn a lamp on/off slowly and name it each time.'] },
      { word: 'Kiss', category: 'Social', ipa: '/kɪs/', say: 'KISS', why: 'Words tied to touch land emotionally even pre-verbally.', activities: ['Say "kiss" right before you give one, every time.', 'Make the "mmm-wah" sound so they hear the shape of it.'] },
      { word: 'Song', category: 'Play', ipa: '/sɔːŋ/', say: 'SAWNG', why: 'Melody is how babies first parse language.', activities: ['Say "song time!" then sing the same lullaby daily.', 'Let them feel your chest vibrate as you hum.'] },
    ],
  },
  {
    id: 'cooing',
    label: '3–6 months',
    minMonths: 3,
    maxMonths: 6,
    headline: 'Cooing back and taking turns',
    summary:
      'Your baby now "talks" back with coos and gurgles and is learning the ' +
      'turn-taking rhythm of conversation. They start connecting a few sounds ' +
      'to people and things. Respond to every coo as if it were a word — that ' +
      'back-and-forth is the engine of language.',
    milestones: [
      'Coos and makes back-and-forth sounds with you',
      'Turns toward voices and sounds',
      'Laughs and squeals',
    ],
    words: [
      { word: 'Baby', category: 'People', ipa: '/ˈbeɪ.bi/', say: 'BAY-bee', why: 'Self-recognition begins; babies love the mirror.', activities: ['Hold them at a mirror: "Who\'s that? Baby!"', 'Touch their nose and say "baby" with a smile.'] },
      { word: 'Ball', category: 'Objects', ipa: '/bɔːl/', say: 'BAWL', why: '"B" is an early sound and balls invite tracking and reaching.', activities: ['Roll a soft ball slowly across their view: "ball… ball…"', 'Hand it over and take it back, naming it each pass.'] },
      { word: 'Cat', category: 'Animals', ipa: '/kæt/', say: 'KAT', why: 'Animals pair a word with a sound — double the input.', activities: ['Point at a cat (or picture): "Cat! Meow."', 'Do the "meow" so the word carries a fun sound-cue.'] },
      { word: 'Dog', category: 'Animals', ipa: '/dɔːɡ/', say: 'DAWG', why: 'High-frequency household animal, easy to spot together.', activities: ['"Dog! Woof woof." — link the word to its sound.', 'Let them watch a dog move and narrate: "the dog runs".'] },
      { word: 'Eyes', category: 'Body', ipa: '/aɪz/', say: 'EYEZ', why: 'Body-part naming during care is rich, repeated input.', activities: ['Gently touch each eye: "eyes — your eyes".', 'Point to your own: "Mama\'s eyes, baby\'s eyes".'] },
      { word: 'Nose', category: 'Body', ipa: '/noʊz/', say: 'NOHZ', why: 'Face parts are close, high-contrast and endlessly available.', activities: ['Boop their nose each time you say it — they\'ll anticipate it.', 'Play "nose… nose… NOSE!" building suspense.'] },
      { word: 'Water', category: 'Routine', ipa: '/ˈwɔː.tɚ/', say: 'WAH-ter', why: 'Bath time is multi-sensory — perfect for sticky words.', activities: ['Splash gently in the bath: "water! splash!"', 'Pour water over their hands and name it.'] },
      { word: 'Up', category: 'Action', ipa: '/ʌp/', say: 'UP', why: 'Tiny action words attached to a physical feeling stick fast.', activities: ['Say "up!" every time you lift them — pause before the lift.', 'Exaggerate the rise so the body feels the word.'] },
      { word: 'More', category: 'Action', ipa: '/mɔːr/', say: 'MOR', why: 'A cornerstone early word that gives babies control.', activities: ['During tickles, stop, then say "more?" before continuing.', 'Use it at feeds: "more milk?"'] },
      { word: 'Bird', category: 'Animals', ipa: '/bɜːrd/', say: 'BURD', why: 'Outdoor words extend attention beyond the room.', activities: ['At a window: "Bird! Tweet tweet."', 'Track a bird together and narrate its flight.'] },
    ],
  },
  {
    id: 'babbling',
    label: '6–9 months',
    minMonths: 6,
    maxMonths: 9,
    headline: 'Babbling: ba-ba, da-da, ga-ga',
    summary:
      'Repetitive babbling has arrived — the "ba-ba-ba" and "da-da-da" that ' +
      'is the brain rehearsing the machinery of speech. Your baby now ' +
      'understands more than they can say and starts to grasp that things ' +
      'have names. Label everything, all day long.',
    milestones: [
      'Babbles strings of sounds (bababa, dadada)',
      'Responds to their own name',
      'Understands "no" and simple tone',
    ],
    words: [
      { word: 'Red', category: 'Colours', ipa: '/rɛd/', say: 'RED', why: 'Colours are best taught by pointing across many objects.', activities: ['Carry them around the house: "This is a RED apple… a RED car… a RED book."', 'Over-emphasise the word "red" and keep the object simple.', 'Hand them a red toy and repeat the colour, not the object.'] },
      { word: 'Blue', category: 'Colours', ipa: '/bluː/', say: 'BLOO', why: 'Sky and water make "blue" easy to point out repeatedly.', activities: ['Point to the sky: "Blue! The sky is blue."', 'Find three blue things together and name the colour each time.'] },
      { word: 'Hand', category: 'Body', ipa: '/hænd/', say: 'HAND', why: 'Babies are discovering their own hands — perfect timing.', activities: ['Clap their hands together: "hands! clap clap".', 'Play "give me your hand" and gently take it.'] },
      { word: 'Foot', category: 'Body', ipa: '/fʊt/', say: 'FUUT', why: 'Nappy changes give a captive moment to name feet and toes.', activities: ['Wiggle each foot: "foot… this little foot".', 'Play "this little piggy" to link rhyme and body part.'] },
      { word: 'Duck', category: 'Animals', ipa: '/dʌk/', say: 'DUK', why: 'Bath-toy staple with a fun, imitable sound.', activities: ['Float a rubber duck: "Duck! Quack quack."', 'Make the duck "swim" and quack toward them.'] },
      { word: 'Banana', category: 'Food', ipa: '/bəˈnæn.ə/', say: 'buh-NAN-uh', why: 'The "nana" repetition suits the babbling stage.', activities: ['Show it at mealtime: "banana — nana!"', 'Let them hold it and mash it while you name it.'] },
      { word: 'Book', category: 'Objects', ipa: '/bʊk/', say: 'BUUK', why: 'Naming the book itself builds the reading ritual.', activities: ['Hold it up before reading: "Book! Let\'s read."', 'Let them turn a board-book page as you say "book".'] },
      { word: 'Bath', category: 'Routine', ipa: '/bɑːθ/', say: 'BAHTH', why: 'Predicting a loved routine builds anticipation and meaning.', activities: ['Say "bath time!" as you run the water each night.', 'Point to the tub: "bath!" before you lower them in.'] },
      { word: 'Bye-bye', category: 'Social', ipa: '/ˈbaɪ.baɪ/', say: 'BYE-bye', why: 'Pairs a word with a gesture (waving) — powerful combo.', activities: ['Wave their hand and say "bye-bye" when someone leaves.', 'Play peekaboo with "bye-bye… hello!"'] },
      { word: 'Hot', category: 'Concepts', ipa: '/hɑːt/', say: 'HOT', why: 'An early safety word that ties word to real sensation.', activities: ['Near warm food: "hot! careful, hot" with a cautious face.', 'Feel a warm (safe) mug together: "warm… hot".'] },
      { word: 'Green', category: 'Colours', ipa: '/ɡriːn/', say: 'GREEN', why: 'Grass and leaves make green easy to demonstrate outdoors.', activities: ['Touch grass together: "green! green grass".', 'Point out green vegetables at dinner.'] },
    ],
  },
  {
    id: 'firstwords',
    label: '9–12 months',
    minMonths: 9,
    maxMonths: 12,
    headline: 'First real words and pointing',
    summary:
      'The magic threshold: first true words appear, and pointing becomes a ' +
      'superpower for sharing attention. Your baby follows simple instructions ' +
      'and uses gestures deliberately. Name what they point at, and expand it ' +
      'into a short phrase.',
    milestones: [
      'Says one or two words (mama, dada, uh-oh)',
      'Points at things they want',
      'Follows simple directions with a gesture',
    ],
    words: [
      { word: 'Apple', category: 'Food', ipa: '/ˈæp.əl/', say: 'AP-ul', why: 'Concrete, holdable, appears daily at snack time.', activities: ['Hand them a real apple: "apple — red apple".', 'Take a bite: "mmm, apple!" and offer a taste.', 'When they point at it, name it before giving it.'] },
      { word: 'Shoe', category: 'Objects', ipa: '/ʃuː/', say: 'SHOO', why: 'Getting dressed is a natural, repeated naming moment.', activities: ['Hold up a shoe before putting it on: "shoe! on your foot".', 'Play "where\'s your shoe?" and let them point.'] },
      { word: 'Car', category: 'Vehicles', ipa: '/kɑːr/', say: 'KAR', why: 'Moving objects grab attention and invite sound effects.', activities: ['At the window: "car! vroom vroom".', 'Push a toy car: "the car goes — car!"'] },
      { word: 'Cup', category: 'Objects', ipa: '/kʌp/', say: 'KUP', why: 'Introducing a cup is a milestone worth naming.', activities: ['At meals: "cup — your cup" as you hand it over.', 'Clink two cups: "cup, cup!"'] },
      { word: 'Dog', category: 'Animals', ipa: '/dɔːɡ/', say: 'DAWG', why: 'Now they can point — reward the point with the word.', activities: ['When they point at a dog: "Yes! Dog. The dog says woof."', 'Read a dog page and let them point to it.'] },
      { word: 'Nose', category: 'Body', ipa: '/noʊz/', say: 'NOHZ', why: 'They can now follow "where\'s your nose?" — turn it into a game.', activities: ['Ask "where\'s your nose?" and guide their hand.', 'Take turns: your nose, their nose, teddy\'s nose.'] },
      { word: 'Uh-oh', category: 'Social', ipa: '/ˈʌ.oʊ/', say: 'UH-oh', why: 'Playful, easy, and it invites them to imitate you.', activities: ['Drop a soft toy: "uh-oh!" and pick it up together.', 'Let them drop things (they will) and say "uh-oh" each time.'] },
      { word: 'Hat', category: 'Objects', ipa: '/hæt/', say: 'HAT', why: 'Dressing gives a repeatable on/off naming game.', activities: ['Put a hat on: "hat! on your head".', 'Pop it on your own head: "hat!" — they\'ll giggle.'] },
      { word: 'Wave', category: 'Action', ipa: '/weɪv/', say: 'WAYV', why: 'Links an action word to a gesture they\'re mastering.', activities: ['Model waving: "wave bye-bye!" at departures.', 'Wave at people on a walk and name it.'] },
      { word: 'Yellow', category: 'Colours', ipa: '/ˈjɛl.oʊ/', say: 'YEL-oh', why: 'Bright and cheerful; bananas and the sun make it easy.', activities: ['Point at the sun / a banana: "yellow!"', 'Gather yellow toys: "all yellow!"'] },
      { word: 'Book', category: 'Objects', ipa: '/bʊk/', say: 'BUUK', why: 'They can now fetch a book — build the habit.', activities: ['"Go get a book!" and celebrate when they bring one.', 'Let them choose: "this book or that book?"'] },
    ],
  },
  {
    id: 'onewords',
    label: '12–18 months',
    minMonths: 12,
    maxMonths: 18,
    headline: 'The one-word stage',
    summary:
      'Your toddler is building a spoken vocabulary — often 5 to 50 words by ' +
      '18 months — and each word does the work of a whole sentence ("up" means ' +
      '"pick me up"). Repeat their word back and expand it: they say "dog", you ' +
      'say "yes, a big dog!". Now the words start to get more complex.',
    milestones: [
      'Uses several single words',
      'Points to a few body parts on request',
      'Brings you things to show you',
    ],
    words: [
      { word: 'Happy', category: 'Feelings', ipa: '/ˈhæp.i/', say: 'HAP-ee', why: 'Naming emotions early builds emotional vocabulary.', activities: ['When they smile: "you\'re happy! Happy face."', 'Make happy faces in the mirror together.'] },
      { word: 'Spoon', category: 'Objects', ipa: '/spuːn/', say: 'SPOON', why: 'Self-feeding makes utensils meaningful and repeated.', activities: ['Hand over the spoon: "spoon — big spoon".', 'Tap the bowl: "spoon in the bowl!"'] },
      { word: 'Flower', category: 'Nature', ipa: '/ˈflaʊ.ɚ/', say: 'FLOW-er', why: 'Outdoor discovery words expand their world.', activities: ['Smell a flower together: "flower! smell — mmm".', 'Point out flowers on every walk and name colours too.'] },
      { word: 'Splash', category: 'Action', ipa: '/splæʃ/', say: 'SPLASH', why: 'Action words tied to fun get repeated eagerly.', activities: ['In the bath: "splash! splash the water!"', 'Jump in a (safe) puddle: "splash!"'] },
      { word: 'Teddy', category: 'Toys', ipa: '/ˈtɛd.i/', say: 'TED-ee', why: 'A beloved object is a motivating, emotional word.', activities: ['"Where\'s teddy? Give teddy a cuddle."', 'Have teddy "talk": "teddy says hello!"'] },
      { word: 'Banana', category: 'Food', ipa: '/bəˈnæn.ə/', say: 'buh-NAN-uh', why: 'Three syllables stretch their sound-making.', activities: ['Peel it together: "banana! peel the banana".', 'Ask "banana or apple?" and let them choose and name.'] },
      { word: 'Big', category: 'Concepts', ipa: '/bɪɡ/', say: 'BIG', why: 'Opposites (big/small) build early comparison thinking.', activities: ['Stretch arms wide: "so BIG!" then "so small".', 'Compare two toys: "big teddy, small teddy".'] },
      { word: 'Splash', category: 'Action', ipa: '/splæʃ/', say: 'SPLASH', why: 'Repeated across days deepens the sound-meaning bond.', activities: ['Narrate cause and effect: "you splashed — splash!"', 'Take turns splashing and naming it.'] },
      { word: 'Sad', category: 'Feelings', ipa: '/sæd/', say: 'SAD', why: 'Labelling their feelings helps them self-regulate.', activities: ['When they cry: "you feel sad. It\'s okay to be sad."', 'Point out a sad face in a book: "he\'s sad".'] },
      { word: 'Open', category: 'Action', ipa: '/ˈoʊ.pən/', say: 'OH-pun', why: 'A high-utility word — doors, boxes, hands, everything.', activities: ['At a door: "open! we open the door".', 'Play open/shut with your hands and a box.'] },
      { word: 'Star', category: 'Nature', ipa: '/stɑːr/', say: 'STAR', why: 'Ties to the familiar song "Twinkle Twinkle".', activities: ['Sing "Twinkle Twinkle" and point up: "star!"', 'Find star shapes in books and on clothes.'] },
      { word: 'Brush', category: 'Routine', ipa: '/brʌʃ/', say: 'BRUSH', why: 'Anchors the tooth-brushing and hair routine.', activities: ['"Brush your teeth! Brush brush brush."', 'Let them hold the brush and name the action.'] },
    ],
  },
  {
    id: 'combos',
    label: '18–24 months',
    minMonths: 18,
    maxMonths: 24,
    headline: 'The word explosion & two-word combos',
    summary:
      'Vocabulary can rocket to 50–200+ words and your toddler starts joining ' +
      'them: "more milk", "daddy go", "big dog". Model two-word phrases and ' +
      'introduce verbs and describing words. Follow their lead — talk about ' +
      'whatever they are interested in right now.',
    milestones: [
      'Puts two words together',
      'Uses 50+ words',
      'Points to several body parts and pictures',
    ],
    words: [
      { word: 'Jump', category: 'Action', ipa: '/dʒʌmp/', say: 'JUMP', why: 'Big-movement verbs are learned through the body.', activities: ['Jump together: "jump! we jump up high".', 'Make a toy jump: "froggy jumps — jump!"'] },
      { word: 'Running', category: 'Action', ipa: '/ˈrʌn.ɪŋ/', say: 'RUN-ing', why: 'Introduces the -ing ending on a favourite action.', activities: ['On a run-around: "you\'re running! running fast!"', 'Narrate a dog: "the dog is running".'] },
      { word: 'Circle', category: 'Shapes', ipa: '/ˈsɜːr.kəl/', say: 'SUR-kul', why: 'Shapes build early maths and describing language.', activities: ['Trace a circle in the air: "circle — round and round".', 'Find circles: plates, wheels, the moon.'] },
      { word: 'Cold', category: 'Concepts', ipa: '/koʊld/', say: 'KOHLD', why: 'Sensory opposites (hot/cold) sharpen description.', activities: ['Touch something from the fridge: "cold! brrr".', 'Compare: "cold water, warm bath".'] },
      { word: 'Please', category: 'Manners', ipa: '/pliːz/', say: 'PLEEZ', why: 'Early manners words are learned by modelling, not demanding.', activities: ['Model it: "milk, please" when you want them to copy.', 'Never force it — just say it warmly and often.'] },
      { word: 'Elephant', category: 'Animals', ipa: '/ˈɛl.ə.fənt/', say: 'EL-uh-funt', why: 'Longer words stretch their growing sound system.', activities: ['"Elephant! Big elephant. It goes trumpet!"', 'Do the trunk arm and the sound together.'] },
      { word: 'Tired', category: 'Feelings', ipa: '/ˈtaɪ.ɚd/', say: 'TY-erd', why: 'Naming tiredness helps them understand their own body.', activities: ['At wind-down: "you\'re tired. Time to rest."', 'Yawn together: "so tired!"'] },
      { word: 'Two', category: 'Numbers', ipa: '/tuː/', say: 'TOO', why: 'Counting starts with pairing a number to real objects.', activities: ['Count their shoes: "one, two! two shoes".', 'Give "two" grapes and count as you hand them.'] },
      { word: 'Under', category: 'Position', ipa: '/ˈʌn.dɚ/', say: 'UN-der', why: 'Position words power comprehension and following directions.', activities: ['Hide a toy: "it\'s under the blanket!"', 'Play "put teddy under the table".'] },
      { word: 'Wash', category: 'Routine', ipa: '/wɑːʃ/', say: 'WOSH', why: 'Verbs for daily routines get constant practice.', activities: ['"Wash your hands! Wash wash wash."', 'Wash a toy together in the bath.'] },
      { word: 'Loud', category: 'Concepts', ipa: '/laʊd/', say: 'LOWD', why: 'Describing sound builds sensory vocabulary.', activities: ['Bang a drum: "loud! that\'s loud" then "quiet".', 'Point out loud things: a truck, a dog.'] },
      { word: 'Purple', category: 'Colours', ipa: '/ˈpɜːr.pəl/', say: 'PUR-pul', why: 'Rounds out the colour set with a trickier word.', activities: ['Find purple grapes / flowers: "purple!"', 'Sort toys: "put the purple ones here".'] },
    ],
  },
  {
    id: 'sentences',
    label: '24–36 months',
    minMonths: 24,
    maxMonths: 36,
    headline: 'Sentences, questions and "why?"',
    summary:
      'Your child is stringing together short sentences, asking questions and ' +
      'using pronouns, plurals and prepositions. Vocabulary is in the hundreds ' +
      'and climbing. Extend their sentences, ask open questions, and dive into ' +
      'feelings, categories and pretend play.',
    milestones: [
      'Uses 2–3 word sentences',
      'Asks "what?" and "why?"',
      'Follows two-step instructions',
    ],
    words: [
      { word: 'Because', category: 'Language', ipa: '/bɪˈkɔːz/', say: 'bee-KAWZ', why: 'Unlocks reasoning and cause-and-effect talk.', activities: ['Model it: "we wear a coat because it\'s cold".', 'Answer their "why?" with a "because…" sentence.'] },
      { word: 'Excited', category: 'Feelings', ipa: '/ɪkˈsaɪ.tɪd/', say: 'ik-SY-tid', why: 'Richer emotion words deepen self-expression.', activities: ['"You\'re excited! Your body is wiggly."', 'Name it before a treat: "I\'m excited for the park!"'] },
      { word: 'Triangle', category: 'Shapes', ipa: '/ˈtraɪ.æŋ.ɡəl/', say: 'TRY-ang-gul', why: 'Extends shape knowledge and syllable control.', activities: ['Trace three sides: "triangle — one, two, three sides".', 'Hunt for triangles: a roof, a slice of pizza.'] },
      { word: 'Gentle', category: 'Concepts', ipa: '/ˈdʒɛn.təl/', say: 'JEN-tul', why: 'Key social word for handling pets, babies and friends.', activities: ['Stroke a pet: "gentle hands — soft and gentle".', 'Praise it: "you were so gentle with the baby!"'] },
      { word: 'Butterfly', category: 'Nature', ipa: '/ˈbʌt.ɚ.flaɪ/', say: 'BUT-er-fly', why: 'A wonder word that invites questions and story.', activities: ['Watch one: "butterfly! It flies. Where is it going?"', 'Flap your arms like wings together.'] },
      { word: 'Share', category: 'Manners', ipa: '/ʃɛər/', say: 'SHAIR', why: 'Central to this age\'s social development.', activities: ['Model it: "I\'ll share my snack with you".', 'Praise sharing warmly the moment it happens.'] },
      { word: 'Three', category: 'Numbers', ipa: '/θriː/', say: 'THREE', why: 'Counting real sets builds true number sense.', activities: ['Count three steps: "one, two, three!"', 'Give three blocks and count together.'] },
      { word: 'Behind', category: 'Position', ipa: '/bɪˈhaɪnd/', say: 'bee-HYND', why: 'Prepositions power richer sentences and directions.', activities: ['Play hide and seek: "you\'re behind the door!"', 'Line up toys: "the duck is behind the car".'] },
      { word: 'Rainbow', category: 'Nature', ipa: '/ˈreɪn.boʊ/', say: 'RAYN-boh', why: 'Ties every colour together into one delightful word.', activities: ['Name each colour: "red, orange, yellow… a rainbow!"', 'Draw a rainbow and say the colours as you go.'] },
      { word: 'Question', category: 'Language', ipa: '/ˈkwɛs.tʃən/', say: 'KWES-chun', why: 'Meta-language: naming the act of asking.', activities: ['"That\'s a good question! Let\'s find out."', 'Take turns asking each other silly questions.'] },
      { word: 'Whisper', category: 'Concepts', ipa: '/ˈwɪs.pɚ/', say: 'WIS-per', why: 'Volume control is a fun, learnable skill.', activities: ['Play the whisper game: "let\'s whisper — shhh".', 'Contrast: "now loud! now whisper".'] },
      { word: 'Together', category: 'Social', ipa: '/təˈɡɛð.ɚ/', say: 'tuh-GETH-er', why: 'Reinforces connection and cooperative play.', activities: ['"Let\'s build it together!"', 'Sing "the more we get together" and hold hands.'] },
    ],
  },
];

// Expose for both browser (window) and any module context.
if (typeof window !== 'undefined') {
  window.CURRICULUM = STAGES;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { STAGES };
}
