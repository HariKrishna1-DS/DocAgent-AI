export interface WordSlot {
  length: number;
  hint: string;
}

export interface Puzzle {
  id: string;
  title: string;
  date: string;
  grid: (string | null)[][];
  slots: WordSlot[];
  primaryWords?: string[];
}

export interface GameStreakData {
  streak: number;
  lastCompletedDate: string;
  bestTimeSeconds: number | null;
  totalPlayed: number;
}

// Curated daily puzzles including the exact puzzle from the reference screenshot
export const DAILY_PUZZLES: Puzzle[] = [
  {
    id: 'puzzle_h_grid',
    title: 'H-Formation Word Vault',
    date: 'today',
    // Exactly matches the user's screenshot:
    // Row 0: U B E I G
    // Row 1: H   H   H
    // Row 2: O       T
    // Row 3: H   H   H
    // Row 4: C E C T A
    grid: [
      ['U', 'B', 'E', 'I', 'G'],
      ['H', null, 'H', null, 'H'],
      ['O', null, null, null, 'T'],
      ['H', null, 'H', null, 'H'],
      ['C', 'E', 'C', 'T', 'A'],
    ],
    slots: [
      { length: 3, hint: 'Try: HUB, HAT, CAT, HOT, or HUG' },
      { length: 4, hint: 'Try: ECHO, CHAT, TECH, or THAT' },
      { length: 5, hint: 'Try: HATCH, EIGHT, or CHEAT' },
      { length: 6, hint: 'Try: HEIGHT (uses H-E-I-G-H-T)' },
    ],
    primaryWords: [
      'HEIGHT',
      'HATCH',
      'ECHO',
      'HUB',
      'EIGHT',
      'CHAT',
      'TECH',
      'THAT',
      'HATE',
      'HEAT',
      'HAT',
      'CAT',
      'HOT',
      'HUG'
    ],
  },
  {
    id: 'puzzle_diamond_grid',
    title: 'Diamond Lattice',
    date: 'bonus_1',
    grid: [
      ['S', 'P', 'A', 'R', 'K'],
      ['T', null, 'L', null, 'E'],
      ['A', null, null, null, 'E'],
      ['R', null, 'M', null, 'P'],
      ['S', 'M', 'A', 'R', 'T'],
    ],
    slots: [
      { length: 3, hint: 'Try: RAM, SEA, TEA, ART, or MAP' },
      { length: 4, hint: 'Try: STAR, PARK, KEEP, or TEAM' },
      { length: 4, hint: 'Try: STEM, PEAK, MEAT, or SEAL' },
      { length: 5, hint: 'Try: SMART, SPARK, or TRAMP' },
    ],
    primaryWords: ['SMART', 'STAR', 'PARK', 'RAM', 'SPARK', 'KEEP'],
  },
  {
    id: 'puzzle_cross_grid',
    title: 'Crosshair Matrix',
    date: 'bonus_2',
    grid: [
      ['F', 'L', 'A', 'S', 'H'],
      ['O', null, 'U', null, 'O'],
      ['U', null, null, null, 'P'],
      ['N', null, 'D', null, 'E'],
      ['D', 'R', 'E', 'A', 'M'],
    ],
    slots: [
      { length: 3, hint: 'Try: SUN, OAD, RUN, RED, or HOP' },
      { length: 4, hint: 'Try: HOPE, LEAP, LOUD, or HEAD' },
      { length: 4, hint: 'Try: SHED, SOUP, HORN, or FAME' },
      { length: 5, hint: 'Try: FLASH, DREAM, or FOUND' },
    ],
    primaryWords: ['FLASH', 'HOPE', 'DREAM', 'SUN', 'FOUND'],
  },
];

