// resolver key sk-mx2ajx (skills-index lookup; keep)
//
// Selr AI — THE single source of truth for every design token.
// tokens.css, the Figma import files and the Plugin API script are all generated
// from this file by build.mjs. Change a value here, run the build, everything follows.
//
// Every hex is a locked brand value, measured off www.selrai.com.au in
// ~/.claude/skills/selr-design-language/tokens.css — migrated 2026-08-14.
// Names are unchanged so the Figma collections and CSS_MAP below still resolve.
// 2026-08-15: Purple/500 re-derived from the canonical accent (#6736E2↔#9B73FF
// midpoint) — the old #7E4BFF accent family is retired everywhere.

export const RAMPS = {
  'Purple/100': '#F2EDFF', 'Purple/200': '#D5C4FF', 'Purple/400': '#9B73FF',
  'Purple/500': '#8155F0', 'Purple/600': '#6736E2', 'Purple/700': '#5024C0',
  'Purple/800': '#3C159E', 'Purple/900': '#230670',

  'Gray/Cloud': '#F7F5EF', 'Gray/Smoke': '#E3E3E3', 'Gray/Steel': '#C7C7C2',
  'Gray/Space': '#A8A59D', 'Gray/Graphite': '#6E6A62', 'Gray/Arsenic': '#616161',
  'Gray/Phantom': '#1E1E24', 'Gray/Black': '#242424', 'Gray/True': '#000000',

  'Neutral/100': '#FCFCFA', 'Neutral/200': '#F0EEE6', 'Neutral/400': '#ABABAB',

  'Success/base': '#26B759', 'Success/mid': '#B5FFCF', 'Success/tint': '#E0FFEB',
  'Warning/base': '#F39A46', 'Warning/mid': '#F9BE85', 'Warning/tint': '#FFE9D4',
  'Danger/base': '#FF1B1B',  'Danger/mid': '#FF8A8A',  'Danger/tint': '#FFE0E0',

  'White': '#FFFFFA', 'Black': '#242424'
};

// [Light Mode, Dark Mode] — both are keys of RAMPS.
export const SEMANTIC = {
  'Background/Surface/primary':          ['Gray/Cloud',  'Gray/Black'],
  'Background/Surface/secondary':        ['White',       'Gray/Phantom'],
  'Background/Surface/tertiary':         ['Neutral/100', 'Gray/Arsenic'],
  'Background/Surface/inverted':         ['Gray/Black',  'White'],
  'Background/Surface/accent':           ['Purple/600',  'Purple/500'],
  'Background/Surface/danger':           ['Danger/tint', 'Gray/Phantom'],

  'Background/Button/primary-active':    ['Purple/600',  'Purple/600'],
  'Background/Button/primary-hover':     ['Purple/700',  'Purple/700'],
  'Background/Button/primary-pressed':   ['Purple/700',  'Purple/700'],
  'Background/Button/primary-disabled':  ['Neutral/200', 'Gray/Arsenic'],
  'Background/Button/secondary-active':  ['White',       'Gray/Phantom'],
  'Background/Button/secondary-hover':   ['Purple/100',  'Purple/900'],
  'Background/Button/secondary-pressed': ['Purple/200',  'Purple/800'],
  'Background/Button/secondary-disabled':['Neutral/200', 'Gray/Arsenic'],

  'Background/Chip/active':              ['White',       'Gray/Phantom'],
  'Background/Chip/hover':               ['Gray/Cloud',  'Gray/Arsenic'],
  'Background/Chip/pressed':             ['Gray/Smoke',  'Gray/Graphite'],
  'Background/Chip/selected':            ['Gray/Black',  'White'],
  'Background/Indicator/primary':        ['Purple/600',  'Purple/400'],
  'Background/Indicator/black':          ['Gray/Black',  'White'],
  'Background/Indicator/white':          ['White',       'Gray/Phantom'],

  'Typography/primary':                  ['Gray/Black',    'White'],
  'Typography/secondary':                ['Gray/Arsenic',  'Gray/Steel'],
  'Typography/tertiary':                 ['Gray/Graphite', 'Gray/Space'],
  'Typography/disabled':                 ['Gray/Steel',    'Gray/Graphite'],
  'Typography/accent':                   ['Purple/600',    'Purple/400'],
  'Typography/primary-inverted':         ['White',         'Gray/Black'],
  'Typography/secondary-inverted':       ['Gray/Smoke',    'Gray/Graphite'],

  'Border/primary':                      ['Gray/Smoke', 'Gray/Arsenic'],
  'Border/secondary':                    ['Gray/Cloud', 'Gray/Phantom'],
  'Border/tertiary':                     ['Gray/Steel', 'Gray/Graphite'],

  'Charts/Context/primary-1':            ['Purple/100',   'Purple/900'],
  'Charts/Context/primary-2':            ['Purple/200',   'Purple/800'],
  'Charts/Context/primary-3':            ['Purple/400',   'Purple/500'],
  'Charts/Context/primary-4':            ['Purple/600',   'Purple/600'],
  'Charts/Context/primary-5':            ['Purple/800',   'Purple/400'],
  'Charts/Context/primary-alt':          ['Purple/700',   'Purple/200'],
  'Charts/Context/secondary':            ['Success/base', 'Success/base'],
  'Charts/Context/tertiary':             ['Warning/base', 'Warning/base'],
  'Charts/Context/quarterly':            ['Gray/Space',   'Gray/Graphite'],
  'Charts/Context/basic':                ['Gray/Cloud',   'Gray/Arsenic'],
  'Charts/Context/negative':             ['Danger/base',  'Danger/base']
};

