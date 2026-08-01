/*
 * phonics.js — the pronunciation-coaching engine.
 *
 * Two reference tables power all phonics guidance in the app:
 *
 *  1. PHONEMES  — every English consonant/vowel sound the curriculum targets,
 *                 with a parent-friendly name, an articulation script ("what
 *                 your mouth actually does"), the typical age band by which
 *                 most children produce it, and contrast/minimal-pair ideas.
 *
 *  2. TECHNIQUES — the delivery techniques evidenced in the newborn-brain
 *                 literature (infant-directed speech, prosodic boundary
 *                 marking, varied-context repetition for statistical learning,
 *                 pause-and-predict, joint attention). Each monthly plan cites
 *                 the techniques that matter most at that age.
 *
 * Because coaching is looked up from these tables rather than duplicated on
 * every word, the word bank stays compact and the guidance stays consistent.
 *
 * Age-of-acquisition bands follow widely used English consonant norms
 * (Sander 1972; Crowe & McLeod 2020). They describe when most children
 * *produce* a sound accurately — babies understand long before they can say
 * it, so a "later" sound is still fine to model from day one.
 */

const PHONEMES = {
  // ---- Early consonants: most children produce these by ~2;0 --------------
  m: {
    ipa: '/m/', name: 'the "mmm" sound', band: 'early', byAge: 'by 2 years',
    how: 'Lips press together, voice on, air out through the nose. Let them see your lips close and feel the hum on your cheek.',
    mouth: 'Lips together · voiced · through the nose',
    contrast: ['m / b — "mmm" hums, "buh" pops'],
  },
  b: {
    ipa: '/b/', name: 'the "buh" sound', band: 'early', byAge: 'by 2 years',
    how: 'Lips together, build a little air behind them, then pop them open with your voice on. It should sound bouncy.',
    mouth: 'Lips together · voiced · pops open',
    contrast: ['b / p — "buh" buzzes, "puh" is a whisper-pop'],
  },
  p: {
    ipa: '/p/', name: 'the "puh" sound', band: 'early', byAge: 'by 2 years',
    how: 'Same lips-together pop as "b" but with no voice — just a puff of air. Hold a tissue near your mouth so they see it flutter.',
    mouth: 'Lips together · voiceless · puff of air',
    contrast: ['p / b — "puh" puffs, "buh" buzzes'],
  },
  n: {
    ipa: '/n/', name: 'the "nnn" sound', band: 'early', byAge: 'by 2 years',
    how: 'Tongue tip up behind the top front teeth, voice on, air through the nose. Point to your nose while you hum it.',
    mouth: 'Tongue tip up · voiced · through the nose',
    contrast: ['n / d — "nnn" hums, "duh" taps'],
  },
  d: {
    ipa: '/d/', name: 'the "duh" sound', band: 'early', byAge: 'by 2 years',
    how: 'Tongue tip taps just behind the top front teeth and drops away, voice on. Quick and bouncy.',
    mouth: 'Tongue tip taps behind teeth · voiced',
    contrast: ['d / t — "duh" buzzes, "tuh" is a dry tap'],
  },
  w: {
    ipa: '/w/', name: 'the "wuh" sound', band: 'early', byAge: 'by 2 years',
    how: 'Round your lips into a tight circle, then slide them open. Exaggerate the pucker — it is very visible to a baby.',
    mouth: 'Lips rounded · voiced · glides open',
    contrast: ['w / b — "wuh" glides, "buh" pops'],
  },
  h: {
    ipa: '/h/', name: 'the "huh" sound', band: 'early', byAge: 'by 2 years',
    how: 'Just breathe out with an open mouth — no tongue or lip work at all. Like fogging a window.',
    mouth: 'Open mouth · breath only · voiceless',
    contrast: ['h / no sound — "hat" vs "at"'],
  },

  // ---- Middle consonants: most children produce these by ~3;0 ------------
  t: {
    ipa: '/t/', name: 'the "tuh" sound', band: 'middle', byAge: 'by 3 years',
    how: 'Tongue tip taps behind the top front teeth with no voice — a dry, crisp tap. Like a tiny clock tick.',
    mouth: 'Tongue tip taps behind teeth · voiceless',
    contrast: ['t / d — "tuh" ticks, "duh" buzzes'],
  },
  k: {
    ipa: '/k/', name: 'the "kuh" sound', band: 'middle', byAge: 'by 3 years',
    how: 'The BACK of the tongue humps up to touch the roof of the mouth, then releases with a puff. Many toddlers say "tuh" instead — that is normal.',
    mouth: 'Back of tongue up · voiceless',
    contrast: ['k / t — "kuh" is made at the back, "tuh" at the front'],
  },
  g: {
    ipa: '/g/', name: 'the "guh" sound', band: 'middle', byAge: 'by 3 years',
    how: 'Same back-of-tongue hump as "k", but with your voice switched on. Put their hand on your throat to feel the buzz.',
    mouth: 'Back of tongue up · voiced',
    contrast: ['g / k — "guh" buzzes, "kuh" puffs'],
  },
  f: {
    ipa: '/f/', name: 'the "fff" sound', band: 'middle', byAge: 'by 3 years',
    how: 'Top teeth rest gently on the bottom lip and you blow. A long, quiet windy sound they can watch and feel.',
    mouth: 'Teeth on lip · voiceless · long airflow',
    contrast: ['f / v — "fff" is windy, "vvv" tickles'],
  },
  ng: {
    ipa: '/ŋ/', name: 'the "ng" sound', band: 'middle', byAge: 'by 3 years',
    how: 'Back of the tongue lifts to the roof of the mouth and the sound hums out through the nose — the ending of "sing".',
    mouth: 'Back of tongue up · voiced · through the nose',
    contrast: ['ng / n — "sing" vs "sin"'],
  },
  y: {
    ipa: '/j/', name: 'the "yuh" sound', band: 'middle', byAge: 'by 3 years',
    how: 'Tongue humps high and forward, then glides away. Stretch it out: "yyyy-es".',
    mouth: 'Tongue high and forward · voiced · glides',
    contrast: ['y / w — "yuh" spreads, "wuh" rounds'],
  },

  // ---- Later consonants: typically by ~4;0 or beyond ---------------------
  s: {
    ipa: '/s/', name: 'the "sss" sound', band: 'later', byAge: 'by 4 years',
    how: 'Teeth almost closed, tongue tip near (not touching) the ridge behind the top teeth, and blow a thin stream. The classic "snake" sound.',
    mouth: 'Teeth close · thin airstream · voiceless',
    contrast: ['s / sh — "sss" is thin and sharp, "shh" is wide and soft'],
  },
  z: {
    ipa: '/z/', name: 'the "zzz" sound', band: 'later', byAge: 'by 4 years',
    how: 'Exactly like "sss" but with the voice on — a buzzing bee. Great for feeling voice on the throat.',
    mouth: 'Teeth close · thin airstream · voiced',
    contrast: ['z / s — "zzz" buzzes, "sss" hisses'],
  },
  l: {
    ipa: '/l/', name: 'the "lll" sound', band: 'later', byAge: 'by 4 years',
    how: 'Tongue tip presses up behind the top teeth and the voice flows around the sides. Stick your tongue up so they can see it.',
    mouth: 'Tongue tip up · voiced · air round the sides',
    contrast: ['l / w — many toddlers say "wion" for "lion"; that is expected'],
  },
  sh: {
    ipa: '/ʃ/', name: 'the "shh" sound', band: 'later', byAge: 'by 4 years',
    how: 'Lips push forward into a small round shape, tongue pulls back a little, and you blow a wide, soft stream. The "quiet" sound.',
    mouth: 'Lips rounded forward · wide airstream · voiceless',
    contrast: ['sh / s — "shh" is soft and wide, "sss" is sharp and thin'],
  },
  ch: {
    ipa: '/tʃ/', name: 'the "ch" sound', band: 'later', byAge: 'by 4 years',
    how: 'A "t" and a "sh" squashed together — tap then release into a soft blow. Like a little train: ch-ch-ch.',
    mouth: 'Tap then blow · voiceless',
    contrast: ['ch / sh — "chip" vs "ship"'],
  },
  j: {
    ipa: '/dʒ/', name: 'the "juh" sound', band: 'later', byAge: 'by 4 years',
    how: 'The voiced twin of "ch" — a "d" released into a buzzy "zh". Hand on the throat to feel the difference.',
    mouth: 'Tap then buzz · voiced',
    contrast: ['j / ch — "juh" buzzes, "ch" puffs'],
  },
  v: {
    ipa: '/v/', name: 'the "vvv" sound', band: 'later', byAge: 'by 4 years',
    how: 'Top teeth on the bottom lip like "fff", but with the voice on so the lip tickles. Let them touch your lip to feel it.',
    mouth: 'Teeth on lip · voiced · tickly',
    contrast: ['v / f — "vvv" tickles, "fff" is just wind'],
  },
  r: {
    ipa: '/ɹ/', name: 'the "rrr" sound', band: 'latest', byAge: 'often 5–6 years',
    how: 'The tongue bunches up in the middle of the mouth without touching anything. This is one of the last sounds to arrive — "wabbit" for "rabbit" is completely normal for years.',
    mouth: 'Tongue bunched, touching nothing · voiced',
    contrast: ['r / w — expect "w" substitutions well into the preschool years'],
  },
  th: {
    ipa: '/θ/, /ð/', name: 'the "th" sound', band: 'latest', byAge: 'often 5–6 years',
    how: 'Tongue tip peeks out between the teeth and you blow ("thumb") or hum ("this"). Very visible — let them watch, but do not expect it back yet.',
    mouth: 'Tongue between teeth · voiceless or voiced',
    contrast: ['th / f — "fum" for "thumb" is a normal toddler swap'],
  },

  // ---- Vowels & syllable shapes ------------------------------------------
  vowel: {
    ipa: 'vowels', name: 'open vowel sounds', band: 'early', byAge: 'from birth',
    how: 'Vowels are made with an open, unobstructed mouth — the jaw, lips and tongue just change shape. Stretch them out ("baaaall") so the melody carries.',
    mouth: 'Open mouth · voiced · shape changes',
    contrast: ['ah / ee / oo — exaggerate the lip shape for each'],
  },
  redup: {
    ipa: 'CV·CV', name: 'a repeated-syllable word', band: 'early', byAge: 'from birth',
    how: 'Words like ma-ma and ba-ba repeat the same simple syllable. The newborn brain groups repeated units into one chunk, which makes these the easiest wordforms of all to learn.',
    mouth: 'Same simple syllable, twice',
    contrast: ['ba-ba / ba-da — repetition is easier than variety'],
  },
};

