// app/api/subscribe/page/[pageId]/route.js
const { NextRequest, NextResponse } = require('next/server');
import { getPageAccessToken, subscribeToPage } from '@/lib/facebook';
import { setWebhookUrl } from '@/data/store';

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