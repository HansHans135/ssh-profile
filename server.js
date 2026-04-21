const { Server } = require('ssh2');
const fs = require('fs');
const path = require('path');

// ─── 個人簡介設定（請修改這裡）───────────────────────────
const PROFILE = {
  name:     'Hans Chen',
  title:    'Full-Stack Developer',
  location: 'Taipei, Taiwan',
  github:   'github.com/hans0805',
  email:    'hans@hans0805.me',
  website:  'hans0805.me',
  skills:   ['Node.js', 'Go', 'React', 'Kubernetes', 'Docker'],
  quote:    '"Code is poetry."',
};
// ────────────────────────────────────────────────────────

function buildBanner(p) {
  const line  = '─'.repeat(44);
  const pad   = (s, w) => s + ' '.repeat(Math.max(0, w - s.length));

  return [
    '',
    '\x1b[33m┌' + line + '┐\x1b[0m',
    '\x1b[33m│\x1b[0m' + ' '.repeat(44) + '\x1b[33m│\x1b[0m',
    '\x1b[33m│\x1b[0m  \x1b[1;36m' + pad(p.name, 42) + '\x1b[0m\x1b[33m│\x1b[0m',
    '\x1b[33m│\x1b[0m  \x1b[90m' + pad(p.title, 42) + '\x1b[0m\x1b[33m│\x1b[0m',
    '\x1b[33m│\x1b[0m' + ' '.repeat(44) + '\x1b[33m│\x1b[0m',
    '\x1b[33m├' + line + '┤\x1b[0m',
    '\x1b[33m│\x1b[0m' + ' '.repeat(44) + '\x1b[33m│\x1b[0m',
    '\x1b[33m│\x1b[0m  \x1b[90m📍\x1b[0m  ' + pad(p.location, 38) + '\x1b[33m│\x1b[0m',
    '\x1b[33m│\x1b[0m  \x1b[90m🐙\x1b[0m  ' + pad(p.github,   38) + '\x1b[33m│\x1b[0m',
    '\x1b[33m│\x1b[0m  \x1b[90m✉️ \x1b[0m  ' + pad(p.email,    37) + '\x1b[33m│\x1b[0m',
    '\x1b[33m│\x1b[0m  \x1b[90m🌐\x1b[0m  ' + pad(p.website,  38) + '\x1b[33m│\x1b[0m',
    '\x1b[33m│\x1b[0m' + ' '.repeat(44) + '\x1b[33m│\x1b[0m',
    '\x1b[33m│\x1b[0m  \x1b[90mSkills:\x1b[0m ' + pad(p.skills.join(' · '), 35) + '\x1b[33m│\x1b[0m',
    '\x1b[33m│\x1b[0m' + ' '.repeat(44) + '\x1b[33m│\x1b[0m',
    '\x1b[33m│\x1b[0m  \x1b[3;37m' + pad(p.quote, 42) + '\x1b[0m\x1b[33m│\x1b[0m',
    '\x1b[33m│\x1b[0m' + ' '.repeat(44) + '\x1b[33m│\x1b[0m',
    '\x1b[33m└' + line + '┘\x1b[0m',
    '',
  ].join('\r\n');
}

const hostKey = fs.readFileSync(path.join(__dirname, 'host_key'));
const banner  = buildBanner(PROFILE);
const PORT    = process.env.PORT || 22;

new Server({ hostKeys: [hostKey] }, (client) => {
  console.log('Client connected:', new Date().toISOString());

  client.on('authentication', (ctx) => {
    // 接受所有驗證方式（password / publickey / none）
    ctx.accept();
  });

  client.on('ready', () => {
    client.on('session', (accept) => {
      const session = accept();

      const respond = (accept) => {
        const stream = accept();
        stream.write(banner);
        stream.exit(0);
        stream.end();
      };

      session.on('shell',   (accept) => respond(accept));
      session.on('exec',    (accept) => respond(accept));
      session.on('subsystem', (accept) => respond(accept));
    });
  });

  client.on('error', () => {});
  client.on('close', () => console.log('Client disconnected'));

}).listen(PORT, '0.0.0.0', () => {
  console.log(`SSH profile server listening on port ${PORT}`);
});
