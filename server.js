const { Server } = require('ssh2');
const fs = require('fs');
const path = require('path');
const http = require('http');

const PROFILE = {
  name:     'Hans',
  title:    'Backend Developer & Digital Architect',
  location: 'New Taipei City, Taiwan',
  github:   'HansHans135',
  website:  'hans0805.me',
  telegram: '@hans0805',
  instagram: '@08.hans_',
};

// ── ANSI ─────────────────────────────────────────────────────────────────────
const C = {
  reset:   '\x1b[0m',
  bold:    '\x1b[1m',
  dim:     '\x1b[2m',
  cyan:    '\x1b[36m',
  yellow:  '\x1b[33m',
  green:   '\x1b[32m',
  gray:    '\x1b[90m',
  white:   '\x1b[37m',
  blue:    '\x1b[34m',
};

const ESC = {
  clear:      '\x1b[2J\x1b[H',
  hideCursor: '\x1b[?25l',
  showCursor: '\x1b[?25h',
  moveTo:     (r, c) => `\x1b[${r};${c}H`,
  clearLine:  '\x1b[2K',
};

// ── Pages (arrays of plain strings, rendered line by line) ───────────────────
const D = '─'.repeat(48);

const PAGES = [
  {
    key:   'b',
    label: 'Home',
    lines: [
      `${C.cyan}${C.bold}██╗  ██╗ █████╗ ███╗   ██╗███████╗${C.reset}`,
      `${C.cyan}${C.bold}██║  ██║██╔══██╗████╗  ██║██╔════╝${C.reset}`,
      `${C.cyan}${C.bold}███████║███████║██╔██╗ ██║███████╗${C.reset}`,
      `${C.cyan}${C.bold}██╔══██║██╔══██║██║╚██╗██║╚════██║${C.reset}`,
      `${C.cyan}${C.bold}██║  ██║██║  ██║██║ ╚████║███████║${C.reset}`,
      `${C.cyan}${C.bold}╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝${C.reset}`,
      '',
      `  ${C.bold}${PROFILE.title}${C.reset}`,
      `  ${C.gray}📍 ${PROFILE.location}${C.reset}`,
      '',
      `${C.gray}${D}${C.reset}`,
      '',
      `  🌐  ${PROFILE.website}`,
      `  🐙  github.com/${PROFILE.github}`,
      `  ✈️   ${PROFILE.telegram}`,
      '',
      `${C.gray}${D}${C.reset}`,
      '',
      `  ${C.dim}Navigate with keys below ↓${C.reset}`,
    ],
  },
  {
    key:   'a',
    label: 'About',
    lines: [
      `${C.cyan}${C.bold}# About Me${C.reset}`,
      `${C.gray}${D}${C.reset}`,
      '',
      `I'm Hans, a Taiwan-based student developer who loves building`,
      `high-performance, highly available backend systems and crafting`,
      `things that feel fast, useful, and a little bit personal.`,
      '',
      `A lot of my work starts with curiosity — sometimes that means`,
      `designing a cleaner backend, sometimes it means spinning up a`,
      `bot, and sometimes it's just an idea I want to understand well`,
      `enough to build myself.`,
      '',
      `I spend most of my time around Python, JavaScript, and server`,
      `infrastructure. I also care deeply about open source, community,`,
      `and the craft of writing good code.`,
      '',
      `Feel free to reach out — I'm always happy to chat.`,
      '',
      `${C.gray}${D}${C.reset}`,
      `${C.cyan}${C.bold}# Roles${C.reset}`,
      `${C.gray}${D}${C.reset}`,
      '',
      `  ${C.yellow}◆${C.reset} Web Dev   ${C.yellow}◆${C.reset} Backend Architecture   ${C.yellow}◆${C.reset} Team Lead`,
    ],
  },
  {
    key:   's',
    label: 'Skills',
    lines: [
      `${C.cyan}${C.bold}# Skills${C.reset}`,
      `${C.gray}${D}${C.reset}`,
      '',
      `  ${C.yellow}Languages${C.reset}`,
      `  ${C.green}▸${C.reset} Python   ${C.green}▸${C.reset} C#   ${C.green}▸${C.reset} C++   ${C.green}▸${C.reset} JavaScript   ${C.green}▸${C.reset} HTML`,
      '',
      `  ${C.yellow}Frameworks${C.reset}`,
      `  ${C.green}▸${C.reset} Next.js   ${C.green}▸${C.reset} Flask   ${C.green}▸${C.reset} Supabase`,
      '',
      `  ${C.yellow}Bots${C.reset}`,
      `  ${C.green}▸${C.reset} Discord Bot   ${C.green}▸${C.reset} Telegram Bot   ${C.green}▸${C.reset} Line Bot`,
      '',
      `  ${C.yellow}Infrastructure${C.reset}`,
      `  ${C.green}▸${C.reset} Server Management   ${C.green}▸${C.reset} Docker`,
    ],
  },
  {
    key:   'p',
    label: 'Projects',
    lines: [
      `${C.cyan}${C.bold}# Projects${C.reset}`,
      `${C.gray}${D}${C.reset}`,
      '',
      `  ${C.bold}${C.yellow}VocPass${C.reset}  ${C.gray}vocpass.com${C.reset}`,
      `  A universal school portal app for vocational high school`,
      `  students in Taiwan. Timetable, grades, attendance, wallpaper`,
      `  generator, When2Meet. Built with SwiftUI.`,
      `  ${C.green}4000+${C.reset} downloads  ${C.yellow}4.8★${C.reset} App Store  ${C.gray}Open Source${C.reset}`,
      '',
      `${C.gray}  ·····${C.reset}`,
      '',
      `  ${C.bold}${C.yellow}Bopomofo Input Bot${C.reset}`,
      `  A bot that helps with Bopomofo (Zhuyin) input method.`,
      `  ${C.gray}Tags: Bot, Utility${C.reset}`,
      '',
      `  ${C.bold}${C.yellow}BoardMate${C.reset}`,
      `  Pterodactyl server management panel.`,
      `  ${C.gray}Tags: Node.js, Panel${C.reset}`,
      '',
      `  ${C.bold}${C.yellow}HBot${C.reset}`,
      `  Multi-functional Discord robot.`,
      `  ${C.gray}Tags: Discord.js, Bot${C.reset}`,
    ],
  },
  {
    key:   'c',
    label: 'Community',
    lines: [
      `${C.cyan}${C.bold}# Community & Events${C.reset}`,
      `${C.gray}${D}${C.reset}`,
      '',
      `  ${C.yellow}★${C.reset} ${C.bold}SITCON${C.reset}`,
      `    2024 Staff  /  2025 Admin & Camp Lecturer`,
      `    Student Information Technology Conference Taiwan.`,
      '',
      `  ${C.yellow}★${C.reset} ${C.bold}TTHJCC CTF${C.reset}`,
      `    Secretary — 2 seasons`,
      `    Capture the Flag competition organizer.`,
      '',
      `  ${C.yellow}★${C.reset} ${C.bold}National High School Skills Competition 2025${C.reset}`,
      `    ${C.green}12th place${C.reset} — Software Development category.`,
      '',
      `  ${C.yellow}★${C.reset} ${C.bold}COSCUP / CYBERSEC / COMPUTEX${C.reset}`,
      `    Regular attendee of major tech conferences in Taiwan.`,
    ],
  },
  {
    key:   'o',
    label: 'Contact',
    lines: [
      `${C.cyan}${C.bold}# Contact${C.reset}`,
      `${C.gray}${D}${C.reset}`,
      '',
      `  Feel free to reach out through any of the following:`,
      '',
      `  🌐  ${C.yellow}Website${C.reset}    https://${PROFILE.website}`,
      `  🐙  ${C.yellow}GitHub${C.reset}     github.com/${PROFILE.github}`,
      `  ✈️   ${C.yellow}Telegram${C.reset}   ${PROFILE.telegram}`,
      `  📸  ${C.yellow}Instagram${C.reset}  ${PROFILE.instagram}`,
      '',
      `${C.gray}${D}${C.reset}`,
      `${C.cyan}${C.bold}# About This SSH Site${C.reset}`,
      `${C.gray}${D}${C.reset}`,
      '',
      `  You are browsing my profile through SSH.`,
      `  Source code:  github.com/${PROFILE.github}/ssh-profile`,
    ],
  },
];

