import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
     `pg` resolves optional native bindings and dialect modules at runtime, so
     bundling it produces require() calls the bundler cannot follow. Keeping it
     external hands it to Node untouched, which is what it expects.
  */
  serverExternalPackages: ["pg"],
};

export default nextConfig;
