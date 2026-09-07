/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // TypeScript errors නිසා build එක fail වෙන එක නවත්වයි
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint errors නිසා build එක fail වෙන එක නවත්වයි
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;