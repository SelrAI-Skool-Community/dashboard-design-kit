/* resolver key sk-1v1zmtl (skills-index lookup; keep)
   Selr AI — the page map for the dashboard app.

   Seventeen destinations. The eight business pages are the eight connector
   categories from the workshop's own connectors catalogue, so the dashboard
   takes the shape of the tools the attendee just spent the morning plugging in.
   Nothing here is invented; it is their morning, turned into a left nav.

   Every unbuilt page carries the exact words that build it. That is the point:
   a page that is empty today is a menu item, not a dead end. */

export const GROUPS = [
  { title: 'Overview',          ids: ['home', 'insights'] },
  { title: 'Run the business',  ids: ['money','sales','marketing','customers','work','team','store','web'] },
  { title: 'Your AI',           ids: ['connectors','skills','agents'] },
  { title: 'Settings',          ids: ['brand','settings'] },
];

/* Not links. Present so the shape of the whole system is visible on day one,
   honest about not existing yet. */
export const SOON = [
  { label: 'Forecasting', icon: 'trend' },
  { label: 'Reports',     icon: 'doc'   },
];

export const ICONS = {
  home:      'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  trend:     'M3 17l6-6 4 4 7-7M21 8v5h-5',
  money:     'M12 3v18M16.5 7.5c0-1.7-2-2.5-4.5-2.5S7.5 5.9 7.5 7.5 9.4 10 12 10.5s4.5 1.2 4.5 3-2 2.5-4.5 2.5-4.5-.9-4.5-2.5',
  sales:     'M4 20V10M10 20V4M16 20v-7M22 20H2',
  marketing: 'M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1zM17 8a5 5 0 0 1 0 8',
  customers: 'M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z',
  work:      'M3 8a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  team:      'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2 20a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M18 20a6 6 0 0 0-1.5-4',
  store:     'M4 8h16l-1 12H5zM8 8V6a4 4 0 0 1 8 0v2',
  web:       'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18',
  plug:      'M9 3v6M15 3v6M6 9h12v3a6 6 0 0 1-12 0zM12 18v3',
  skills:    'M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8z',
  agents:    'M12 3v3M5.6 5.6l2.1 2.1M3 12h3M18 12h3M16.3 7.7l2.1-2.1M8 20h8M7 16a5 5 0 1 1 10 0z',
  brand:     'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  settings:  'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7.5 19.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3 14a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.1-2.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 3.6V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.6 1.6 0 0 0 20.4 10H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z',
  doc:       'M6 3h8l4 4v14H6zM14 3v4h4',
};

/* Each page: what it is, what it would show, and the words that build it.
   `scanKey` ties a page to the scan's `pages` object; pages without one are
   always available (they describe the attendee's own setup, not a tool's data). */
