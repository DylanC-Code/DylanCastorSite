import { defineConfig } from "vitest/config";

/**
 * Two projects. `unit`: plain TypeScript tested on its own, a test beside its
 * file (`readerSteps.ts` and `readerSteps.test.ts`). `browser`: the built site
 * in a real Chromium (browser_tests/), run after the build.
 */
export default defineConfig({
    test: {
        passWithNoTests: true,
        projects: [
            { test: { name: "unit", include: ["src/**/*.test.ts"] } },
            {
                test: {
                    name: "browser",
                    include: ["browser_tests/**/*.test.ts"],
                    testTimeout: 30_000,
                    hookTimeout: 30_000,
                },
            },
        ],
    },
});