// ── Nav bar at bottom ─────────────────────────────────────────────────────────
function navBar(pageIdx) {
  const keys = PAGES.map((p, i) => {
    if (i === pageIdx) {
      return `${C.bold}${C.cyan}[${p.key} ${p.label}]${C.reset}`;
    }
    return `${C.gray}${p.key} ${p.label}${C.reset}`;
  }).join('  ');
  const hint = `${C.gray}${C.bold}up/k${C.reset}${C.gray} scroll  •  ${C.bold}←/→${C.reset}${C.gray} page  •  ${C.bold}ctrl+c${C.reset}${C.gray} quit${C.reset}`;
  return { keys, hint };
}

// ── Renderer ──────────────────────────────────────────────────────────────────
function render(stream, state) {
  const { rows, cols, pageIdx, scrollTop } = state;
  const contentRows = rows - 4; // reserve: name row + blank + nav keys + nav hint

  const page  = PAGES[pageIdx];
  const lines = page.lines;

  // Clamp scroll
  const maxScroll = Math.max(0, lines.length - contentRows);
  state.scrollTop = Math.min(Math.max(0, scrollTop), maxScroll);

  const visible = lines.slice(state.scrollTop, state.scrollTop + contentRows);

  let out = ESC.clear;

  // ── Header: name + title ──────────────────────────────────────────────────
  out += `${C.bold}${PROFILE.name}${C.reset}\r\n`;
  out += `${C.gray}${PROFILE.title}${C.reset}\r\n`;
  out += '\r\n';

  // ── Content ───────────────────────────────────────────────────────────────
  for (let i = 0; i < contentRows; i++) {
    out += ESC.clearLine;
    if (i < visible.length) {
      out += visible[i];
    }
    out += '\r\n';
  }

  // ── Bottom nav ────────────────────────────────────────────────────────────
  const { keys, hint } = navBar(pageIdx);
  out += `${C.gray}${'─'.repeat(Math.min(cols, 72))}${C.reset}\r\n`;
  out += keys + '\r\n';
  out += hint;

  stream.write(out);
}

