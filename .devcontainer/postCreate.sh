#!/bin/sh
# Runs in the container once it is made: the toolchain, the git hooks, and the
# packages, frozen, so a new container gets exactly the locked versions.
set -eu

# A fresh volume belongs to root: each is given to vscode once.
for folder in node_modules "$HOME/.cache/bun"; do
    [ "$(stat -c %U "$folder")" = vscode ] || sudo chown -R vscode:vscode "$folder"
done

mise install
lefthook install
bun install --frozen-lockfile

# The browser the browser tests drive (bun run test:browser), with the system
# libraries it needs.
bun x playwright install --with-deps chromium-headless-shell
