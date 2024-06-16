// utils.js

// Utility function to format uptime
// function formatUptime(seconds) {
//   const days = Math.floor(seconds / (3600 * 24));
//   const hours = Math.floor(seconds % (3600 * 24) / 3600);
//   const minutes = Math.floor(seconds % 3600 / 60);
//   const uptimeString = `${days}d ${hours}h ${minutes}m`;
//   return uptimeString;
// }
const os = require('os');

let startTime = Date.now(); // Capture the start time in milliseconds
function formatUptime() {
  let uptimeMilliseconds = Date.now() - startTime; // Calculate uptime in milliseconds
  // let uptimeSeconds = Math.floor(uptimeMilliseconds / 1000); // Convert milliseconds to seconds
  // const days = Math.floor(uptimeSeconds / (3600 * 24));
  // uptimeSeconds %= (3600 * 24);
  // const hours = Math.floor(uptimeSeconds / 3600);
  // uptimeSeconds %= 3600;
  // const minutes = Math.floor(uptimeSeconds / 60);
  // const seconds = uptimeSeconds % 60;
   const days = Math.floor(uptimeMilliseconds / (1000 * 3600 * 24));
  uptimeMilliseconds %= (1000 * 3600 * 24);
  const hours = Math.floor(uptimeMilliseconds / (1000 * 3600));
  uptimeMilliseconds %= (1000 * 3600);
  const minutes = Math.floor(uptimeMilliseconds / (1000 * 60));
  const seconds = Math.floor(uptimeMilliseconds / 1000);
  
  const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  return uptimeString;
}

//system uptime this will show in  /dev command
function formatSystemUptime() {
  let uptimeSeconds = os.uptime(); // Get system uptime in seconds

  const days = Math.floor(uptimeSeconds / (3600 * 24));
  uptimeSeconds %= (3600 * 24);
  const hours = Math.floor(uptimeSeconds / 3600);
  uptimeSeconds %= 3600;
  const minutes = Math.floor(uptimeSeconds / 60);
  const seconds = uptimeSeconds % 60;

  const systemString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  return systemString;
}
module.exports = {
  formatUptime,
  formatSystemUptime
};
