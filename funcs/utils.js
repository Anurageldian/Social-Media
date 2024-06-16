// utils.js

// Utility function to format uptime
function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor(seconds % (3600 * 24) / 3600);
  const minutes = Math.floor(seconds % 3600 / 60);
  const uptimeString = `${days}d ${hours}h ${minutes}m`;
  return uptimeString;
}

module.exports = {
  formatUptime
};
