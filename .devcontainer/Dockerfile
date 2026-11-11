# syntax=docker/dockerfile:1

# TightStack's image, trimmed for a static site: Ubuntu 24.04 pinned by digest (the
# same one, so the layers are shared), every package named here, the toolchain from
# mise, no Node: Bun runs everything (bunfig.toml).
ARG BASE_IMAGE=ubuntu:24.04@sha256:fe81560990fae86dc4743202b2cb4d3df98d0bcf949173cecef15ce1127ef852
FROM ${BASE_IMAGE}

# git and openssh-client for pushes; curl and ca-certificates for the mise and
# Claude Code installers; sudo for postCreate.sh; less, git's pager; procps, `ps`;
# zsh for the terminals. A person's own packages go through EXTRA_APT_PACKAGES.
ARG EXTRA_APT_PACKAGES=""
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates curl git less openssh-client procps sudo zsh ${EXTRA_APT_PACKAGES} \
    && rm -rf /var/lib/apt/lists/*

# The `vscode` user, uid 1000 like the host's; Ubuntu's own uid 1000 user goes first.
RUN userdel --remove ubuntu \
    && useradd --create-home --shell /bin/bash --uid 1000 --user-group vscode \
    && echo 'vscode ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/vscode \
    && chmod 0440 /etc/sudoers.d/vscode

ENV LANG=C.UTF-8
USER vscode
ENV HOME=/home/vscode
ENV PATH="${HOME}/.local/share/mise/shims:${HOME}/.local/bin:${PATH}"

# Made as vscode before any volume lands in them, so a new volume belongs to vscode.
RUN mkdir -p "${HOME}/.config" "${HOME}/.local/share" "${HOME}/.cache/bun"

# mise, at the version TightStack's CI installs, then the toolchain of mise.toml.
ARG MISE_VERSION=2026.10.21
RUN curl -fsSL https://mise.run | MISE_VERSION="v${MISE_VERSION}" sh \
    && echo 'eval "$(mise activate bash)"' >> ~/.bashrc \
    && echo 'eval "$(mise activate zsh)"'  >> ~/.zshrc

COPY --chown=vscode:vscode mise.toml /tmp/toolchain/mise.toml
RUN cd /tmp/toolchain && mise trust && mise install && rm -rf /tmp/toolchain

# Claude Code, at a pinned version, never updating itself.
ARG CLAUDE_CODE_VERSION=2.1.314
RUN curl -fsSL https://claude.ai/install.sh | bash -s -- "${CLAUDE_CODE_VERSION}"
ENV DISABLE_AUTOUPDATER=1
