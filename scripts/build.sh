#!/bin/bash

echo "🔧 Starting Render build process..."

# Install dependencies without dev dependencies in production
if [ "$NODE_ENV" = "production" ]; then
  echo "📦 Installing production dependencies..."
  npm ci --only=production
  
  # Install only necessary dev dependencies for build
  echo "📦 Installing build dependencies..."
  npm install --no-save typescript @nestjs/cli
else
  echo "📦 Installing all dependencies..."
  npm ci
fi

# Build the application
echo "🏗️ Building application..."
npx nest build

# Run post-build setup
echo "⚙️ Running post-build setup..."
node scripts/setup-storage.js || echo "Storage setup completed"

echo "✅ Build completed successfully!"
