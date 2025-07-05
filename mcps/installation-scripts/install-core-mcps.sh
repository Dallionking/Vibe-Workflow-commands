#!/bin/bash

# Vibe Coding Core MCPs Installation Script
# Installs the essential MCP tools required for all Vibe Coding projects

set -e

echo "🚀 Installing Vibe Coding Core MCPs"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Node.js/npm is required but not installed${NC}"
    echo "Please install Node.js 16+ from https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}✅ Node.js/npm detected${NC}"
echo ""

# Function to install MCP with error handling
install_mcp() {
    local name=$1
    local package=$2
    local description=$3
    
    echo -e "${BLUE}📦 Installing $name MCP...${NC}"
    echo "   Description: $description"
    
    if npm install -g "$package"; then
        echo -e "${GREEN}✅ $name MCP installed successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to install $name MCP${NC}"
        return 1
    fi
}

# Function to test MCP connection
test_mcp() {
    local name=$1
    local test_command=$2
    
    echo -e "${BLUE}🧪 Testing $name MCP...${NC}"
    
    if eval "$test_command" &>/dev/null; then
        echo -e "${GREEN}✅ $name MCP connection test passed${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️ $name MCP installed but needs configuration${NC}"
        return 1
    fi
}

echo "Installing Core MCPs required for all Vibe Coding projects:"
echo ""

# Track installation results
INSTALLED_COUNT=0
FAILED_COUNT=0
CONFIG_NEEDED=()

# Install Context7 MCP
if install_mcp "Context7" "@context7/mcp-client" "Documentation fetching and research"; then
    ((INSTALLED_COUNT++))
    if ! test_mcp "Context7" "context7 --version"; then
        CONFIG_NEEDED+=("Context7")
    fi
else
    ((FAILED_COUNT++))
fi
echo ""

# Install Perplexity MCP
if install_mcp "Perplexity" "@perplexity/mcp-integration" "Real-time research and market analysis"; then
    ((INSTALLED_COUNT++))
    if ! test_mcp "Perplexity" "perplexity-mcp --version"; then
        CONFIG_NEEDED+=("Perplexity")
    fi
else
    ((FAILED_COUNT++))
fi
echo ""

# Install GitHub MCP
if install_mcp "GitHub" "@github/mcp-cli" "Repository management and CI/CD integration"; then
    ((INSTALLED_COUNT++))
    if ! test_mcp "GitHub" "github-mcp --version"; then
        CONFIG_NEEDED+=("GitHub")
    fi
else
    ((FAILED_COUNT++))
fi
echo ""

# Install Sequential Thinking MCP
if install_mcp "Sequential Thinking" "@sequential-thinking/mcp" "Complex analysis and planning"; then
    ((INSTALLED_COUNT++))
    if ! test_mcp "Sequential Thinking" "sequential-thinking --version"; then
        CONFIG_NEEDED+=("Sequential Thinking")
    fi
else
    ((FAILED_COUNT++))
fi
echo ""

# Installation Summary
echo "==============================================="
echo -e "${BLUE}📊 Installation Summary${NC}"
echo "==============================================="
echo -e "${GREEN}✅ Successfully installed: $INSTALLED_COUNT/4 Core MCPs${NC}"

if [ $FAILED_COUNT -gt 0 ]; then
    echo -e "${RED}❌ Failed installations: $FAILED_COUNT${NC}"
fi

if [ ${#CONFIG_NEEDED[@]} -gt 0 ]; then
    echo -e "${YELLOW}⚙️ Need configuration: ${CONFIG_NEEDED[*]}${NC}"
fi

echo ""

# Configuration Instructions
if [ ${#CONFIG_NEEDED[@]} -gt 0 ]; then
    echo -e "${YELLOW}🔧 Configuration Required${NC}"
    echo "======================================="
    echo ""
    echo "The following MCPs were installed but need API keys:"
    echo ""
    
    for mcp in "${CONFIG_NEEDED[@]}"; do
        case $mcp in
            "Context7")
                echo -e "${BLUE}Context7 Setup:${NC}"
                echo "1. Visit: https://context7.ai/dashboard"
                echo "2. Generate API key"
                echo "3. Add to .env.mcp: CONTEXT7_API_KEY=ctx7_your_key_here"
                echo ""
                ;;
            "Perplexity")
                echo -e "${BLUE}Perplexity Setup:${NC}"
                echo "1. Visit: https://perplexity.ai/settings/api"
                echo "2. Generate API key"
                echo "3. Add to .env.mcp: PERPLEXITY_API_KEY=pplx_your_key_here"
                echo ""
                ;;
            "GitHub")
                echo -e "${BLUE}GitHub Setup:${NC}"
                echo "1. Visit: https://github.com/settings/tokens"
                echo "2. Generate personal access token"
                echo "3. Add to .env.mcp: GITHUB_TOKEN=ghp_your_token_here"
                echo ""
                ;;
            "Sequential Thinking")
                echo -e "${BLUE}Sequential Thinking Setup:${NC}"
                echo "1. Visit: https://sequential-thinking.ai/dashboard"
                echo "2. Generate API key"
                echo "3. Add to .env.mcp: SEQUENTIAL_THINKING_KEY=st_your_key_here"
                echo ""
                ;;
        esac
    done
    
    echo -e "${BLUE}💡 Quick Setup:${NC}"
    echo "Create .env.mcp file in your project root:"
    echo ""
    echo "# Core MCP Configuration"
    echo "CONTEXT7_API_KEY=ctx7_your_key_here"
    echo "PERPLEXITY_API_KEY=pplx_your_key_here"
    echo "GITHUB_TOKEN=ghp_your_token_here"
    echo "SEQUENTIAL_THINKING_KEY=st_your_key_here"
    echo ""
