const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Try loading .dev.vars (Cloudflare Pages dev) or .env.local if present.
const devVarsPath = path.resolve(process.cwd(), ".dev.vars");
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(devVarsPath)) {
  dotenv.config({ path: devVarsPath });
} else if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}

describe("Unsplash env variable", () => {
  test("UNSPLASH_ACCESS_KEY should be defined locally", () => {
    expect(process.env.UNSPLASH_ACCESS_KEY).toBeDefined();
  });
});