process.on('uncaughtException', (err) => console.error('Uncaught:', err));
process.on('unhandledRejection', (err) => console.error('Unhandled rejection:', err));

// ── SSH server ────────────────────────────────────────────────────────────────
const hostKey = process.env.SSH_HOST_KEY_B64
  ? Buffer.from(process.env.SSH_HOST_KEY_B64, 'base64')
  : fs.readFileSync(path.join(__dirname, 'host_key'));
const PORT = process.env.PORT || 22;

new Server({ hostKeys: [hostKey] }, (client) => {
  console.log('Client connected:', new Date().toISOString());

  client.on('authentication', (ctx) => ctx.accept());

  client.on('ready', () => {
    client.on('session', (accept) => {
      const session = accept();

      session.on('exec', (accept) => {
        const stream = accept();
        const lines = [
          `${PROFILE.name}`,
          `${PROFILE.title}`,
          '',
          ...PAGES[0].lines,
        ];
        stream.write(lines.join('\r\n') + '\r\n');
        stream.exit(0);
        stream.end();
      });

      let ptyInfo = { rows: 24, cols: 80 };
      session.on('pty', (accept, reject, info) => {
        ptyInfo = info;
        accept();
      });

      session.on('shell', (accept) => {
        const stream = accept();
        stream.setEncoding('utf8');

        const state = {
          rows:     ptyInfo.rows || 24,
          cols:     ptyInfo.cols || 80,
          pageIdx:  0,
          scrollTop: 0,
        };

        stream.write(ESC.hideCursor);
        render(stream, state);

        // Escape sequence parser
        let escBuf = '';
        let inEsc  = false;

        stream.on('data', (data) => {
          for (let i = 0; i < data.length; i++) {
            const ch   = data[i];
            const code = ch.charCodeAt(0);

            if (inEsc) {
              escBuf += ch;
              if (escBuf === '[') continue;
              if (escBuf.length >= 2) {
                handleEsc(escBuf, stream, state);
                escBuf = '';
                inEsc  = false;
              }
              continue;
            }

            if (code === 27) { inEsc = true; escBuf = ''; continue; }

            // Ctrl-C / Ctrl-D
            if (code === 3 || code === 4) {
              stream.write(ESC.showCursor);
              stream.write('\r\nBye! 👋\r\n');
              stream.exit(0);
              stream.end();
              return;
            }

            const lower = ch.toLowerCase();

            // Quit
            if (lower === 'q') {
              stream.write(ESC.showCursor);
              stream.write('\r\nBye! 👋\r\n');
              stream.exit(0);
              stream.end();
              return;
            }

            // Scroll: j / k
            if (lower === 'j') { state.scrollTop++; render(stream, state); continue; }
            if (lower === 'k') { state.scrollTop = Math.max(0, state.scrollTop - 1); render(stream, state); continue; }

            // Page shortcuts by letter
            const byKey = PAGES.findIndex(p => p.key === lower);
            if (byKey !== -1) {
              state.pageIdx  = byKey;
              state.scrollTop = 0;
              render(stream, state);
              continue;
            }
          }
        });

        function handleEsc(seq, stream, state) {
          if (seq === '[A') { // Up
            state.scrollTop = Math.max(0, state.scrollTop - 1);
            render(stream, state);
          } else if (seq === '[B') { // Down
            state.scrollTop++;
            render(stream, state);
          } else if (seq === '[D') { // Left — prev page
            state.pageIdx   = (state.pageIdx - 1 + PAGES.length) % PAGES.length;
            state.scrollTop = 0;
            render(stream, state);
          } else if (seq === '[C') { // Right — next page
            state.pageIdx   = (state.pageIdx + 1) % PAGES.length;
            state.scrollTop = 0;
            render(stream, state);
          }
        }

        stream.on('window-change', (info) => {
          state.rows = info.rows || state.rows;
          state.cols = info.cols || state.cols;
          render(stream, state);
        });
      });
    });
  });

  client.on('error', () => {});
  client.on('close', () => console.log('Client disconnected'));

}).on('error', (err) => {
  console.error('SSH server error:', err);
}).listen(PORT, '0.0.0.0', () => {
  console.log(`SSH profile server listening on port ${PORT}`);
});