export const SPACING = [0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 40, 48, 56];

// Collapsed onto the measured 4-tier scale (20 field / 30 card / 40 pill / 100%
// round — Figma has no percentage radius, so Full is approximated at 999).
// Names are unchanged; the old 2-40px step scale now resolves onto the real tiers.
export const RADIUS = { '3XS': 20, '2XS': 20, 'XS': 20, 'S': 20, 'M': 20, 'L': 30,
                        'XL': 20, '2XL': 30, '3XL': 40, '4XL': 40, 'Full': 999 };

// [name, size, weight role, letter-spacing in em]
// Tracking is tiered per the measured rule: -0.04 >=25px, -0.03 15-20px, -0.015 <=12px.
// 'display' rides the variable Manrope axis at wght 585 (giant one-word display: 500).
export const TYPE = [
  ['Marketing/Heading 1',   64, 'display',  -0.04],
  ['Marketing/Heading 2',   48, 'display',  -0.04],
  ['Marketing/Subheader 1', 32, 'display',  -0.04],
  ['Marketing/Subheader 2', 24, 'display',  -0.04],
  ['Marketing/Paragraph 1', 18, 'regular',  -0.03],
  ['Marketing/Paragraph 2', 16, 'regular',  -0.03],
  ['UI/Header 1', 32, 'display',  -0.04],
  ['UI/Header 2', 24, 'display',  -0.04],
  ['UI/Header 3', 20, 'semibold', -0.03],
  ['UI/Header 4', 17, 'semibold', -0.03],
  ['UI/Header 5', 15, 'semibold', -0.03],
  ['UI/Title 1',  20, 'medium',   -0.03],
  ['UI/Title 2',  18, 'medium',   -0.03],
  ['UI/Title 3',  15, 'medium',   -0.03],
  ['UI/Body',     15, 'regular',  -0.03],
  ['UI/Caption',  12, 'medium',   -0.015]
];

export const FONT_FAMILY = 'Manrope';

// CSS variable names the templates use → the semantic token they mirror.
// This is the contract between tokens.css and 01 - Color Styles in Figma.
export const CSS_MAP = {
  '--bg-primary':              'Background/Surface/primary',
  '--bg-secondary':            'Background/Surface/secondary',
  '--bg-tertiary':             'Background/Surface/tertiary',
  '--bg-inverted':             'Background/Surface/inverted',
  '--bg-accent':               'Background/Surface/accent',
  '--bg-danger':               'Background/Surface/danger',
  '--btn-primary':             'Background/Button/primary-active',
  '--btn-primary-hover':       'Background/Button/primary-hover',
  '--btn-primary-pressed':     'Background/Button/primary-pressed',
  '--btn-primary-disabled':    'Background/Button/primary-disabled',
  '--btn-secondary':           'Background/Button/secondary-active',
  '--btn-secondary-hover':     'Background/Button/secondary-hover',
  '--btn-secondary-pressed':   'Background/Button/secondary-pressed',
  '--chip':                    'Background/Chip/active',
  '--chip-hover':              'Background/Chip/hover',
  '--chip-pressed':            'Background/Chip/pressed',
  '--chip-selected':           'Background/Chip/selected',
  '--text-primary':            'Typography/primary',
  '--text-secondary':          'Typography/secondary',
  '--text-tertiary':           'Typography/tertiary',
  '--text-disabled':           'Typography/disabled',
  '--text-accent':             'Typography/accent',
  '--text-inverted':           'Typography/primary-inverted',
  '--border-primary':          'Border/primary',
  '--border-secondary':        'Border/secondary',
  '--border-tertiary':         'Border/tertiary',
  '--c1':                      'Charts/Context/primary-1',
  '--c2':                      'Charts/Context/primary-2',
  '--c3':                      'Charts/Context/primary-3',
  '--c4':                      'Charts/Context/primary-4',
  '--c5':                      'Charts/Context/primary-5',
  '--c-alt':                   'Charts/Context/primary-alt',
  '--c-basic':                 'Charts/Context/basic',
  '--c-quarterly':             'Charts/Context/quarterly',
  '--c-negative':              'Charts/Context/negative'
};
