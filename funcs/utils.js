// utils.js

// Utility function to format uptime
// function formatUptime(seconds) {
//   const days = Math.floor(seconds / (3600 * 24));
//   const hours = Math.floor(seconds % (3600 * 24) / 3600);
//   const minutes = Math.floor(seconds % 3600 / 60);
//   const uptimeString = `${days}d ${hours}h ${minutes}m`;
//   return uptimeString;
// }
function formatUptime() {
  let uptimeSeconds = Math.floor((new Date() - startTime) / 1000);
  const days = Math.floor(uptimeSeconds / (3600 * 24));
  uptimeSeconds %= (3600 * 24);
  const hours = Math.floor(uptimeSeconds / 3600);
  uptimeSeconds %= 3600;
  const minutes = Math.floor(uptimeSeconds / 60);
  const seconds = uptimeSeconds % 60;
  
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
module.exports = {
  formatUptime,
};
