import { defineConfig } from "vitest/config";

/**
 * The demos' logic is plain TypeScript, tested on its own in node. A test sits
 * beside its file: `lazyDemo.ts` and `lazyDemo.test.ts`.
 */
export default defineConfig({
    test: {
        include: ["src/**/*.test.ts"],
        passWithNoTests: true,
    },
});
