# SSH Profile Server

連線後顯示個人簡介的假 SSH server，部署在 Fly.io（免費）。

## 效果

```
ssh ssh.hans0805.me
# 輸入任意密碼 → 顯示個人簡介 → 自動斷線
```

## 修改個人簡介

編輯 `server.js` 頂部的 `PROFILE` 物件：

```js
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
```

## 部署步驟

### 1. 安裝 flyctl

```bash
# macOS
brew install flyctl

# Linux
curl -L https://fly.io/install.sh | sh

# Windows
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### 2. 登入 / 註冊

```bash
fly auth signup   # 新帳號
# 或
fly auth login    # 已有帳號
```

### 3. 產生 host key（如果 host_key 不存在）

```bash
node -e "
const { generateKeyPairSync } = require('crypto');
const { privateKey } = generateKeyPairSync('ed25519');
const pem = privateKey.export({ type: 'pkcs8', format: 'pem' });
require('fs').writeFileSync('host_key', pem);
"
```

### 4. 修改 fly.toml

把 `app = "hans-ssh-profile"` 改成你想要的 app 名稱（全球唯一）。

### 5. Deploy

```bash
fly launch --no-deploy   # 初始化（選 no 跳過自動設定）
fly deploy               # 部署
```

### 6. 設定自訂網域（選用）

```bash
# 查看 Fly.io 給的 IP
fly ips list

# 然後在你的 DNS 設定 A record：
# ssh.hans0805.me → <fly ip>
```

不設定也可以直接用：
```bash
ssh hans-ssh-profile.fly.dev
```

## 本地測試

```bash
npm install
node server.js &
ssh -p 22 localhost   # 輸入任意密碼
```
