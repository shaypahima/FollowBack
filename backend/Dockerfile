FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy application code
COPY . .

# Generate Prisma Client
RUN bunx prisma generate

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "start"]
