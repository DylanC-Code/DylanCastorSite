# syntax=docker/dockerfile:1
# The site's image (launch decisions, section 1): the static build served by
# static-web-server, in Dylan's k3s cluster behind Cloudflare; the cluster's
# configuration lives in his infrastructure repo. Built from the repo's root:
#   docker build .
# Every base image is pinned by its digest; Bun is mise.toml's. Tagged with the
# commit it was built from (.github/workflows/image.yml): a rollback is a tag.

ARG BUN_IMAGE=oven/bun:1.4.4@sha256:1d22548f177f4ff38e0c15baa3c2c46c6c2060ba2d1bc573bb4720b407548f1d
ARG SWS_IMAGE=ghcr.io/static-web-server/static-web-server:2.44.2-alpine@sha256:8df70fd2c77ab2757fc757586b801aee6223ac49dd6b8346a15184a79213f6da

# The site built as `bun run build` builds it, its packages from bun.lock.
FROM ${BUN_IMAGE} AS build
WORKDIR /site
COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile
COPY astro.config.ts tsconfig.json ./
COPY public/ public/
COPY src/ src/
RUN bun run build

# The pages, served as files by a user without rights (static-web-server's
# `sws`), on port 8080; GET /health answers 200 for the cluster's probes.
FROM ${SWS_IMAGE} AS web
COPY sws.toml /etc/sws.toml
ENV SERVER_CONFIG_FILE=/etc/sws.toml
COPY --from=build /site/dist/ /home/sws/public/
EXPOSE 8080
