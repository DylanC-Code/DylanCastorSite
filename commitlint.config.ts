import { RuleConfigSeverity, type UserConfig } from "@commitlint/types";

export default {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "body-leading-blank": [RuleConfigSeverity.Error, "always"],
        "footer-leading-blank": [RuleConfigSeverity.Error, "always"],
        "header-max-length": [RuleConfigSeverity.Error, "always", 72],
        "scope-empty": [RuleConfigSeverity.Error, "always"],
    },
} satisfies UserConfig;