export const PAGES = {
  home: {
    label: 'Home', icon: 'home', file: 'index.html', built: true,
    eyebrow: 'Overview', title: 'Home',
    sub: 'Everything at a glance. Sections fill themselves in as you connect more and build more.',
  },

  insights: {
    label: 'Insights', icon: 'trend', file: 'insights.html',
    eyebrow: 'Overview', title: 'Insights',
    sub: 'The trends underneath the numbers — what is going up, what is going down, and since when.',
    willShow: ['Revenue trend', 'Best and worst months', 'Growth rate', 'What changed this month'],
    needs: null,
    prompt: () => `Build my Insights page.

It is at insights.html in my dashboard folder and right now it is a placeholder. Use the Dashboard Design Kit in ~/.claude/skills/dashboard-design-kit: copy the closest chart layout out of templates/, keep the left nav and the app shell exactly as they are on my other pages, and use my brand colours from brand/BRAND.md.

Show me the trends, not the totals: how revenue has moved month by month, my best and worst months, my growth rate, and what actually changed this month versus last.

Pull the real numbers from whatever I have connected. If something is not connected yet, leave that section out rather than inventing a number. Do not ask permission to read files or run commands — just do it.`,
    ask: 'what trends would be worth watching in a business like mine?',
  },

  money: {
    label: 'Money', icon: 'money', file: 'money.html', scanKey: 'money',
    eyebrow: 'Run the business', title: 'Money',
    sub: 'Where your cash actually is, who owes you, and what is about to go out.',
    willShow: ['Cash position', 'Who owes you', 'Overdue invoices', 'Due this week', 'Money in vs out'],
    prompt: (t) => `Build my Money page.

It is at money.html in my dashboard folder and right now it is a placeholder. Use the Dashboard Design Kit in ~/.claude/skills/dashboard-design-kit: copy the closest template out of templates/, keep the left nav and the app shell exactly as they are on my other pages, and use my brand colours from brand/BRAND.md.

Pull real numbers from ${t}. Show me: my cash position right now, who owes me and how overdue they are, what is due to go out this week, and money in versus money out over the last six months.

If a connection is not working, tell me in plain English and build the page with the parts that do work. Do not ask permission to read files or run commands — just do it.`,
    ask: 'what should I be watching on my money page each week?',
  },

  sales: {
    label: 'Sales', icon: 'sales', file: 'sales.html', scanKey: 'sales',
    eyebrow: 'Run the business', title: 'Sales',
    sub: 'Every deal in play, what it is worth, and what has gone quiet.',
    willShow: ['Pipeline by stage', 'Value in play', 'New leads this week', 'Gone quiet', 'Win rate'],
    prompt: (t) => `Build my Sales page.

It is at sales.html in my dashboard folder and right now it is a placeholder. Use the Dashboard Design Kit in ~/.claude/skills/dashboard-design-kit: copy the closest template out of templates/, keep the left nav and the app shell exactly as they are on my other pages, and use my brand colours from brand/BRAND.md.

Pull my real pipeline from ${t}. Show me: every deal by stage with its value, total value in play, new leads this week, anything that has not been touched in two weeks, and my win rate.

If a connection is not working, tell me in plain English and build the page with the parts that do work. Do not ask permission to read files or run commands — just do it.`,
    ask: 'what would tell me early that my pipeline is drying up?',
  },

  marketing: {
    label: 'Marketing', icon: 'marketing', file: 'marketing.html', scanKey: 'marketing',
    eyebrow: 'Run the business', title: 'Marketing',
    sub: 'What you are spending to get attention, and what it is bringing back.',
    willShow: ['Ad spend', 'Cost per lead', 'Best performing ad', 'Email open rates', 'Where leads come from'],
    prompt: (t) => `Build my Marketing page.

It is at marketing.html in my dashboard folder and right now it is a placeholder. Use the Dashboard Design Kit in ~/.claude/skills/dashboard-design-kit: copy the closest template out of templates/, keep the left nav and the app shell exactly as they are on my other pages, and use my brand colours from brand/BRAND.md.

Pull real numbers from ${t}. Show me: what I am spending on ads, my cost per lead, which ad or email is performing best right now, my open and click rates, and where my leads are actually coming from.

If a connection is not working, tell me in plain English and build the page with the parts that do work. Do not ask permission to read files or run commands — just do it.`,
    ask: 'which marketing number actually predicts revenue for me?',
  },

  customers: {
    label: 'Customers', icon: 'customers', file: 'customers.html', scanKey: 'customers',
    eyebrow: 'Run the business', title: 'Customers',
    sub: 'Who is waiting on you, and who you have gone quiet on.',
    willShow: ['Unanswered messages', 'Response time', 'Waiting longest', 'Busiest hours', 'Common questions'],
    prompt: (t) => `Build my Customers page.

It is at customers.html in my dashboard folder and right now it is a placeholder. Use the Dashboard Design Kit in ~/.claude/skills/dashboard-design-kit: copy the closest template out of templates/, keep the left nav and the app shell exactly as they are on my other pages, and use my brand colours from brand/BRAND.md.

Pull real conversations from ${t}. Show me: anything unanswered, how long people have been waiting, my average response time, which hours are busiest, and the questions that keep coming up.

Read only — never send, reply to, or delete a message. If a connection is not working, tell me in plain English and build the page with the parts that do work. Do not ask permission to read files or run commands — just do it.`,
    ask: 'what would help me stop leaving people waiting?',
  },

  work: {
    label: 'Work', icon: 'work', file: 'work.html', scanKey: 'work',
    eyebrow: 'Run the business', title: 'Work',
    sub: 'Every job on, who has it, and what is running late.',
    willShow: ['Jobs in progress', 'Running late', 'Due this week', 'Workload by person', 'Signed and unsigned'],
    prompt: (t) => `Build my Work page.

It is at work.html in my dashboard folder and right now it is a placeholder. Use the Dashboard Design Kit in ~/.claude/skills/dashboard-design-kit: copy the closest template out of templates/, keep the left nav and the app shell exactly as they are on my other pages, and use my brand colours from brand/BRAND.md.

Pull real jobs and tasks from ${t}. Show me: everything in progress, anything running late, what is due this week, how the workload is split across people, and any document still waiting on a signature.

Read only — never create, close, or reassign anything. If a connection is not working, tell me in plain English and build the page with the parts that do work. Do not ask permission to read files or run commands — just do it.`,
    ask: 'how would I spot a job going off the rails a week earlier?',
  },

  team: {
    label: 'Team', icon: 'team', file: 'team.html', scanKey: 'team',
    eyebrow: 'Run the business', title: 'Team',
    sub: 'Who is on, who is booked, and what it is costing you.',
    willShow: ['Who is on today', 'Hours this week', 'Bookings', 'Wage cost', 'Time off coming up'],
    prompt: (t) => `Build my Team page.

It is at team.html in my dashboard folder and right now it is a placeholder. Use the Dashboard Design Kit in ~/.claude/skills/dashboard-design-kit: copy the closest template out of templates/, keep the left nav and the app shell exactly as they are on my other pages, and use my brand colours from brand/BRAND.md.

Pull real rosters and bookings from ${t}. Show me: who is on today, hours logged this week, what is booked in, what it is costing me in wages, and any time off coming up.

Read only. Never approve a timesheet, never submit a pay run, never change a roster — this is real people's pay and it stays a human decision. If a connection is not working, tell me in plain English and build the page with the parts that do work. Do not ask permission to read files or run commands — just do it.`,
    ask: 'what would tell me I am about to be short-staffed?',
  },

  store: {
    label: 'Store', icon: 'store', file: 'store.html', scanKey: 'store',
    eyebrow: 'Run the business', title: 'Store',
    sub: 'What is selling, what is not, and what is stuck in transit.',
    willShow: ['Orders today', 'Best sellers', 'Not moving', 'Low stock', 'Stuck in shipping'],
    prompt: (t) => `Build my Store page.

It is at store.html in my dashboard folder and right now it is a placeholder. Use the Dashboard Design Kit in ~/.claude/skills/dashboard-design-kit: copy the closest template out of templates/, keep the left nav and the app shell exactly as they are on my other pages, and use my brand colours from brand/BRAND.md.

Pull real orders from ${t}. Show me: orders today and this week, my best sellers, what is not moving, anything low on stock, and any order stuck in shipping.

Read only — never refund, cancel, or change an order. If a connection is not working, tell me in plain English and build the page with the parts that do work. Do not ask permission to read files or run commands — just do it.`,
    ask: 'what should I reorder based on how things are actually selling?',
  },

  web: {
    label: 'Web', icon: 'web', file: 'web.html', scanKey: 'web',
    eyebrow: 'Run the business', title: 'Web',
    sub: 'Your sites, whether they are up, and what people do when they land.',
    willShow: ['Sites live', 'Visitors', 'Last deploy', 'Anything down', 'Top pages'],
    prompt: (t) => `Build my Web page.

It is at web.html in my dashboard folder and right now it is a placeholder. Use the Dashboard Design Kit in ~/.claude/skills/dashboard-design-kit: copy the closest template out of templates/, keep the left nav and the app shell exactly as they are on my other pages, and use my brand colours from brand/BRAND.md.

Pull real data from ${t}. Show me: every site I have live, whether each one is up, when it last deployed, how many visitors it is getting, and my top pages.

Read only — never deploy, never delete a project. If a connection is not working, tell me in plain English and build the page with the parts that do work. Do not ask permission to read files or run commands — just do it.`,
    ask: 'what on my website should I fix first?',
  },

  connectors: {
    label: 'Connectors', icon: 'plug', file: 'connectors.html', built: true,
    eyebrow: 'Your AI', title: 'Connectors',
    sub: 'Every tool plugged into your Claude, and every one still sitting in your kit waiting.',
  },

  skills: {
    label: 'Skills & Kits', icon: 'skills', file: 'skills.html', built: true,
    eyebrow: 'Your AI', title: 'Skills and kits',
    sub: 'What your Claude can already do for you, without you asking twice.',
  },

  agents: {
    label: 'Agents', icon: 'agents', file: 'agents.html',
    eyebrow: 'Your AI', title: 'Agents',
    sub: 'The jobs that run on their own, on a schedule, whether you are at the desk or not.',
    willShow: ['What runs daily', 'Last run', 'What it found', 'Anything that failed'],
    needs: null,
    prompt: () => `Build my Agents page.

It is at agents.html in my dashboard folder and right now it is a placeholder. Use the Dashboard Design Kit in ~/.claude/skills/dashboard-design-kit: copy the closest template out of templates/, keep the left nav and the app shell exactly as they are on my other pages, and use my brand colours from brand/BRAND.md.

Show me every job I have set to run on its own: what it does, when it runs, when it last ran, what it found, and anything that failed. If I do not have any yet, say so and suggest three that would be worth setting up for a business like mine.

Do not ask permission to read files or run commands — just do it.`,
    ask: 'what is worth having run automatically every morning?',
  },

  brand: {
    label: 'Brand', icon: 'brand', file: 'brand.html', built: true,
    eyebrow: 'Settings', title: 'Brand',
    sub: 'The colours and logo every page here is built from. Change them once, everything follows.',
  },

  settings: {
    label: 'Settings', icon: 'settings', file: 'settings.html', built: true,
    eyebrow: 'Settings', title: 'Settings',
    sub: 'How this dashboard is put together, and how to change it.',
  },
};

