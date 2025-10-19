// app/page.js
'use client';
const { useEffect, useState } = require('react');
const { getMonitoredItems, setWebhookUrl } = require('@/data/store');

export default function Home() {
  const [items, setItems] = useState(getMonitoredItems());
  const [webhookUrl, setWebhookUrlState] = useState('');

  useEffect(() => {
    // Example: Poll every 5 min (replace userId/token)
    const interval = setInterval(() => {
      console.log('Polling...');
      // fetch(`/api/poll/user/${userId}?token=${token}`)
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const subscribePage = async (pageId) => {
    await fetch(`/api/subscribe/page/${pageId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhookUrl: webhookUrl || 'https://example.com/forward' }),
    });
    setItems(getMonitoredItems());
  };

  return (
    <div className="p-4">
      <h1>Facebook Monitor Dashboard</h1>
      <a href="/api/auth/login" className="bg-blue-500 text-white p-2">Login with Facebook</a>
      <input
        type="text"
        placeholder="Forward Webhook URL"
        value={webhookUrl}
        onChange={(e) => setWebhookUrlState(e.target.value)}
        className="ml-4 p-2 border"
      />
      <ul>
        {Object.entries(items).map(([id, item]) => (
          <li key={id}>
            {id} - Last: {item.lastPostId} - Forward: {item.webhookUrl || 'None'}
            <button onClick={() => subscribePage(id)} className="ml-2 bg-green-500 text-white p-1">Subscribe Page</button>
          </li>
        ))}
      </ul>
    </div>
  );
}