/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Disable eslint during build to prevent build failures
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;