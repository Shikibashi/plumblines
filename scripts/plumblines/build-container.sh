#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
pnpm install --frozen-lockfile
pnpm build-web
docker compose -p plumblines -f docker-images/docker-compose.yml build
