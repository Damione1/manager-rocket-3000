/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "storage.googleapis.com",
            },
            {
                hostname: "storage.cloud.google.com",
            },
            {
                hostname: "robohash.org",
            }
        ],
    },
};

export default nextConfig;
