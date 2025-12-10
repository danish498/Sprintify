#!/bin/bash

# Smart Queue Development Scripts

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Help function
show_help() {
    echo "Smart Queue Development Scripts"
    echo ""
    echo "Usage: ./scripts.sh [command]"
    echo ""
    echo "Commands:"
    echo "  setup       - Initial project setup"
    echo "  dev         - Start development server"
    echo "  build       - Build the application"
    echo "  test        - Run all tests"
    echo "  lint        - Run linter"
    echo "  format      - Format code"
    echo "  clean       - Clean build artifacts"
    echo "  docker:up   - Start Docker containers"
    echo "  docker:down - Stop Docker containers"
    echo "  db:migrate  - Run database migrations"
    echo "  db:seed     - Seed database"
    echo ""
}

# Setup function
setup() {
    print_info "Setting up Smart Queue..."
    
    if [ ! -f .env ]; then
        print_info "Creating .env file from .env.example"
        cp .env.example .env
    fi
    
    print_info "Installing dependencies..."
    npm install
    
    print_success "Setup complete!"
}

# Development server
dev() {
    print_info "Starting development server..."
    npm run start:dev
}

# Build
build() {
    print_info "Building application..."
    npm run build
    print_success "Build complete!"
}

# Test
test() {
    print_info "Running tests..."
    npm run test
}

# Lint
lint() {
    print_info "Running linter..."
    npm run lint
}

# Format
format() {
    print_info "Formatting code..."
    npm run format
    print_success "Code formatted!"
}

# Clean
clean() {
    print_info "Cleaning build artifacts..."
    rm -rf dist
    rm -rf node_modules
    print_success "Clean complete!"
}

# Docker up
docker_up() {
    print_info "Starting Docker containers..."
    docker-compose up -d
    print_success "Docker containers started!"
}

# Docker down
docker_down() {
    print_info "Stopping Docker containers..."
    docker-compose down
    print_success "Docker containers stopped!"
}

# Main script
case "$1" in
    setup)
        setup
        ;;
    dev)
        dev
        ;;
    build)
        build
        ;;
    test)
        test
        ;;
    lint)
        lint
        ;;
    format)
        format
        ;;
    clean)
        clean
        ;;
    docker:up)
        docker_up
        ;;
    docker:down)
        docker_down
        ;;
    *)
        show_help
        ;;
esac
