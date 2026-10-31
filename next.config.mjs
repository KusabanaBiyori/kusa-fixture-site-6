/**
 * Static export is not a preference here, it is the contract.
 *
 * `kusa.config.json` declares `framework: "nextjs-static-export"`, and
 * KusaBuilder's onboarding validator proves this file sets `output: 'export'`
 * before it will provision anything. Removing this line makes the repository
 * fail contract validation rather than silently deploying something Cloudflare
 * Pages cannot serve.
 */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