// Comprehensive English word dictionary for validation of grid finds
const DICTIONARY_WORDS = new Set([
  // 3-letter words
  'CAT', 'HAT', 'HOT', 'HUG', 'BIG', 'BET', 'BEG', 'BAG', 'BUT', 'BAT', 'ICE',
  'EAT', 'TEA', 'TAG', 'GET', 'HIT', 'OUT', 'TUB', 'THE', 'ACE', 'ACT', 'OAT',
  'TOE', 'TIE', 'GIG', 'BOG', 'COT', 'COG', 'BOY', 'GUT', 'TAB', 'ATE', 'AGE',
  'CUB', 'HUB', 'BUD', 'PUB', 'BIT', 'HUT', 'BUG', 'PIG', 'DIG', 'FIT', 'SIT',
  'WIT', 'LIT', 'ROT', 'LOT', 'NOT', 'POT', 'DOT', 'BOT', 'NET', 'SET', 'LET',
  'MET', 'PET', 'WET', 'YET', 'JET', 'RUN', 'SUN', 'GUN', 'FUN', 'BUN', 'NUN',
  'PUN', 'CAR', 'BAR', 'FAR', 'JAR', 'TAR', 'WAR', 'EAR', 'OAR', 'PAR', 'RAW',
  'SAW', 'LAW', 'JAW', 'PAW', 'COW', 'HOW', 'NOW', 'BOW', 'ROW', 'SOW', 'TOW',
  'VOW', 'ZOO', 'TOO', 'COO', 'BOO', 'MOO', 'WOO', 'FOO', 'GOO', 'HOG', 'FOG',
  'LOG', 'DOG', 'JOG', 'MUG', 'RUG', 'JUG', 'TUG', 'PUG', 'HUE', 'CUE', 'DUE',
  'SUE', 'PIE', 'LIE', 'DIE', 'TIE', 'VIE', 'RYE', 'BYE', 'EYE', 'DYE', 'AWE',
  'AXE', 'APE', 'ASP', 'ASS', 'ASH', 'AIR', 'AIM', 'AID', 'ALL', 'ALE', 'ARK',
  'ARM', 'ART', 'AWL', 'BAD', 'BED', 'BID', 'BOD', 'BOP', 'BOX', 'CAB', 'CAD',
  'CAM', 'CAN', 'CAP', 'COB', 'COD', 'COP', 'CUD', 'CUP', 'CUR', 'CUT', 'DAB',
  'DAD', 'DAM', 'DAP', 'DAY', 'DEN', 'DEW', 'DIP', 'DOE', 'DON', 'DUB', 'DUD',
  'DUG', 'DUN', 'DUO', 'EEL', 'EFT', 'EGG', 'EGO', 'ELK', 'ELM', 'EMU', 'END',
  'ERA', 'ERG', 'ERR', 'EVE', 'EWE', 'FAD', 'FAN', 'FAT', 'FAX', 'FED', 'FEE',
  'FEN', 'FEW', 'FEY', 'FEZ', 'FIB', 'FIG', 'FIN', 'FIR', 'FIX', 'FLU', 'FLY',
  'FOB', 'FOE', 'FOP', 'FOX', 'FRO', 'FRY', 'FUD', 'FUG', 'FUR', 'GAB', 'GAD',
  'GAG', 'GAL', 'GAM', 'GAP', 'GAS', 'GAY', 'GED', 'GEE', 'GEL', 'GEM', 'GEN',
  'GIB', 'GID', 'GIE', 'GIN', 'GIP', 'GIT', 'GNU', 'GOB', 'GOD', 'GOO', 'GOR',
  'GOT', 'GOX', 'GOY', 'GUL', 'GUM', 'GUP', 'GUR', 'GUS', 'GUV', 'GUY', 'GYM',
  'GYP', 'HAD', 'HAE', 'HAG', 'HAH', 'HAJ', 'HAM', 'HAO', 'HAP', 'HAS', 'HAW',
  'HAY', 'HEH', 'HEM', 'HEN', 'HEP', 'HER', 'HES', 'HEW', 'HEX', 'HIC', 'HID',
  'HIE', 'HIM', 'HIN', 'HIP', 'HIS', 'HOE', 'HOH', 'HOI', 'HOM', 'HON', 'HOP',
  'HOY', 'HUB', 'HUM', 'HUN', 'HUP', 'HYP', 'ICK', 'ICY', 'IFS', 'IGG', 'ILK',
  'ILL', 'IMP', 'INK', 'INN', 'INS', 'ION', 'IRE', 'IRK', 'ISM', 'ITS', 'IVY',

  // 4-letter words
  'EIGHT', 'ECHO', 'CHAT', 'TECH', 'THAT', 'HATE', 'BATH', 'COAT', 'BYTE',
  'BEAT', 'HEAT', 'BITE', 'GATE', 'BAIT', 'BOAT', 'TACT', 'CUTE', 'BENT',
  'BEAM', 'BEST', 'BETH', 'CHEF', 'CHIT', 'CHOC', 'CHOP', 'CHUB', 'CITE',
  'CITY', 'CLOT', 'CLUB', 'COMA', 'COMB', 'COME', 'CONE', 'COOK', 'COOL',
  'COOP', 'COOT', 'COPE', 'COPY', 'CORD', 'CORE', 'CORK', 'CORN', 'COST',
  'COTE', 'CRAB', 'CRAG', 'CRAM', 'CREW', 'CROP', 'CROW', 'CUBE', 'CUFF',
  'CULT', 'CURB', 'CURD', 'CURE', 'CURL', 'CURT', 'CUSP', 'EACH', 'EARL',
  'EARN', 'EASE', 'EAST', 'EASY', 'EDGE', 'EDGY', 'EDIT', 'EGGS', 'EGOS',
  'ELAN', 'ELSE', 'ENVY', 'EPIC', 'EVEN', 'EVER', 'EVIL', 'EXAM', 'EXIT',
  'EYES', 'FACE', 'FACT', 'FADE', 'FAIL', 'FAIR', 'FAKE', 'FALL', 'FAME',
  'FANG', 'FARM', 'FAST', 'FATE', 'FAWN', 'FEAR', 'FEAT', 'FEED', 'FEEL',
  'FEES', 'FEET', 'FELL', 'FELT', 'FERN', 'FETA', 'FEUD', 'FILE', 'FILL',
  'FILM', 'FIND', 'FINE', 'FIRE', 'FIRM', 'FISH', 'FIST', 'FITS', 'FIVE',
  'FLAG', 'FLAP', 'FLAT', 'FLAW', 'FLEA', 'FLED', 'FLEE', 'FLEW', 'FLIP',
  'FLIT', 'FLOE', 'FLOG', 'FLOW', 'FOAM', 'FOIL', 'FOLD', 'FOLK', 'FOND',
  'FOOD', 'FOOL', 'FOOT', 'FORD', 'FORE', 'FORK', 'FORM', 'FORT', 'FOUL',
  'FOUR', 'FOWL', 'FREE', 'FRET', 'FROG', 'FROM', 'FUEL', 'FULL', 'FUME',
  'FUND', 'FURY', 'FUSE', 'FUSS', 'GAIN', 'GAIT', 'GALE', 'GAME', 'GANG',
  'GAOL', 'GAPE', 'GAPS', 'GARB', 'GASH', 'GASP', 'GAVE', 'GAZE', 'GEAR',
  'GEMS', 'GENE', 'GIFT', 'GILL', 'GILT', 'GIRL', 'GIRT', 'GIST', 'GIVE',
  'GLAD', 'GLAM', 'GLEN', 'GLIB', 'GLOB', 'GLOM', 'GLOP', 'GLOW', 'GLUE',
  'GLUM', 'GLUT', 'GOAD', 'GOAL', 'GOAT', 'GOLD', 'GOLF', 'GONE', 'GONG',
  'GOOD', 'GOOF', 'GOON', 'GORE', 'GORY', 'GOSH', 'GOTH', 'GOUT', 'GOWN',
  'GRAB', 'GRAD', 'GRAM', 'GRAY', 'GREW', 'GREY', 'GRID', 'GRIM', 'GRIN',
  'GRIP', 'GRIT', 'GROG', 'GROW', 'GRUB', 'GULF', 'GULL', 'GULP', 'GUMS',
  'GUNG', 'GUNK', 'GUNS', 'GURU', 'GUSH', 'GUST', 'GUTS', 'GUYS', 'HEAL',
  'HEAP', 'HEAR', 'HECK', 'HEED', 'HEEL', 'HEFT', 'HEIR', 'HELD', 'HELM',
  'HELP', 'HEMP', 'HENS', 'HERB', 'HERD', 'HERE', 'HERO', 'HERS', 'HEWN',
  'HIDE', 'HIGH', 'HIKE', 'HILL', 'HILT', 'HIND', 'HINT', 'HIPS', 'HIRE',
  'HISS', 'HIVE', 'HOAX', 'HOBO', 'HOCK', 'HOLD', 'HOLE', 'HOLM', 'HOLT',
  'HOLY', 'HOME', 'HONE', 'HONK', 'HOOD', 'HOOF', 'HOOK', 'HOOP', 'HOOT',
  'HOPE', 'HOPS', 'HORN', 'HOSE', 'HOST', 'HOTS', 'HOUR', 'HOVE', 'HOWL',
  'HUGE', 'HULA', 'HULK', 'HULL', 'HUMP', 'HUNG', 'HUNK', 'HUNT', 'HURL',
  'HURT', 'HUSH', 'HUSK', 'HYMN', 'HYPE', 'HYPO', 'ICED', 'ICES', 'ICON',
  'IDEA', 'IDLE', 'IDLY', 'IDOL', 'INCH', 'INFO', 'INKS', 'INKY', 'INNS',
  'INTO', 'IONS', 'IOTA', 'IRIS', 'IRKS', 'IRON', 'ISLE', 'ITCH', 'ITEM',

  // 5-letter words
  'HEIGHT', 'HATCH', 'EIGHT', 'TOUCH', 'BEIGE', 'CHEAT', 'CATCH', 'BATCH', 'BEACH', 'BIGHT',
  'THIGH', 'CHUTE', 'OUGHT', 'WHITE', 'THICK', 'THINK', 'THANK', 'THING',
  'THEME', 'THEIR', 'THERE', 'THESE', 'THOSE', 'TIGER', 'TIGHT', 'TIMER',
  'TIMES', 'TITLE', 'TODAY', 'TOKEN', 'TOOTH', 'TOPIC', 'TOTAL', 'TOWER',
  'TRACK', 'TRADE', 'TRAIL', 'TRAIN', 'TRAIT', 'TREAT', 'TREND', 'TRIAL',
  'TRIBE', 'TRICK', 'TRIED', 'TRIES', 'TRUCK', 'TRULY', 'TRUNK', 'TRUST',
  'TRUTH', 'TWICE', 'UNCLE', 'UNDER', 'UNION', 'UNITY', 'UNTIL', 'UPPER',
  'UPSET', 'URBAN', 'USAGE', 'USUAL', 'VALID', 'VALUE', 'VAPOR', 'VAULT',
  'VENUE', 'VERSE', 'VIDEO', 'VIRUS', 'VISIT', 'VITAL', 'VOICE', 'VOWEL',
  'WASTE', 'WATCH', 'WATER', 'WAVE', 'WEAR', 'WHEAT', 'WHEEL', 'WHERE',
  'WHICH', 'WHILE', 'WHOLE', 'WHOSE', 'WOMAN', 'WOMEN', 'WORLD', 'WORRY',
  'WORSE', 'WORST', 'WORTH', 'WOULD', 'WOUND', 'WRITE', 'WRONG', 'YOUTH',
  'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT',
  'AFTER', 'AGAIN', 'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT',
  'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE', 'ALLOW', 'ALONE', 'ALONG', 'ALTER',
  'AMONG', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLE', 'APPLY', 'ARENA',
  'ARGUE', 'ARISE', 'ARMED', 'ARMOR', 'ARROW', 'ASIDE', 'ASSET', 'AUDIO',
  'AUDIT', 'AVOID', 'AWAIT', 'AWAKE', 'AWARD', 'AWARE', 'BADGE', 'BAKER',
  'BASIC', 'BASIS', 'BEAST', 'BEGIN', 'BEING', 'BELOW', 'BENCH', 'BIRTH',
  'BLACK', 'BLADE', 'BLAME', 'BLANK', 'BLAST', 'BLEED', 'BLEND', 'BLESS',
  'BLIND', 'BLOCK', 'BLOOD', 'BOARD', 'BOAST', 'BOOST', 'BOUND', 'BRAIN',
  'BRAKE', 'BRAND', 'BRASS', 'BRAVE', 'BREAD', 'BREAK', 'BREED', 'BRIEF',
  'BRING', 'BROAD', 'BROKE', 'BROWN', 'BUILD', 'BUILT', 'BUYER', 'CABIN',
  'CABLE', 'CALIF', 'CANDY', 'CARGO', 'CARRY', 'CAUSE', 'CHAIN', 'CHAIR',
  'CHALK', 'CHAMP', 'CHART', 'CHASE', 'CHECK', 'CHEEK', 'CHEER', 'CHEST',
  'CHIEF', 'CHILD', 'CHINA', 'CHOIR', 'CHOKE', 'CHORD', 'CHOSE', 'CIVIL',
  'CLAIM', 'CLASS', 'CLEAN', 'CLEAR', 'CLERK', 'CLICK', 'CLIFF', 'CLIMB',
  'CLOCK', 'CLOSE', 'CLOTH', 'CLOUD', 'COACH', 'COAST', 'COLOR', 'CORAL',
  'COUNT', 'COURT', 'COVER', 'CRACK', 'CRAFT', 'CRANE', 'CRASH', 'CRAZY',
  'CREAM', 'CRIME', 'CRISP', 'CROSS', 'CROWD', 'CROWN', 'CRUDE', 'CRUSH',
  'CRYST', 'CUBIC', 'CURSE', 'CURVE', 'CYCLE', 'DAILY', 'DANCE', 'DATED',
  'DEALT', 'DEATH', 'DEBUT', 'DELAY', 'DEPTH', 'DEVIL', 'DIARY', 'DIRTY',
  'DISCO', 'DOUBT', 'DOUGH', 'DRAFT', 'DRAIN', 'DRAMA', 'DRANK', 'DRAWN',
  'DREAM', 'DRESS', 'DRIED', 'DRIFT', 'DRILL', 'DRINK', 'DRIVE', 'DROWN',
  'DRUNK', 'DYING', 'EAGER', 'EARLY', 'EARTH', 'EATEN', 'ELDER', 'ELECT',
  'ELITE', 'EMPTY', 'ENEMY', 'ENJOY', 'ENTER', 'ENTRY', 'EQUAL', 'ERROR',
  'ESSAY', 'EVENT', 'EVERY', 'EXACT', 'EXIST', 'EXTRA', 'FAINT', 'FAITH',
  'FALSE', 'FATAL', 'FAULT', 'FAVOR', 'FEAST', 'FEVER', 'FIBER', 'FIELD',
  'FIFTH', 'FIFTY', 'FIGHT', 'FINAL', 'FIRST', 'FIXED', 'FLAME', 'FLASH',
  'FLEET', 'FLESH', 'FLOAT', 'FLOOD', 'FLOOR', 'FLOUR', 'FLUID', 'FLUSH',
  'FOCAL', 'FOCUS', 'FORCE', 'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FRAME',
  'FRAUD', 'FRESH', 'FRONT', 'FROST', 'FRUIT', 'FULLY', 'FUNNY', 'GIANT',
  'GIVEN', 'GLASS', 'GLOBE', 'GLORY', 'GLOVE', 'GOING', 'GRACE', 'GRADE',
  'GRAIN', 'GRAND', 'GRANT', 'GRAPE', 'GRAPH', 'GRASP', 'GRASS', 'GRAVE',
  'GREAT', 'GREEK', 'GREEN', 'GREET', 'GRIEF', 'GRILL', 'GROSS', 'GROUP',
  'GROVE', 'GROWN', 'GUARD', 'GUESS', 'GUEST', 'GUIDE', 'GUILT', 'HABIT',
  'HAPPY', 'HARSH', 'HATCH', 'HAVEN', 'HEART', 'HEAVY', 'HELLO', 'HENCE',
  'HONEY', 'HONOR', 'HORSE', 'HOTEL', 'HOUSE', 'HUMAN', 'HUMOR', 'HURRY',
  'IDEAL', 'IMAGE', 'IMPLY', 'INDEX', 'INNER', 'INPUT', 'ISSUE', 'IVORY',
  'JAPAN', 'JEWEL', 'JOINT', 'JUDGE', 'JUICE', 'KNIFE', 'KNOCK', 'KNOWN',
  'LABEL', 'LABOR', 'LARGE', 'LASER', 'LATER', 'LAUGH', 'LAYER', 'LEARN',
  'LEASE', 'LEAST', 'LEAVE', 'LEGAL', 'LEMON', 'LEVEL', 'LIGHT', 'LIMIT',
  'LINEN', 'LIVER', 'LOCAL', 'LODGE', 'LOGIC', 'LOOSE', 'LOVER', 'LOWER',
  'LUCKY', 'LUNCH', 'MAGIC', 'MAJOR', 'MAKER', 'MARCH', 'MARRY', 'MATCH',
  'MAYBE', 'MAYOR', 'MEANT', 'MEDAL', 'MEDIA', 'MERCY', 'METAL', 'METER',
  'MIGHT', 'MINER', 'MINOR', 'MINUS', 'MIXED', 'MODEL', 'MODEM', 'MONEY',
  'MONTH', 'MORAL', 'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH', 'MOVIE', 'MUSIC',
  'NAKED', 'NAVAL', 'NERVE', 'NEVER', 'NEWER', 'NIGHT', 'NOBLE', 'NOISE',
  'NORTH', 'NOTED', 'NOVEL', 'NURSE', 'OCCUR', 'OCEAN', 'OFFER', 'OFTEN',
  'ORDER', 'OTHER', 'OUTER', 'OWNER', 'OXIDE', 'PAINT', 'PANEL', 'PANIC',
  'PAPER', 'PARTY', 'PASTA', 'PATCH', 'PAUSE', 'PEACE', 'PENNY', 'PHASE',
  'PHONE', 'PHOTO', 'PIECE', 'PILOT', 'PITCH', 'PIVOT', 'PIZZA', 'PLACE',
  'PLAIN', 'PLANE', 'PLANT', 'PLATE', 'POINT', 'POKER', 'POLAR', 'POUND',
  'POWER', 'PRESS', 'PRICE', 'PRIDE', 'PRIME', 'PRINT', 'PRIOR', 'PRIZE',
  'PROBE', 'PRONE', 'PROOF', 'PROUD', 'PROVE', 'QUEEN', 'QUICK', 'QUIET',
  'QUITE', 'RADIO', 'RAISE', 'RANCH', 'RANGE', 'RAPID', 'RATIO', 'REACH',
  'REACT', 'READY', 'REALM', 'REBEL', 'REFER', 'RELAX', 'REPLY', 'RESET',
  'RIDER', 'RIDGE', 'RIGHT', 'RIVAL', 'RIVER', 'ROBOT', 'ROUND', 'ROUTE',
  'ROYAL', 'RURAL', 'SCALE', 'SCENE', 'SCOPE', 'SCORE', 'SEIZE', 'SENSE',
  'SERVE', 'SEVEN', 'SHALL', 'SHAPE', 'SHARE', 'SHARP', 'SHEEP', 'SHEET',
  'SHELF', 'SHELL', 'SHIFT', 'SHINE', 'SHIRT', 'SHOCK', 'SHOOT', 'SHORE',
  'SHORT', 'SHOUT', 'SIGHT', 'SKILL', 'SLEEP', 'SLICE', 'SLIDE', 'SLOPE',
  'SMALL', 'SMART', 'SMILE', 'SMOKE', 'SOLAR', 'SOLID', 'SOLVE', 'SORRY',
  'SOUND', 'SOUTH', 'SPACE', 'SPARE', 'SPEAK', 'SPEED', 'SPEND', 'SPENT',
  'SPICE', 'SPILL', 'SPIN', 'SPIRIT', 'SPLIT', 'SPOKE', 'SPORT', 'STAFF',
  'STAGE', 'STAIN', 'STAKE', 'STAND', 'START', 'STATE', 'STEAM', 'STEEL',
  'STICK', 'STILL', 'STOCK', 'STONE', 'STOOD', 'STORM', 'STORY', 'STRIP',
  'STUCK', 'STUDY', 'STUFF', 'STYLE', 'SUGAR', 'SUITE', 'SUPER', 'SWEET',
  'SWIFT', 'SWORD', 'TABLE', 'TAKEN', 'TASTE', 'TAXES', 'TEACH', 'TEETH',
  'TERMS', 'THANK', 'THEFT', 'THEIR', 'THEME', 'THERE', 'THESE', 'THICK',
  'THING', 'THINK', 'THIRD', 'THOSE', 'THREE', 'THREW', 'THROW', 'TIGHT',
  'TIMES', 'TIRED', 'TITLE', 'TODAY', 'TOOTH', 'TOPIC', 'TOTAL', 'TOUCH',
  'TOUGH', 'TOWER', 'TRACK', 'TRADE', 'TRAIN', 'TREAT', 'TREND', 'TRIAL',
  'TRIED', 'TRIES', 'TRUCK', 'TRULY', 'TRUST', 'TRUTH', 'TWICE', 'TWINS',
  'UNCLE', 'UNDER', 'UNION', 'UNITY', 'UNTIL', 'UPPER', 'UPSET', 'URBAN',
  'USAGE', 'USUAL', 'VALID', 'VALUE', 'VIDEO', 'VIRUS', 'VISIT', 'VITAL',
  'VOICE', 'WASTE', 'WATCH', 'WATER', 'WHEEL', 'WHERE', 'WHICH', 'WHILE',
  'WHITE', 'WHOLE', 'WHOSE', 'WOMAN', 'WOMEN', 'WORLD', 'WORRY', 'WORSE',
  'WORST', 'WORTH', 'WOULD', 'WOUND', 'WRITE', 'WRONG', 'YEARS', 'YIELD',
  'YOUNG', 'YOUTH',

  // 6-letter words
  'HEIGHT', 'STREET', 'MARKET', 'SYSTEM', 'HEALTH', 'REPORT', 'PEOPLE', 'NUMBER'
]);

