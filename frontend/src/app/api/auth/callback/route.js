// app/api/auth/callback/route.js
const { NextRequest, NextResponse } = require('next/server');
const { getUserAccessToken } = require('@/lib/facebook');
const axios = require('axios');

exports.GET = async function (request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'No code' }, { status: 400 });

  try {
    const userToken = await getUserAccessToken(code);
    const { data: userData } = await axios.get(`https://graph.facebook.com/me?access_token=${userToken}`);
    const userId = userData.id;

    const { data: pages } = await axios.get(`https://graph.facebook.com/${userId}/accounts?access_token=${userToken}`);
    const pageTokens = pages.data.map((p) => ({ id: p.id, token: p.access_token, name: p.name }));
    return NextResponse.redirect(new URL('/home?userId='+userId+'&userToken='+userToken
        , request.url));
    //return NextResponse.json({ userId, userToken, pages: pageTokens });
  } catch (error) {
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
  }
};