// ── HTTP hint page ────────────────────────────────────────────────────────────
const HTTP_PORT = process.env.HTTP_PORT || 80;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<!DOCTYPE html>
<html lang="zh-Hant">
<head><meta charset="utf-8"><title>${PROFILE.name} — SSH Profile</title>
<style>
  *{box-sizing:border-box}
  body{font-family:monospace;background:#0f0f0f;color:#d4d4d4;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:1rem}
  .box{max-width:540px;width:100%;padding:2rem}
  h1{color:#fff;margin-bottom:.1rem;font-size:1.4rem}
  .sub{color:#888;margin-top:0}
  code{background:#1e1e1e;padding:.2em .5em;border-radius:4px;color:#4ec9b0}
  .keys{background:#1a1a1a;border-radius:6px;padding:1rem;margin:1.2rem 0;line-height:2}
  .k{color:#ce9178;font-weight:bold}
  .note{font-size:.8em;color:#555}
  a{color:#4ec9b0}
</style></head>
<body><div class="box">
  <h1>${PROFILE.name}</h1>
  <p class="sub">${PROFILE.title}</p>
  <p>Browse my profile over SSH:</p>
  <p><code>ssh ssh.hans0805.me</code></p>
  <div class="keys">
    <span class="k">↑ / k</span> scroll up &nbsp;&nbsp;
    <span class="k">↓ / j</span> scroll down<br>
    <span class="k">← / →</span> switch page &nbsp;&nbsp;
    <span class="k">b a s p c o</span> jump to section<br>
    <span class="k">ctrl+c / q</span> quit
  </div>
  <p class="note">No password required.</p>
</div></body></html>`);
}).listen(HTTP_PORT, '0.0.0.0', () => {
  console.log(`HTTP hint page listening on port ${HTTP_PORT}`);
});
