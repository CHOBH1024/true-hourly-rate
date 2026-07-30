const os = require('os');
os.hostname = () => 'vercelhost';
const origUserInfo = os.userInfo;
os.userInfo = (opts) => ({ username: 'verceluser', uid: -1, gid: -1, homedir: os.homedir(), shell: null });

if (globalThis.Headers) {
  const origSet = globalThis.Headers.prototype.set;
  globalThis.Headers.prototype.set = function(name, value) {
    if (typeof value === 'string') value = value.replace(/[^\x00-\x7F]/g, '');
    return origSet.call(this, name, value);
  };
}

delete process.env.COMPUTERNAME;
delete process.env.LOGONSERVER;
delete process.env.USERDOMAIN;
delete process.env.USERDOMAIN_ROAMINGPROFILE;

process.env.COMPUTERNAME = "vercelhost";
process.env.LOGONSERVER = "\\\\vercelhost";
process.env.USERDOMAIN = "vercelhost";
process.env.USERDOMAIN_ROAMINGPROFILE = "vercelhost";

process.argv = [process.argv[0], 'vercel', '--prod', '--yes'];

try {
  const path = require('path');
  const vercelPkg = require.resolve('vercel/package.json', { 
    paths: [process.cwd(), __dirname, path.join(process.env.APPDATA || '', 'npm', 'node_modules')] 
  });
  const vercelDir = path.dirname(vercelPkg);
  require(path.join(vercelDir, 'dist', 'index.js'));
} catch (e) {
  console.error("Direct require error:", e);
}
