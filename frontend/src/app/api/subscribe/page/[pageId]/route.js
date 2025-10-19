// app/api/subscribe/page/[pageId]/route.js
const { NextRequest, NextResponse } = require('next/server');
const { getPageAccessToken, subscribeToPage } = require('@/lib/facebook');
const { setWebhookUrl } = require('@/data/store');

exports.POST = async function (request, { params }) {
  const { pageId } = params;
  const { userToken, webhookUrl } = await request.json();

  try {
    const pageToken = await getPageAccessToken(userToken, pageId);
    await subscribeToPage(pageId, pageToken, `${request.nextUrl.origin}/api/webhooks/facebook`);
    setWebhookUrl(pageId, webhookUrl);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
};