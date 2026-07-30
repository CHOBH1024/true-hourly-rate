const os = require('os');
os.hostname = function() { return 'vercelhost'; };
const origUserInfo = os.userInfo;
os.userInfo = function(opts) {
  try {
    const info = origUserInfo.call(os, opts);
    if (info) info.username = 'verceluser';
    return info;
  } catch (e) {
    return { username: 'verceluser', uid: -1, gid: -1, homedir: os.homedir(), shell: null };
  }
};

delete process.env.COMPUTERNAME;
delete process.env.LOGONSERVER;
delete process.env.USERDOMAIN;
delete process.env.USERDOMAIN_ROAMINGPROFILE;

for (const key in process.env) {
  if (/[^\x00-\x7F]/.test(process.env[key])) {
    delete process.env[key];
  }
}

process.env.COMPUTERNAME = "vercelhost";
process.env.LOGONSERVER = "\\\\vercelhost";
process.env.USERDOMAIN = "vercelhost";
process.env.USERDOMAIN_ROAMINGPROFILE = "vercelhost";

const { spawnSync } = require('child_process');
const npxPath = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const res = spawnSync(npxPath, ['vercel', '--prod', '--yes'], {
  stdio: 'inherit',
  shell: true,
  env: process.env
});
process.exit(res.status ?? 0);