fi

# Test All MCPs
echo -e "${BLUE}🧪 Testing All Installed MCPs${NC}"
echo "======================================="
echo ""

if [ ${#CONFIG_NEEDED[@]} -eq 0 ]; then
    echo "Running comprehensive test suite..."
    if command -v claude-mcp &> /dev/null; then
        claude-mcp test --category "core" --verbose
    else
        echo -e "${YELLOW}⚠️ Claude MCP CLI not available. Install with: npm install -g @claude/mcp-cli${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ Skipping tests - configuration required first${NC}"
    echo "After configuring API keys, run: claude-mcp test --category core"
fi

echo ""

# Next Steps
echo -e "${GREEN}🎯 Next Steps${NC}"
echo "======================================="
echo ""

if [ $INSTALLED_COUNT -eq 4 ] && [ ${#CONFIG_NEEDED[@]} -eq 0 ]; then
    echo -e "${GREEN}🎉 All Core MCPs installed and configured!${NC}"
    echo ""
    echo "You can now:"
    echo "• Start a new Vibe Coding project: /vibe-init my-project"
    echo "• Install service-specific MCPs: ./install-service-mcps.sh"
    echo "• Run Step 2.5 auto-setup: /vibe-step-2.5-mcp-setup"
    echo ""
elif [ $INSTALLED_COUNT -eq 4 ]; then
    echo -e "${YELLOW}✅ All Core MCPs installed successfully!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Configure API keys (see instructions above)"
    echo "2. Test configuration: claude-mcp test --category core"
    echo "3. Install service MCPs: ./install-service-mcps.sh"
    echo "4. Start your first project: /vibe-init my-project"
    echo ""
else
    echo -e "${RED}⚠️ Some installations failed${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "• Check Node.js version: node --version (requires 16+)"
    echo "• Check npm permissions: npm config get prefix"
    echo "• Try with sudo: sudo ./install-core-mcps.sh"
    echo "• Check internet connectivity"
    echo ""
fi

# Usage Examples
echo -e "${BLUE}📚 Usage Examples${NC}"
echo "======================================="
echo ""
echo "# Research with Perplexity"
echo "/perplexity \"SaaS pricing trends 2024\""
echo ""
echo "# Fetch documentation with Context7"
echo "/context7 library=\"react\" topic=\"hooks-best-practices\""
echo ""
echo "# GitHub repository operations"
echo "/github create-repo --name \"my-project\" --private"
echo ""
echo "# Complex analysis with Sequential Thinking"
echo "/sequential-thinking \"Compare React vs Vue for enterprise app\""
echo ""

# Create quick reference
if [ $INSTALLED_COUNT -eq 4 ]; then
    echo -e "${BLUE}📋 Quick Reference${NC}"
    echo "======================================="
    echo ""
    
    # Create MCP quick reference file
    cat > mcp-quick-reference.md << 'EOF'
# Core MCPs Quick Reference

## Context7 - Documentation & Research
```bash
/context7 library="react" topic="hooks-best-practices"
/context7 library="nextjs" topic="app-router-migration"
```

## Perplexity - Real-time Research
```bash
/perplexity "SaaS pricing trends 2024"
/perplexity "React vs Vue performance 2024"
```

## GitHub - Repository Management
```bash
/github create-repo --name "project" --private
/github create-issue --title "Feature request"
```

## Sequential Thinking - Complex Analysis
```bash
/sequential-thinking "Analyze tech stack for e-commerce app"
/sequential-thinking framework="mcda" "Compare database options"
```

## Testing Commands
```bash
claude-mcp test --all
claude-mcp status-dashboard
claude-mcp performance-report
```
EOF
    
    echo "✅ Quick reference created: mcp-quick-reference.md"
    echo ""
fi

echo -e "${GREEN}🚀 Core MCP installation complete!${NC}"
echo ""
echo "Happy coding with AI-powered development tools! 🤖"