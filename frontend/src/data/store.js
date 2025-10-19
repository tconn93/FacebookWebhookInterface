// data/store.js
const store = {};

function getLastPostId(key) {
  return store[key]?.lastPostId ?? null;
}

function updateLastPostId(key, postId) {
  if (!store[key]) store[key] = { lastPostId: '' };
  store[key].lastPostId = postId;
}

function setWebhookUrl(key, url) {
  if (!store[key]) store[key] = { lastPostId: '' };
  store[key].webhookUrl = url;
}

function getMonitoredItems() {
  return store;
}

module.exports = { getLastPostId, updateLastPostId, setWebhookUrl, getMonitoredItems };