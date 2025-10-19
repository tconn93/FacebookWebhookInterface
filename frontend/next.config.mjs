/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
        FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
        
    }
};

export default nextConfig;
