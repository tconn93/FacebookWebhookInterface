// app/api/webhooks/facebook/route.js
const { NextRequest, NextResponse } = require('next/server');
import { verifyWebhook } from '@/lib/facebook';
import { getLastPostId, updateLastPostId, getMonitoredItems } from '@/data/store';
const axios = require('axios');

exports.GET = async function (request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  try {
    const verified = verifyWebhook(mode || '', token || '', challenge);
    return NextResponse.json(verified);
  } catch {
    return new NextResponse('Forbidden', { status: 403 });
  }
};

exports.POST = async function (request) {
  const payload = await request.json();
  const entry = payload.entry?.[0];

  if (!entry || entry.changes?.[0].field !== 'feed') return NextResponse.json({});

  const pageId = entry.id;
  const verb = entry.changes[0].value?.verb;
  if (!verb) return NextResponse.json({});

  const lastId = getLastPostId(pageId);
  updateLastPostId(pageId, Date.now().toString());

  const forwardUrl = getMonitoredItems()[pageId]?.webhookUrl;
  if (forwardUrl) {
    await axios.post(forwardUrl, {
      source: 'facebook_page',
      pageId,
      event: 'new_post_or_share',
      verb,
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json({ received: true });
};