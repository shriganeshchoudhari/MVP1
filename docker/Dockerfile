# Pinned official Microsoft Playwright runtime image with Node.js LTS and browsers pre-installed
FROM mcr.microsoft.com/playwright:v1.58.2-noble

WORKDIR /app

# Copy dependency manifests
COPY package*.json tsconfig.json ./

# Install npm dependencies deterministically
RUN npm ci

# Copy framework source, config, and tests
COPY config ./config
COPY src ./src
COPY tests ./tests
COPY scripts ./scripts
COPY .env.example .env

# Verify TypeScript compilation within container build
RUN npx tsc --noEmit

# Default command: Headless smoke test execution
CMD ["npx", "playwright", "test", "tests/smoke", "--config", "config/playwright.config.ts"]
