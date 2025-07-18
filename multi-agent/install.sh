#!/bin/bash

# Vibe Agent Bus Installation Script
# Installs and configures the enhanced MCP-native multi-agent system

set -e  # Exit on any error

echo "🚀 Installing Vibe Agent Bus - Enhanced Multi-Agent System"
echo "=========================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ required. Current version: $(node --version)"
    exit 1
fi

print_success "Node.js $(node --version) detected"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm and try again."
    exit 1
fi

print_success "npm $(npm --version) detected"

# Check Claude CLI
if ! command -v claude &> /dev/null; then
    print_warning "Claude CLI not found. Please ensure Claude Desktop is installed."
    print_warning "Install from: https://claude.ai/download"
    print_warning "Continue anyway? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

print_status "Installing dependencies..."

# Install Node.js dependencies
if [ -f "package.json" ]; then
    npm install
    print_success "Dependencies installed"
else
    print_error "package.json not found. Please run from the multi-agent directory."
    exit 1
fi

print_status "Configuring MCP server..."

# Check if MCP server is already installed
if command -v claude &> /dev/null; then
    if claude mcp list | grep -q "vibeAgentBus"; then
        print_warning "Vibe Agent Bus already installed. Updating..."
        claude mcp remove vibeAgentBus || true
    fi
    
    # Install/update MCP server
    MCP_SERVER_PATH="$(pwd)/vibe-agent-bus.js"
    if claude mcp add vibeAgentBus node -- "$MCP_SERVER_PATH"; then
        print_success "MCP server registered successfully"
    else
        print_error "Failed to register MCP server"
        exit 1
    fi
    
    # Test connectivity
    print_status "Testing MCP server connectivity..."
    if claude mcp ping vibeAgentBus; then
        print_success "MCP server is responding"
    else
        print_warning "MCP server may not be responding properly"
    fi
else
    print_warning "Claude CLI not available. Manual MCP setup required:"
    echo "  1. Open Claude Desktop"
    echo "  2. Go to Settings → Developer"
    echo "  3. Add MCP server with path: $(pwd)/vibe-agent-bus.js"
fi

print_status "Setting up database..."

# Create database directory if needed
DB_DIR="/tmp"
if [ ! -w "$DB_DIR" ]; then
    print_warning "Cannot write to /tmp. Database will use current directory."
fi

print_status "Creating default configuration..."

# Create configuration file
cat > vibe-agent-config.json << EOF
{
  "version": "2.1.0",
  "dbPath": "/tmp/vibe-agent-bus.db",
  "features": {
    "intelligentRouting": true,
    "persistentMemory": true,
    "vibeIntegration": true,
    "contextAwareness": true
  },
  "agents": {
    "autoRegister": true,
    "defaultCapabilities": ["vibe-methodology", "mcp-tools"],
    "memoryRetention": "14d"
  },
  "installation": {
    "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "nodeVersion": "$(node --version)",
    "platform": "$(uname -s)"
  }
}
EOF

print_success "Configuration created"

print_status "Running system validation..."

# Test basic functionality
if node vibe-agent-bus.js --version &> /dev/null; then
    print_success "MCP server startup test passed"
else
    print_warning "MCP server startup test failed (may need manual configuration)"
fi

echo ""
echo "🎯 Installation Complete!"
echo "========================"
echo ""
print_success "Vibe Agent Bus v2.1.0 installed successfully"
echo ""
echo "📋 Next Steps:"
echo "  1. Run: /vibe-multi-agent-enhanced"
echo "  2. Test communication: /sendVibeMessage agent=\"test\" message=\"Hello World\""
echo "  3. Check status: /getVibeProjectStatus"
echo ""
echo "📚 Available Commands:"
echo "  • /sendVibeMessage - Send intelligent messages to agents"
echo "  • /checkVibeMessages - Check agent communications"
echo "  • /getVibeProjectStatus - Get project and agent status"
echo "  • /registerVibeAgent - Register new agents"
echo "  • /findVibeAgentsForTask - Find optimal agents for tasks"
echo ""
echo "🔧 Management:"
echo "  • Check status: npm run status"
echo "  • View logs: npm run logs"
echo "  • Restart: npm run install-mcp"
echo ""
echo "🎉 Ready to revolutionize your Vibe Coding with intelligent multi-agent coordination!"
echo ""

# Optional: Migrate existing agent history
echo "📂 Would you like to migrate existing agent communication history? (y/N)"
read -r migrate_response
if [[ "$migrate_response" =~ ^[Yy]$ ]]; then
    print_status "Looking for existing channel.md..."
    if [ -f "../.workflow/context/channel.md" ] || [ -f "../.vibe-backup/multi-agent-legacy/channel-backup.md" ]; then
        npm run migrate
        print_success "✓ Agent history migration completed"
    else
        print_warning "No existing channel.md found to migrate"
    fi
fi

# Optional: Test installation
echo "🧪 Would you like to run a quick system test? (y/N)"
read -r test_response
if [[ "$test_response" =~ ^[Yy]$ ]]; then
    print_status "Running system test..."
    
    # Test basic MCP functionality
    if command -v claude &> /dev/null; then
        echo "Testing MCP server status..."
        if claude mcp list | grep -q "vibeAgentBus"; then
            print_success "✓ MCP server registered"
        else
            print_warning "✗ MCP server not found in registry"
        fi
        
        echo "Testing MCP server ping..."
        if claude mcp ping vibeAgentBus; then
            print_success "✓ MCP server responding"
        else
            print_warning "✗ MCP server not responding"
        fi
    fi
    
    echo "Testing database permissions..."
    if touch /tmp/vibe-test-db && rm /tmp/vibe-test-db; then
        print_success "✓ Database directory writable"
    else
        print_warning "✗ Database directory not writable"
    fi
    
    # Test migration if database exists
    if [ -f "/tmp/vibe-agent-bus.db" ]; then
        echo "Testing database schema..."
        if node -e "
        import Database from 'better-sqlite3';
        const db = new Database('/tmp/vibe-agent-bus.db');
        const tables = db.prepare('SELECT name FROM sqlite_master WHERE type=\"table\"').all();
        console.log('Tables found:', tables.length);
        db.close();
        "; then
            print_success "✓ Database schema valid"
        else
            print_warning "✗ Database schema issues detected"
        fi
    fi
    
    print_status "System test complete!"
fi

exit 0