/*
 * Delivery techniques, each grounded in the newborn-brain literature.
 * `cite` is a short tag rendered in the app so parents can see the guidance
 * is evidence-led rather than folklore. See CONTENT-DESIGN.md for sources.
 */
const TECHNIQUES = {
  ids: {
    id: 'ids',
    name: 'Use parentese',
    icon: '🎵',
    short: 'Slow, sing-song, high-pitched, exaggerated vowels.',
    detail:
      'Newborns can tell infant-directed speech from adult-directed speech, and ' +
      'it acts as a signal that the message is meant for them. Slow right down, ' +
      'lift your pitch, and stretch the vowels — "haaaai, baaaby". It feels ' +
      'silly and it works. Use real words, just delivered musically.',
    cite: 'Infant-directed speech',
  },
  varied: {
    id: 'varied',
    name: 'Same word, many sentences',
    icon: '🔁',
    short: 'Repeat the target word inside different sentences.',
    detail:
      'Babies find where words start and stop by tracking which sounds reliably ' +
      'follow each other — statistical learning. That works best when the word ' +
      'stays constant while everything around it changes. So not "ball, ball, ' +
      'ball" but "here is the ball… the ball is red… roll the ball to me".',
    cite: 'Statistical learning / transitional probabilities',
  },
  boundary: {
    id: 'boundary',
    name: 'Frame it with pauses',
    icon: '⏸️',
    short: 'Small pause… target word… small pause.',
    detail:
      'Prosodic boundaries — brief pauses and pitch drops — are one of the ' +
      'strongest cues a newborn has for finding word edges. Landing the target ' +
      'word at the end of a short phrase, then pausing, makes it stand out ' +
      'clearly from the stream of speech.',
    cite: 'Prosodic boundary perception',
  },
  predict: {
    id: 'predict',
    name: 'Pause and let them predict',
    icon: '⏳',
    short: 'Build a routine, then pause before the punchline.',
    detail:
      "The infant brain constantly predicts what sound comes next and reacts when " +
      'the prediction breaks. Repetitive games with a held pause — "ready… ' +
      'steady… GO!" — put that machinery to work, and the wait invites them to ' +
      'fill the gap themselves.',
    cite: 'Prediction / mismatch response',
  },
  rhythm: {
    id: 'rhythm',
    name: 'Lean on rhythm',
    icon: '🥁',
    short: 'Songs, rhymes and a steady beat.',
    detail:
      'Rhythm and prosody are available to babies before word order is — ' +
      'phrase-level melody can even override word order in newborns, and slow ' +
      'rhythmic cues reach them in the womb. Sung and rhyming versions of a word ' +
      'are genuinely easier to latch onto than spoken ones.',
    cite: 'Prosodic tracking of phrases',
  },
  face: {
    id: 'face',
    name: 'Let them watch your mouth',
    icon: '👀',
    short: 'Face to face, about 30cm away, good light.',
    detail:
      'Time spent watching a speaker\'s mouth predicts later language ability. ' +
      'Get down to their level, hold the object beside your face, and let them ' +
      'see exactly how the sound is made.',
    cite: 'Joint attention / mouth-watching',
  },
  quiet: {
    id: 'quiet',
    name: 'Cut the background noise',
    icon: '🔇',
    short: 'TV and radio off while you teach.',
    detail:
      'Babies can separate competing sound streams, but it costs them effort ' +
      'that is then unavailable for learning. A quiet room measurably improves ' +
      'how well a new word lands.',
    cite: 'Auditory stream segregation',
  },
  joint: {
    id: 'joint',
    name: 'Name what they look at',
    icon: '🫵',
    short: 'Follow their gaze, then label it.',
    detail:
      'Language is learned in social exchange, not from sound alone. Labelling ' +
      'the thing your baby is already attending to — rather than redirecting ' +
      'them to yours — is one of the strongest predictors of vocabulary growth.',
    cite: 'Communicative context',
  },
  expand: {
    id: 'expand',
    name: 'Say it back, plus one',
    icon: '➕',
    short: 'They say "dog" → you say "big dog!"',
    detail:
      'Repeat what they said and add one element. It confirms you understood, ' +
      'models the next step up, and keeps the exchange going — the back-and-forth ' +
      'itself is what drives the gains.',
    cite: 'Turn-taking / contingent response',
  },
  contrast: {
    id: 'contrast',
    name: 'Play with sound pairs',
    icon: '⚖️',
    short: 'Contrast two near-identical words.',
    detail:
      'The infant brain detects tiny acoustic differences and uses them to build ' +
      'phoneme categories. Playfully contrasting a minimal pair — "bat… pat" — ' +
      'sharpens the boundary between two sounds.',
    cite: 'Phoneme discrimination',
  },
};

const BAND_LABEL = {
  early: 'Early sound',
  middle: 'Middle sound',
  later: 'Later sound',
  latest: 'Latest sound',
};

// Look up a phoneme record from a word's `focus` key, tolerating unknown keys.
function phoneme(key) {
  return PHONEMES[key] || null;
}

if (typeof window !== 'undefined') {
  window.PHONEMES = PHONEMES;
  window.TECHNIQUES = TECHNIQUES;
  window.BAND_LABEL = BAND_LABEL;
  window.phoneme = phoneme;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PHONEMES, TECHNIQUES, BAND_LABEL, phoneme };
}