export function isValidWord(word: string): boolean {
  return DICTIONARY_WORDS.has(word.toUpperCase());
}

const STREAK_KEY = 'docuagent_daily_game_streak';

export function getStreakData(): GameStreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) {
      return { streak: 0, lastCompletedDate: '', bestTimeSeconds: null, totalPlayed: 0 };
    }
    return JSON.parse(raw);
  } catch {
    return { streak: 0, lastCompletedDate: '', bestTimeSeconds: null, totalPlayed: 0 };
  }
}

export function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function recordGameWin(elapsedSeconds: number): GameStreakData {
  const current = getStreakData();
  const today = getTodayDateString();

  if (current.lastCompletedDate === today) {
    const best = current.bestTimeSeconds === null
      ? elapsedSeconds
      : Math.min(current.bestTimeSeconds, elapsedSeconds);
    const updated = { ...current, bestTimeSeconds: best };
    localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
    return updated;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  let newStreak = 1;
  if (current.lastCompletedDate === yesterdayStr) {
    newStreak = current.streak + 1;
  }

  const best = current.bestTimeSeconds === null
    ? elapsedSeconds
    : Math.min(current.bestTimeSeconds, elapsedSeconds);

  const updated: GameStreakData = {
    streak: newStreak,
    lastCompletedDate: today,
    bestTimeSeconds: best,
    totalPlayed: current.totalPlayed + 1,
  };

  localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
  return updated;
}

export function formatGameTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
