/*
 * data.js — the month-by-month curriculum.
 *
 * Previously the curriculum was grouped into broad quarters. It is now
 * organised as MONTHS: one plan per month from 0 to 36, so a parent always has
 * a small, current, achievable set rather than a three-month bucket.
 *
 * Each month plan:
 *   m          - the month number (baby's age in whole months)
 *   title      - short name for the month's plan
 *   focus      - one line on what this month is really practising
 *   summary    - what is happening developmentally, in plain language
 *   milestones - what many babies are doing around now
 *   techniques - keys into TECHNIQUES (phonics.js) that matter most this month
 *   words      - the target word bank for the month
 *   phrases    - (from ~15 months) word-combination patterns to model
 *
 * Each word:
 *   w      - the word
 *   c      - category (for dashboard breakdowns and filtering)
 *   ipa    - broad phonetic transcription, British English (RP / Standard
 *            Southern British). Non-rhotic: /r/ appears only before a vowel.
 *   say    - plain "sounds like" respelling, stressed syllable in caps
 *   focus  - key into PHONEMES: the sound this word is chosen to practise
 *   why    - why this word suits this month
 *   acts   - concrete things to do today
 *
 * STAGE_BANDS keeps the longer narrative arc (newborn → sentences) used for
 * headings and context; MONTHS is the unit the app actually teaches from.
 *
 * Sources and the evidence behind the teaching techniques are documented in
 * CONTENT-DESIGN.md.
 */

const STAGE_BANDS = [
  { id: 'newborn',    label: 'Newborn',      min: 0,  max: 3,  headline: 'Soaking up the melody of your voice' },
  { id: 'cooing',     label: 'Cooing',       min: 3,  max: 6,  headline: 'Cooing back and taking turns' },
  { id: 'babbling',   label: 'Babbling',     min: 6,  max: 9,  headline: 'Ba-ba, da-da, ga-ga' },
  { id: 'firstwords', label: 'First words',  min: 9,  max: 12, headline: 'Pointing and first real words' },
  { id: 'onewords',   label: 'Single words', min: 12, max: 18, headline: 'One word doing the work of a sentence' },
  { id: 'combos',     label: 'Word combos',  min: 18, max: 24, headline: 'The word explosion and two-word phrases' },
  { id: 'sentences',  label: 'Sentences',    min: 24, max: 37, headline: 'Sentences, questions and "why?"' },
];

