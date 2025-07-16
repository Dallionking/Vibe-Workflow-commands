# Claude Vibe - Troubleshooting Guide 🔧

Comprehensive solutions for common issues with Claude Vibe, Advanced Context Features, and Multi-Agent System.

## 🚨 Quick Diagnostics

**Start here for any issue:**
```bash
npm run doctor              # Full system health check
/vibe-status               # Project status
/context-validate --verbose # Advanced context system check
```

## 📋 Common Issues & Solutions

### Installation & Setup Issues

#### Commands Not Found
**Symptoms**: Claude Code can't find `/vibe-*` commands

**Solutions**:
1. **Restart Claude Code Desktop** - Most common fix
2. **Re-import Configuration**:
   - Settings → Developer → Import Configuration
   - Select `claude.json` from project directory
3. **Check Installation**:
   ```bash
   npm run doctor
   npm run validate
   ```
4. **Verify Path**: Ensure Claude Code is looking in correct directory

#### Dependencies Installation Failed
**Symptoms**: `npm install` fails or warnings about missing packages

**Solutions**:
1. **Update Node.js**: Ensure v18+ is installed
   ```bash
   node --version  # Should be 18.0.0 or higher
   ```
2. **Clear Cache and Reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install
   ```
3. **Check Permissions**: Ensure write access to project directory
4. **Platform-Specific Issues**:
   - **Windows**: May need Visual Studio Build Tools for native modules
   - **macOS**: May need Xcode Command Line Tools: `xcode-select --install`

#### TypeScript Compilation Errors
**Symptoms**: tsc errors, especially tree-sitter related

**Solutions**:
1. **Expected Behavior**: Tree-sitter compilation errors are normal on some systems
2. **Use TypeScript Fallbacks**: Advanced Context includes TypeScript-only implementations
3. **Check TypeScript Version**:
   ```bash
   npx tsc --version  # Should be 5.2.0 or higher
   ```
4. **Update tsconfig.json**: Run `npm run typecheck` to validate

### MCP Tools Issues

#### MCP Tools Not Connecting
**Symptoms**: Commands work but research/context features fail

**Solutions**:
1. **Check MCP Status**:
   ```bash
   /vibe-mcp-status
   npm run doctor
   ```
2. **Verify API Keys**: In Claude Code Settings → MCP Tools
3. **Test Individual Tools**:
   - Context7: Try documentation lookup
   - Perplexity: Try simple research query
   - Sequential Thinking: Try multi-step planning
4. **Restart MCP Services**: Restart Claude Code Desktop

#### Context7 Connection Failed
**Symptoms**: Documentation fetching fails, research commands timeout

**Solutions**:
1. **Check API Key**: Verify key is valid and has correct permissions
2. **Test Connection**: Try simple query in Claude Code MCP panel
3. **Fallback Mode**: Commands will use WebSearch as fallback
4. **Rate Limiting**: Wait if hitting API limits

#### Perplexity Research Failing
**Symptoms**: Research steps return empty or error results

**Solutions**:
1. **Verify Subscription**: Ensure Perplexity API access is active
2. **Check Rate Limits**: Perplexity has usage quotas
3. **Use Alternative**: System will fallback to WebSearch if needed
4. **Manual Research**: Continue with manual research if needed

### Multi-Agent System Issues

#### Multi-Agent Setup Failed
**Symptoms**: `/multi-agent` command fails or doesn't create `.workflow/`

**Solutions**:
1. **Check Dependencies**:
   ```bash
   npm install  # Ensure chokidar, ws, js-yaml installed
   ```
2. **File Permissions**: Ensure write access to project directory
3. **Create Manually**:
   ```bash
   mkdir -p .workflow/context
   touch .workflow/context/channel.md
   ```
4. **Verify Node.js**: Multi-agent requires Node.js v18+

#### Agents Not Connecting
**Symptoms**: Agents don't respond to orchestrator commands

**Solutions**:
1. **Check Terminal IDs**: Ensure unique `--terminal-id` for each agent
2. **Verify File Monitoring**: Check `.workflow/context/channel.md` exists
3. **Restart Agents**: Close and restart agent terminals
4. **Check Syntax**: Use exact command format:
   ```bash
   /agent research-agent --terminal-id=2
   ```

#### Channel Communication Issues
**Symptoms**: Agents don't see each other's messages

**Solutions**:
1. **File Permissions**: Check `.workflow/context/` is writable
2. **File Monitoring**: Verify chokidar dependency is working:
   ```bash
   npm list chokidar
   ```
3. **Manual Check**: Open `channel.md` and verify updates appear
4. **Restart System**: Close all agents and orchestrator, restart

#### Agents Stop Working
**Symptoms**: Agents were working but suddenly stop responding

**Solutions**:
1. **Check Process Status**: Verify agent processes are still running
2. **Memory Issues**: Advanced context features use memory:
   ```bash
   npm run benchmark:memory --gc
   ```
3. **File Lock Issues**: Restart if files seem locked
4. **Clean Restart**: Stop all agents, clean `.workflow/temp/`, restart

### Advanced Context System Issues

#### Context System Performance Issues
**Symptoms**: Slow responses, high memory usage, context timeouts

**Solutions**:
1. **Analyze Performance**:
   ```bash
   /context-analyze --verbose
   ```
2. **Optimize System**:
   ```bash
   /context-optimize
   ```
3. **Check Memory**: Ensure 4GB+ RAM available
4. **Clean Cache**:
   ```bash
   rm -rf .context-cache/
   rm -rf .context-temp/
   ```

#### PRP System Not Working
**Symptoms**: Pattern recognition features don't activate

**Solutions**:
1. **Check Environment Variables**: Ensure `CONTEXT_ENGINEERING_ENABLED=true`
2. **Validate Installation**:
   ```bash
   /context-validate --verbose
   ```
3. **TypeScript Issues**: Check for compilation errors
4. **Fallback Mode**: System continues without PRP if needed

#### Field Protocols Errors
**Symptoms**: Context management features fail

**Solutions**:
1. **Check Configuration**: Verify `.context-cache/` permissions
2. **Reset Protocols**:
   ```bash
   rm -rf .field-protocols-cache/
   /context-validate
   ```
3. **Memory Limits**: Increase available RAM if possible
4. **Environment Setup**: Check all Advanced Context environment variables

### YOLO Commands Issues

#### YOLO Execution Fails
**Symptoms**: `/yolo` commands fail to execute or hang

**Solutions**:
1. **Check Phase Files**: Ensure phases exist in `phases/` directory
2. **Docker Issues** (for `/yolo docker`):
   ```bash
   docker --version  # Ensure Docker is installed
   docker system prune  # Clean up if needed
   ```
3. **Permissions**: Check file permissions for phase execution
4. **Dry Run First**:
   ```bash
   /yolo local --dry-run  # Test what would execute
   ```

#### Docker YOLO Issues
**Symptoms**: Docker-based YOLO commands fail

**Solutions**:
1. **Docker Installation**: Ensure Docker Desktop is running
2. **Build Issues**: Try with `--rebuild --no-cache`
3. **Container Cleanup**:
   ```bash
   docker container prune
   docker image prune
   ```
4. **Fallback to Local**: Use `/yolo local` instead

### Project-Specific Issues

#### Git Integration Problems
**Symptoms**: Git operations fail, branch issues

**Solutions**:
1. **Check Git Status**:
   ```bash
   git status
   git branch
   ```
2. **Repository Issues**: Ensure you're in a git repository
3. **Permissions**: Check git repository permissions
4. **Remote Issues**: Verify remote repository access

#### Template Loading Fails
**Symptoms**: Project templates don't load or apply correctly

**Solutions**:
1. **Check Templates**: Verify `templates/` directory exists
2. **JSON Validation**: Ensure template JSON is valid
3. **Permissions**: Check read access to template files
4. **Fallback**: Use basic template if others fail

#### Service Initialization Fails
**Symptoms**: `/vibe-init-services` commands fail

**Solutions**:
1. **Check Service Configs**: Verify service configuration files
2. **API Access**: Ensure service API keys are valid
3. **Network Issues**: Check internet connectivity
4. **Service Status**: Verify external services are operational

### Quality Assurance Issues

#### Validation Commands Fail
**Symptoms**: `/vibe-validate-work`, `/re-channel` fail

**Solutions**:
1. **Check File Structure**: Ensure project files are properly organized
2. **Missing Dependencies**: Run `npm install` to ensure all tools available
3. **Permissions**: Check read access to project files
4. **Memory Issues**: Free up system memory if validation is slow

#### Testing Framework Issues
**Symptoms**: Test commands fail or don't find tests

**Solutions**:
1. **Install Test Dependencies**: Ensure test framework is installed
2. **Test Configuration**: Check test configuration files
3. **Path Issues**: Verify test file paths are correct
4. **Framework Compatibility**: Ensure test framework version compatibility

## 🔧 Advanced Troubleshooting

### Performance Optimization

#### Memory Optimization
```bash
# Check current memory usage
npm run benchmark:memory --gc

