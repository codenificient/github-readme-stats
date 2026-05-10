FROM mirror.gcr.io/library/node:22-alpine


# Install wget for healthcheck
RUN apk add --no-cache wget

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodejs

WORKDIR /app

# Copy package files first for better layer caching
COPY --chown=nodejs:nodejs package.json package-lock.json ./

ENV HUSKY=0
# Install production deps only. Fall back to install if ci fails (e.g. lockfile drift).
RUN npm ci --omit=dev --ignore-scripts || npm install --omit=dev --ignore-scripts

# Copy the rest of the app
COPY --chown=nodejs:nodejs . .

USER nodejs

ENV NODE_ENV=production \
    PORT=9000

EXPOSE 9000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:9000/api/health || exit 1

CMD ["node", "express.js"]