const MONTHS = [
  // ===================== 0–2 months: exposure ============================
  {
    m: 0,
    title: 'Your voice, their world',
    focus: 'Pure exposure — melody, warmth and your face',
    summary:
      'Your baby cannot form words, but their brain already separates speech ' +
      'from other sound, tells your voice from a stranger\'s, and prefers the ' +
      'language they heard in the womb. Nothing you say is wasted. The job this ' +
      'month is simply to talk, constantly and musically.',
    milestones: ['Calms or startles to your voice', 'Watches your face while you talk', 'Prefers your voice to any other'],
    techniques: ['ids', 'face', 'quiet'],
    words: [
      { w: 'Mama', c: 'People', ipa: '/ˈmɑː.mə/', say: 'MAH-mah', focus: 'redup', why: 'A repeated simple syllable — the easiest wordform for a newborn brain to chunk.', acts: ['Say it slowly, high and warm every time your face comes close.', 'Stretch it out: "maaa-maaa" so the melody carries.', 'Record yourself saying it and play it back — they will still turn towards the real you.'] },
      { w: 'Dada', c: 'People', ipa: '/ˈdɑː.də/', say: 'DAH-dah', focus: 'redup', why: '"D" is one of the earliest consonants and the repetition makes it stick.', acts: ['Point to the other parent and repeat it during nappy changes.', 'Pair it with a big smile so it carries warmth.', 'Have the other parent say their own name while holding them face to face.'] },
      { w: 'Hello', c: 'Social', ipa: '/həˈləʊ/', say: 'huh-LOH', focus: 'h', why: 'Said dozens of times a day, so repetition comes free.', acts: ['Say "hello" then wait 3 seconds, holding eye contact, as if they might reply.', 'Use it every single time you re-enter their view.', 'Greet the cat, the postman and the kettle out loud. They are learning the tune, not the target.'] },
      { w: 'Milk', c: 'Food', ipa: '/mɪlk/', say: 'MILK', focus: 'm', why: 'Attaching a word to a strong daily event builds the sound-to-meaning link.', acts: ['Say "milk?" just before every feed so the word predicts the event.', 'Keep it short and clear — one word, then feed.', 'Say it once at the start of the feed and once at the end, so it frames the whole event.'] },
      { w: 'Sleep', c: 'Routine', ipa: '/sliːp/', say: 'SLEEP', focus: 'vowel', why: 'Routine words make the day predictable and calm.', acts: ['Whisper "sleep time" in the same soft tone at every nap.', 'Pair it with dimming the lights.', 'Use the same three words in the same order every nap: “book, cuddle, sleep”.'] },
      { w: 'Light', c: 'World', ipa: '/laɪt/', say: 'LYTE', focus: 'l', why: 'Newborns are drawn to light and high contrast — easy shared attention.', acts: ['Carry them to a window: "Look — light!"', 'Turn a lamp on and off slowly, naming it each time.', 'Lie them under a window and let leaf shadows move over them while you narrate.'] },
      { w: 'Kiss', c: 'Social', ipa: '/kɪs/', say: 'KISS', focus: 'k', why: 'Words tied to touch land emotionally long before they land linguistically.', acts: ['Say "kiss" right before you give one, every time.', 'Make the "mmm-wah" so they hear the shape of it.', 'Kiss their hand, their foot, their nose — naming each one as you go.'] },
      { w: 'Song', c: 'Play', ipa: '/sɒŋ/', say: 'SONG', focus: 'ng', why: 'Melody is how babies first parse language — rhythm before words.', acts: ['Say "song time!" then sing the same lullaby daily.', 'Let them feel your chest vibrate as you hum.', 'Pick one song as “their” song and sing only that one at bedtime for a month.'] },
    ],
  },
  {
    m: 1,
    title: 'Faces and rhythms',
    focus: 'Face-to-face time and a steady daily rhythm',
    summary:
      'Vision is sharpening to roughly the distance from your arms to your ' +
      'face — which is exactly where language happens. Your baby is tracking ' +
      'the rhythm of your speech and beginning to hold your gaze for longer.',
    milestones: ['Holds your gaze briefly', 'Makes small throaty sounds', 'Settles to a familiar song'],
    techniques: ['ids', 'face', 'rhythm'],
    words: [
      { w: 'Baby', c: 'People', ipa: '/ˈbeɪ.bi/', say: 'BAY-bee', focus: 'b', why: 'Two easy "b" syllables, and it names the person they are learning to be.', acts: ['Hold them at a mirror: "Who\'s that? Baby!"', 'Touch their chest gently as you say it.', 'Hold a photo of them beside your face: “that’s baby, and this is baby too”.'] },
      { w: 'Nose', c: 'Body', ipa: '/nəʊz/', say: 'NOHZ', focus: 'n', why: 'Face parts are close, high-contrast and always available.', acts: ['Boop their nose each time you say it.', 'Point to your own nose, then theirs.', 'Rub noses. The word and the touch arrive together, which is what makes it stick.'] },
      { w: 'Eyes', c: 'Body', ipa: '/aɪz/', say: 'EYEZ', focus: 'vowel', why: 'Eye contact is the foundation of the conversational exchange.', acts: ['Gently touch near each eye: "eyes — your eyes".', 'Hold their gaze and say it slowly.', 'Play a slow blinking game and name it each time you open yours.'] },
      { w: 'Warm', c: 'Feelings', ipa: '/wɔːm/', say: 'WAWM', focus: 'w', why: 'The rounded "w" lip shape is very visible up close.', acts: ['During a cuddle: "warm — you\'re nice and warm".', 'Exaggerate the lip pucker so they can watch it.', 'Say it as you take them out of the bath and wrap the towel round.'] },
      { w: 'Moon', c: 'Nature', ipa: '/muːn/', say: 'MOON', focus: 'm', why: 'Long vowel and a hum — lovely to stretch out at bedtime.', acts: ['At the window at night: "moooon".', 'Sing a moon lullaby and point.', 'Keep a moon picture by the cot and point at it during night feeds.'] },
      { w: 'Home', c: 'World', ipa: '/həʊm/', say: 'HOHM', focus: 'h', why: 'A word for the safe place, said constantly on the way back from anywhere.', acts: ['Coming through the door: "we\'re home!"', 'Use the same sing-song each time.', 'Say it at the same doorway every time, so the place and the word pair up.'] },
      { w: 'Rock', c: 'Action', ipa: '/rɒk/', say: 'ROK', focus: 'r', why: 'Pairs a word to a physical rhythm they feel in the body.', acts: ['Rock them and chant "rock… rock… rock" on the beat.', 'Slow the rhythm as they settle.', 'Rock to the beat of a song rather than randomly — the rhythm is the lesson.'] },
      { w: 'Hush', c: 'Routine', ipa: '/hʌʃ/', say: 'HUSH', focus: 'sh', why: 'The soft "shh" is close to womb sound and instantly calming.', acts: ['Use "hush" with a long "shhh" when settling.', 'Keep it very quiet — let them lean in to hear it.', 'Use it as the last word of the bedtime routine, every single night.'] },
    ],
  },
  {
    m: 2,
    title: 'First smiles, first replies',
    focus: 'Treating every coo as a turn in a conversation',
    summary:
      'The social smile arrives, and with it the first real back-and-forth. ' +
      'When your baby makes a sound, answer it. That exchange — sound, pause, ' +
      'reply — is the template every future conversation is built on.',
    milestones: ['Smiles socially and on purpose', 'Coos and gurgles', 'Quietens to a familiar voice'],
    techniques: ['ids', 'predict', 'face'],
    words: [
      { w: 'Smile', c: 'Feelings', ipa: '/smaɪl/', say: 'SMYLE', focus: 'm', why: 'Name the thing they have just discovered how to do.', acts: ['When they smile: "a smile! You\'re smiling."', 'Smile widely back so they see it mirrored.', 'Smile, wait for theirs, then name it. The pause is what teaches turn-taking.'] },
      { w: 'Happy', c: 'Feelings', ipa: '/ˈhæp.i/', say: 'HAP-ee', focus: 'h', why: 'Emotion words start now, long before they can be repeated.', acts: ['Match your tone to the word: bright and lifted.', 'Say it every time they light up.', 'Name it in others too: “Daddy’s happy, look at his face”.'] },
      { w: 'Peekaboo', c: 'Play', ipa: '/ˌpiː.kəˈbuː/', say: 'pee-kuh-BOO', focus: 'p', why: 'The held pause before "boo" is exactly the prediction game the brain loves.', acts: ['Cover your face… wait… "peekaboo!"', 'Lengthen the pause a little each time.', 'Hide behind the muslin instead of your hands so they can see it coming.'] },
      { w: 'Bubble', c: 'Play', ipa: '/ˈbʌb.əl/', say: 'BUB-ul', focus: 'b', why: 'Two "b" pops in one word, plus something fun to watch.', acts: ['Blow bubbles and name each one: "bubble!"', 'Pop one and pause before the next.', 'Let one land on their arm and name the pop as they feel it.'] },
      { w: 'Tickle', c: 'Play', ipa: '/ˈtɪk.əl/', say: 'TIK-ul', focus: 't', why: 'A word that reliably predicts a delightful sensation.', acts: ['"Tickle… tickle… TICKLE!" with a pause before the last.', 'Wait for a smile before you start again.', 'Walk your fingers up their tummy first, so the word predicts the touch.'] },
      { w: 'Voice', c: 'Social', ipa: '/vɔɪs/', say: 'VOYS', focus: 'v', why: 'Naming the thing they are learning to use.', acts: ['When they coo: "there\'s your voice!"', 'Copy their exact sound back, then wait.', 'Copy their coo exactly, then change it slightly and see if they follow.'] },
      { w: 'Look', c: 'Action', ipa: '/lʊk/', say: 'LUUK', focus: 'l', why: 'The word that opens joint attention — you will use it forever.', acts: ['"Look!" then point at something bright and wait.', 'Follow where their eyes go and name that instead.', 'Follow their eyes rather than directing them, and name whatever they chose.'] },
      { w: 'Yes', c: 'Social', ipa: '/jes/', say: 'YES', focus: 'y', why: 'A warm confirmation word to close every exchange.', acts: ['Answer every coo with "yes! Tell me more."', 'Nod as you say it.', 'Nod as you say it. The gesture arrives long before the word does.'] },
    ],
  },

  // ===================== 3–5 months: turn-taking ==========================
  {
    m: 3,
    title: 'Conversation practice',
    focus: 'Sound, pause, reply — the turn-taking loop',
    summary:
      'Cooing becomes richer and more deliberate. Your baby is starting to ' +
      'wait for your reply. Leave gaps: the pause is the invitation, and the ' +
      'timing of your response is what teaches them how conversation works.',
    milestones: ['Makes back-and-forth sounds with you', 'Turns towards voices', 'Laughs out loud'],
    techniques: ['predict', 'ids', 'expand'],
    words: [
      { w: 'Hand', c: 'Body', ipa: '/hænd/', say: 'HAND', focus: 'h', why: 'They have just discovered their hands exist.', acts: ['Bring their hands together: "hands!"', 'Open and close their fingers as you name it.', 'Open their fingers one at a time and count them as you name the hand.'] },
      { w: 'Water', c: 'Routine', ipa: '/ˈwɔː.tə/', say: 'WAW-ter', focus: 'w', why: 'Bath time is multi-sensory, which makes words stickier.', acts: ['Splash gently: "water! Warm water."', 'Pour it over their hands and name it.', 'Name it in three places today: the bath, the tap and a glass.'] },
      { w: 'Up', c: 'Action', ipa: '/ʌp/', say: 'UP', focus: 'p', why: 'A tiny word attached to a big physical feeling.', acts: ['Say "up!" just BEFORE every lift — pause first.', 'Exaggerate the rise so the body feels the word.', 'Pause with them halfway up, say it again, then finish the lift.'] },
      { w: 'Down', c: 'Action', ipa: '/daʊn/', say: 'DOWN', focus: 'd', why: 'The natural pair to "up" — opposites teach each other.', acts: ['Lower them slowly: "doooown".', 'Drop your pitch as you say it.', 'Slide your voice down the scale as you lower them — meaning carried by pitch.'] },
      { w: 'Sing', c: 'Play', ipa: '/sɪŋ/', say: 'SING', focus: 'ng', why: 'Rhythm carries language before words do.', acts: ['"Shall we sing?" then always the same song.', 'Pause before the last word of a line.', 'Sing the same line twice, then leave the last word out and wait.'] },
      { w: 'Foot', c: 'Body', ipa: '/fʊt/', say: 'FUUT', focus: 'f', why: 'Nappy changes give a captive, repeated naming moment.', acts: ['Wiggle each foot: "foot… other foot".', 'Do "this little piggy" for rhyme plus body part.', 'Kiss the sole of each foot and name it. Feet are very ticklish and very memorable.'] },
      { w: 'Funny', c: 'Feelings', ipa: '/ˈfʌn.i/', say: 'FUN-ee', focus: 'f', why: 'Laughter is arriving — name it when it happens.', acts: ['When they laugh: "that\'s funny!"', 'Repeat whatever made them laugh, exactly.', 'Repeat whatever made them laugh three times, naming it each round.'] },
      { w: 'Wait', c: 'Concepts', ipa: '/weɪt/', say: 'WAYT', focus: 'w', why: 'Introduces the pause that makes turn-taking possible.', acts: ['"Wait… wait… now!" in a tickle game.', 'Hold the pause a beat longer than feels natural.', 'Hold a rattle just out of reach: “wait… wait… now!”'] },
      { w: 'Bath', c: 'Routine', ipa: '/bɑːθ/', say: 'BATH', focus: 'b', why: 'A daily, predictable event worth naming in advance.', acts: ['Say "bath time!" as the water runs.', 'Same phrase, same tune, every night.', 'Say it while the water is running so they hear it before they see it.'] },
    ],
  },
  {
    m: 4,
    title: 'Reaching and grabbing',
    focus: 'Naming whatever lands in their hands',
    summary:
      'Your baby is reaching for things on purpose. Every grab is a moment of ' +
      'focused attention — and a word delivered at that exact moment has the ' +
      'best possible chance of sticking. Follow their hands with your voice.',
    milestones: ['Reaches for and grasps objects', 'Brings things to their mouth', 'Makes squealing sounds'],
    techniques: ['joint', 'varied', 'face'],
    words: [
      { w: 'Ball', c: 'Objects', ipa: '/bɔːl/', say: 'BAWL', focus: 'b', why: 'Round, graspable and a perfect "b" model.', acts: ['Roll a soft ball slowly across their view: "ball".', 'Say it in three different sentences as you play.', 'Roll it away and back: “the ball goes… the ball comes back”.'] },
      { w: 'Cup', c: 'Objects', ipa: '/kʌp/', say: 'KUP', focus: 'k', why: 'An everyday object they will soon use themselves.', acts: ['Tap a cup: "cup — this is a cup".', 'Let them hold it while you name it.', 'Let them hold an empty one at every meal, long before they can drink from it.'] },
      { w: 'Book', c: 'Objects', ipa: '/bʊk/', say: 'BUUK', focus: 'b', why: 'Naming the book builds the reading ritual itself.', acts: ['Hold it up: "book! Let\'s read the book."', 'Let them touch the pages as you say it.', 'Keep one book in the nappy bag and name it every time it comes out.'] },
      { w: 'Soft', c: 'Concepts', ipa: '/sɒft/', say: 'SOFT', focus: 's', why: 'Texture words pair a sound with something they can feel.', acts: ['Stroke a blanket on their cheek: "soft".', 'Contrast with something hard.', 'Line up three soft things and stroke each one against their cheek, naming it.'] },
      { w: 'Teddy', c: 'Toys', ipa: '/ˈted.i/', say: 'TED-ee', focus: 't', why: 'A beloved object becomes an emotionally loaded word.', acts: ['"Here\'s teddy. Teddy is soft."', 'Have teddy "walk" up to them and say hello.', 'Give teddy a bedtime too: “teddy is sleeping”.'] },
      { w: 'Give', c: 'Action', ipa: '/ɡɪv/', say: 'GIV', focus: 'g', why: 'Sets up the give-and-take exchange games of the next months.', acts: ['Hand something over: "give — I give it to you".', 'Hold your palm out and wait.', 'Take turns handing over a spoon at mealtimes, naming each pass.'] },
      { w: 'Shake', c: 'Action', ipa: '/ʃeɪk/', say: 'SHAYK', focus: 'sh', why: 'The action and the word arrive together with a rattle.', acts: ['Shake a rattle: "shake shake shake!"', 'Stop suddenly, pause, then start again.', 'Shake fast, then slow, then stop dead — the contrast holds their attention.'] },
      { w: 'Mine', c: 'Concepts', ipa: '/maɪn/', say: 'MYNE', focus: 'm', why: 'Possession words begin here, gently and playfully.', acts: ['"Yours… mine… yours" passing a toy back and forth.', 'Keep the tone light and sing-song.', 'Keep it playful and shared. At this age it is a word game, not a rule.'] },
      { w: 'Gentle', c: 'Manners', ipa: '/ˈdʒen.təl/', say: 'JEN-tul', focus: 'j', why: 'Starts the vocabulary of careful touch early.', acts: ['Stroke your own arm with their hand: "gentle".', 'Use the word every time they touch a face or pet.', 'Use it every time they touch your face, before they ever meet a pet.'] },
    ],
  },
  {
    m: 5,
    title: 'Food and flavours',
    focus: 'Mealtime words as solids approach',
    summary:
      'Feeding is becoming a rich, messy, sensory event — and sensory events ' +
      'make excellent word anchors. Narrate every part of the meal. Your baby ' +
      'is also starting to recognise their own name.',
    milestones: ['Responds to their own name', 'Shows interest in food', 'Blows raspberries'],
    techniques: ['varied', 'boundary', 'joint'],
    words: [
      { w: 'Banana', c: 'Food', ipa: '/bəˈnɑː.nə/', say: 'buh-NAH-nuh', focus: 'b', why: 'Three syllables with a lovely repeated "n" in the middle.', acts: ['Show it at mealtime: "banana — na-na-na".', 'Let them hold and squash it while you name it.', 'Let them hold the peel afterwards and name it once more.'] },
      { w: 'Apple', c: 'Food', ipa: '/ˈæp.əl/', say: 'AP-ul', focus: 'p', why: 'A crisp "p" pop right in the middle of the word.', acts: ['Bite one loudly: "apple! crunch."', 'Let them hold a whole apple.', 'Slice one in front of them and name it before every bite.'] },
      { w: 'Eat', c: 'Action', ipa: '/iːt/', say: 'EET', focus: 't', why: 'The verb of the moment, repeated many times a day.', acts: ['"Eat — we eat the banana."', 'Make eating noises and name the action.', 'Narrate who is eating: “Mummy eats, baby eats, teddy eats”.'] },
      { w: 'Spoon', c: 'Objects', ipa: '/spuːn/', say: 'SPOON', focus: 's', why: 'A brand-new object about to become central to their day.', acts: ['Tap the bowl with it: "spoon".', 'Let them grip it while you feed.', 'Give them their own to hold while you feed with a second one.'] },
      { w: 'Yummy', c: 'Food', ipa: '/ˈjʌm.i/', say: 'YUM-ee', focus: 'y', why: 'Emotion plus food — a very motivating pairing.', acts: ['Big face: "mmm, yummy!"', 'Use it only when they actually enjoy something.', 'Pull a delighted face. The expression carries the meaning before the word does.'] },
      { w: 'Hot', c: 'Concepts', ipa: '/hɒt/', say: 'HOT', focus: 'h', why: 'An early safety word tied to real sensation.', acts: ['Near warm food: "hot — careful, hot" with a cautious face.', 'Let them feel a safely warm mug.', 'Blow on the food and name it. The blowing becomes part of the word.'] },
      { w: 'Cold', c: 'Concepts', ipa: '/kəʊld/', say: 'KOHLD', focus: 'k', why: 'The contrast that makes "hot" meaningful.', acts: ['Touch something from the fridge: "cold! Brrr."', 'Say "hot… cold" back to back.', 'Press a chilled spoon to their hand for a second and name it.'] },
      { w: 'Finished', c: 'Routine', ipa: '/ˈfɪn.ɪʃt/', say: 'FIN-isht', focus: 'f', why: 'Marks the end of an activity — a useful boundary word.', acts: ['Hands up at the end: "all finished!"', 'Same gesture and phrase every meal.', 'Sign it with both hands turned over, every single time.'] },
      { w: 'Name', c: 'Social', ipa: '/neɪm/', say: 'NAYM', focus: 'n', why: 'They are just beginning to respond to their own.', acts: ['Use their name at the START of sentences.', 'Say it, pause, and wait for them to look.', 'Use their name last in the sentence so it lands: “all done, Sophia”.'] },
    ],
  },

  // ===================== 6–8 months: babbling ============================
  {
    m: 6,
    title: 'Babbling begins',
    focus: 'Repeated syllables — ba-ba, da-da, ma-ma',
    summary:
      'Canonical babbling arrives: strings of repeated syllables that are the ' +
      'brain rehearsing the machinery of speech. Babble back. Copy their exact ' +
      'syllables, then add one of your own and see if they copy you.',
    milestones: ['Babbles strings like "bababa"', 'Sits with support', 'Responds to their name reliably'],
    techniques: ['ids', 'predict', 'contrast'],
    words: [
      { w: 'Ba-ba', c: 'Sounds', ipa: '/ˈbɑː.bɑː/', say: 'BAH-bah', focus: 'redup', why: 'The exact syllable shape they are producing right now — meet them there.', acts: ['Babble it back the instant they say it.', 'Take turns: you, then pause, then them.', 'Bounce them once per syllable so they feel the beat of it.'] },
      { w: 'Da-da', c: 'Sounds', ipa: '/ˈdɑː.dɑː/', say: 'DAH-dah', focus: 'redup', why: 'A tongue-tip sound they can watch you make.', acts: ['Say it slowly so they see your tongue tap.', 'Attach it to the real person: "dada!"', 'Alternate with “ma-ma” so they hear two lips shapes side by side.'] },
      { w: 'Ga-ga', c: 'Sounds', ipa: '/ˈɡɑː.ɡɑː/', say: 'GAH-gah', focus: 'g', why: 'Practises the back-of-tongue sounds that come next.', acts: ['Put their hand on your throat to feel the "g" buzz.', 'Alternate "ga-ga" and "da-da" playfully.', 'Say it while they touch your throat, then let them feel their own.'] },
      { w: 'Red', c: 'Colours', ipa: '/red/', say: 'RED', focus: 'r', why: 'Colours are learned by hearing one word across many objects.', acts: ['Carry them round the house: "a RED apple… a RED car… a RED book".', 'Stress the colour word, not the object.', 'Hand them something red and repeat just the colour.'] },
      { w: 'Blue', c: 'Colours', ipa: '/bluː/', say: 'BLOO', focus: 'b', why: 'Sky and water make blue endlessly pointable.', acts: ['Point at the sky: "blue! The sky is blue."', 'Find three blue things, naming the colour each time.', 'Name it every time you go outside: “look up — blue”.'] },
      { w: 'Duck', c: 'Animals', ipa: '/dʌk/', say: 'DUK', focus: 'd', why: 'A bath staple with a fun, copyable sound attached.', acts: ['Float it: "duck! Quack quack."', 'Make the duck swim towards them and pause before "quack".', 'Sing “five little ducks” at bath time and quack on every chorus.'] },
      { w: 'Cat', c: 'Animals', ipa: '/kæt/', say: 'KAT', focus: 'k', why: 'Animal words come with a sound effect — double the input.', acts: ['"Cat! The cat says meow."', 'Stroke a cat (or a picture) as you say it.', 'Stroke a soft toy cat the way you would a real one, naming both.'] },
      { w: 'Dog', c: 'Animals', ipa: '/dɒɡ/', say: 'DOG', focus: 'd', why: 'High-frequency, easy to spot on any walk.', acts: ['"Dog! Woof woof."', 'Point out every dog you pass and name it.', 'Count the dogs on a walk out loud: “one dog… two dogs”.'] },
      { w: 'Clap', c: 'Action', ipa: '/klæp/', say: 'KLAP', focus: 'k', why: 'A rhythmic action that maps sound onto beat.', acts: ['Clap their hands together on the beat of a song.', 'Clap… pause… clap, and see if they anticipate.', 'Clap their hands for them at first, then pause and see if they start it.'] },
      { w: 'Boo', c: 'Play', ipa: '/buː/', say: 'BOO', focus: 'b', why: 'The payoff word in the world\'s best prediction game.', acts: ['Hide, hold the pause, then "BOO!"', 'Let them try hiding behind a cloth.', 'Let them hide behind the cloth and be the one who says it.'] },
    ],
  },
  {
    m: 7,
    title: 'Animals and their sounds',
    focus: 'Pairing every word with a sound effect',
    summary:
      'Babbling is getting more varied. Animal words are a gift right now: ' +
      'each one comes with its own sound, so your baby gets two learnable ' +
      'items for the price of one — and animal noises are easier to copy than ' +
      'words.',
    milestones: ['Babbles with varied consonants', 'Passes objects hand to hand', 'Looks for a dropped toy'],
    techniques: ['contrast', 'varied', 'joint'],
    words: [
      { w: 'Cow', c: 'Animals', ipa: '/kaʊ/', say: 'KOW', focus: 'k', why: 'A big open vowel and a very copyable "moo".', acts: ['"Cow! The cow says moooo."', 'Stretch the "moo" out long and low.', 'Moo low and long, then high and squeaky, and let them choose a favourite.'] },
      { w: 'Sheep', c: 'Animals', ipa: '/ʃiːp/', say: 'SHEEP', focus: 'sh', why: 'Models the soft "sh" plus a wobbly "baa".', acts: ['"Sheep — baaaa!" with a wobble in your voice.', 'Contrast "sheep" and "beep" playfully.', 'Rub a woolly jumper on their cheek as you name it.'] },
      { w: 'Pig', c: 'Animals', ipa: '/pɪɡ/', say: 'PIG', focus: 'p', why: 'A crisp "p" puff and an irresistible snort.', acts: ['"Pig! Oink oink." Snort loudly.', 'Hold a tissue up so they see the "p" puff.', 'Snort against their tummy — the sound and the tickle together.'] },
      { w: 'Bird', c: 'Animals', ipa: '/bɜːd/', say: 'BURD', focus: 'b', why: 'Extends attention out of the room and through the window.', acts: ['At the window: "bird! Tweet tweet."', 'Track one together and narrate its flight.', 'Put crumbs on the sill and wait together. The waiting is half the lesson.'] },
      { w: 'Fish', c: 'Animals', ipa: '/fɪʃ/', say: 'FISH', focus: 'f', why: 'Two visible mouth shapes in one short word.', acts: ['Make fish lips: "fish!"', 'Let them watch your teeth touch your lip for "f".', 'Watch water swirl down the plughole: “where do the fish go?”'] },
      { w: 'Horse', c: 'Animals', ipa: '/hɔːs/', say: 'HAWSS', focus: 'h', why: 'Breathy "h" start plus a fun clip-clop rhythm.', acts: ['"Horse! Clip clop clip clop" bouncing them on your knee.', 'Match the bounce to the syllables.', 'Gallop your fingers up their arm in a clip-clop rhythm.'] },
      { w: 'Bee', c: 'Animals', ipa: '/biː/', say: 'BEE', focus: 'b', why: 'The "zzz" buzz is a sound they can feel on their skin.', acts: ['"Bee — zzzzz!" then land the bee on their tummy.', 'Pause mid-buzz before landing.', 'Buzz your finger in a slow circle and land it somewhere different each time.'] },
      { w: 'Green', c: 'Colours', ipa: '/ɡriːn/', say: 'GREEN', focus: 'g', why: 'Grass and leaves make green demonstrable outdoors.', acts: ['Touch grass together: "green grass".', 'Point out green vegetables at dinner.', 'Hold a leaf up to the light and name the colour, not the leaf.'] },
      { w: 'Yellow', c: 'Colours', ipa: '/ˈjel.əʊ/', say: 'YEL-oh', focus: 'y', why: 'Bright, cheerful, and easy to find in food and toys.', acts: ['Point at a banana or the sun: "yellow!"', 'Gather yellow things: "all yellow!"', 'Name the sun through the window every morning.'] },
      { w: 'Splash', c: 'Action', ipa: '/splæʃ/', say: 'SPLASH', focus: 'sh', why: 'A word whose sound imitates its meaning.', acts: ['In the bath: "splash!" every time they hit the water.', 'Narrate their own action back to them.', 'Let them splash you and react loudly — cause and effect is the point.'] },
    ],
  },
  {
    m: 8,
    title: 'Body parts',
    focus: 'Naming their body during care routines',
    summary:
      'Your baby understands far more than they can say. Nappy changes, ' +
      'dressing and bath time are captive, repeated, face-to-face moments — ' +
      'the ideal slot for body-part words. Touch the part as you name it.',
    milestones: ['Understands "no"', 'Sits without support', 'Copies simple gestures'],
    techniques: ['face', 'boundary', 'varied'],
    words: [
      { w: 'Tummy', c: 'Body', ipa: '/ˈtʌm.i/', say: 'TUM-ee', focus: 't', why: 'Ticklish, funny and always available.', acts: ['Blow a raspberry: "tummy!"', 'Pause before the raspberry so they anticipate it.', 'Do tummy time on your chest and name it while they push up.'] },
      { w: 'Toes', c: 'Body', ipa: '/təʊz/', say: 'TOHZ', focus: 't', why: 'They can now reach and grab their own feet.', acts: ['Count them: "toes — one, two, three".', 'Wiggle each one as you name it.', 'Put socks on slowly, naming the toes as they disappear.'] },
      { w: 'Ear', c: 'Body', ipa: '/ɪə/', say: 'EER', focus: 'vowel', why: 'A pure vowel word, easy to stretch out.', acts: ['Whisper into it: "ear — this is your ear".', 'Point to yours, then theirs.', 'Cup your hand behind yours: “listening ears — what can you hear?”'] },
      { w: 'Mouth', c: 'Body', ipa: '/maʊθ/', say: 'MOWTH', focus: 'th', why: 'Naming the very thing that makes the sounds.', acts: ['Open yours wide: "mouth!"', 'Let them touch your lips as you speak.', 'Let them put a hand on your lips while you hum, then while you stop.'] },
      { w: 'Hair', c: 'Body', ipa: '/heə/', say: 'HAIR', focus: 'h', why: 'Something they can feel and pull on both of you.', acts: ['Stroke their head: "soft hair".', 'Brush it and name the action too.', 'Name it while you dry theirs after a bath.'] },
      { w: 'Knee', c: 'Body', ipa: '/niː/', say: 'NEE', focus: 'n', why: 'Short, clear, and useful once crawling starts.', acts: ['Tap each knee: "knee, knee".', 'Bounce them on your knee and name it.', 'Bounce them on your knee to a rhyme and name it at the end.'] },
      { w: 'Head', c: 'Body', ipa: '/hed/', say: 'HED', focus: 'h', why: 'Anchors the "head, shoulders, knees and toes" song.', acts: ['Sing the song and touch each part.', 'Slow the song right down.', 'Pop a hat on and off their head, naming it each time it lands.'] },
      { w: 'Kick', c: 'Action', ipa: '/kɪk/', say: 'KIK', focus: 'k', why: 'Their legs are strong now and they love using them.', acts: ['"Kick! Kick your legs" during a nappy change.', 'Copy their kicking and name it.', 'Hang something within reach of their feet and name every kick that hits it.'] },
      { w: 'No', c: 'Concepts', ipa: '/nəʊ/', say: 'NOH', focus: 'n', why: 'They are beginning to understand it — keep it rare and clear.', acts: ['Use a calm, low, firm tone — not loud.', 'Follow it with what they CAN do.', 'Pair it with a gentle hand redirect, so the word never travels alone.'] },
      { w: 'Wash', c: 'Routine', ipa: '/wɒʃ/', say: 'WOSH', focus: 'w', why: 'A daily action verb with a visible lip shape.', acts: ['"Wash your hands — wash wash wash."', 'Wash a toy together in the bath.', 'Wash their hands under running water and name it before every meal.'] },
    ],
  },

  // ===================== 9–11 months: first words ========================
  {
    m: 9,
    title: 'Pointing changes everything',
    focus: 'Following their point and naming what they choose',
    summary:
      'Pointing is a superpower: it lets your baby tell you what they are ' +
      'interested in. Every point is a request for a word. Follow it, name it, ' +
      'and add one detail. This is the single highest-value habit of the year.',
    milestones: ['Points at things they want', 'Understands simple instructions with a gesture', 'Waves bye-bye'],
    techniques: ['joint', 'expand', 'varied'],
    words: [
      { w: 'Bye-bye', c: 'Social', ipa: '/ˈbaɪ.baɪ/', say: 'BYE-bye', focus: 'redup', why: 'Pairs a repeated syllable with a gesture they can already do.', acts: ['Wave their hand and say it at every departure.', 'Pause and wait for them to wave first.', 'Wave at the window as a car pulls away, long after the person has gone.'] },
      { w: 'Shoe', c: 'Objects', ipa: '/ʃuː/', say: 'SHOO', focus: 'sh', why: 'Dressing gives a natural, repeated naming moment.', acts: ['Hold it up before it goes on: "shoe!"', 'Ask "where\'s your shoe?" and let them point.', 'Line up everyone’s shoes by the door and name whose is whose.'] },
      { w: 'Hat', c: 'Objects', ipa: '/hæt/', say: 'HAT', focus: 'h', why: 'On-and-off games make the word repeat naturally.', acts: ['Pop it on your own head: "hat!" — expect giggles.', 'Take turns wearing it.', 'Try it on teddy, on you, then on them — three chances to hear it.'] },
      { w: 'Car', c: 'Vehicles', ipa: '/kɑː/', say: 'KAH', focus: 'k', why: 'Moving things pull attention and invite sound effects.', acts: ['At the window: "car! Vroom."', 'Push a toy car: "the car goes… car!"', 'Push a toy car under a cushion and ask where it went.'] },
      { w: 'Keys', c: 'Objects', ipa: '/kiːz/', say: 'KEEZ', focus: 'k', why: 'Endlessly fascinating and jingly — attention comes free.', acts: ['Jingle them: "keys!"', 'Hide them under a cloth and find them again.', 'Give them a set of toy keys of their own and name them alongside yours.'] },
      { w: 'Door', c: 'World', ipa: '/dɔː/', say: 'DAW', focus: 'd', why: 'A fixed feature of the house, passed through many times a day.', acts: ['"Door — open the door."', 'Knock on it, pause, then open it.', 'Play a knock-and-open game: knock, pause, “door!”'] },
      { w: 'Light', c: 'World', ipa: '/laɪt/', say: 'LYTE', focus: 'l', why: 'A switch gives instant cause and effect to name.', acts: ['Let them flick the switch: "light on… light off".', 'Pause before each flick.', 'Let them press the switch themselves and name the result, not the button.'] },
      { w: 'Open', c: 'Action', ipa: '/ˈəʊ.pən/', say: 'OH-pun', focus: 'p', why: 'A high-utility verb: doors, boxes, books, hands.', acts: ['"Open!" at every door, lid and box.', 'Play open-and-shut with your hands.', 'Ask “open?” before every lid, box and door, then wait a beat for a reply.'] },
      { w: 'Uh-oh', c: 'Social', ipa: '/ˈʌ.əʊ/', say: 'UH-oh', focus: 'vowel', why: 'Playful, easy to say, and highly imitable.', acts: ['Drop a soft toy: "uh-oh!"', 'They will drop things repeatedly — say it every time.', 'Build a two-brick tower and knock it down together.'] },
      { w: 'Again', c: 'Concepts', ipa: '/əˈɡen/', say: 'uh-GEN', focus: 'g', why: 'Gives them a way to request more of a good thing.', acts: ['After a tickle, pause: "again?"', 'Wait for a sound or gesture before continuing.', 'Stop a favourite game dead and look at them expectantly. Wait longer than feels natural.'] },
    ],
  },
  {
    m: 10,
    title: 'Words for doing',
    focus: 'Action words attached to real movement',
    summary:
      'Your baby is on the move — crawling, cruising, pulling up. Verbs learned ' +
      'through the body are learned fastest. Narrate what they are doing as ' +
      'they do it, in short phrases with the verb at the end.',
    milestones: ['Crawls or shuffles', 'Pulls to stand', 'Copies sounds you make'],
    techniques: ['boundary', 'joint', 'predict'],
    words: [
      { w: 'Go', c: 'Action', ipa: '/ɡəʊ/', say: 'GOH', focus: 'g', why: 'The shortest, most useful verb there is.', acts: ['"Ready, steady… GO!" — hold the pause.', 'Use it to start every movement game.', 'Line up cars at the top of a ramp: “ready, steady… go!”'] },
      { w: 'Stop', c: 'Action', ipa: '/stɒp/', say: 'STOP', focus: 's', why: 'The pair to "go" — and a genuinely useful safety word.', acts: ['Play stop-and-go while pushing a toy car.', 'Freeze dramatically on "stop".', 'Play musical statues with one song — freeze on “stop”.'] },
      { w: 'Push', c: 'Action', ipa: '/pʊʃ/', say: 'PUUSH', focus: 'p', why: 'They are pushing everything right now.', acts: ['"Push the car — push!"', 'Push together, hand over hand.', 'Give them a sturdy box to push across the floor and narrate the journey.'] },
      { w: 'Walk', c: 'Action', ipa: '/wɔːk/', say: 'WAWK', focus: 'w', why: 'The thing they are working towards — name it constantly.', acts: ['Hold their hands: "walk, walk, walk" on each step.', 'Match the word to the rhythm of the steps.', 'Say it in rhythm with their steps, one word per step.'] },
      { w: 'Sit', c: 'Action', ipa: '/sɪt/', say: 'SIT', focus: 's', why: 'A short, clear instruction they can actually follow.', acts: ['"Sit down" with a gesture, then praise it.', 'Use the same phrase every time.', 'Say it as they sit for meals, so it attaches to a moment that happens anyway.'] },
      { w: 'Drink', c: 'Action', ipa: '/drɪŋk/', say: 'DRINK', focus: 'd', why: 'Cup skills are developing — the verb gets daily practice.', acts: ['"Drink your water — drink!"', 'Model drinking from your own cup first.', 'Clink cups and say “cheers — drink!”'] },
      { w: 'Throw', c: 'Action', ipa: '/θrəʊ/', say: 'THROH', focus: 'th', why: 'Models a later sound in a very motivating context.', acts: ['"Ready… throw!" with a soft ball.', 'Do not expect the "th" back for years.', 'Throw soft toys into a laundry basket and name each one that goes in.'] },
      { w: 'Bang', c: 'Sounds', ipa: '/bæŋ/', say: 'BANG', focus: 'ng', why: 'Loud, satisfying, and ends in a hummy "ng".', acts: ['Bang two blocks: "bang bang!"', 'Copy their rhythm exactly.', 'Give them a wooden spoon and a saucepan. Accept the consequences.'] },
      { w: 'Peekaboo', c: 'Play', ipa: '/ˌpiː.kəˈbuː/', say: 'pee-kuh-BOO', focus: 'p', why: 'Now they can hide themselves — the game gets richer.', acts: ['Let them pull the cloth off your face.', 'Stretch the pause and watch them wait.', 'Hide a toy under a cloth instead of your face — same word, new idea.'] },
      { w: 'More', c: 'Action', ipa: '/mɔː/', say: 'MAW', focus: 'm', why: 'A cornerstone word that hands them real control.', acts: ['Stop mid-game: "more?" and wait.', 'Accept any sound or gesture as a "yes".', 'Use it for things they can refuse too, so it stays a choice rather than a demand.'] },
    ],
  },
  {
    m: 11,
    title: 'Around the house',
    focus: 'The furniture of their everyday world',
    summary:
      'Your baby now moves through the house and meets the same objects over ' +
      'and over. High-frequency household words get enormous natural ' +
      'repetition, which is exactly what word learning needs. Say the word in ' +
      'many different sentences, not the same one repeated.',
    milestones: ['Says one or two real words', 'Cruises along furniture', 'Hands you objects deliberately'],
    techniques: ['varied', 'boundary', 'expand'],
    words: [
      { w: 'Fridge', c: 'Home', ipa: '/frɪdʒ/', say: 'FRIJ', focus: 'j', why: 'Opened many times a day, and full of things to name.', acts: ['"The fridge! Let\'s open the fridge. What\'s in the fridge?"', 'Let them feel the cold air: "cold fridge".', 'Put a photo of them on the door and name both the photo and the fridge.'] },
      { w: 'Chair', c: 'Home', ipa: '/tʃeə/', say: 'CHAIR', focus: 'ch', why: 'Models the "ch" sound on a very familiar object.', acts: ['Pat the seat: "chair — sit on the chair".', 'Count the chairs at the table.', 'Push their chair in at every meal and name it as it arrives at the table.'] },
      { w: 'Table', c: 'Home', ipa: '/ˈteɪ.bəl/', say: 'TAY-bul', focus: 't', why: 'A landmark they now pull up on daily.', acts: ['Tap it: "table — the table is hard".', 'Play "under the table" peekaboo.', 'Wipe it together after eating and name it while you do.'] },
      { w: 'Bed', c: 'Home', ipa: '/bed/', say: 'BED', focus: 'b', why: 'Anchors the bedtime routine with a single clear word.', acts: ['"Bed time — into bed."', 'Same phrase, same order, every night.', 'Name it as you lay them down, the last word of the day.'] },
      { w: 'Window', c: 'Home', ipa: '/ˈwɪn.dəʊ/', say: 'WIN-doh', focus: 'w', why: 'A frame for naming everything outside it.', acts: ['"Look out of the window — what can you see?"', 'Name three things through it.', 'Draw a shape in the condensation and name the window, not the shape.'] },
      { w: 'Stairs', c: 'Home', ipa: '/steəz/', say: 'STAIRZ', focus: 's', why: 'A daily, physical, countable feature.', acts: ['Count as you climb: "one, two, three stairs".', 'Say "up the stairs… down the stairs".', 'Count them the same way every time so the number and the word pair up.'] },
      { w: 'Towel', c: 'Home', ipa: '/ˈtaʊ.əl/', say: 'TOW-ul', focus: 't', why: 'Arrives at the same moment every single bath.', acts: ['Wrap them up: "towel! Cosy towel."', 'Play peekaboo with it.', 'Play a hiding game under it, then name it as you rub them dry.'] },
      { w: 'Bin', c: 'Home', ipa: '/bɪn/', say: 'BIN', focus: 'b', why: 'A simple word attached to a satisfying action.', acts: ['"In the bin!" as you throw something away.', 'Let them post something in.', 'Give them the wrapper to post in themselves and name it as it drops.'] },
      { w: 'Phone', c: 'Objects', ipa: '/fəʊn/', say: 'FOHN', focus: 'f', why: 'Endlessly interesting to them — use that motivation.', acts: ['Pretend call: "hello? … bye!"', 'Hand it over and take turns talking.', 'Use a toy phone, not yours, so the word is not tangled up with a battle.'] },
      { w: 'Brush', c: 'Routine', ipa: '/brʌʃ/', say: 'BRUSH', focus: 'b', why: 'Twice-daily repetition, built into the routine.', acts: ['"Brush your teeth — brush brush brush."', 'Let them hold the brush and copy you.', 'Brush teddy’s hair first, then theirs, naming the brush both times.'] },
    ],
  },

  // ===================== 12–17 months: single words ======================
  {
    m: 12,
    title: 'First birthday words',
    focus: 'Consolidating the people and things they love most',
    summary:
      'Happy birthday! Most babies have a handful of real words now, and ' +
      'understand many more. Words for the people and objects they care about ' +
      'most will come first — motivation drives vocabulary at this age.',
    milestones: ['Uses 1–3 words meaningfully', 'Follows a simple instruction', 'Points to ask for things'],
    techniques: ['expand', 'joint', 'ids'],
    words: [
      { w: 'Mummy', c: 'People', ipa: '/ˈmʌm.i/', say: 'MUM-ee', focus: 'm', why: 'The most motivating word in their world.', acts: ['Say it when you arrive: "Mummy\'s here!"', 'Point to photos and name everyone.', 'Point them out in photos of people who are not in the room.'] },
      { w: 'Daddy', c: 'People', ipa: '/ˈdæd.i/', say: 'DAD-ee', focus: 'd', why: 'Easy consonants and huge emotional weight.', acts: ['"Where\'s Daddy? There\'s Daddy!"', 'Use it in three different sentences a day.', 'Play a “where’s Daddy?” hunt round the house, naming him each time you fail.'] },
      { w: 'Baby', c: 'People', ipa: '/ˈbeɪ.bi/', say: 'BAY-bee', focus: 'b', why: 'They now recognise themselves in the mirror.', acts: ['Mirror time: "who\'s that? That\'s baby!"', 'Name other babies you see out and about.', 'Point out babies in books and out in the street, not just in the mirror.'] },
      { w: 'Cake', c: 'Food', ipa: '/keɪk/', say: 'KAYK', focus: 'k', why: 'A birthday word with two "k" sounds to model.', acts: ['"Cake! Happy birthday cake."', 'Blow out a candle: "ready… blow!"', 'Sing “happy birthday” to a teddy and name the cake at the end.'] },
      { w: 'Juice', c: 'Food', ipa: '/dʒuːs/', say: 'JOOSS', focus: 'j', why: 'A want-word they can use to make a request.', acts: ['Hold the cup: "juice?" and wait for a sound.', 'Accept any attempt and give it straight away.', 'Offer a choice of two cups and name whichever they reach for.'] },
      { w: 'Bread', c: 'Food', ipa: '/bred/', say: 'BRED', focus: 'b', why: 'A daily food with a clear "b" start.', acts: ['"Bread — a piece of bread."', 'Let them tear it while you name it.', 'Let them help push the toaster down, then name what comes out.'] },
      { w: 'Cheese', c: 'Food', ipa: '/tʃiːz/', say: 'CHEEZ', focus: 'ch', why: 'Models "ch" and makes a great smiling face.', acts: ['"Cheese!" with a big grin.', 'Contrast "cheese" and "sneeze".', 'Say it while taking a photo — the smile and the word arrive together.'] },
      { w: 'Hug', c: 'Social', ipa: '/hʌɡ/', say: 'HUG', focus: 'h', why: 'A word they will happily request all day.', acts: ['Open your arms: "hug?" and wait.', 'Say it every single time you hug.', 'Ask teddy for one first, then them. Modelling it removes the pressure.'] },
      { w: 'Night-night', c: 'Routine', ipa: '/ˈnaɪt.naɪt/', say: 'NYTE-nyte', focus: 'redup', why: 'A repeated form, so it is easier than "goodnight".', acts: ['Same words, same order, every bedtime.', 'Wave to the room: "night-night, teddy".', 'Turn the lights off on the way out and say it from the doorway, always the same.'] },
      { w: 'Thank you', c: 'Manners', ipa: '/ˈθæŋk juː/', say: 'THANK-yoo', focus: 'th', why: 'Model it constantly; never require it back yet.', acts: ['Say it every time they hand you something.', 'Keep it warm, never a demand.', 'Say it to other people in front of them — the shop, the bus driver.'] },
    ],
  },
  {
    m: 13,
    title: 'Getting dressed',
    focus: 'Clothes words, twice a day, every day',
    summary:
      'Dressing is a slow, close, repetitive routine — perfect conditions for ' +
      'word learning. Name each item just before it goes on, then pause. Your ' +
      'toddler is starting to help, which means they are paying attention.',
    milestones: ['Holds out an arm or leg to help dress', 'Uses a few words consistently', 'Points to a familiar object when named'],
    techniques: ['boundary', 'varied', 'predict'],
    words: [
      { w: 'Socks', c: 'Clothes', ipa: '/sɒks/', say: 'SOKS', focus: 's', why: 'Two "s" sounds bracketing a short word.', acts: ['"Socks — on your feet!"', 'Play sock-pulling-off games and name it.', 'Hide one and hunt for it: “where’s the other sock?”'] },
      { w: 'Coat', c: 'Clothes', ipa: '/kəʊt/', say: 'KOHT', focus: 'k', why: 'Signals going out — a very motivating association.', acts: ['"Coat on — we\'re going out!"', 'Hold it up and pause before dressing.', 'Do the coat flip and name it as it lands on their shoulders.'] },
      { w: 'Trousers', c: 'Clothes', ipa: '/ˈtraʊ.zəz/', say: 'TROW-zerz', focus: 't', why: 'A longer word to stretch their syllable handling.', acts: ['"Trousers — one leg, two legs."', 'Count the legs in.', 'Name each leg going in: “one leg, two legs, trousers on”.'] },
      { w: 'Shirt', c: 'Clothes', ipa: '/ʃɜːt/', say: 'SHURT', focus: 'sh', why: 'Practises "sh" with an over-the-head game.', acts: ['"Where\'s your head? … There it is!" as it pops through.', 'Pause with the shirt over their face.', 'Play peekaboo as their head comes through the neck.'] },
      { w: 'Buttons', c: 'Clothes', ipa: '/ˈbʌt.ənz/', say: 'BUT-unz', focus: 'b', why: 'Small, countable and fascinating to little fingers.', acts: ['Count them as you do them up.', 'Let them touch each one.', 'Let them press the buttons on the washing machine and name those too.'] },
      { w: 'Boots', c: 'Clothes', ipa: '/buːts/', say: 'BOOTS', focus: 'b', why: 'Means puddles and outside — high motivation.', acts: ['"Boots on — puddle time!"', 'Stomp and name it.', 'Line them up by the door pointing outwards and name them as you pass.'] },
      { w: 'Warm', c: 'Concepts', ipa: '/wɔːm/', say: 'WAWM', focus: 'w', why: 'Connects clothing to a felt sensation.', acts: ['"Coat on — now you\'re warm."', 'Contrast with "cold" outside.', 'Warm your hands on a mug and let them feel it: “warm hands”.'] },
      { w: 'Off', c: 'Action', ipa: '/ɒf/', say: 'OFF', focus: 'f', why: 'The natural pair to "on", used constantly while dressing.', acts: ['"Socks off! Hat off!"', 'Alternate "on… off… on".', 'Let them pull their own socks off — the action they can already do.'] },
      { w: 'On', c: 'Action', ipa: '/ɒn/', say: 'ON', focus: 'n', why: 'Tiny, high-frequency and immediately useful.', acts: ['Say it as each item goes on.', 'Pause: "hat… ON!"', 'Sing an on-and-off song as you dress, one word per item.'] },
      { w: 'Help', c: 'Social', ipa: '/help/', say: 'HELP', focus: 'h', why: 'Gives them a word for frustration before it becomes a meltdown.', acts: ['Model it: "help? Mummy can help."', 'Offer the word when you see them struggle.', 'Offer the word before the frustration builds, not after it arrives.'] },
    ],
  },
  {
    m: 14,
    title: 'Out and about',
    focus: 'Vehicles, weather and the world outside',
    summary:
      'Trips out are packed with big, loud, moving things — which grab ' +
      'attention effortlessly. Narrate the walk. Vehicles come with sound ' +
      'effects, and sound effects are easier to imitate than words.',
    milestones: ['Walks a few steps or confidently', 'Understands several everyday words', 'Enjoys pointing things out to you'],
    techniques: ['joint', 'varied', 'quiet'],
    words: [
      { w: 'Bus', c: 'Vehicles', ipa: '/bʌs/', say: 'BUS', focus: 'b', why: 'Big, loud, and stars in a song they will know.', acts: ['"Bus! The wheels on the bus…"', 'Wave at every bus you see.', 'Sing “the wheels on the bus” while actually waiting at a bus stop.'] },
      { w: 'Train', c: 'Vehicles', ipa: '/treɪn/', say: 'TRAYN', focus: 't', why: 'Comes with a rhythmic chug that maps onto syllables.', acts: ['"Train — choo choo!"', 'Chug around the room together.', 'Line up chairs and chug along them together.'] },
      { w: 'Bike', c: 'Vehicles', ipa: '/baɪk/', say: 'BYKE', focus: 'b', why: 'Short, clear, and seen on every walk.', acts: ['"Bike! Ring ring."', 'Point out bikes as they pass.', 'Count the wheels: “one, two — two wheels on a bike”.'] },
      { w: 'Tree', c: 'Nature', ipa: '/triː/', say: 'TREE', focus: 't', why: 'A fixed landmark you can visit repeatedly.', acts: ['Touch the bark: "tree — rough tree".', 'Visit the same tree daily and name it.', 'Adopt one tree and visit it weekly, naming what has changed.'] },
      { w: 'Rain', c: 'Weather', ipa: '/reɪn/', say: 'RAYN', focus: 'r', why: 'Multi-sensory: seen, heard and felt at once.', acts: ['"Rain! Pitter patter."', 'Hold a hand out of the window to feel it.', 'Listen to it on the window with the lights off and name the sound.'] },
      { w: 'Sun', c: 'Weather', ipa: '/sʌn/', say: 'SUN', focus: 's', why: 'Bright, obvious and easy to point at.', acts: ['"Sun! The sun is warm."', 'Sing a sunshine song.', 'Draw one on a steamy window and name it.'] },
      { w: 'Wind', c: 'Weather', ipa: '/wɪnd/', say: 'WIND', focus: 'w', why: 'Something they can feel but not see — good for description.', acts: ['"Wind — whooosh!" as it blows their hair.', 'Blow gently on their face and name it.', 'Blow a dandelion or a tissue and name the wind, not the object.'] },
      { w: 'Puddle', c: 'Nature', ipa: '/ˈpʌd.əl/', say: 'PUD-ul', focus: 'p', why: 'Irresistible, and guarantees repeated use.', acts: ['"Puddle! Jump in the puddle."', 'Count the puddles on a walk.', 'Drop a stone in and name the splash and the puddle separately.'] },
      { w: 'Walk', c: 'Action', ipa: '/wɔːk/', say: 'WAWK', focus: 'w', why: 'Now something they do themselves, so it means more.', acts: ['"We\'re walking — walk, walk, walk."', 'Match the word to their steps.', 'Name the destination as you set off: “we walk to the park”.'] },
      { w: 'Outside', c: 'World', ipa: '/ˌaʊtˈsaɪd/', say: 'owt-SYDE', focus: 's', why: 'A longer word attached to a much-wanted event.', acts: ['"Outside? Let\'s go outside!"', 'Say it at the door every time.', 'Say it at the threshold every single time, so the word marks the boundary.'] },
    ],
  },
  {
    m: 15,
    title: 'Feelings have names',
    focus: 'Naming emotions as they happen — and first two-word phrases',
    summary:
      'Big feelings arrive well before the words for them. Naming an emotion ' +
      'in the moment helps your toddler recognise and eventually manage it. ' +
      'This is also when you can start modelling two-word phrases — say their ' +
      'word back and add one more.',
    milestones: ['Uses 5–10 words', 'Shows clear likes and dislikes', 'Brings you things to share'],
    techniques: ['expand', 'ids', 'joint'],
    words: [
      { w: 'Happy', c: 'Feelings', ipa: '/ˈhæp.i/', say: 'HAP-ee', focus: 'h', why: 'The easiest emotion to catch and name in the moment.', acts: ['"You\'re happy! Happy face."', 'Make happy faces in the mirror.', 'Draw a smiley face on a steamy window and name the feeling.'] },
      { w: 'Sad', c: 'Feelings', ipa: '/sæd/', say: 'SAD', focus: 's', why: 'Labelling sadness helps them feel understood.', acts: ['"You feel sad. It\'s okay to be sad."', 'Point out sad faces in books.', 'Name it in a book character before you ever need it for them.'] },
      { w: 'Cross', c: 'Feelings', ipa: '/krɒs/', say: 'KROSS', focus: 'k', why: 'Gives anger a name before it becomes a tantrum.', acts: ['"You\'re cross. That was frustrating."', 'Stay calm and keep your tone level.', 'Name your own: “Mummy feels cross. I’m going to breathe.”'] },
      { w: 'Tired', c: 'Feelings', ipa: '/ˈtaɪ.əd/', say: 'TY-erd', focus: 't', why: 'Helps them connect a body state to a word.', acts: ['At wind-down: "you\'re tired. Time to rest."', 'Yawn together dramatically.', 'Name it in the dog, the teddy and yourself, so it is not only about them.'] },
      { w: 'Scared', c: 'Feelings', ipa: '/skeəd/', say: 'SKAIRD', focus: 'k', why: 'Naming fear reduces it and invites comfort.', acts: ['"That was loud. You felt scared."', 'Hold them while you name it.', 'Name it, then name the safety: “that was loud. You are safe.”'] },
      { w: 'Love', c: 'Feelings', ipa: '/lʌv/', say: 'LUV', focus: 'l', why: 'Said often and felt deeply — an easy word to over-use.', acts: ['"I love you" at the same moments daily.', 'Pair it with a hug.', 'Say it at the same three moments daily — waking, leaving, bedtime.'] },
      { w: 'Cuddle', c: 'Social', ipa: '/ˈkʌd.əl/', say: 'KUD-ul', focus: 'k', why: 'A request word for comfort they will use for years.', acts: ['Open your arms: "cuddle?"', 'Wait for them to come to you.', 'Let them decide when it ends. The word means comfort, not compliance.'] },
      { w: 'Cry', c: 'Feelings', ipa: '/kraɪ/', say: 'KRY', focus: 'k', why: 'Names an action they know intimately.', acts: ['"You\'re crying. What\'s wrong?"', 'Name it in books too.', 'Never pair it with “don’t”. Name it, then offer the comfort.'] },
      { w: 'Better', c: 'Feelings', ipa: '/ˈbet.ə/', say: 'BET-er', focus: 'b', why: 'Closes the emotional loop after upset.', acts: ['"All better now."', 'Use it after every comfort.', 'Use it after a plaster, a cuddle or a nap — anything that mends something.'] },
      { w: 'Okay', c: 'Social', ipa: '/ˌəʊˈkeɪ/', say: 'oh-KAY', focus: 'k', why: 'A reassuring word they will start echoing.', acts: ['"You\'re okay. Mummy\'s here."', 'Use a calm, steady tone.', 'Say it in a low, slow voice. The tone teaches more than the word.'] },
    ],
    phrases: [
      { p: 'more milk', pattern: 'more + noun', tip: 'The most useful early pattern — swap the noun: more juice, more book, more cuddle.' },
      { p: 'bye Daddy', pattern: 'social + name', tip: 'Attach a name to a word they already have. Wave as you say it.' },
      { p: 'big dog', pattern: 'describing + noun', tip: 'When they say "dog", say it back with one word added: "big dog!"' },
    ],
  },
  {
    m: 16,
    title: 'Colours and shapes',
    focus: 'One property across many objects',
    summary:
      'Colour is abstract — it lives across objects rather than in one. That ' +
      'is why colour words take longer. Teach one colour at a time across many ' +
      'different things, stressing the colour word and not the object.',
    milestones: ['Uses 10–15 words', 'Points to pictures in a book', 'Sorts or lines up toys'],
    techniques: ['varied', 'contrast', 'boundary'],
    words: [
      { w: 'Red', c: 'Colours', ipa: '/red/', say: 'RED', focus: 'r', why: 'Usually the first colour word children produce.', acts: ['Find five red things: "red cup… red sock… red car".', 'Stress "red" each time, not the object.', 'Eat a red day: strawberries, tomato, red cup. Name the colour at every step.'] },
      { w: 'Blue', c: 'Colours', ipa: '/bluː/', say: 'BLOO', focus: 'b', why: 'Everywhere outdoors, so repetition is free.', acts: ['"Blue sky, blue coat, blue cup."', 'Sort blue toys into a pile.', 'Sort blue socks out of the laundry pile together.'] },
      { w: 'Orange', c: 'Colours', ipa: '/ˈɒr.ɪndʒ/', say: 'OR-inj', focus: 'j', why: 'A colour and a fruit — two meanings, one word.', acts: ['Hold an orange: "orange — it\'s orange!"', 'Find other orange things together.', 'Peel one and name the colour and the fruit as separate things.'] },
      { w: 'Purple', c: 'Colours', ipa: '/ˈpɜː.pəl/', say: 'PUR-pul', focus: 'p', why: 'Two "p" sounds and a satisfying rhythm.', acts: ['Point at grapes or flowers: "purple".', 'Sort purple things into a box.', 'Squash a blueberry and watch the colour appear on their fingers.'] },
      { w: 'Black', c: 'Colours', ipa: '/blæk/', say: 'BLAK', focus: 'b', why: 'High contrast, so it is visually easy.', acts: ['"Black shoes, black night."', 'Contrast black and white directly.', 'Point it out at night: “the sky is black now”.'] },
      { w: 'White', c: 'Colours', ipa: '/waɪt/', say: 'WYTE', focus: 'w', why: 'The clearest contrast partner for black.', acts: ['"White milk, white paper."', 'Say "black… white" back to back.', 'Name it on paper, milk and clouds — three very different white things.'] },
      { w: 'Circle', c: 'Shapes', ipa: '/ˈsɜː.kəl/', say: 'SUR-kul', focus: 's', why: 'The first shape most toddlers recognise.', acts: ['Trace it in the air: "circle — round and round".', 'Find circles: plates, wheels, the moon.', 'Roll everything round you can find and name the shape that rolls.'] },
      { w: 'Square', c: 'Shapes', ipa: '/skweə/', say: 'SKWAIR', focus: 's', why: 'Corners make it easy to feel as well as see.', acts: ['Trace the four sides on a book.', 'Count the sides: "one, two, three, four".', 'Post square blocks through a square hole and name the fit.'] },
      { w: 'Star', c: 'Shapes', ipa: '/stɑː/', say: 'STAH', focus: 's', why: 'Tied to a song they almost certainly know.', acts: ['Sing "Twinkle Twinkle" and point up.', 'Find star shapes on clothes and in books.', 'Cut one from foil and stick it above the cot.'] },
      { w: 'Same', c: 'Concepts', ipa: '/seɪm/', say: 'SAYM', focus: 's', why: 'The idea that makes sorting and matching possible.', acts: ['Hold up two matching socks: "same!"', 'Play a simple matching game.', 'Match socks from the dry washing and say it on every pair.'] },
    ],
    phrases: [
      { p: 'red ball', pattern: 'colour + noun', tip: 'Once a colour is solid, attach it to nouns they already know.' },
      { p: 'my turn', pattern: 'possessive + noun', tip: 'Model turn-taking language in every game.' },
      { p: 'all gone', pattern: 'quantity + state', tip: 'Say it at the end of every meal — it becomes automatic.' },
    ],
  },
  {
    m: 17,
    title: 'Bath and bedtime',
    focus: 'The evening routine as a language script',
    summary:
      'A routine that happens in the same order every night becomes a script ' +
      'your toddler can predict — and prediction is what lets them fill in the ' +
      'gaps. Use the same phrases in the same order, then start pausing before ' +
      'the key word and let them supply it.',
    milestones: ['Uses 15–20 words', 'Follows a two-part routine', 'Tries to join in with songs'],
    techniques: ['predict', 'rhythm', 'boundary'],
    words: [
      { w: 'Bubbles', c: 'Play', ipa: '/ˈbʌb.əlz/', say: 'BUB-ulz', focus: 'b', why: 'Three "b" sounds and endless fun.', acts: ['"Bubbles! Pop the bubbles."', 'Pause before blowing each time.', 'Chase them across the room and name each one before it pops.'] },
      { w: 'Splash', c: 'Action', ipa: '/splæʃ/', say: 'SPLASH', focus: 'sh', why: 'The word sounds like the thing it means.', acts: ['"Splash!" every time they hit the water.', 'Narrate their own actions back.', 'Take turns: they splash, you splash, naming whose turn it is.'] },
      { w: 'Soap', c: 'Routine', ipa: '/səʊp/', say: 'SOHP', focus: 's', why: 'A daily object with a clean "s" onset.', acts: ['"Soap — slippery soap!"', 'Let them hold it and lose it.', 'Let them wash your hands and name the soap while they do.'] },
      { w: 'Wet', c: 'Concepts', ipa: '/wet/', say: 'WET', focus: 'w', why: 'A felt sensation paired with a short word.', acts: ['"You\'re wet! Now let\'s get dry."', 'Contrast wet and dry with a towel.', 'Name a wet flannel and a dry one held one in each hand.'] },
      { w: 'Dry', c: 'Concepts', ipa: '/draɪ/', say: 'DRY', focus: 'd', why: 'The other half of the wet/dry pair.', acts: ['Rub with the towel: "dry, dry, dry".', 'Say "wet… dry" as it changes.', 'Rub each limb dry in the same order, naming it as a routine.'] },
      { w: 'Pyjamas', c: 'Clothes', ipa: '/pəˈdʒɑː.məz/', say: 'puh-JAH-muz', focus: 'j', why: 'Three syllables, said every single night.', acts: ['"Pyjamas on — bedtime soon."', 'Clap the three syllables: pa-ja-mas.', 'Let them choose between two pairs and name the one they pick.'] },
      { w: 'Story', c: 'Routine', ipa: '/ˈstɔː.ri/', say: 'STAW-ree', focus: 's', why: 'Names the ritual that builds every later language skill.', acts: ['"Story time! Which story?"', 'Let them choose between two books.', 'Let them turn the pages and set the pace. Naming the ritual matters more than the words.'] },
      { w: 'Teeth', c: 'Body', ipa: '/tiːθ/', say: 'TEETH', focus: 'th', why: 'Twice-daily repetition, guaranteed.', acts: ['"Brush your teeth — teeth!"', 'Show your own teeth in the mirror.', 'Show them yours in the mirror, then count theirs out loud.'] },
      { w: 'Blanket', c: 'Home', ipa: '/ˈblæŋ.kɪt/', say: 'BLANG-kit', focus: 'b', why: 'The comfort object of the whole routine.', acts: ['"Blanket on — snug as a bug."', 'Play peekaboo under it.', 'Tuck teddy in first, naming the blanket, then do the same for them.'] },
      { w: 'Sleepy', c: 'Feelings', ipa: '/ˈsliː.pi/', say: 'SLEE-pee', focus: 's', why: 'Names the state you want them to notice in themselves.', acts: ['"You look sleepy. Time for bed."', 'Lower your voice as you say it.', 'Yawn deliberately and name it — yawns are contagious and so is the word.'] },
    ],
    phrases: [
      { p: 'night night', pattern: 'repeated social phrase', tip: 'Say it to every toy in turn — it multiplies the practice.' },
      { p: 'more story', pattern: 'more + noun', tip: 'Let them request one more with words rather than protest.' },
      { p: 'wet hands', pattern: 'describing + noun', tip: 'Narrate the bath in two-word chunks.' },
    ],
  },

  // ===================== 18–23 months: word combos =======================
  {
    m: 18,
    title: 'The word explosion',
    focus: 'Verbs — the engine of sentences',
    summary:
      'Many toddlers hit a sudden acceleration around now, sometimes learning ' +
      'several words a day. Verbs matter most: a sentence needs a verb, so ' +
      'every verb you add unlocks dozens of new combinations.',
    milestones: ['Uses 20–50+ words', 'Starts joining two words', 'Points to body parts on request'],
    techniques: ['expand', 'varied', 'joint'],
    words: [
      { w: 'Jump', c: 'Action', ipa: '/dʒʌmp/', say: 'JUMP', focus: 'j', why: 'Big-movement verbs are learned through the body.', acts: ['Jump together: "jump! We jump high."', 'Make a toy jump and narrate.', 'Jump off the bottom stair holding both hands, naming every landing.'] },
      { w: 'Run', c: 'Action', ipa: '/rʌn/', say: 'RUN', focus: 'r', why: 'Short, high-frequency and very physical.', acts: ['"Run! You\'re running fast."', 'Chase and narrate as you go.', 'Race to a fixed point and name the running, not the winning.'] },
      { w: 'Eat', c: 'Action', ipa: '/iːt/', say: 'EET', focus: 't', why: 'Used many times daily with many different nouns.', acts: ['"Eat the apple. Eat the bread."', 'Vary the noun, keep the verb.', 'Feed a doll a pretend meal and narrate every mouthful.'] },
      { w: 'Sleep', c: 'Action', ipa: '/sliːp/', say: 'SLEEP', focus: 's', why: 'Applies to people, animals and toys alike.', acts: ['"Teddy is sleeping. Shh."', 'Put toys to bed together.', 'Put every toy to bed in a row, naming the verb each time.'] },
      { w: 'Wash', c: 'Action', ipa: '/wɒʃ/', say: 'WOSH', focus: 'w', why: 'A routine verb with a visible lip shape.', acts: ['"Wash hands. Wash the cup."', 'Swap the object each time.', 'Wash a toy car in a bowl and name the action, not the car.'] },
      { w: 'Read', c: 'Action', ipa: '/riːd/', say: 'REED', focus: 'r', why: 'Names the activity that grows every other skill.', acts: ['"Let\'s read! Read the book."', 'Let them "read" to you.', 'Let them “read” a familiar book to you and listen properly.'] },
      { w: 'Sing', c: 'Action', ipa: '/sɪŋ/', say: 'SING', focus: 'ng', why: 'Music carries language and they can join in.', acts: ['"Sing with me!"', 'Pause before the last word of a line.', 'Stop mid-line and wait. Leaving the gap is the whole technique.'] },
      { w: 'Draw', c: 'Action', ipa: '/drɔː/', say: 'DRAW', focus: 'd', why: 'Introduces a creative activity with its own vocabulary.', acts: ['"Draw! Draw a circle."', 'Name what they make, whatever it is.', 'Draw round their hand and name the drawing as it appears.'] },
      { w: 'Build', c: 'Action', ipa: '/bɪld/', say: 'BILD', focus: 'b', why: 'Blocks give a natural, repeatable verb context.', acts: ['"Build a tower — up, up, up!"', 'Knock it down and build again.', 'Build it, knock it down, build it again — three chances to say the word.'] },
      { w: 'Help', c: 'Action', ipa: '/help/', say: 'HELP', focus: 'h', why: 'Turns frustration into communication.', acts: ['"Do you need help? Say help."', 'Respond instantly when they use it.', 'Ask them for help with a real task: carrying, posting, passing.'] },
      { w: 'Find', c: 'Action', ipa: '/faɪnd/', say: 'FYND', focus: 'f', why: 'Powers hide-and-seek and searching games.', acts: ['"Find the ball! Where is it?"', 'Hide a toy under a cloth.', 'Hide three familiar objects and name each one as it turns up.'] },
      { w: 'Give', c: 'Action', ipa: '/ɡɪv/', say: 'GIV', focus: 'g', why: 'Central to sharing and turn-taking.', acts: ['"Give it to Mummy. Thank you!"', 'Pass an object back and forth.', 'Play pass-the-parcel with one toy and a lot of naming.'] },
    ],
    phrases: [
      { p: 'Daddy go', pattern: 'person + verb', tip: 'The classic first sentence shape. Narrate who is doing what all day.' },
      { p: 'want juice', pattern: 'want + noun', tip: 'Gives them a polite way to request instead of pointing and whining.' },
      { p: 'teddy sleeping', pattern: 'noun + verb-ing', tip: 'Narrate what toys are doing — it is low pressure and very repeatable.' },
    ],
  },
  {
    m: 19,
    title: 'Opposites',
    focus: 'Pairs that teach each other',
    summary:
      'Opposites are efficient: each word makes the other clearer. Teach them ' +
      'in pairs and demonstrate the contrast physically in the same breath — ' +
      '"big… small", with your body showing the difference.',
    milestones: ['Combines two words sometimes', 'Understands many more words than they say', 'Enjoys simple pretend play'],
    techniques: ['contrast', 'ids', 'expand'],
    words: [
      { w: 'Big', c: 'Concepts', ipa: '/bɪɡ/', say: 'BIG', focus: 'b', why: 'Easy to show with your whole body.', acts: ['Stretch your arms wide: "sooo BIG!"', 'Compare two teddies directly.', 'Compare two of the same thing, not two different things — a big spoon and a small spoon.'] },
      { w: 'Small', c: 'Concepts', ipa: '/smɔːl/', say: 'SMAWL', focus: 's', why: 'The contrast that gives "big" its meaning.', acts: ['Pinch your fingers: "tiny and small".', 'Say "big… small" back to back.', 'Make yourself small on the floor and name it with your whole body.'] },
      { w: 'Fast', c: 'Concepts', ipa: '/fɑːst/', say: 'FAST', focus: 'f', why: 'Felt in the body during movement games.', acts: ['Run fast, then say it: "fast!"', 'Push a car quickly and slowly.', 'Wind a toy car up and let it go: “fast!”'] },
      { w: 'Slow', c: 'Concepts', ipa: '/sləʊ/', say: 'SLOH', focus: 's', why: 'Stretch the word out to match the meaning.', acts: ['"Slooooow" in a low, drawn-out voice.', 'Walk in slow motion together.', 'Move in slow motion together and stretch the word out to match.'] },
      { w: 'Loud', c: 'Concepts', ipa: '/laʊd/', say: 'LOWD', focus: 'l', why: 'Volume is a concept they can control themselves.', acts: ['Bang a drum: "loud!"', 'Then whisper: "quiet".', 'Bang a pan, then name it. Then whisper the same word to show the contrast.'] },
      { w: 'Quiet', c: 'Concepts', ipa: '/ˈkwaɪ.ət/', say: 'KWY-ut', focus: 'k', why: 'Genuinely useful, and fun as a game.', acts: ['Whisper it: "quiet… shhh".', 'Play the whisper game.', 'Make it a game with a reward: “when we are quiet, we can hear the birds”.'] },
      { w: 'Up', c: 'Position', ipa: '/ʌp/', say: 'UP', focus: 'p', why: 'One of the earliest and most-used position words.', acts: ['Lift high: "up!"', 'Raise your pitch as you say it.', 'Send a balloon up and name where it goes.'] },
      { w: 'Down', c: 'Position', ipa: '/daʊn/', say: 'DOWN', focus: 'd', why: 'Drop your pitch to match the meaning.', acts: ['Lower slowly: "doooown".', 'Alternate up and down.', 'Roll a ball down a slope and name the direction.'] },
      { w: 'Empty', c: 'Concepts', ipa: '/ˈemp.ti/', say: 'EMP-tee', focus: 'm', why: 'Demonstrable with any cup or box.', acts: ['Tip a cup over: "empty! All gone."', 'Fill it again: "full".', 'Tip a box out completely and name what is left: nothing.'] },
      { w: 'Full', c: 'Concepts', ipa: '/fʊl/', say: 'FUUL', focus: 'f', why: 'Applies to cups, tummies and boxes.', acts: ['"The cup is full."', 'Pat their tummy after a meal: "full!"', 'Fill a cup to the top with them watching and stop at “full”.'] },
      { w: 'Dirty', c: 'Concepts', ipa: '/ˈdɜː.ti/', say: 'DUR-tee', focus: 'd', why: 'A concept they generate plenty of evidence for.', acts: ['"Dirty hands! Let\'s wash them."', 'Then: "clean hands!"', 'Name muddy boots before they come inside.'] },
      { w: 'Clean', c: 'Concepts', ipa: '/kliːn/', say: 'KLEEN', focus: 'k', why: 'Completes the pair and closes the routine.', acts: ['After washing: "all clean!"', 'Say "dirty… clean" as it changes.', 'Name it at the end of the bath, not the start — it is the result, not the process.'] },
    ],
    phrases: [
      { p: 'big truck', pattern: 'describing + noun', tip: 'Attach each new describing word to nouns they already own.' },
      { p: 'all gone', pattern: 'quantity + state', tip: 'Use at the end of meals, baths and games.' },
      { p: 'go fast', pattern: 'verb + describing', tip: 'Combine a verb with a new concept word.' },
    ],
  },
  {
    m: 20,
    title: 'Nature and weather',
    focus: 'Words for the world outside the window',
    summary:
      'Outdoor words extend attention beyond the room and give you fresh ' +
      'material every day. Weather changes, so the same words come up in ' +
      'genuinely different sentences — exactly the varied repetition that ' +
      'helps a word settle.',
    milestones: ['Uses 50+ words', 'Asks for things by name', 'Names familiar pictures'],
    techniques: ['varied', 'joint', 'quiet'],
    words: [
      { w: 'Flower', c: 'Nature', ipa: '/ˈflaʊ.ə/', say: 'FLOW-er', focus: 'f', why: 'Smellable, touchable and colourful all at once.', acts: ['Smell one: "flower — mmm!"', 'Name the colour too.', 'Pick one and put it in a glass, naming it every time you pass.'] },
      { w: 'Leaf', c: 'Nature', ipa: '/liːf/', say: 'LEEF', focus: 'l', why: 'Free, everywhere, and collectable.', acts: ['Collect leaves: "one leaf, two leaves".', 'Crunch a dry one.', 'Make a rubbing with a crayon and name the leaf as it appears.'] },
      { w: 'Grass', c: 'Nature', ipa: '/ɡrɑːs/', say: 'GRASS', focus: 'g', why: 'A texture they can feel with hands and feet.', acts: ['Bare feet on grass: "grass — tickly!"', 'Name the colour: "green grass".', 'Lie on it and look up. Name what is under them.'] },
      { w: 'Cloud', c: 'Weather', ipa: '/klaʊd/', say: 'KLOWD', focus: 'k', why: 'Invites looking up and wondering.', acts: ['Lie down and watch: "cloud — it\'s moving".', 'Say what shapes you see.', 'Say what each one looks like — the naming game matters more than being right.'] },
      { w: 'Snow', c: 'Weather', ipa: '/snəʊ/', say: 'SNOH', focus: 's', why: 'Rare and magical, so highly memorable.', acts: ['"Snow! Cold snow."', 'Catch a flake and name it.', 'Bring a handful inside in a bowl and watch it vanish, naming it as it goes.'] },
      { w: 'Moon', c: 'Nature', ipa: '/muːn/', say: 'MOON', focus: 'm', why: 'A long, hummy vowel and a bedtime ritual.', acts: ['"Moon! Say night-night to the moon."', 'Look for it every evening.', 'Look for it in the daytime sky, which surprises them every time.'] },
      { w: 'Water', c: 'Nature', ipa: '/ˈwɔː.tə/', say: 'WAW-ter', focus: 'w', why: 'Appears in the bath, the sink, the rain and the sea.', acts: ['Name it in four different places today.', 'Pour it and narrate.', 'Pour between two jugs and name it on every pour.'] },
      { w: 'Stone', c: 'Nature', ipa: '/stəʊn/', say: 'STOHN', focus: 's', why: 'Heavy, hard and collectable.', acts: ['"Stone — heavy stone."', 'Drop one in a puddle: "splash!"', 'Collect one from every walk and keep them in a jar you name together.'] },
      { w: 'Butterfly', c: 'Nature', ipa: '/ˈbʌt.ə.flaɪ/', say: 'BUT-er-fly', focus: 'b', why: 'Three syllables and a sense of wonder.', acts: ['"Butterfly! It flies."', 'Clap the three syllables.', 'Make one from a folded paper and name it as it opens.'] },
      { w: 'Garden', c: 'World', ipa: '/ˈɡɑː.dən/', say: 'GAH-dun', focus: 'g', why: 'Names the place where all these words live.', acts: ['"Let\'s go in the garden."', 'Name three things in it each visit.', 'Give them one pot of their own and name the garden every time you water it.'] },
    ],
    phrases: [
      { p: 'wet grass', pattern: 'describing + noun', tip: 'Weather makes the same noun change description daily.' },
      { p: 'look moon', pattern: 'verb + noun', tip: 'Model the pointing-out sentence they will soon use themselves.' },
      { p: 'more outside', pattern: 'more + place', tip: 'Let them ask to stay out longer with words.' },
    ],
  },
  {
    m: 21,
    title: 'Toys and pretend play',
    focus: 'Pretend play as a language workout',
    summary:
      'Pretend play is where language really stretches: your toddler has to ' +
      'name things that are not literally there. Feeding teddy, driving a ' +
      'block as a car — every pretend act is an invitation to narrate.',
    milestones: ['Pretends to feed a doll or teddy', 'Uses two-word phrases more often', 'Copies household activities'],
    techniques: ['expand', 'joint', 'predict'],
    words: [
      { w: 'Blocks', c: 'Toys', ipa: '/blɒks/', say: 'BLOKS', focus: 'b', why: 'Countable, stackable and endlessly re-nameable.', acts: ['"Blocks — build a tower."', 'Count them as you stack.', 'Sort them by colour before building, naming both the colour and the blocks.'] },
      { w: 'Doll', c: 'Toys', ipa: '/dɒl/', say: 'DOL', focus: 'd', why: 'A character to talk about and talk to.', acts: ['"The doll is hungry. Feed the doll."', 'Give the doll a voice.', 'Give the doll a name and use both: “the doll — Rosie — is hungry”.'] },
      { w: 'Puzzle', c: 'Toys', ipa: '/ˈpʌz.əl/', say: 'PUZ-ul', focus: 'p', why: 'Generates natural problem-solving talk.', acts: ['"Where does it go? In… there!"', 'Name each piece as you place it.', 'Take one piece out of a finished puzzle and let them find where it goes.'] },
      { w: 'Bricks', c: 'Toys', ipa: '/brɪks/', say: 'BRIKS', focus: 'b', why: 'A consonant cluster in a very familiar word.', acts: ['"Bricks — click them together."', 'Sort them by colour.', 'Make a tower as tall as them and name it as you measure.'] },
      { w: 'Drum', c: 'Toys', ipa: '/drʌm/', say: 'DRUM', focus: 'd', why: 'Rhythm practice, which underpins speech timing.', acts: ['Tap a steady beat and say a word per beat.', 'Copy their rhythm back.', 'Copy their rhythm exactly, then add one beat and see if they copy back.'] },
      { w: 'Slide', c: 'Play', ipa: '/slaɪd/', say: 'SLYDE', focus: 's', why: 'A whole sequence to narrate: climb, sit, slide.', acts: ['"Up the steps… ready… slide!"', 'Hold the pause at the top.', 'Send a toy down first and name the slide before they go.'] },
      { w: 'Swing', c: 'Play', ipa: '/swɪŋ/', say: 'SWING', focus: 'ng', why: 'Rhythmic and repetitive — perfect for chanting.', acts: ['Push in time: "swing… swing… swing".', 'Pause and wait for a request.', 'Chant one word per push, so the rhythm carries the word.'] },
      { w: 'Hide', c: 'Action', ipa: '/haɪd/', say: 'HYDE', focus: 'h', why: 'Powers the game that teaches object permanence.', acts: ['"Hide! Where are you?"', 'Take turns hiding.', 'Hide badly, on purpose. Being found is the fun part.'] },
      { w: 'Cook', c: 'Action', ipa: '/kʊk/', say: 'KUUK', focus: 'k', why: 'Pretend cooking mirrors what they watch you do.', acts: ['"Cook the dinner. Stir it!"', 'Use a real spoon and bowl.', 'Give them a real bowl and spoon while you cook, and narrate both.'] },
      { w: 'Turn', c: 'Social', ipa: '/tɜːn/', say: 'TURN', focus: 't', why: 'The word that makes shared play possible.', acts: ['"My turn… your turn."', 'Keep the turns short at first.', 'Use a timer for turns so the word is attached to something fair and visible.'] },
    ],
    phrases: [
      { p: 'my turn', pattern: 'possessive + noun', tip: 'Alternate "my turn / your turn" in every game.' },
      { p: 'teddy eat', pattern: 'noun + verb', tip: 'Narrate pretend play as simple sentences.' },
      { p: 'build tower', pattern: 'verb + noun', tip: 'Pair each new verb with a familiar noun.' },
    ],
  },
  {
    m: 22,
    title: 'Where things are',
    focus: 'Position words and following instructions',
    summary:
      'Position words unlock two-step instructions and richer sentences. They ' +
      'are best taught physically: put the teddy in, on and under the box while ' +
      'you say the word, and let them do it too.',
    milestones: ['Follows a two-step instruction', 'Uses two-word phrases regularly', 'Names several body parts'],
    techniques: ['boundary', 'contrast', 'expand'],
    words: [
      { w: 'In', c: 'Position', ipa: '/ɪn/', say: 'IN', focus: 'n', why: 'The easiest position word to demonstrate.', acts: ['"Put teddy IN the box."', 'Stress the position word.', 'Post things through a slot cut in a box lid and name each one going in.'] },
      { w: 'Out', c: 'Position', ipa: '/aʊt/', say: 'OWT', focus: 't', why: 'The natural partner to "in".', acts: ['"Take it OUT again."', 'In, out, in, out.', 'Tip the box out at the end and name the reverse.'] },
      { w: 'On', c: 'Position', ipa: '/ɒn/', say: 'ON', focus: 'n', why: 'Tiny and used dozens of times a day.', acts: ['"On the table. On your head!"', 'Be silly with the placements.', 'Stack cushions and name each one going on top.'] },
      { w: 'Under', c: 'Position', ipa: '/ˈʌn.də/', say: 'UN-der', focus: 'd', why: 'Powers hide-and-seek and searching games.', acts: ['Hide a toy: "it\'s UNDER the blanket!"', 'Ask them to find it.', 'Crawl under the table together and name where you both are.'] },
      { w: 'Behind', c: 'Position', ipa: '/bɪˈhaɪnd/', say: 'bee-HYND', focus: 'b', why: 'A harder one — needs physical demonstration.', acts: ['"You\'re BEHIND the door!"', 'Line up toys and describe positions.', 'Play hide and seek and name the hiding place when you find them.'] },
      { w: 'Next to', c: 'Position', ipa: '/ˈnekst tuː/', say: 'NEKST-too', focus: 'n', why: 'Introduces relative position between two things.', acts: ['"The cup is next to the plate."', 'Arrange toys in a row.', 'Sit their teddy next to them at dinner and name the arrangement.'] },
      { w: 'Top', c: 'Position', ipa: '/tɒp/', say: 'TOP', focus: 't', why: 'Useful for towers, stairs and shelves.', acts: ['"On top! Right at the top."', 'Stack blocks and name the top one.', 'Put the last block on and name the top, not the tower.'] },
      { w: 'Inside', c: 'Position', ipa: '/ˌɪnˈsaɪd/', say: 'in-SYDE', focus: 's', why: 'A two-syllable extension of "in".', acts: ['"Inside the house. Inside the box."', 'Contrast with "outside".', 'Name it as you come in from the cold, opposite “outside”.'] },
      { w: 'Away', c: 'Position', ipa: '/əˈweɪ/', say: 'uh-WAY', focus: 'w', why: 'Makes tidying a language activity.', acts: ['"Put it away — all away!"', 'Sing a tidy-up song.', 'Sing the same tidy-up song every time so the word has a tune.'] },
      { w: 'Here', c: 'Position', ipa: '/hɪə/', say: 'HEER', focus: 'h', why: 'Constantly useful and easy to gesture.', acts: ['Pat the spot: "here! Come here."', 'Contrast with "there".', 'Pat the spot beside you and say it, rather than pointing from a distance.'] },
    ],
    phrases: [
      { p: 'in box', pattern: 'position + noun', tip: 'Give little instructions all day: "in box", "on chair".' },
      { p: 'teddy under', pattern: 'noun + position', tip: 'Let them place the toy and describe where it went.' },
      { p: 'put away', pattern: 'verb + position', tip: 'Attach position words to tidy-up time.' },
    ],
  },
  {
    m: 23,
    title: 'Counting begins',
    focus: 'Numbers attached to real, touchable things',
    summary:
      'Counting starts as a rhythm, not as maths. Say numbers in order while ' +
      'touching real objects one at a time — the touch is what connects the ' +
      'word to the quantity. Do not worry about accuracy yet.',
    milestones: ['Repeats words they hear', 'Uses 50–100+ words', 'Joins in with counting rhythms'],
    techniques: ['rhythm', 'boundary', 'varied'],
    words: [
      { w: 'One', c: 'Numbers', ipa: '/wʌn/', say: 'WUN', focus: 'w', why: 'The first number and the concept of a single thing.', acts: ['Hold up one finger: "one!"', 'Give exactly one grape: "one".', 'Give one thing at a time and name the number before you hand it over.'] },
      { w: 'Two', c: 'Numbers', ipa: '/tuː/', say: 'TOO', focus: 't', why: 'Pairs are everywhere: shoes, socks, hands, eyes.', acts: ['Count their shoes: "one, two!"', 'Point out pairs all day.', 'Count their shoes, their hands and their eyes — pairs are everywhere.'] },
      { w: 'Three', c: 'Numbers', ipa: '/θriː/', say: 'THREE', focus: 'th', why: 'Models a late sound in a very frequent word.', acts: ['Count three steps: "one, two, three!"', 'Do not expect the "th" back yet.', 'Count three claps, three jumps, three kisses. Actions count better than objects.'] },
      { w: 'Four', c: 'Numbers', ipa: '/fɔː/', say: 'FAW', focus: 'f', why: 'Extends the counting rhythm one further.', acts: ['Count four wheels on a toy car.', 'Touch each one as you count.', 'Count the legs on a chair or a dog.'] },
      { w: 'Five', c: 'Numbers', ipa: '/faɪv/', say: 'FYVE', focus: 'f', why: 'One hand — the perfect built-in counter.', acts: ['Count their fingers: "…four, five!"', 'Sing "five little ducks".', 'Sing “five little ducks” and put a finger down on each verse.'] },
      { w: 'More', c: 'Numbers', ipa: '/mɔː/', say: 'MAW', focus: 'm', why: 'The earliest and most useful quantity word.', acts: ['"More? One more."', 'Combine: "more grapes".', 'Ask “more or finished?” so it is a real choice, not a rule.'] },
      { w: 'Lots', c: 'Numbers', ipa: '/lɒts/', say: 'LOTS', focus: 'l', why: 'A quantity word that needs no exact counting.', acts: ['"Lots of bubbles!"', 'Contrast with "one".', 'Tip out the whole box: “lots and lots!”'] },
      { w: 'None', c: 'Numbers', ipa: '/nʌn/', say: 'NUN', focus: 'n', why: 'Zero is a real concept and worth naming.', acts: ['Show an empty hand: "none — all gone".', 'Play a disappearing game.', 'Show empty hands after a snack: “all gone — none left”.'] },
      { w: 'Again', c: 'Concepts', ipa: '/əˈɡen/', say: 'uh-GEN', focus: 'g', why: 'Lets them request a repeat with words.', acts: ['Pause after a game: "again?"', 'Wait for the word before repeating.', 'Let them ask before you repeat, even if the wait is long.'] },
      { w: 'Last', c: 'Concepts', ipa: '/lɑːst/', say: 'LAST', focus: 'l', why: 'Prepares them for transitions and endings.', acts: ['"One more, then it\'s the last one."', 'Follow through consistently.', 'Give a warning that is always honoured: “one more, then last”.'] },
    ],
    phrases: [
      { p: 'two shoes', pattern: 'number + noun', tip: 'Count things they wear and touch, not abstract numbers.' },
      { p: 'one more', pattern: 'number + quantity', tip: 'Use it to manage transitions kindly.' },
      { p: 'lots of bubbles', pattern: 'quantity + of + noun', tip: 'A three-word phrase — stretch them gently.' },
    ],
  },

  // ===================== 24–36 months: sentences =========================
  {
    m: 24,
    title: 'Sentences start here',
    focus: 'Pronouns and three-word sentences',
    summary:
      'Two years old. Your toddler is starting to use "I", "you" and "me" and ' +
      'to build three-word sentences. Keep expanding: whatever they say, say it ' +
      'back with one more element added. That single habit does most of the work.',
    milestones: ['Uses 2–3 word sentences', 'Uses "I", "me", "you"', 'Follows two-step instructions'],
    techniques: ['expand', 'joint', 'varied'],
    words: [
      { w: 'Me', c: 'Language', ipa: '/miː/', say: 'MEE', focus: 'm', why: 'Self-reference is a big cognitive step.', acts: ['"Who wants a biscuit? Me!"', 'Point to yourself as you say it.', 'Look in a mirror together and take turns pointing: “me… you”.'] },
      { w: 'You', c: 'Language', ipa: '/juː/', say: 'YOO', focus: 'y', why: 'The other half of the conversational pair.', acts: ['"I do it… you do it."', 'Point clearly as you switch.', 'Pass a toy back and forth naming who has it: “you have it, now me”.'] },
      { w: 'Mine', c: 'Language', ipa: '/maɪn/', say: 'MYNE', focus: 'm', why: 'Possession is central to toddler social life.', acts: ['"That\'s mine. This is yours."', 'Keep it calm and matter-of-fact.', 'Name what belongs to whom at dinner: “your cup, my cup”.'] },
      { w: 'Want', c: 'Action', ipa: '/wɒnt/', say: 'WONT', focus: 'w', why: 'Turns demands into sentences.', acts: ['"I want juice. What do you want?"', 'Model the whole sentence.', 'Offer two things and make them choose. Wanting needs an alternative to mean anything.'] },
      { w: 'Go', c: 'Action', ipa: '/ɡəʊ/', say: 'GOH', focus: 'g', why: 'Combines with almost any noun or place.', acts: ['"I go outside. We go now."', 'Vary who is going.', 'Narrate departures: “the bus goes, the dog goes, we go”.'] },
      { w: 'Come', c: 'Action', ipa: '/kʌm/', say: 'KUM', focus: 'k', why: 'Directional partner to "go".', acts: ['"Come here. Come with me."', 'Gesture as you say it.', 'Use it with a welcoming gesture, never as a summons from another room.'] },
      { w: 'See', c: 'Action', ipa: '/siː/', say: 'SEE', focus: 's', why: 'Powers the pointing-out sentences they love.', acts: ['"I see a dog! What do you see?"', 'Take turns spotting things.', 'Play I-spy with colours rather than letters at this age.'] },
      { w: 'Make', c: 'Action', ipa: '/meɪk/', say: 'MAYK', focus: 'm', why: 'Creative verb for building, drawing and cooking.', acts: ['"Let\'s make a tower."', 'Narrate what you are making.', 'Bake something simple and name what you are making at every step.'] },
      { w: 'Ours', c: 'Language', ipa: '/ˈaʊ.əz/', say: 'OW-erz', focus: 'vowel', why: 'Introduces shared possession — a step past "mine".', acts: ['"This is ours. We share it."', 'Use during shared play.', 'Name shared things at home: “our house, our table”.'] },
      { w: 'Please', c: 'Manners', ipa: '/pliːz/', say: 'PLEEZ', focus: 'p', why: 'Learned by modelling, never by demanding.', acts: ['Model it: "juice please".', 'Never withhold until they say it.', 'Model it with a sing-song lift at the end so it sounds warm, not stern.'] },
    ],
    phrases: [
      { p: 'I want juice', pattern: 'pronoun + verb + noun', tip: 'The three-word backbone. Model it dozens of times a day.' },
      { p: 'Mummy go car', pattern: 'person + verb + place', tip: 'Narrate who is going where.' },
      { p: 'I see dog', pattern: 'pronoun + verb + noun', tip: 'Take turns spotting and naming on every walk.' },
    ],
  },
  {
    m: 25,
    title: 'Animals everywhere',
    focus: 'Expanding categories — farm, wild and pets',
    summary:
      'Your toddler can now hold categories in mind. Animals are the perfect ' +
      'category to build: lots of members, each with a sound, a size and a ' +
      'home. Group them out loud — "that\'s a farm animal".',
    milestones: ['Names many familiar animals', 'Sorts objects into groups', 'Uses 200+ words'],
    techniques: ['contrast', 'expand', 'joint'],
    words: [
      { w: 'Elephant', c: 'Animals', ipa: '/ˈel.ə.fənt/', say: 'EL-uh-funt', focus: 'f', why: 'Three syllables stretches their word length.', acts: ['"Elephant! Big grey elephant."', 'Clap the three syllables.', 'Use an arm as a trunk to pick things up, naming it each time.'] },
      { w: 'Lion', c: 'Animals', ipa: '/ˈlaɪ.ən/', say: 'LY-un', focus: 'l', why: 'A great "l" model with an irresistible roar.', acts: ['"Lion — ROAR!"', 'Take turns roaring.', 'Roar loudly, then quietly, and name the animal both times.'] },
      { w: 'Monkey', c: 'Animals', ipa: '/ˈmʌŋ.ki/', say: 'MUNG-kee', focus: 'ng', why: 'Contains the "ng" sound in the middle.', acts: ['"Monkey! Ooh ooh ah ah."', 'Do the actions together.', 'Hang from your hands together and name it while you swing.'] },
      { w: 'Rabbit', c: 'Animals', ipa: '/ˈræb.ɪt/', say: 'RAB-it', focus: 'r', why: 'Models the late "r" — expect "wabbit" for years.', acts: ['"Rabbit — hop hop hop!"', 'Hop together.', 'Hop everywhere for one minute and name the animal you are being.'] },
      { w: 'Chicken', c: 'Animals', ipa: '/ˈtʃɪk.ɪn/', say: 'CHIK-in', focus: 'ch', why: 'A clear "ch" at the start of a familiar animal.', acts: ['"Chicken — cluck cluck."', 'Flap your elbows.', 'Look at an egg and name where it came from.'] },
      { w: 'Frog', c: 'Animals', ipa: '/frɒɡ/', say: 'FROG', focus: 'f', why: 'A consonant cluster plus a jumping game.', acts: ['"Frog — ribbit! Jump like a frog."', 'Jump on each "ribbit".', 'Jump from cushion to cushion, naming a ribbit on each landing.'] },
      { w: 'Snake', c: 'Animals', ipa: '/sneɪk/', say: 'SNAYK', focus: 's', why: 'The classic way to practise a long "sss".', acts: ['"Snake — ssssss."', 'Stretch the "s" as long as you can.', 'Wiggle a scarf along the floor and name it as it moves.'] },
      { w: 'Horse', c: 'Animals', ipa: '/hɔːs/', say: 'HAWSS', focus: 'h', why: 'Rhythmic clip-clop supports speech timing.', acts: ['Bounce on your knee: "clip clop".', 'Match the bounce to the beat.', 'Name it while pretending to feed one from a flat palm.'] },
      { w: 'Fish', c: 'Animals', ipa: '/fɪʃ/', say: 'FISH', focus: 'sh', why: 'Two visible mouth shapes in one short word.', acts: ['Make fish lips: "fish!"', 'Contrast "fish" and "dish".', 'Blow bubbles in a glass of water through a straw and name the fish.'] },
      { w: 'Farm', c: 'World', ipa: '/fɑːm/', say: 'FAHM', focus: 'f', why: 'The category label that ties the group together.', acts: ['"Farm animals: cow, pig, sheep."', 'Sort toy animals into farm and wild.', 'Sort toy animals into farm and wild, saying the group name each time.'] },
    ],
    phrases: [
      { p: 'big elephant', pattern: 'describing + noun', tip: 'Add size words to every animal you name.' },
      { p: 'lion says roar', pattern: 'noun + verb + sound', tip: 'A natural three-word sentence with a fun payoff.' },
      { p: 'two little ducks', pattern: 'number + describing + noun', tip: 'Four-word phrases are within reach now.' },
    ],
  },
  {
    m: 26,
    title: 'In the kitchen',
    focus: 'Mealtimes, food words and sequences',
    summary:
      'Meals happen several times a day with the same objects and the same ' +
      'sequence — unbeatable repetition. Involve your toddler in simple steps ' +
      'and narrate the order: first, then, last.',
    milestones: ['Helps with simple tasks', 'Names foods they like', 'Uses phrases to request'],
    techniques: ['varied', 'boundary', 'expand'],
    words: [
      { w: 'Plate', c: 'Objects', ipa: '/pleɪt/', say: 'PLAYT', focus: 'p', why: 'Present at every meal without fail.', acts: ['"Your plate. Put it on the table."', 'Let them carry it.', 'Let them lay the table and name each item as it goes down.'] },
      { w: 'Fork', c: 'Objects', ipa: '/fɔːk/', say: 'FAWK', focus: 'f', why: 'A tool they are learning to control.', acts: ['"Fork — stab the pasta!"', 'Name it every meal.', 'Compare a fork and a spoon and name what each one is for.'] },
      { w: 'Bowl', c: 'Objects', ipa: '/bəʊl/', say: 'BOHL', focus: 'b', why: 'Contrasts nicely with "plate".', acts: ['"Bowl for soup, plate for toast."', 'Sort them together.', 'Name it while they help stir something in it.'] },
      { w: 'Pasta', c: 'Food', ipa: '/ˈpæs.tə/', say: 'PASS-tuh', focus: 'p', why: 'A favourite, so motivation is high.', acts: ['"Pasta! Yummy pasta."', 'Let them help stir.', 'Play with dry pasta in a tray and name the shapes as well as the food.'] },
      { w: 'Egg', c: 'Food', ipa: '/eɡ/', say: 'EG', focus: 'g', why: 'Short, clear and full of process to narrate.', acts: ['Crack one: "egg — crack!"', 'Whisk together.', 'Crack one into a bowl and name the shell, the white and the yolk.'] },
      { w: 'Toast', c: 'Food', ipa: '/təʊst/', say: 'TOHST', focus: 't', why: 'A daily breakfast word with a pop-up event.', acts: ['"Toast — pop!" when it jumps up.', 'Wait for the pop together.', 'Name the smell before the sight: “I can smell toast”.'] },
      { w: 'Hungry', c: 'Feelings', ipa: '/ˈhʌŋ.ɡri/', say: 'HUNG-gree', focus: 'ng', why: 'Connects a body state to a word and a solution.', acts: ['"Are you hungry? Let\'s eat."', 'Pat your tummy.', 'Name it in the dog, the doll and yourself, so it is not only their state.'] },
      { w: 'Thirsty', c: 'Feelings', ipa: '/ˈθɜː.sti/', say: 'THUR-stee', focus: 'th', why: 'Models "th" in a genuinely useful word.', acts: ['"Thirsty? Here\'s some water."', 'Offer the word when they reach for a cup.', 'Name it after running about, when they can feel it.'] },
      { w: 'Stir', c: 'Action', ipa: '/stɜː/', say: 'STUR', focus: 's', why: 'A cooking verb they can actually perform.', acts: ['"Stir it round and round."', 'Hand over hand together.', 'Count the stirs out loud: “stir, two, three”.'] },
      { w: 'Pour', c: 'Action', ipa: '/pɔː/', say: 'PAW', focus: 'p', why: 'A satisfying action with visible cause and effect.', acts: ['"Pour the milk — slowly!"', 'Let them try with a small jug.', 'Practise in the bath with cups first, where a spill costs nothing.'] },
    ],
    phrases: [
      { p: 'I am hungry', pattern: 'pronoun + verb + describing', tip: 'Model full sentences at every meal.' },
      { p: 'more pasta please', pattern: 'more + noun + manners', tip: 'Three words plus a manner word.' },
      { p: 'stir the pot', pattern: 'verb + the + noun', tip: 'Introduce "the" — it appears naturally in cooking talk.' },
    ],
  },
  {
    m: 27,
    title: 'Bigger feelings',
    focus: 'Naming complex emotions during real moments',
    summary:
      'Two-year-old feelings are enormous and often overwhelming. Giving them ' +
      'precise names — not just happy and sad — genuinely helps regulation. ' +
      'Name the feeling first, solve the problem second.',
    milestones: ['Shows empathy for others', 'Has strong preferences', 'Recovers from upset with help'],
    techniques: ['ids', 'expand', 'joint'],
    words: [
      { w: 'Excited', c: 'Feelings', ipa: '/ɪkˈsaɪ.tɪd/', say: 'ik-SY-tid', focus: 's', why: 'Names that fizzy, wriggly feeling they know well.', acts: ['"You\'re excited! Your body is wiggly."', 'Say it before a treat or outing.', 'Name it in advance: “tomorrow we go to the park — I feel excited”.'] },
      { w: 'Frustrated', c: 'Feelings', ipa: '/frʌˈstreɪ.tɪd/', say: 'fruh-STRAY-tid', focus: 'f', why: 'Precisely names the feeling behind most tantrums.', acts: ['"That\'s frustrating. It\'s hard."', 'Name it before offering help.', 'Name it in yourself when a jar will not open. Modelling beats explaining.'] },
      { w: 'Proud', c: 'Feelings', ipa: '/praʊd/', say: 'PROWD', focus: 'p', why: 'Builds the language of self-esteem.', acts: ['"You did it! I\'m proud of you."', 'Be specific about what they did.', 'Be specific: “you put your own shoes on. I’m proud of you.”'] },
      { w: 'Worried', c: 'Feelings', ipa: '/ˈwʌr.id/', say: 'WUR-eed', focus: 'w', why: 'Gives anxiety a name they can use.', acts: ['"Are you worried? I\'m here."', 'Stay close as you say it.', 'Name it and then name the plan, so the feeling has somewhere to go.'] },
      { w: 'Calm', c: 'Feelings', ipa: '/kɑːm/', say: 'KAHM', focus: 'k', why: 'Names the state you are helping them find.', acts: ['"Let\'s be calm. Big breath."', 'Breathe slowly together.', 'Breathe in for three and out for three together, naming it at the end.'] },
      { w: 'Kind', c: 'Manners', ipa: '/kaɪnd/', say: 'KYND', focus: 'k', why: 'A social value made concrete through examples.', acts: ['"That was kind of you."', 'Point out kindness in others.', 'Notice it in strangers out loud: “that lady was kind to hold the door”.'] },
      { w: 'Sorry', c: 'Manners', ipa: '/ˈsɒr.i/', say: 'SOR-ee', focus: 's', why: 'Model it genuinely, including when you get it wrong.', acts: ['Say sorry to them when you snap.', 'Never force it out of them.', 'Say it to them when you get it wrong. That is the whole lesson.'] },
      { w: 'Gentle', c: 'Manners', ipa: '/ˈdʒen.təl/', say: 'JEN-tul', focus: 'j', why: 'Essential for pets, babies and friends.', acts: ['"Gentle hands with the cat."', 'Praise it the moment it happens.', 'Practise on something delicate: a bubble, a flower, a baby’s hand.'] },
      { w: 'Brave', c: 'Feelings', ipa: '/breɪv/', say: 'BRAYV', focus: 'b', why: 'Helps them face new or scary things.', acts: ['"That was brave!"', 'Use it after a doctor visit or a big slide.', 'Name the feeling and the action separately: “you felt scared and you did it anyway”.'] },
      { w: 'Safe', c: 'Feelings', ipa: '/seɪf/', say: 'SAYF', focus: 's', why: 'The reassurance word underneath all the others.', acts: ['"You\'re safe. I\'ve got you."', 'Use a low, steady voice.', 'Name it at bedtime as part of the wind-down: “you’re safe, I’m here”.'] },
    ],
    phrases: [
      { p: 'I am sad', pattern: 'pronoun + verb + feeling', tip: 'Give them the full sentence for their own state.' },
      { p: 'that is scary', pattern: 'pronoun + verb + describing', tip: 'Narrate feelings about things, not just people.' },
      { p: 'I need cuddle', pattern: 'pronoun + verb + noun', tip: 'A request sentence that prevents a meltdown.' },
    ],
  },
  {
    m: 28,
    title: 'Sorting and shapes',
    focus: 'Shapes, matching and early maths language',
    summary:
      'Sorting is thinking made visible. Shape and matching words give your ' +
      'toddler the vocabulary for comparison, which underpins both maths and ' +
      'reasoning. Sort things together and narrate the rule out loud.',
    milestones: ['Matches shapes and colours', 'Completes simple puzzles', 'Sorts by one property'],
    techniques: ['contrast', 'boundary', 'expand'],
    words: [
      { w: 'Triangle', c: 'Shapes', ipa: '/ˈtraɪ.æŋ.ɡəl/', say: 'TRY-ang-gul', focus: 't', why: 'Three syllables and three countable sides.', acts: ['Trace it: "one, two, three sides".', 'Find triangles: a roof, a slice of pizza.', 'Make one with three fingers and name it.'] },
      { w: 'Rectangle', c: 'Shapes', ipa: '/ˈrek.tæŋ.ɡəl/', say: 'REK-tang-gul', focus: 'r', why: 'A long word for a very common shape.', acts: ['"A door is a rectangle."', 'Clap the syllables.', 'Point out doors and books and name the shape, not the object.'] },
      { w: 'Round', c: 'Shapes', ipa: '/raʊnd/', say: 'ROWND', focus: 'r', why: 'A property word rather than a shape name.', acts: ['"The ball is round. The plate is round."', 'Roll round things.', 'Roll oranges, balls and wheels and name what they have in common.'] },
      { w: 'Match', c: 'Concepts', ipa: '/mætʃ/', say: 'MACH', focus: 'ch', why: 'Names the core sorting action.', acts: ['"These match! Same colour."', 'Match socks from the laundry.', 'Play snap with two sets of picture cards, naming each match.'] },
      { w: 'Different', c: 'Concepts', ipa: '/ˈdɪf.rənt/', say: 'DIF-runt', focus: 'd', why: 'The contrast that makes "same" meaningful.', acts: ['"These are different. This one is red."', 'Say "same… different".', 'Put one odd thing in a line of four and ask which is different.'] },
      { w: 'Sort', c: 'Action', ipa: '/sɔːt/', say: 'SAWT', focus: 's', why: 'Names the activity itself.', acts: ['"Let\'s sort the blocks by colour."', 'State the rule out loud.', 'Sort the cutlery drawer together and say the rule out loud as you go.'] },
      { w: 'Long', c: 'Concepts', ipa: '/lɒŋ/', say: 'LONG', focus: 'ng', why: 'A size word beyond big and small.', acts: ['"A long snake! A short worm."', 'Stretch your arms out.', 'Compare two pieces of string and name the longer one.'] },
      { w: 'Short', c: 'Concepts', ipa: '/ʃɔːt/', say: 'SHAWT', focus: 'sh', why: 'Partner to "long", with a clear "sh".', acts: ['Compare two sticks: "long… short".', 'Line them up side by side.', 'Line up three sticks by size, naming the ends of the row.'] },
      { w: 'Heavy', c: 'Concepts', ipa: '/ˈhev.i/', say: 'HEV-ee', focus: 'h', why: 'A property they feel with their whole body.', acts: ['Lift something: "heavy! Ooof."', 'Contrast with something light.', 'Fill two identical bags differently and let them feel the difference.'] },
      { w: 'Light', c: 'Concepts', ipa: '/laɪt/', say: 'LYTE', focus: 'l', why: 'Same word, new meaning — worth naming explicitly.', acts: ['"A feather is light."', 'Compare a book and a feather.', 'Blow a feather across the table and name why it moves so easily.'] },
    ],
    phrases: [
      { p: 'these are same', pattern: 'pronoun + verb + describing', tip: 'Narrate the rule whenever you sort.' },
      { p: 'big red circle', pattern: 'size + colour + shape', tip: 'Stack three describing words together.' },
      { p: 'too heavy for me', pattern: 'longer sentence', tip: 'Model four- and five-word sentences now.' },
    ],
  },
  {
    m: 29,
    title: 'First, then, next',
    focus: 'Time words and sequencing',
    summary:
      'Time is abstract and takes a long while to grasp, but sequence words ' +
      'make daily life far smoother. "First shoes, then park" gives your ' +
      'toddler a map of what is coming, which heads off a lot of resistance.',
    milestones: ['Understands "in a minute"', 'Anticipates familiar routines', 'Talks about things not present'],
    techniques: ['boundary', 'predict', 'expand'],
    words: [
      { w: 'First', c: 'Time', ipa: '/fɜːst/', say: 'FURST', focus: 'f', why: 'Opens every sequence instruction.', acts: ['"First shoes, then park."', 'Use the same phrasing every time.', 'Use a two-picture chart for the bedtime routine: first bath, then story.'] },
      { w: 'Then', c: 'Time', ipa: '/ðen/', say: 'THEN', focus: 'th', why: 'Links two events into an order.', acts: ['"Bath, then story, then bed."', 'Count the steps on your fingers.', 'Recap the day backwards at bedtime, using it to link events.'] },
      { w: 'Next', c: 'Time', ipa: '/nekst/', say: 'NEKST', focus: 'n', why: 'Helps them predict what is coming.', acts: ['"What comes next?"', 'Let them answer.', 'Pause a familiar routine and ask what comes next.'] },
      { w: 'Now', c: 'Time', ipa: '/naʊ/', say: 'NOW', focus: 'n', why: 'The anchor point for all other time words.', acts: ['"Not later — now!"', 'Contrast with "soon".', 'Contrast it with waiting: “not soon — now!”'] },
      { w: 'Later', c: 'Time', ipa: '/ˈleɪ.tə/', say: 'LAY-ter', focus: 'l', why: 'Introduces delay, and with it patience.', acts: ['"We\'ll do it later, after lunch."', 'Always follow through.', 'Attach it to a landmark, not a clock: “later, after lunch”.'] },
      { w: 'Soon', c: 'Time', ipa: '/suːn/', say: 'SOON', focus: 's', why: 'A softer delay word for transitions.', acts: ['"Nearly time. Soon."', 'Give a countdown.', 'Give a countdown they can see: three more pushes on the swing.'] },
      { w: 'Today', c: 'Time', ipa: '/təˈdeɪ/', say: 'tuh-DAY', focus: 'd', why: 'Starts the idea of days as units.', acts: ['"Today we go to Grandma\'s."', 'Recap the day at bedtime.', 'Start each morning by naming the day’s one plan.'] },
      { w: 'Tomorrow', c: 'Time', ipa: '/təˈmɒr.əʊ/', say: 'tuh-MOR-oh', focus: 'm', why: 'A three-syllable word for the future.', acts: ['"Tomorrow, after sleep."', 'Link it to waking up.', 'Tie it to sleep: “after we sleep, it will be tomorrow”.'] },
      { w: 'Morning', c: 'Time', ipa: '/ˈmɔː.nɪŋ/', say: 'MAW-ning', focus: 'ng', why: 'Ties a time word to a felt part of the day.', acts: ['"Good morning! It\'s morning time."', 'Same greeting every day.', 'Open the curtains and name it as the first thing you do.'] },
      { w: 'Night', c: 'Time', ipa: '/naɪt/', say: 'NYTE', focus: 'n', why: 'The other end of the daily cycle.', acts: ['"It\'s night. Dark outside."', 'Look out of the window.', 'Look at the dark sky and name it before the curtains close.'] },
    ],
    phrases: [
      { p: 'first shoes then park', pattern: 'first + noun + then + noun', tip: 'The single most useful transition sentence you will own.' },
      { p: 'we go tomorrow', pattern: 'pronoun + verb + time', tip: 'Attach time words to real plans.' },
      { p: 'not now later', pattern: 'negation + time', tip: 'Model kind, clear boundaries in words.' },
    ],
  },
  {
    m: 30,
    title: 'Playing with others',
    focus: 'Social words for sharing and friendship',
    summary:
      'Playing alongside other children is becoming playing *with* them. That ' +
      'needs language: asking, offering, waiting and negotiating. Model the ' +
      'exact words you want to hear, and narrate other children\'s feelings too.',
    milestones: ['Plays alongside other children', 'Takes turns with support', 'Uses names of friends'],
    techniques: ['expand', 'joint', 'ids'],
    words: [
      { w: 'Share', c: 'Manners', ipa: '/ʃeə/', say: 'SHAIR', focus: 'sh', why: 'The central social skill of this age.', acts: ['"I\'ll share my snack with you."', 'Praise sharing the instant it happens.', 'Share something of yours first, and name it while you do.'] },
      { w: 'Friend', c: 'People', ipa: '/frend/', say: 'FREND', focus: 'f', why: 'Names the relationship they are forming.', acts: ['"Your friend Sam is here."', 'Use children\'s names often.', 'Look at photos of their friends and name each one.'] },
      { w: 'Wait', c: 'Social', ipa: '/weɪt/', say: 'WAYT', focus: 'w', why: 'Waiting is easier when it has a name.', acts: ['"Wait for your turn. Nearly."', 'Count the wait out loud.', 'Give the waiting a job: “hold this while we wait”.'] },
      { w: 'Together', c: 'Social', ipa: '/təˈɡeð.ə/', say: 'tuh-GETH-er', focus: 'th', why: 'Three syllables and a warm, cooperative idea.', acts: ['"Let\'s build it together!"', 'Sing "the more we get together".', 'Do a two-person job — carrying a box, holding a sheet — and name it.'] },
      { w: 'Swap', c: 'Social', ipa: '/swɒp/', say: 'SWOP', focus: 's', why: 'A practical alternative to a tug-of-war.', acts: ['"Shall we swap? You have this one."', 'Offer a swap before conflict escalates.', 'Offer the swap before the grab happens, not after.'] },
      { w: 'Ask', c: 'Social', ipa: '/ɑːsk/', say: 'ASK', focus: 's', why: 'Replaces grabbing with words.', acts: ['"Ask him: can I have it?"', 'Give them the exact words.', 'Give them the exact words, then let them use them themselves.'] },
      { w: 'Hello', c: 'Social', ipa: '/həˈləʊ/', say: 'huh-LOH', focus: 'h', why: 'Greeting others is a skill worth rehearsing.', acts: ['Practise before you arrive somewhere.', 'Model it warmly every time.', 'Rehearse it in the car on the way somewhere new.'] },
      { w: 'Goodbye', c: 'Social', ipa: '/ɡʊdˈbaɪ/', say: 'guud-BYE', focus: 'g', why: 'The grown-up version of bye-bye.', acts: ['"Goodbye! See you tomorrow."', 'Wave and make eye contact.', 'Make it a fixed ritual — same words, same wave, every time.'] },
      { w: 'Sorry', c: 'Manners', ipa: '/ˈsɒr.i/', say: 'SOR-ee', focus: 's', why: 'Best taught by example, not enforcement.', acts: ['Model it yourself, genuinely.', 'Explain what it means.', 'Separate it from being made to say it. Repair matters more than the word.'] },
      { w: 'Everyone', c: 'People', ipa: '/ˈev.ri.wʌn/', say: 'EV-ree-wun', focus: 'w', why: 'A group word for a growing social world.', acts: ['"Everyone gets a turn."', 'Point to each person as you say it.', 'Hand out snacks one per person, naming everyone as you go.'] },
    ],
    phrases: [
      { p: 'can I have it', pattern: 'question sentence', tip: 'Give them the exact words to ask instead of grabbing.' },
      { p: 'my turn next', pattern: 'possessive + noun + time', tip: 'Combines turn-taking with sequencing.' },
      { p: 'play with me', pattern: 'verb + preposition + pronoun', tip: 'An invitation sentence for making friends.' },
    ],
  },
  {
    m: 31,
    title: 'Asking questions',
    focus: 'Question words — and answering with "because"',
    summary:
      'The question age arrives. Every "why?" is a request for more language, ' +
      'so answer properly rather than deflecting. Model question words ' +
      'yourself, and use "because" in your answers — it unlocks reasoning.',
    milestones: ['Asks "what?" and "where?"', 'Starts asking "why?"', 'Answers simple questions'],
    techniques: ['expand', 'joint', 'varied'],
    words: [
      { w: 'What', c: 'Language', ipa: '/wɒt/', say: 'WOT', focus: 'w', why: 'The most useful question word of all.', acts: ['"What is that? What can you see?"', 'Pause and genuinely wait.', 'Put something odd in a bag and let them ask before they look.'] },
      { w: 'Where', c: 'Language', ipa: '/weə/', say: 'WAIR', focus: 'w', why: 'Powers searching and hiding games.', acts: ['"Where is teddy? Let\'s look."', 'Search together, narrating.', 'Hide a toy and let them ask the question rather than you.'] },
      { w: 'Who', c: 'Language', ipa: '/huː/', say: 'HOO', focus: 'h', why: 'Turns attention to people and names.', acts: ['"Who is that? Who\'s at the door?"', 'Look at photos and ask.', 'Play “who is knocking?” with a hand behind the door.'] },
      { w: 'Why', c: 'Language', ipa: '/waɪ/', say: 'WY', focus: 'w', why: 'The gateway to reasoning — welcome it.', acts: ['Answer with a real reason, not "just because".', 'Ask them "why?" back sometimes.', 'Ask them why sometimes. Their answers will be excellent.'] },
      { w: 'Because', c: 'Language', ipa: '/bɪˈkɔːz/', say: 'bee-KAWZ', focus: 'b', why: 'Links cause and effect in a single word.', acts: ['"We wear a coat because it\'s cold."', 'Use it in every "why" answer.', 'Use it for pleasant things too: “we’re going because it’s sunny”.'] },
      { w: 'How', c: 'Language', ipa: '/haʊ/', say: 'HOW', focus: 'h', why: 'Opens up process and explanation.', acts: ['"How does it work? Let\'s find out."', 'Narrate the steps.', 'Take something apart together — a torch, a pen — and narrate the how.'] },
      { w: 'When', c: 'Language', ipa: '/wen/', say: 'WEN', focus: 'w', why: 'Connects questions to time words.', acts: ['"When we get home, we\'ll eat."', 'Answer with a routine anchor.', 'Answer with an event, never a time: “when the timer beeps”.'] },
      { w: 'Maybe', c: 'Language', ipa: '/ˈmeɪ.bi/', say: 'MAY-bee', focus: 'm', why: 'Introduces uncertainty honestly.', acts: ['"Maybe. Let\'s see."', 'Only use it when you mean it.', 'Only use it when it is genuinely uncertain, or it becomes a soft no.'] },
      { w: 'Think', c: 'Language', ipa: '/θɪŋk/', say: 'THINK', focus: 'th', why: 'Names the invisible activity of thinking.', acts: ['"I think it\'s in the box."', 'Say your thinking out loud.', 'Pause visibly: “let me think… I think it’s in the drawer”.'] },
      { w: 'Know', c: 'Language', ipa: '/nəʊ/', say: 'NOH', focus: 'n', why: 'Distinguishes knowing from guessing.', acts: ['"I know! It\'s under the chair."', 'Admit when you do not know.', 'Say “I don’t know, let’s find out” out loud. It teaches more than knowing.'] },
    ],
    phrases: [
      { p: 'what is that', pattern: 'question word + verb + pronoun', tip: 'The question they will ask a thousand times. Answer it fully.' },
      { p: 'because it is cold', pattern: 'because + clause', tip: 'Always give a real reason — it models causal thinking.' },
      { p: 'where is teddy gone', pattern: 'longer question', tip: 'Five-word questions are realistic now.' },
    ],
  },
  {
    m: 32,
    title: 'Body and feeling well',
    focus: 'Health words and describing how they feel',
    summary:
      'Being able to say where it hurts is genuinely useful — and it needs ' +
      'specific vocabulary. Teach body words in calm moments, not during ' +
      'upset, so the words are already there when they are needed.',
    milestones: ['Points to where it hurts', 'Names most body parts', 'Describes simple states'],
    techniques: ['boundary', 'contrast', 'expand'],
    words: [
      { w: 'Tummy', c: 'Body', ipa: '/ˈtʌm.i/', say: 'TUM-ee', focus: 't', why: 'Where most toddler complaints are located.', acts: ['"Does your tummy hurt? Show me."', 'Practise pointing in calm moments.', 'Name it during a cuddle, not only when something hurts.'] },
      { w: 'Finger', c: 'Body', ipa: '/ˈfɪŋ.ɡə/', say: 'FING-ger', focus: 'ng', why: 'Countable, and involved in most small injuries.', acts: ['Count all ten: "fingers!"', 'Name each one.', 'Paint with one finger and name it while it is covered in colour.'] },
      { w: 'Elbow', c: 'Body', ipa: '/ˈel.bəʊ/', say: 'EL-boh', focus: 'l', why: 'A less obvious part worth naming.', acts: ['Touch elbows: "elbow!"', 'Play a body-part touching game.', 'Play elbow-to-elbow greetings and name it.'] },
      { w: 'Shoulder', c: 'Body', ipa: '/ˈʃəʊl.də/', say: 'SHOHL-der', focus: 'sh', why: 'Features in a song they already know.', acts: ['Sing "head, shoulders, knees and toes".', 'Slow it right down.', 'Give a shoulder ride and name what they are sitting on.'] },
      { w: 'Tongue', c: 'Body', ipa: '/tʌŋ/', say: 'TUNG', focus: 'ng', why: 'The tool that makes most speech sounds.', acts: ['Stick it out in the mirror: "tongue!"', 'Show how it moves for "l" and "t".', 'Pull faces in the mirror and name the tongue as it moves.'] },
      { w: 'Hurt', c: 'Feelings', ipa: '/hɜːt/', say: 'HURT', focus: 'h', why: 'The word that lets them tell you something is wrong.', acts: ['"Does it hurt? Show me where."', 'Take it seriously every time.', 'Name it for a toy first: “teddy hurt his leg”.'] },
      { w: 'Poorly', c: 'Feelings', ipa: '/ˈpɔː.li/', say: 'PAW-lee', focus: 'p', why: 'A general word for feeling unwell.', acts: ['"You feel poorly. Let\'s rest."', 'Use it with a gentle tone.', 'Read a book about being unwell when they are perfectly well.'] },
      { w: 'Medicine', c: 'Objects', ipa: '/ˈmed.sən/', say: 'MED-sin', focus: 'm', why: 'Naming it in advance reduces the fear.', acts: ['"Medicine helps you feel better."', 'Explain before you give it.', 'Let them give some to a doll with a toy spoon.'] },
      { w: 'Doctor', c: 'People', ipa: '/ˈdɒk.tə/', say: 'DOK-ter', focus: 'd', why: 'Preparing for visits makes them go better.', acts: ['Play doctors with teddy.', 'Explain what will happen first.', 'Play doctors with a toy kit before any real appointment.'] },
      { w: 'Rest', c: 'Action', ipa: '/rest/', say: 'REST', focus: 'r', why: 'Names the thing they need when unwell.', acts: ['"Let\'s rest on the sofa."', 'Make it cosy and named.', 'Model it: “I’m tired, I’m going to rest for five minutes”.'] },
    ],
    phrases: [
      { p: 'my tummy hurts', pattern: 'possessive + noun + verb', tip: 'Rehearse this sentence when they are well.' },
      { p: 'I feel poorly', pattern: 'pronoun + verb + describing', tip: 'Gives them a way to tell you before you notice.' },
      { p: 'it hurts here', pattern: 'pronoun + verb + position', tip: 'Combines a feeling word with pointing.' },
    ],
  },
  {
    m: 33,
    title: 'Out in the world',
    focus: 'Places and the people who work there',
    summary:
      'Your toddler is noticing that the world has roles and places. Naming ' +
      'them builds general knowledge alongside vocabulary — and gives you ' +
      'plenty to talk about on any ordinary errand.',
    milestones: ['Talks about past events', 'Recognises familiar places', 'Uses 300+ words'],
    techniques: ['joint', 'varied', 'expand'],
    words: [
      { w: 'Shop', c: 'World', ipa: '/ʃɒp/', say: 'SHOP', focus: 'sh', why: 'A weekly destination full of nameable things.', acts: ['"We\'re going to the shop."', 'Name three things you buy.', 'Give them one item to hold and name where you are while they carry it.'] },
      { w: 'Park', c: 'World', ipa: '/pɑːk/', say: 'PAHK', focus: 'p', why: 'A much-loved place, so highly motivating.', acts: ['"To the park! What shall we play on?"', 'Name the equipment.', 'Name the parts as well as the place: gate, swing, slide, park.'] },
      { w: 'School', c: 'World', ipa: '/skuːl/', say: 'SKOOL', focus: 'k', why: 'Prepares them for a big future transition.', acts: ['"Big children go to school."', 'Point it out as you pass.', 'Point it out at drop-off time when the children are visible.'] },
      { w: 'Hospital', c: 'World', ipa: '/ˈhɒs.pɪ.təl/', say: 'HOS-pi-tul', focus: 'h', why: 'Three syllables and a place worth demystifying.', acts: ['"Doctors work at the hospital."', 'Keep the tone matter-of-fact.', 'Name it neutrally when you pass one, so it is familiar before it matters.'] },
      { w: 'Library', c: 'World', ipa: '/ˈlaɪ.brə.ri/', say: 'LY-bruh-ree', focus: 'l', why: 'Ties place, books and quiet together.', acts: ['"The library is full of books."', 'Let them choose one.', 'Let them choose one book themselves and name where it came from.'] },
      { w: 'Doctor', c: 'People', ipa: '/ˈdɒk.tə/', say: 'DOK-ter', focus: 'd', why: 'A role they will meet regularly.', acts: ['"The doctor helps people."', 'Play the role together.', 'Name what the doctor does, not just who they are.'] },
      { w: 'Driver', c: 'People', ipa: '/ˈdraɪ.və/', say: 'DRY-ver', focus: 'd', why: 'Links a person to an action they can see.', acts: ['"The driver drives the bus."', 'Wave at the driver.', 'Wave at one and name the job as they wave back.'] },
      { w: 'Postman', c: 'People', ipa: '/ˈpəʊst.mən/', say: 'POHST-mun', focus: 'p', why: 'A visible daily visitor.', acts: ['"The postman brings letters."', 'Watch for the post together.', 'Watch for the post together and name who brought it.'] },
      { w: 'Neighbour', c: 'People', ipa: '/ˈneɪ.bə/', say: 'NAY-ber', focus: 'n', why: 'Names the people nearest to home.', acts: ['"That\'s our neighbour. Say hello!"', 'Use their actual name too.', 'Use their real name alongside the word every time.'] },
      { w: 'Money', c: 'Objects', ipa: '/ˈmʌn.i/', say: 'MUN-ee', focus: 'm', why: 'A concrete object with an abstract purpose.', acts: ['"We pay with money."', 'Let them hand over a coin.', 'Let them hand over a coin and name it as it changes hands.'] },
    ],
    phrases: [
      { p: 'go to the park', pattern: 'verb + to + the + noun', tip: 'Four- and five-word sentences with small connecting words.' },
      { p: 'the driver drives bus', pattern: 'noun + verb + noun', tip: 'Link a role to its action.' },
      { p: 'we went to shop', pattern: 'past tense sentence', tip: 'Talk about what already happened — a big new skill.' },
    ],
  },
  {
    m: 34,
    title: 'Describing things',
    focus: 'Richer adjectives and the senses',
    summary:
      'Describing words make sentences longer and more interesting, and they ' +
      'train close observation. Anchor each one to a sense: something they can ' +
      'touch, smell, hear or taste right now.',
    milestones: ['Uses describing words', 'Uses 3–4 word sentences', 'Notices small details'],
    techniques: ['contrast', 'boundary', 'joint'],
    words: [
      { w: 'Soft', c: 'Concepts', ipa: '/sɒft/', say: 'SOFT', focus: 's', why: 'A texture they can verify by touch instantly.', acts: ['"Soft blanket. Feel it."', 'Contrast with something hard.', 'Make a soft-things box and name each one as they pull it out.'] },
      { w: 'Rough', c: 'Concepts', ipa: '/rʌf/', say: 'RUF', focus: 'r', why: 'A texture contrast found on any walk.', acts: ['Touch tree bark: "rough!"', 'Then something smooth.', 'Do a bark rubbing with a crayon and name the texture.'] },
      { w: 'Smooth', c: 'Concepts', ipa: '/smuːð/', say: 'SMOOTH', focus: 'th', why: 'Models the voiced "th" in a tactile word.', acts: ['Stroke a pebble: "smooth".', 'Say "rough… smooth".', 'Compare a pebble and a pinecone in each hand.'] },
      { w: 'Sweet', c: 'Concepts', ipa: '/swiːt/', say: 'SWEET', focus: 's', why: 'A taste word with immediate evidence.', acts: ['"Sweet strawberry!"', 'Contrast with "sour".', 'Name it while tasting something they already love.'] },
      { w: 'Sour', c: 'Concepts', ipa: '/ˈsaʊ.ə/', say: 'SOW-er', focus: 's', why: 'Produces a memorable face.', acts: ['Try a lemon: "sour!"', 'Pull the face together.', 'Let them watch your face before they taste it themselves.'] },
      { w: 'Bright', c: 'Concepts', ipa: '/braɪt/', say: 'BRYTE', focus: 'b', why: 'A visual property they can point at.', acts: ['"Bright light! Bright colours."', 'Contrast with "dark".', 'Contrast a torch on and off in a dark room.'] },
      { w: 'Dark', c: 'Concepts', ipa: '/dɑːk/', say: 'DAHK', focus: 'd', why: 'Useful for bedtime and for feelings about it.', acts: ['"It\'s dark outside now."', 'Turn a light off and on.', 'Make a den with a blanket and name the dark inside it.'] },
      { w: 'Noisy', c: 'Concepts', ipa: '/ˈnɔɪ.zi/', say: 'NOY-zee', focus: 'n', why: 'Names a sensory experience they may find hard.', acts: ['"That\'s noisy! Cover your ears."', 'Then find somewhere quiet.', 'Name it, then find somewhere quiet and name that too.'] },
      { w: 'Sticky', c: 'Concepts', ipa: '/ˈstɪk.i/', say: 'STIK-ee', focus: 's', why: 'A texture toddlers generate constantly.', acts: ['"Sticky hands! Let\'s wash."', 'Name it during meals.', 'Play with dough or honey on a tray and name the feeling.'] },
      { w: 'Beautiful', c: 'Concepts', ipa: '/ˈbjuː.tɪ.fəl/', say: 'BYOO-ti-ful', focus: 'b', why: 'Three syllables and a word of delight.', acts: ['"That\'s beautiful! You made it."', 'Clap the syllables.', 'Use it for their drawings, out loud, where they can hear you.'] },
    ],
    phrases: [
      { p: 'the soft blanket', pattern: 'the + describing + noun', tip: 'Add small connecting words to their phrases.' },
      { p: 'it tastes sweet', pattern: 'pronoun + verb + describing', tip: 'Link a sense verb to a describing word.' },
      { p: 'very big dog', pattern: 'intensifier + describing + noun', tip: 'Introduce "very" and "really" to stretch descriptions.' },
    ],
  },
  {
    m: 35,
    title: 'Groups and categories',
    focus: 'Category words that organise vocabulary',
    summary:
      'Category words — food, animals, clothes — are how vocabulary gets ' +
      'organised in memory, and organised vocabulary is easier to retrieve. ' +
      'Name the group as well as the members: "apple, banana — those are fruit".',
    milestones: ['Groups objects by type', 'Uses category names', 'Answers "which one?" questions'],
    techniques: ['contrast', 'expand', 'varied'],
    words: [
      { w: 'Food', c: 'Categories', ipa: '/fuːd/', say: 'FOOD', focus: 'f', why: 'The most concrete category to start with.', acts: ['"Apple, bread, cheese — all food."', 'Sort play food together.', 'Sort the shopping into food and not-food as you unpack.'] },
      { w: 'Fruit', c: 'Categories', ipa: '/fruːt/', say: 'FROOT', focus: 'f', why: 'A subgroup inside food — nesting categories.', acts: ['"Apple and banana are fruit."', 'Name three fruits at the shop.', 'Make a fruit salad together and name the group each time you add one.'] },
      { w: 'Clothes', c: 'Categories', ipa: '/kləʊz/', say: 'KLOHZ', focus: 'k', why: 'A category they handle twice a day.', acts: ['"Socks, coat, hat — all clothes."', 'Sort the laundry together.', 'Sort clean washing into piles by person, naming the category.'] },
      { w: 'Toys', c: 'Categories', ipa: '/tɔɪz/', say: 'TOYZ', focus: 't', why: 'Makes tidying a sorting game.', acts: ['"Put all the toys away."', 'Sort by type into boxes.', 'Give each type of toy its own box and name the group at tidy-up.'] },
      { w: 'Furniture', c: 'Categories', ipa: '/ˈfɜː.nɪ.tʃə/', say: 'FUR-ni-cher', focus: 'ch', why: 'A long word for very familiar objects.', acts: ['"Chair, table, bed — furniture."', 'Walk round naming it.', 'Walk round the room naming everything you could not lift.'] },
      { w: 'Vehicles', c: 'Categories', ipa: '/ˈviː.ɪ.kəlz/', say: 'VEE-i-kulz', focus: 'v', why: 'Models the "v" sound in an exciting category.', acts: ['"Cars, buses, bikes — vehicles."', 'Spot them on a walk.', 'Count vehicles on a walk and name the group as well as each one.'] },
      { w: 'Family', c: 'Categories', ipa: '/ˈfæm.ə.li/', say: 'FAM-uh-lee', focus: 'f', why: 'The most emotionally important group.', acts: ['Look at photos: "our family".', 'Name everyone in turn.', 'Make a photo page and name everyone, then name the group.'] },
      { w: 'Colours', c: 'Categories', ipa: '/ˈkʌl.əz/', say: 'KUL-erz', focus: 'k', why: 'Naming the category consolidates the members.', acts: ['"Red, blue, green — all colours."', 'Sort crayons.', 'Lay out crayons in rainbow order and name the set.'] },
      { w: 'Vegetables', c: 'Categories', ipa: '/ˈvedʒ.tə.bəlz/', say: 'VEJ-tuh-bulz', focus: 'v', why: 'A long word, and useful at every mealtime.', acts: ['"Carrot and peas are vegetables."', 'Name them as you cook.', 'Let them wash them at the sink and name the group while they do.'] },
      { w: 'Belong', c: 'Concepts', ipa: '/bɪˈlɒŋ/', say: 'bee-LONG', focus: 'ng', why: 'Names the idea of membership itself.', acts: ['"Where does this belong?"', 'Use it during tidy-up.', 'Ask “where does this belong?” at tidy-up and let them answer.'] },
    ],
    phrases: [
      { p: 'apples are fruit', pattern: 'noun + are + category', tip: 'State the category rule out loud.' },
      { p: 'put toys away', pattern: 'verb + noun + position', tip: 'Category words make instructions shorter.' },
      { p: 'which one is red', pattern: 'question + category', tip: 'Ask them to choose by property.' },
    ],
  },
  {
    m: 36,
    title: 'Telling stories',
    focus: 'Joining sentences and retelling events',
    summary:
      'Three years old. Your child can now tell you about things that are not ' +
      'happening right now — a huge leap. Connecting words are what turn a list ' +
      'of sentences into a story. Retell the day together every evening.',
    milestones: ['Tells simple stories', 'Uses sentences of 4+ words', 'Understood by strangers most of the time'],
    techniques: ['expand', 'rhythm', 'joint'],
    words: [
      { w: 'And', c: 'Language', ipa: '/ænd/', say: 'AND', focus: 'n', why: 'The first and simplest sentence connector.', acts: ['"We went to the park AND we saw a dog."', 'Add "and" to their sentences.', 'Add one to their sentence every time: they say “dog”, you say “a dog and a cat”.'] },
      { w: 'But', c: 'Language', ipa: '/bʌt/', say: 'BUT', focus: 'b', why: 'Introduces contrast between two ideas.', acts: ['"I wanted to go, but it was raining."', 'Model it in your own talk.', 'Use it for real trade-offs: “we can go, but we need coats”.'] },
      { w: 'So', c: 'Language', ipa: '/səʊ/', say: 'SOH', focus: 's', why: 'Expresses consequence and result.', acts: ['"It was cold, so we wore coats."', 'Pair it with "because".', 'Narrate consequences out loud: “it rained, so the grass is wet”.'] },
      { w: 'After', c: 'Time', ipa: '/ˈɑːf.tə/', say: 'AHF-ter', focus: 'f', why: 'Sequences events within a story.', acts: ['"After lunch, we played."', 'Retell the day in order.', 'Sequence photos of the day and tell it back in order.'] },
      { w: 'Before', c: 'Time', ipa: '/bɪˈfɔː/', say: 'bee-FAW', focus: 'b', why: 'The harder half of the sequencing pair.', acts: ['"Before bed, we read a story."', 'Use it in the bedtime routine.', 'Ask what happened before, which is harder than what happened next.'] },
      { w: 'Remember', c: 'Language', ipa: '/rɪˈmem.bə/', say: 're-MEM-ber', focus: 'r', why: 'Names the act of recalling the past.', acts: ['"Do you remember the beach?"', 'Look at photos and recall together.', 'Keep a photo of one outing on the fridge and retell it weekly.'] },
      { w: 'Story', c: 'Language', ipa: '/ˈstɔː.ri/', say: 'STAW-ree', focus: 's', why: 'Names what they are learning to make.', acts: ['"Tell me a story about your day."', 'Let them lead, however odd it gets.', 'Let them tell one to a teddy while you listen without correcting.'] },
      { w: 'Pretend', c: 'Play', ipa: '/prɪˈtend/', say: 'pre-TEND', focus: 'p', why: 'Names imaginative play explicitly.', acts: ['"Let\'s pretend to be lions!"', 'Follow their imaginary rules.', 'Say it out loud as you start: “let’s pretend this box is a boat”.'] },
      { w: 'Once', c: 'Language', ipa: '/wʌns/', say: 'WUNSS', focus: 'w', why: 'Opens every story they will ever hear.', acts: ['"Once upon a time…"', 'Let them finish the sentence.', 'Always open with the same phrase so they learn the signal for a story.'] },
      { w: 'End', c: 'Language', ipa: '/end/', say: 'END', focus: 'n', why: 'Closes a story and marks completion.', acts: ['"…and that\'s the end!"', 'Clap at the end of every story.', 'Close every book the same way: “…and that’s the end”.'] },
    ],
    phrases: [
      { p: 'we went and we saw', pattern: 'sentence + and + sentence', tip: 'Joining two sentences is the start of storytelling.' },
      { p: 'after lunch we played', pattern: 'time + sentence', tip: 'Retell the day in order every evening.' },
      { p: 'I was scared but okay', pattern: 'sentence + but + sentence', tip: 'Contrast connectors let them describe mixed feelings.' },
    ],
  },
];

if (typeof window !== 'undefined') {
  window.MONTHS = MONTHS;
  window.STAGE_BANDS = STAGE_BANDS;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MONTHS, STAGE_BANDS };
}
