const fs = require('fs');
const path = require('path');
const { app } = require('electron');

function getCommandsPath() {
  return path.join(app.getPath('userData'), 'commands.json');
}

function loadFullStructure() {
  const file = getCommandsPath();

  if (!fs.existsSync(file))
    return null;

  try {
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));

    if (raw && raw.activeProfile && raw.profiles)
      return raw;

    if (raw && typeof raw === 'object' && !raw.profiles) {
      const migrado = {
        activeProfile: 'default',
        profiles: { default: raw }
      };
      fs.writeFileSync(file, JSON.stringify(migrado, null, 2));
      return migrado;
    }

    return raw;
  } catch {
    return null;
  }
}

function loadCommands() {
  const full = loadFullStructure();
  if (!full || !full.profiles || !full.activeProfile)
    return {};
  return full.profiles[full.activeProfile] || {};
}

function getActiveProfile() {
  const full = loadFullStructure();
  if (!full)
    return 'default';
  return full.activeProfile || 'default';
}

function getProfiles() {
  const full = loadFullStructure();
  if (!full || !full.profiles)
    return ['default'];
  return Object.keys(full.profiles);
}

function saveProfile(name, commands) {
  const full = loadFullStructure() || { activeProfile: 'default', profiles: {} };
  if (!full.profiles)
    full.profiles = {};
  full.profiles[name] = commands;
  fs.writeFileSync(getCommandsPath(), JSON.stringify(full, null, 2));
}

function deleteProfile(name) {
  const full = loadFullStructure();
  if (!full || !full.profiles || !full.profiles[name])
    return;
  delete full.profiles[name];
  if (full.activeProfile === name) {
    const remaining = Object.keys(full.profiles);
    full.activeProfile = remaining[0] || 'default';
  }
  fs.writeFileSync(getCommandsPath(), JSON.stringify(full, null, 2));
}

function switchProfile(name) {
  const full = loadFullStructure() || { activeProfile: 'default', profiles: {} };
  full.activeProfile = name;
  fs.writeFileSync(getCommandsPath(), JSON.stringify(full, null, 2));
}

module.exports = {
  getCommandsPath,
  loadCommands,
  loadFullStructure,
  getActiveProfile,
  getProfiles,
  saveProfile,
  deleteProfile,
  switchProfile
};