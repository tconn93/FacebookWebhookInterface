const {NextResponse} = require("next/server");

exports.GET = async function () {
const fbUrl = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(process.env.FACEBOOK_REDIRECT_URI || '')}&scope=email,public_profile,user_posts&response_type=code`;
  return NextResponse.redirect(fbUrl);
}