/* Tier copy. Written to be read out loud by somebody who has never seen a
   dashboard before, and to never over-promise. */
export const TIERS = {
  ready: {
    label: 'Ready to build',
    /* "set up in your Claude" rather than "will pull real numbers today".
       A configured MCP server is not proof of a working login — several sign in
       on first use — so the honest claim is that the wiring is there. The
       prompt itself tells Claude to say so plainly if a connection fails. */
    line: (page, names, plural) =>
      `<b>${names}</b> ${plural ? 'are' : 'is'} set up in your Claude, so this page has what it needs. Paste the prompt below and Claude builds it. If ${plural ? 'one of them asks' : 'it asks'} you to sign in first, that is normal.`,
    cta: 'Copy the prompt that builds this page',
  },
  'connect-first': {
    label: 'Connect one tool first',
    line: (page, names) =>
      `Connect <b>${names}</b> and this page fills itself in. The connector is already sitting in your kit, so it is a couple of minutes, not a project.`,
    cta: 'Copy the prompt that connects it',
  },
  /* The state a fresh clone opens in. Saying "nothing in your kit covers this"
     here would be flatly untrue — the kit ships 54 connectors — and it is the
     first sentence an attendee reads if they open the folder before running
     anything. */
  prescan: {
    label: 'One step away',
    line: () =>
      `Your kit already carries the connectors for this. Run the two commands below and this page will tell you exactly what you can build, and hand you the words to build it.`,
    cta: 'Copy the two commands',
  },
  idea: {
    label: 'Your idea goes here',
    line: () =>
      `Nothing in your kit covers this one yet. It is here because it is worth having — tell Claude what you want to see and it will build it.`,
    cta: 'Copy a starting prompt',
  },
};

export const CONNECT_PROMPT = (names, ids) =>
  `Connect ${names} to my Claude.

Use the connector skill that shipped in my workshop kit — look for ${ids.map(i => `${i}-connector`).join(' or ')} in ~/.claude/skills, and if it is not there check ~/claude-workshop-kit/skills. Follow that skill's own sign-in steps; do not hand-roll a connection, because the kit skill carries the proper ladder.

When it is done, prove it worked by pulling one real record back, then re-run my dashboard scan so the page updates:
  node app/scan-kit.mjs

Plain English only, no raw error logs. The only thing you pause for is a sign-in screen that needs me.`;

export const IDEA_PROMPT = (title) =>
  `Build me a ${title} page in my dashboard.

Use the Dashboard Design Kit in ~/.claude/skills/dashboard-design-kit: copy the closest template out of templates/, keep the left nav and the app shell exactly as they are on my other pages, and use my brand colours from brand/BRAND.md.

First ask me one question — what do I most want to see on this page? Then build it from whatever I have connected. If something needs a tool I have not connected, tell me which one and stop rather than inventing numbers.

Do not ask permission to read files or run commands — just do it.`;

export const SCAN_PROMPT =
`node app/scan-kit.mjs
node app/build.mjs`;
