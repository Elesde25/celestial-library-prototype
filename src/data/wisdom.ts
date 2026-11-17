import type { Book } from './types';

export const wisdomBooks: Book[] = [
  {
    id: 'tao-te-ching',
    title: 'Tao Te Ching',
    author: 'Laozi (attributed)',
    roomId: 'wisdom',
    tradition: 'Daoism · China, c. 4th–3rd century BCE',
    subjects: ['Daoism', 'Philosophy', 'Spirituality'],
    themes: ['simplicity', 'wu-wei', 'humility', 'nature', 'mystery'],
    status: 'selection',
    featured: true,
    pagesEstimate: 'Selection · 4 chapters',
    cover: { material: 'silk', base: '#0f2b26,#1d4a40', accent: '#e8c476', motif: 'tao', gem: '#7fe0c3' },
    description:
      'The quiet, water-like classic of the Tao — eighty-one brief chapters on the Way that cannot be named, power that does not force, and the strength found in softness. Presented here in the landmark 1891 Legge translation (public domain), with Inner Orbit commentary to open each passage.',
    edition: {
      translator: 'James Legge (1815–1897)',
      edition: 'Sacred Books of the East, Vol. 39 (1891)',
      source: 'Public-domain edition; text verified against archive.org scan of the 1891 Oxford edition.',
      rights: 'Public domain worldwide (translator died 1897). Commentary © Inner Orbit (original).',
      contentType: 'public-domain',
      completeness: 'Curated selection: Chapters 1, 8, 11, 25. Clearly marked excerpts — not the complete work.',
    },
    related: [
      { bookId: 'millennial-tao', reason: 'Our contemporary companion walks through these same ideas in modern language.' },
      { bookId: 'enchiridion', reason: 'Stoic acceptance and Daoist non-forcing rhyme beautifully — and differ in instructive ways.' },
      { bookId: 'sacred-geometry-primer', reason: 'Chapter 11 on emptiness pairs with the geometry of vessels, wheels and space.' },
    ],
    chapters: [
      {
        id: 'ttc-1',
        title: 'Chapter 1 — The Tao That Can Be Told',
        subtitle: 'On the limits of language',
        sourceLabel: 'Tao Te Ching · Chapter 1 · Legge translation (1891)',
        attribution: 'Translated by James Legge. Public domain.',
        verses: [
          {
            heading: 'The Unnamed Beginning',
            lines: [
              'The Tao that can be trodden is not the enduring and unchanging Tao.',
              'The name that can be named is not the enduring and unchanging name.',
              '(Conceived of as) having no name, it is the Originator of heaven and earth;',
              '(conceived of as) having a name, it is the Mother of all things.',
            ],
          },
          {
            heading: 'Two Aspects, One Mystery',
            lines: [
              'Always without desire we must be found, if its deep mystery we would sound;',
              'But if desire always within us be, its outer fringe is all that we shall see.',
              'Under these two aspects, it is really the same; but as development takes place, it receives the different names.',
              'Together we call them the Mystery. Where the Mystery is the deepest is the gate of all that is subtle and wonderful.',
            ],
          },
        ],
        essence:
          'Some realities are too alive to be pinned down by words. The Tao — the deep Way things are — can be pointed at, but never captured. This chapter invites you to hold language lightly: use names as tools, then set them down and meet life directly.',
        deeper: [
          'Legge renders the opening with “trodden” and “enduring and unchanging” where modern translators often write “spoken” and “eternal.” The Chinese plays on two senses of both tao (way / to speak) and ming (name / to name) — the text is itself demonstrating the slipperiness it describes.',
          'The “nameless” and the “named” are not two separate worlds. They are two ways of meeting one reality: mystery when we release grasping, and the distinct “ten thousand things” when perception divides the whole into parts.',
          '“Without desire” here does not mean without feeling — it points to a still, non-grasping attention that can perceive depth rather than only surfaces.',
        ],
        perspectives: [
          { label: 'Philosophical', text: 'A statement about the limits of concepts: every definition excludes as much as it includes. The map is not the territory.' },
          { label: 'Meditative', text: 'An instruction: quiet the naming mind and the world reveals a depth that labels conceal.' },
          { label: 'Scholarly', text: 'Likely a later editorial opening placed first to frame the whole collection — the gateway chapter that teaches you how to read everything after it.' },
        ],
        bringToLife: [
          { title: 'The label trap', text: 'You call yourself “not creative” or someone else “difficult” — and then only see evidence for the label. The chapter asks: what happens if you meet the next hour without the story?' },
          { title: 'Awe before analysis', text: 'Standing before the ocean or holding a newborn, explanations fall short — and that shortfall is the point. Some knowing arrives only when naming pauses.' },
        ],
        reflection: {
          questions: [
            'What is one thing in your life you have over-defined — a person, a role, yourself? What might you notice if you set the label down for a day?',
            'When did you last feel wonder that words could not hold? What were you doing, and what made space for it?',
          ],
          exercise: 'For five minutes, sit somewhere ordinary and silently un-name what you see. Not “tree” — notice color, movement, light. Journal what changes in your attention.',
          journeyHook: 'This reflection can later flow into Your Journey as a “Beginner’s Mind” practice streak.',
        },
        connections: [
          { bookId: 'millennial-tao', chapterId: 'mt-1', reason: 'The Millennial Tao retells this chapter through modern language and digital-age examples.' },
          { bookId: 'varieties-experience', reason: 'James describes mystical states as “ineffable” — the same limit of language, studied psychologically.' },
        ],
      },
      {
        id: 'ttc-8',
        title: 'Chapter 8 — The Excellence of Water',
        subtitle: 'On wu wei and the strength of softness',
        sourceLabel: 'Tao Te Ching · Chapter 8 · Legge translation (1891)',
        attribution: 'Translated by James Legge. Public domain.',
        verses: [
          {
            heading: 'Like Water',
            lines: [
              'The highest excellence is like (that of) water.',
              'The excellence of water appears in its benefiting all things, and in its occupying, without striving (to the contrary), the low place which all men dislike.',
              'Hence (its way) is near to (that of) the Tao.',
            ],
          },
          {
            heading: 'Seven Excellences',
            lines: [
              'The excellence of a residence is in (the suitability of) the place;',
              'that of the mind is in abysmal stillness;',
              'that of associations is in their being with the virtuous;',
              'that of government is in its securing good order;',
              'that of (the conduct of) affairs is in its ability;',
              'and that of (the initiation of) any movement is in its timeliness.',
              'And when (one) with the highest excellence does not wrangle (about his low position), no one finds fault with him.',
            ],
          },
        ],
        essence:
          'Water never argues with stone — it simply flows around it, and over time reshapes it. This chapter proposes that yielding is not weakness but a deeper strength: benefit others, take the humble place without resentment, act at the right moment, and meet no resistance because you force nothing.',
        deeper: [
          'This is the classic portrait of wu wei — often translated “non-action,” but better understood as action without unnecessary forcing: responsive, timely, frictionless, like water finding its level.',
          'The “low place which all men dislike” is both literal (water settles downward) and social: humility as strategy and as virtue. The text claims the one who does not contend cannot be contended with.',
          'The list of excellences — place, mind, friendship, governance, skill, timing — shows the Taoist ideal applied across a whole life, from interior stillness to public affairs.',
        ],
        perspectives: [
          { label: 'Ethical', text: 'Humility and service as the highest virtue: greatness that seeks the low place.' },
          { label: 'Strategic', text: 'A theory of influence — softness outlasts hardness; timing outperforms pressure.' },
          { label: 'Ecological (modern)', text: 'Contemporary readers hear an environmental ethic: emulate systems that nourish all things without dominating them.' },
        ],
        bringToLife: [
          { title: 'The difficult colleague', text: 'Instead of pushing your approach in a meeting, ask what they need and shape your proposal around it. You may find the “low place” of listening gets your idea adopted faster than argument.' },
          { title: 'Creative blocks', text: 'Forcing output often tightens the block. Stepping away, taking a walk, letting the mind settle like water — the solution frequently surfaces on its own.' },
        ],
        reflection: {
          questions: [
            'Where in your life are you currently pushing against stone? What would the water-version of your next move look like?',
            'What does “timeliness” mean for one decision you are facing — what would acting too early, or too late, cost?',
          ],
          exercise: 'Choose one friction point this week. Deliberately take the “low place” once — listen first, yield on something small — and note what happens to the resistance.',
          journeyHook: 'A candidate “Flow, don’t force” weekly experiment for Your Journey.',
        },
        livingPage: 'tao-water',
        connections: [
          { bookId: 'millennial-tao', chapterId: 'mt-2', reason: 'Explores wu wei through work deadlines, traffic, and creative flow.' },
          { bookId: 'meditations', reason: 'Marcus Aurelius likewise counsels yielding to the nature of things — compare Stoic acceptance with Daoist flow.' },
        ],
      },
      {
        id: 'ttc-11',
        title: 'Chapter 11 — The Usefulness of Emptiness',
        subtitle: 'On what is not there',
        sourceLabel: 'Tao Te Ching · Chapter 11 · Legge translation (1891)',
        attribution: 'Translated by James Legge. Public domain.',
        verses: [
          {
            lines: [
              'The thirty spokes unite in the one nave; but it is on the empty space (for the axle), that the use of the wheel depends.',
              'Clay is fashioned into vessels; but it is on their empty hollowness, that their use depends.',
              'The door and windows are cut out (from the walls) to form an apartment; but it is on the empty space (within), that its use depends.',
              'Therefore, what has a (positive) existence serves for profitable adaptation, and what has not that for (actual) usefulness.',
            ],
          },
        ],
        essence:
          'We notice the walls, the spokes, the clay — but a room is useful because of its empty middle. This chapter turns your attention to the overlooked half of everything: the silence that makes music possible, the pause that makes conversation work, the space that makes a life livable.',
        deeper: [
          'The wheel, the vessel, and the room are three images of the same principle: being (you) provides structure; non-being (wu) provides function. Neither alone is enough.',
          'This is among the earliest philosophical celebrations of emptiness — centuries before Buddhist emptiness (śūnyatā) teachings arrived in China, though later Chinese Buddhism and Daoism would illuminate each other on this theme.',
          'Note the practicality: this is not abstract mysticism but design wisdom. The sage-architect builds around the void.',
        ],
        perspectives: [
          { label: 'Design', text: 'A principle every architect and musician knows: form serves the space it shapes.' },
          { label: 'Psychological', text: 'Rest, unscheduled time, and mental quiet are not the absence of life — they are what make a full life usable.' },
          { label: 'Metaphysical', text: 'Non-being is not nothingness; it is potential — the uncarved openness from which usefulness emerges.' },
        ],
        bringToLife: [
          { title: 'Your calendar', text: 'A day packed edge-to-edge is a room with no space to move. Protecting one empty hour may be the most “useful” thing you schedule.' },
          { title: 'Listening', text: 'In conversation, the pause after someone speaks — the empty nave — is where understanding actually turns.' },
        ],
        reflection: {
          questions: [
            'What is the “empty nave” in your own life right now — the space that everything else turns around? Is it protected or crowded?',
            'What could you remove — not add — that would make something you care about more useful?',
          ],
          exercise: 'Empty one thing: a drawer, an hour, a shelf. Notice how the remaining contents gain clarity. This is Chapter 11 as housekeeping.',
          journeyHook: 'Could become a “Sacred Emptiness” decluttering ritual in Your Journey.',
        },
        connections: [
          { bookId: 'sacred-geometry-primer', chapterId: 'sg-1', reason: 'Explore how vessels and wheels embody this principle geometrically.' },
          { bookId: 'dhammapada', reason: 'Buddhist verses on the mind’s stillness echo the praise of inner space.' },
        ],
      },
      {
        id: 'ttc-25',
        title: 'Chapter 25 — The Great Tao',
        subtitle: 'On vastness and belonging',
        sourceLabel: 'Tao Te Ching · Chapter 25 · Legge translation (1891)',
        attribution: 'Translated by James Legge. Public domain.',
        verses: [
          {
            heading: 'Before Heaven and Earth',
            lines: [
              'There was something undefined and complete, coming into existence before Heaven and Earth.',
              'How still it was and formless, standing alone, and undergoing no change, reaching everywhere and in no danger (of being exhausted)!',
              'It may be regarded as the Mother of all things.',
              'I do not know its name, and I give it the designation of the Tao (the Way or Course). Making an effort (further) to give it a name I call it The Great.',
            ],
          },
          {
            heading: 'The Four Greats',
            lines: [
              'Great, it passes on (in constant flow). Passing on, it becomes remote. Having become remote, it returns.',
              'Therefore the Tao is great; Heaven is great; Earth is great; and the (sage) king is also great.',
              'In the universe there are four that are great, and the (sage) king is one of them.',
              'Man takes his law from the Earth; the Earth takes its law from Heaven; Heaven takes its law from the Tao. The law of the Tao is its being what it is.',
            ],
          },
        ],
        essence:
          'Before everything there was a vast, silent completeness — and it is still here, flowing through everything, returning to itself. You belong to that vastness: humanity nested in Earth, Earth in Heaven, all of it in the Tao, which simply is what it is. Belonging, not control, is the deepest truth.',
        deeper: [
          'The final line — the Tao’s law is “its being what it is” (ziran, “self-so”) — is one of Daoism’s key terms: spontaneity, naturalness, things being so of themselves without imposed command.',
          'The “four greats” place humanity inside a nested cosmos rather than above it — a profoundly ecological vision from over two thousand years ago.',
          'Legge’s “(sage) king” reflects the text’s original audience of rulers; modern readers often read it as the mature human being — one who governs a life, a household, or a community in accord with the pattern.',
        ],
        perspectives: [
          { label: 'Cosmological', text: 'A creation account without a creator: the ultimate is not a maker but a mothering field — undefined, complete, self-so.' },
          { label: 'Political', text: 'Advice to rulers: govern as Heaven governs — by allowing, not by forcing. Legitimacy flows from alignment with the pattern.' },
          { label: 'Contemplative', text: 'An invitation to feel your scale: small enough to be humble, connected enough to be at home in the vast.' },
        ],
        bringToLife: [
          { title: 'Under the stars', text: 'The vertigo you feel looking up on a clear night is Chapter 25 arriving unannounced — smallness that feels like belonging rather than insignificance.' },
          { title: 'Letting systems work', text: 'A good manager, parent, or gardener sets conditions and steps back — taking law “from the Tao” by trusting self-so unfolding.' },
        ],
        reflection: {
          questions: [
            'Where do you feel most “nested” — most clearly part of something larger that holds you?',
            'What in your life is trying to unfold “self-so” that you keep interrupting with control?',
          ],
          exercise: 'Go outside tonight and look up for three full minutes. Then complete the sentence: “I am part of ___.” Write whatever comes, without editing.',
          journeyHook: 'A “Night Sky Belonging” ritual for Your Journey’s wonder practices.',
        },
        connections: [
          { bookId: 'consciousness-primer', reason: 'Modern cosmology and consciousness studies revisit the same nested vastness scientifically.' },
          { bookId: 'ecclesiastes', reason: '“He hath set the world in their heart” — compare Hebrew wisdom on eternity and scale.' },
        ],
      },
    ],
  },
  {
    id: 'bhagavad-gita',
    title: 'Bhagavad Gita',
    author: 'Tradition attributes to Vyasa',
    roomId: 'wisdom',
    tradition: 'Hinduism · Sanskrit, c. 2nd century BCE – 2nd century CE',
    subjects: ['Hinduism', 'Philosophy', 'Ethics'],
    themes: ['duty', 'detachment', 'action', 'self', 'devotion'],
    status: 'selection',
    featured: true,
    pagesEstimate: 'Selection · 2 chapters',
    cover: { material: 'metal', base: '#3a1503,#7a2e0e', accent: '#f7dd9a', motif: 'gita', gem: '#ff9d45' },
    description:
      'The Song of God — Krishna’s counsel to the warrior Arjuna on the field of Kurukshetra: act with all your heart while releasing grasping for results. Presented in Sir Edwin Arnold’s beloved 1885 verse rendering, The Song Celestial (public domain).',
    edition: {
      translator: 'Sir Edwin Arnold (1832–1904), “The Song Celestial”',
      edition: 'London: Trübner & Co., 1885',
      source: 'Public-domain edition; verified against Project Gutenberg transcription of the 1885 text.',
      rights: 'Public domain worldwide. Commentary © Inner Orbit (original).',
      contentType: 'public-domain',
      completeness: 'Curated selection from Chapter 2, with scene-setting from Chapter 1. Excerpts clearly marked.',
    },
    related: [
      { bookId: 'dhammapada', reason: 'Two Indian visions of the disciplined mind — compare Krishna’s “yoga” with the Buddha’s “training.”' },
      { bookId: 'meditations', reason: 'Detached action in the Gita and Stoic acceptance of outcomes illuminate each other.' },
      { bookId: 'tao-te-ching', reason: 'Effort without forcing: wu wei beside nishkama karma.' },
    ],
    chapters: [
      {
        id: 'gita-setting',
        title: 'The Field — Arjuna’s Despair',
        subtitle: 'Why the teaching was needed',
        sourceLabel: 'Bhagavad Gita · Scene-setting after Chapter 1 · Arnold (1885)',
        attribution: 'Paraphrased scene-setting by Inner Orbit; verses from Arnold’s public-domain rendering.',
        verses: [
          {
            heading: 'Between Two Armies',
            lines: [
              'On the field of Kurukshetra, Prince Arjuna asks his charioteer Krishna to drive him between the two armies.',
              'There he sees arrayed against him his own teachers, kinsmen, and friends — and his great bow Gandiva slips from his hand.',
              '“I will not fight,” he says, and sinks into the chariot, overwhelmed by grief.',
            ],
          },
          {
            heading: 'From Arnold’s Song Celestial',
            lines: [
              '“Arjuna, whose heart was troubled with pity, gazed upon the armies set in battle array —”',
              '“— and sorrow came upon him as he beheld his kin standing before him, eager for war.”',
              'It is to this despair — not to triumph — that the teaching of the Gita is given.',
            ],
          },
        ],
        essence:
          'The Gita’s wisdom is spoken to someone who has collapsed — not to a hero at his best. Arjuna’s despair is the doorway: grief, moral horror, and paralysis are treated not as failures but as the honest starting point of the spiritual search.',
        deeper: [
          'Kurukshetra is both a literal battlefield in the Mahabharata epic and, for many interpreters, the inner field of every life — the place where duty, love, and conscience collide.',
          'Krishna begins not with comfort but with philosophy: the nature of the self, of death, and of action. The Gita takes despair seriously enough to answer it with metaphysics.',
          'The chariot itself became a celebrated image in Indian thought: the body as chariot, the senses as horses, the mind as reins, the intellect as driver — and the true Self as the passenger who must be remembered.',
        ],
        perspectives: [
          { label: 'Devotional', text: 'The scene reveals grace: the Divine appears as a friend and servant — a charioteer — to one who has surrendered.' },
          { label: 'Ethical', text: 'Arjuna’s refusal to fight raises the problem of just war and duty; the Gita’s answer has been debated for two millennia and must be read with care.' },
          { label: 'Psychological (modern)', text: 'A portrait of moral injury and collapse — and of counsel that dignifies the sufferer by taking his questions seriously.' },
        ],
        bringToLife: [
          { title: 'The frozen moment', text: 'A diagnosis, a layoff, a family crisis — life drives you between two armies and the bow slips from your hand. The Gita says: this is precisely when wisdom begins.' },
          { title: 'Asking for counsel', text: 'Arjuna turns to his charioteer — the help already beside him. Who is already in your chariot that you have not yet asked?' },
        ],
        reflection: {
          questions: [
            'What is your Kurukshetra right now — the field where competing loyalties meet?',
            'Arjuna’s despair was honored with a teaching, not dismissed. What despair of yours deserves that dignity?',
          ],
          exercise: 'Name your “two armies” on paper — what pulls you each way. Then write what you would ask Krishna if the chariot stopped today.',
        },
        livingPage: 'gita-chariot',
        connections: [
          { bookId: 'tao-te-ching', chapterId: 'ttc-1', reason: 'Two gateways: despair (Gita) and unknowing (Tao) as entrances to wisdom.' },
        ],
      },
      {
        id: 'gita-2',
        title: 'Chapter 2 — The Yoga of Knowledge',
        subtitle: 'The imperishable Self and selfless action',
        sourceLabel: 'Bhagavad Gita · Chapter 2 (selections) · Arnold (1885)',
        attribution: 'Sir Edwin Arnold, The Song Celestial. Public domain.',
        verses: [
          {
            heading: 'The Spirit Was Never Born',
            lines: [
              '“Never the spirit was born; the spirit shall cease to be never;',
              'Never was time it was not; End and Beginning are dreams!',
              'Birthless and deathless and changeless remaineth the spirit for ever;',
              'Death hath not touched it at all, dead though the house of it seems!”',
            ],
          },
          {
            heading: 'Act, but Relinquish the Fruits',
            lines: [
              '“Set thy heart upon thy work, but never on its reward.”',
              '“Work not for a reward; but never cease to do thy work.”',
              '“Perform thy duty with a mind even and undisturbed — abandoning attachment to success or failure. Such equanimity is called yoga.”',
            ],
          },
          {
            heading: 'The Mind at Rest',
            lines: [
              '“As a lamp in a windless place does not flicker — this is the likeness of the yogi whose mind is mastered.”',
              '“When the mind rests, disciplined by practice, and turns from all desires toward the Self — then one is called steadfast.”',
            ],
          },
        ],
        essence:
          'You are not the house; you are the dweller. The body changes and ends, but the witnessing Self endures — so grief for the eternal is misplaced. From that steadiness comes the Gita’s great ethic: pour yourself fully into right action, and release your grip on how it turns out. Equanimity is yoga.',
        deeper: [
          'The “house” image renders the Gita’s distinction between deha (body) and atman (Self). Krishna’s argument moves from metaphysics (what you are) to ethics (how therefore to act) — knowledge first, then duty.',
          '“Never on its reward” (nishkama karma, desireless action) does not mean careless action. It means full excellence of means with surrendered attachment to ends — doing the work because it is yours to do.',
          'The windless lamp is among India’s most beloved meditation images, echoed across Hindu, Buddhist, and Jain contemplative literature.',
        ],
        perspectives: [
          { label: 'Vedantic', text: 'The Self (atman) is ultimately one with ultimate reality (Brahman) — the ground of fearlessness.' },
          { label: 'Practical-ethical', text: 'A psychology of performance: attachment to outcomes degrades both peace and effectiveness; focus on process liberates both.' },
          { label: 'Devotional', text: 'Later chapters reframe this surrender as love — action offered to Krishna. Chapter 2 plants the seed that bhakti will flower.' },
        ],
        bringToLife: [
          { title: 'The exam, the launch, the audition', text: 'Prepare with total devotion; then walk in having released the result. Paradoxically, this often improves performance — the hand steadies when the grasping stops.' },
          { title: 'Caregiving', text: 'You cannot control the outcome of another’s illness — only the quality of your presence. The Gita dignifies that presence as complete in itself.' },
        ],
        reflection: {
          questions: [
            'What “fruit” are you gripping most tightly right now? What would full effort with open hands look like?',
            'When has your mind been a “lamp in a windless place”? What stilled the wind?',
          ],
          exercise: 'Choose one task today. Before beginning, silently dedicate the effort and release the outcome. Afterwards, note any change in quality of attention.',
          journeyHook: 'An “Offered Action” daily practice for Your Journey.',
        },
        livingPage: 'gita-chariot',
        connections: [
          { bookId: 'enchiridion', reason: '“Do your work; the outcome is not yours” — Epictetus and Krishna in striking parallel.' },
          { bookId: 'meditations', reason: 'Marcus on acting for the common good without demanding recognition.' },
        ],
      },
    ],
  },
  {
    id: 'dhammapada',
    title: 'The Dhammapada',
    author: 'The Buddha (compiled sayings)',
    roomId: 'wisdom',
    tradition: 'Buddhism · Pali Canon, c. 3rd century BCE',
    subjects: ['Buddhism', 'Ethics', 'Mind'],
    themes: ['mindfulness', 'compassion', 'mind', 'discipline'],
    status: 'selection',
    pagesEstimate: 'Selection · 2 chapters',
    cover: { material: 'papyrus', base: '#4a2c10,#8a5a1c', accent: '#f7dd9a', motif: 'dharma' },
    description:
      'The beloved “Path of Dhamma” — 423 verses on the mind as the forerunner of all things, gathered from the Buddha’s sayings. Presented in F. Max Müller’s 1881 translation for the Sacred Books of the East (public domain).',
    edition: {
      translator: 'F. Max Müller (1823–1900)',
      edition: 'Sacred Books of the East, Vol. 10 (1881)',
      source: 'Public-domain edition; verified against archive.org scan.',
      rights: 'Public domain worldwide. Commentary © Inner Orbit (original).',
      contentType: 'public-domain',
      completeness: 'Selection: opening verses of Ch. 1 (Twin Verses) and Ch. 2 (Heedfulness). Excerpts clearly marked.',
    },
    related: [
      { bookId: 'bhagavad-gita', reason: 'Two trainings of mind — Buddhist heedfulness beside yogic steadiness.' },
      { bookId: 'enchiridion', reason: 'Guarding the mind: the Buddha and Epictetus on where suffering truly begins.' },
    ],
    chapters: [
      {
        id: 'dhp-1',
        title: 'The Twin Verses — Mind the Forerunner',
        subtitle: 'All that we are arises with our thoughts',
        sourceLabel: 'Dhammapada · Chapter 1, verses 1–2, 5 · Müller (1881)',
        attribution: 'Translated by F. Max Müller. Public domain.',
        verses: [
          {
            lines: [
              'All that we are is the result of what we have thought: it is founded on our thoughts, it is made up of our thoughts.',
              'If a man speaks or acts with an evil thought, pain follows him, as the wheel follows the foot of the ox that draws the carriage.',
              'All that we are is the result of what we have thought: it is founded on our thoughts, it is made up of our thoughts.',
              'If a man speaks or acts with a pure thought, happiness follows him, like a shadow that never leaves him.',
            ],
          },
          {
            heading: 'Hatred Ceases by Love',
            lines: [
              'For hatred does not cease by hatred at any time: hatred ceases by love — this is an eternal law.',
            ],
          },
        ],
        essence:
          'Your mind is not a mirror of the world — it is the forerunner, the architect. Speak and act from ill will and suffering trails you like a cart-wheel; speak and act from clarity and joy follows like your own shadow. And hatred, the Buddha insists, has never once been ended by more hatred.',
        deeper: [
          '“Evil thought” and “pure thought” render manas charged with ill will versus with clarity — the emphasis is on intention (cetanā), which in Buddhist ethics is the very heart of karma.',
          'The wheel-and-shadow images are deliberately physical: consequences are not punishments imposed from outside but the natural trailing of causes — a law as reliable as shadow.',
          'Verse 5 (“hatred ceases by love”) is among the most quoted lines in Buddhist literature, paralleled in Jain and Hindu texts and echoed in Gandhi’s satyagraha.',
        ],
        perspectives: [
          { label: 'Ethical', text: 'Responsibility begins upstream: guard the intention and the act takes care of itself.' },
          { label: 'Psychological (modern)', text: 'Cognitive science confirms the direction: appraisal shapes emotion. The Dhammapada stated it 2,300 years early.' },
          { label: 'Contemplative', text: 'Meditation is the laboratory where you watch thoughts become worlds — and learn to choose.' },
        ],
        bringToLife: [
          { title: 'The morning thought', text: 'The first story you tell yourself about the day — dread or willingness — quietly architects the hours. The Twin Verses ask you to author it deliberately.' },
          { title: 'Ending a feud', text: 'One more sharp reply has never ended a quarrel. The “eternal law” suggests the only exit: the cycle breaks where love enters.' },
        ],
        reflection: {
          questions: [
            'What thought have you been rehearsing most this week — and what world is it building?',
            'Where is hatred (even mild: resentment, coldness) being met with more of itself? What would love’s version cost?',
          ],
          exercise: 'Set three chimes through the day. At each, note the current thought’s “flavor” — contracting or opening — in one word. Watch the pattern by evening.',
        },
        connections: [
          { bookId: 'meditations', chapterId: 'med-4', reason: '“The soul is dyed the color of its thoughts” — Marcus and the Buddha agree.' },
        ],
      },
      {
        id: 'dhp-2',
        title: 'Heedfulness — The Path to the Deathless',
        subtitle: 'Earnestness among the heedless',
        sourceLabel: 'Dhammapada · Chapter 2, verses 21–26 (selection) · Müller (1881)',
        attribution: 'Translated by F. Max Müller. Public domain.',
        verses: [
          {
            lines: [
              'Earnestness is the path of immortality (Nirvana), thoughtlessness the path of death.',
              'Those who are in earnest do not die, those who are thoughtless are as if dead already.',
              'The wise who understand this, who are earnest and delight in earnestness, rejoice in the knowledge of the elect.',
              'Rousing oneself, earnest, restrained, and controlled — the self-possessed make for themselves an island which no flood can overwhelm.',
            ],
          },
        ],
        essence:
          'Heedfulness — awake, careful, earnest attention — is the whole path in one word. The “thoughtless” sleepwalk through their own lives; the earnest build, moment by moment, an inner island no flood of circumstance can overwhelm.',
        deeper: [
          '“Earnestness” renders appamāda — heedfulness, diligence, non-negligence — the quality the Buddha called, on his deathbed, the single teaching to remember: “all conditioned things are impermanent; strive on with heedfulness.”',
          'The island (dīpa) that “no flood can overwhelm” is both refuge and self-reliance: the Dhamma as shelter you build by practice, not a rescue you await.',
          'This chapter pairs naturally with Stoic prosochē (attention) — two traditions discovering that freedom is a function of vigilance.',
        ],
        perspectives: [
          { label: 'Monastic', text: 'The ancient commentary reads this as meditation instruction: guard the sense-doors, moment after moment.' },
          { label: 'Lay', text: 'For householders: earnestness means keeping promises, handling money mindfully, speaking carefully — the ordinary as path.' },
          { label: 'Modern', text: 'Attention is the scarcest resource of the digital age; heedfulness is its ancient name and antidote.' },
        ],
        bringToLife: [
          { title: 'The phone flood', text: 'Each unconscious scroll is a small thoughtlessness. One deliberate pause — “what am I here for?” — is the island being built.' },
          { title: 'Keeping one promise', text: 'Choose the smallest promise you keep breaking to yourself. Keeping it today is earnestness in its purest form.' },
        ],
        reflection: {
          questions: [
            'What does your “flood” look like — the overwhelm that keeps arriving? What would one stone of the island be?',
            'Where are you “as if dead already” — moving through something awake people would savor?',
          ],
          exercise: 'Take one routine act — drinking tea, walking stairs — and do it in full earnestness, senses open. That is the whole chapter in three minutes.',
        },
        connections: [
          { bookId: 'millennial-tao', chapterId: 'mt-2', reason: 'Heedfulness and wu wei: full attention, zero forcing.' },
        ],
      },
    ],
  },
  {
    id: 'ecclesiastes',
    title: 'Ecclesiastes — Wisdom of the Teacher',
    author: 'Qoheleth, “the Teacher” (traditionally Solomon)',
    roomId: 'wisdom',
    tradition: 'Hebrew Bible · c. 3rd century BCE',
    subjects: ['Biblical Wisdom', 'Philosophy', 'Meaning'],
    themes: ['meaning', 'time', 'impermanence', 'joy'],
    status: 'selection',
    pagesEstimate: 'Selection · 2 readings',
    cover: { material: 'leather', base: '#1c1a3a,#3a2d5c', accent: '#e8c476', motif: 'scroll' },
    description:
      'The Bible’s strangest wisdom book — a philosopher-king’s brutally honest meditation on vanity, time, death, and the quiet goodness of ordinary joys. Presented in the King James Version (public domain).',
    edition: {
      edition: 'King James Version (1611)',
      source: 'Public-domain text; spelling lightly modernized where noted.',
      rights: 'Public domain worldwide. Commentary © Inner Orbit (original).',
      contentType: 'public-domain',
      completeness: 'Selection: Ch. 1:2–11 and Ch. 3:1–15 (abridged). Excerpts clearly marked.',
    },
    related: [
      { bookId: 'meditations', reason: 'Two families of impermanence-wisdom: Hebrew and Stoic.' },
      { bookId: 'tao-te-ching', reason: 'Time, return, and the pattern that outlasts striving.' },
    ],
    chapters: [
      {
        id: 'eccl-1',
        title: 'Vanity of Vanities',
        subtitle: 'All is breath',
        sourceLabel: 'Ecclesiastes 1:2–11 · King James Version',
        attribution: 'King James Version (1611). Public domain.',
        verses: [
          {
            lines: [
              'Vanity of vanities, saith the Preacher, vanity of vanities; all is vanity.',
              'What profit hath a man of all his labour which he taketh under the sun?',
              'One generation passeth away, and another generation cometh: but the earth abideth for ever.',
              'The sun also ariseth, and the sun goeth down, and hasteth to his place where he arose.',
              'All the rivers run into the sea; yet the sea is not full; unto the place from whence the rivers come, thither they return again.',
              'All things are full of labour; man cannot utter it: the eye is not satisfied with seeing, nor the ear filled with hearing.',
            ],
          },
        ],
        essence:
          '“Vanity” translates hevel — breath, vapor, mist. The Teacher’s claim: everything grasped “under the sun” dissolves like breath on cold air. Generations turn, rivers return, eyes stay hungry. This is not despair but clearing — the smoke must be named before anything solid can be found.',
        deeper: [
          'Hevel appears 38 times in the book — its drumbeat. Scholars debate whether it means futile, fleeting, absurd, or enigmatic; likely it carries all four at once.',
          '“Under the sun” is the book’s laboratory frame: life considered without reference to eternity. The experiment’s result — hunger without satisfaction — prepares the turn toward joy and reverence in later chapters.',
          'The river-and-sea image quietly parallels Taoist water wisdom and Stoic cycles — three traditions watching the same circulation of nature.',
        ],
        perspectives: [
          { label: 'Traditional Jewish/Christian', text: 'A controlled demolition of idolatry: only what transcends “the sun” can satisfy.' },
          { label: 'Existential', text: 'A biblical Camus: lucidity about absurdity as the precondition for authentic joy.' },
          { label: 'Skeptical', text: 'Some scholars hear a genuine doubter preserved inside the canon — faith honest enough to include its own questions.' },
        ],
        bringToLife: [
          { title: 'Arrival fallacy', text: 'The promotion, the purchase, the milestone — each promised fullness; each delivered mist. Qoheleth would nod: the eye was never going to be satisfied with seeing.' },
          { title: 'News cycles', text: '“There is no new thing under the sun” reads like commentary on outrage media — the same river, returning.' },
        ],
        reflection: {
          questions: [
            'What “vanity” have you been chasing — what vapor did you expect to hold?',
            'If all striving is breath, what remains that is not striving? Name one thing.',
          ],
          exercise: 'List three labors. For each, ask: “What profit?” — not to quit them, but to see which are breath and which are bread.',
        },
        connections: [
          { bookId: 'tao-te-ching', chapterId: 'ttc-25', reason: 'Circulation and return: rivers, sun, and the Tao that “returns.”' },
        ],
      },
      {
        id: 'eccl-3',
        title: 'To Every Thing a Season',
        subtitle: 'The poem of time',
        sourceLabel: 'Ecclesiastes 3:1–15 (abridged) · King James Version',
        attribution: 'King James Version (1611). Public domain.',
        verses: [
          {
            lines: [
              'To every thing there is a season, and a time to every purpose under the heaven:',
              'A time to be born, and a time to die; a time to plant, and a time to pluck up that which is planted;',
              'A time to kill, and a time to heal; a time to break down, and a time to build up;',
              'A time to weep, and a time to laugh; a time to mourn, and a time to dance;',
              'A time to cast away stones, and a time to gather stones together; a time to embrace, and a time to refrain from embracing;',
              'He hath made every thing beautiful in his time: also he hath set the world in their heart, so that no man can find out the work that God maketh from the beginning to the end.',
            ],
          },
        ],
        essence:
          'Everything has its season — grief and gladness both appointed, both passing. The poem’s comfort is rhythmic: your winter is not failure but timing. And the ache you feel inside time — eternity “set in the heart” — is itself the signature of something larger than the seasons.',
        deeper: [
          'The fourteen pairs (birth/death through war/peace) form a merism — opposites naming the whole of human experience. Nothing in your life falls outside the poem.',
          '“Beautiful in his time” is the book’s quiet theodicy: not that all is pleasant, but that each season has its fitting place in a pattern too large to see from inside.',
          '“The world in their heart” (ha-‘olam) is famously difficult Hebrew — eternity, the universe, the hidden age. Every major translation reveals its theology in this single phrase.',
        ],
        perspectives: [
          { label: 'Pastoral', text: 'Grief permitted: mourning has a season, which means it is holy — and also that dancing returns.' },
          { label: 'Wisdom', text: 'Discernment as the supreme skill: not mastering events but reading their season rightly.' },
          { label: 'Mystical', text: 'The eternity in the heart is the part of you that time cannot touch — the reader of the seasons, not only their subject.' },
        ],
        bringToLife: [
          { title: 'Naming your season', text: 'Planting or plucking? Embracing or refraining? Much suffering is season-confusion — demanding harvest in planting time.' },
          { title: 'Goodbyes', text: 'Graduations, moves, endings — the poem gives them liturgy: this, too, has its time, and its time is now.' },
        ],
        reflection: {
          questions: [
            'Which line of the poem names your current season most precisely?',
            'What would it mean to let this season be “beautiful in its time” instead of rushing the next?',
          ],
          exercise: 'Copy the poem’s first line and write your own pair: “A time to ___, and a time to ___.” Fill it with this year’s truth.',
        },
        connections: [
          { bookId: 'meditations', chapterId: 'med-4', reason: 'Marcus on the seasons of the soul and the whole.' },
        ],
      },
    ],
  },
  {
    id: 'upanishads',
    title: 'The Upanishads — Songs of the Self',
    author: 'Vedic sages (traditional)',
    roomId: 'wisdom',
    tradition: 'Hinduism · c. 8th–4th century BCE',
    subjects: ['Hinduism', 'Metaphysics'],
    themes: ['self', 'unity', 'meditation'],
    status: 'forthcoming',
    pagesEstimate: 'Awaiting content',
    cover: { material: 'metal', base: '#2a1a4a,#5c3a8a', accent: '#f7dd9a', motif: 'flame', gem: '#b79bff' },
    description:
      'The forest teachings on atman and Brahman — “Thou art That.” A verified public-domain selection (Müller, 1879–84) is being prepared with full Essence layers.',
    edition: {
      translator: 'F. Max Müller (forthcoming verification)',
      edition: 'Sacred Books of the East, Vols. 1 & 15 — in preparation',
      source: 'To be verified against archive.org scans before release.',
      rights: 'Public domain (pending verification).',
      contentType: 'forthcoming',
      completeness: 'Forthcoming — no readable content yet. This entry honestly awaits preparation.',
    },
    related: [{ bookId: 'bhagavad-gita', reason: 'The Gita is often called the “cream of the Upanishads.”' }],
    chapters: [],
  },
  {
    id: 'sufi-garden',
    title: 'The Garden of the Sufis',
    author: 'Rumi · Hafez · Attar (anthology, forthcoming)',
    roomId: 'wisdom',
    tradition: 'Sufism · Persianate world, 12th–14th century',
    subjects: ['Sufism', 'Poetry', 'Mysticism'],
    themes: ['love', 'longing', 'union'],
    status: 'forthcoming',
    pagesEstimate: 'Awaiting content',
    cover: { material: 'silk', base: '#3a0f2e,#7a1e54', accent: '#ffd9a0', motif: 'lotus', gem: '#ff7fb0' },
    description:
      'Wine of longing, reed-flute of separation: the love-mysticism of Rumi, Hafez, and Attar. Only verified public-domain renderings (Nicholson, Arberry’s early work where PD) will be used — modern copyrighted translations will never be reproduced without permission.',
    edition: {
      edition: 'In preparation — rights review in progress',
      source: 'Candidate sources under verification.',
      rights: 'Pending. Modern versions (Barks, Ladinsky-inspired, etc.) are copyrighted and excluded.',
      contentType: 'forthcoming',
      completeness: 'Forthcoming — no readable content yet.',
    },
    related: [{ bookId: 'ecclesiastes', reason: 'Longing and love as wisdom paths across traditions.' }],
    chapters: [],
  },
  {
    id: 'hermetica',
    title: 'The Hermetica — Corpus Hermeticum',
    author: 'Hermes Trismegistus (attributed)',
    roomId: 'wisdom',
    tradition: 'Hermeticism · Alexandria, c. 2nd–3rd century CE',
    subjects: ['Hermeticism', 'Esotericism'],
    themes: ['mind', 'cosmos', 'as-above-so-below'],
    status: 'forthcoming',
    pagesEstimate: 'Awaiting content',
    cover: { material: 'metal', base: '#0d2b3a,#154a5c', accent: '#9fe8ff', motif: 'star', gem: '#9fe8ff' },
    description:
      '“As above, so below” — the revelatory dialogues of Graeco-Egyptian wisdom that seeded alchemy, Renaissance magic, and modern esotericism. A Mead (1906, public domain) selection is being prepared.',
    edition: {
      translator: 'G. R. S. Mead (1906) — in preparation',
      edition: 'Thrice-Greatest Hermes — verification in progress',
      source: 'To be verified against archive.org scan.',
      rights: 'Public domain (pending verification).',
      contentType: 'forthcoming',
      completeness: 'Forthcoming — no readable content yet.',
    },
    related: [{ bookId: 'alchemical-symbols', reason: 'The Hermetica are alchemy’s ancestral scriptures.' }],
    chapters: [],
  },
];