# Optimize context system
/context-optimize

# Clean all caches
rm -rf .context-cache/ .context-temp/ .workflow/cache/
```

#### Process Optimization
```bash
# Check running processes
ps aux | grep claude
ps aux | grep node

# Kill hung processes if needed
killall node  # Use with caution
```

### System Reset Procedures

#### Soft Reset (Preserve Project Data)
```bash
# Clean temporary files
rm -rf .context-cache/ .context-temp/ .workflow/temp/

# Reinstall dependencies
npm install

# Validate system
npm run doctor
```

#### Hard Reset (Nuclear Option)
```bash
# Backup important files first!
cp .vibe-status.md .vibe-status.backup.md
cp docs/vibe-coding/* /backup/location/

# Clean everything
rm -rf node_modules/ .context-cache/ .workflow/
npm cache clean --force

# Reinstall from scratch
npm install
npm run doctor
```

### Debug Information Collection

#### System Information
```bash
# Collect debug info
echo "Node Version: $(node --version)"
echo "NPM Version: $(npm --version)"
echo "TypeScript Version: $(npx tsc --version)"
echo "Git Version: $(git --version)"
echo "OS: $(uname -a)"

# Check Claude Vibe installation
npm run doctor --verbose
npm run validate --verbose
```

#### Log Collection
```bash
# Check for log files
find . -name "*.log" -type f
cat .vibe-errors.log
cat .vibe/init-services.log
```

## 📞 Getting Help

### Self-Help Resources
1. **Commands Reference**: `COMMANDS-CHEATSHEET.md`
2. **Installation Guide**: `INSTALLATION.md`
3. **Quick Start**: `QUICK-START.md`
4. **Project Status**: Check `current_status.md` and `CONTEXT-ENGINEERING-STATUS.md`

### Health Check Commands
```bash
npm run doctor                    # Comprehensive health check
npm run validate                  # Project structure validation
/vibe-status                     # Project progress
/context-analyze --verbose       # Advanced context analysis
/vibe-mcp-status                 # MCP tools status
```

### Community Support
- **GitHub Issues**: https://github.com/Dallionking/claude-vibe/issues
- **Documentation**: Check all `.md` files in project directory
- **Examples**: Review `examples/` and `multi-agent/examples/`

### Reporting Issues

When reporting issues, please include:
1. **System Information**: Output of `npm run doctor`
2. **Error Messages**: Complete error messages and stack traces
3. **Steps to Reproduce**: Exact commands that caused the issue
4. **Environment**: OS, Node.js version, Claude Code version
5. **Project State**: Current step/phase, any customizations

## 🎯 Prevention Tips

### Best Practices
1. **Regular Health Checks**: Run `npm run doctor` weekly
2. **Keep Dependencies Updated**: Run `npm update` regularly
3. **Monitor Memory**: Check memory usage during large operations
4. **Backup Important Files**: Regular backups of `.vibe-status.md` and `docs/`
5. **Clean Caches**: Periodic cleanup of cache directories

### Proactive Monitoring
```bash
# Weekly maintenance routine
npm run doctor
npm run validate
/context-analyze
npm audit
```

### Environment Maintenance
```bash
# Monthly cleanup
rm -rf .context-cache/ .workflow/temp/
npm install
npm run typecheck
npm test
```

---

## 🚀 Still Having Issues?

If you've tried the solutions above and still have problems:

1. **Check Latest Documentation**: Ensure you have the latest version
2. **Search Existing Issues**: Check GitHub issues for similar problems
3. **Create Detailed Issue Report**: Include all debug information
4. **Try Alternative Approaches**: Use different commands or methods
5. **Community Help**: Engage with other users and contributors

**Remember**: The Advanced Context system is designed to be resilient and will continue working even if some features are unavailable. When in doubt, the system will guide you through fallback options.

**Emergency Command**: `/vibe-doctor` - Your first line of defense for any issue!