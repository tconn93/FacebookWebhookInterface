// app/api/poll/user/[userId]/route.js
const { NextRequest, NextResponse } = require('next/server');
const { getUserPosts } = require('@/lib/facebook');
const { getLastPostId, updateLastPostId, getMonitoredItems } = require('@/data/store');
const axios = require('axios');

exports.GET = async function (request, { params }) {
  const { userId } = params;
  const searchParams = new URL(request.url).searchParams;
  const userToken = searchParams.get('token');
  if (!userToken) return NextResponse.json({ error: 'No token' }, { status: 400 });

  const lastId = getLastPostId(userId);
  const newPosts = await getUserPosts(userId, userToken, lastId);

  if (newPosts.length > 0) {
    const latestPost = newPosts[0];
    updateLastPostId(userId, latestPost.id);

    const forwardUrl = getMonitoredItems()[userId]?.webhookUrl;
    if (forwardUrl) {
      await axios.post(forwardUrl, {
        source: 'facebook_user',
        userId,
        event: 'new_post_or_share',
        post: latestPost,
        timestamp: new Date().toISOString(),
      });
    }
  }

  return NextResponse.json({ newPosts: newPosts.length });
};