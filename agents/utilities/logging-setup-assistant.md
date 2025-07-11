# Logging Setup Assistant Agent

## Mission Statement
**I am the Logging Setup Assistant.** I help you configure proper logging, log rotation, and log management for your project using standard tools like logrotate, systemd, and cloud logging services.

## What This Agent Actually Does

### 1. Basic Logging Configuration
```bash
# Set up structured logging configuration
echo "📝 LOGGING SETUP"
echo "==============="

# Create logs directory structure
mkdir -p logs/{app,error,debug,audit}

# Create basic logging config (Node.js example)
cat > config/logging.js << 'EOF'
const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error/error.log', 
      level: 'error',
      maxsize: 50 * 1024 * 1024, // 50MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: 'logs/app/app.log',
      maxsize: 50 * 1024 * 1024, // 50MB
      maxFiles: 10
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

module.exports = logger;
EOF

echo "✅ Basic logging configuration created!"
```

### 2. Log Rotation Setup (Linux/macOS)
```bash
# Create logrotate configuration
cat > scripts/setup-logrotate.sh << 'EOF'
#!/bin/bash
echo "🔄 Setting up log rotation"

PROJECT_DIR=$(pwd)
PROJECT_NAME=$(basename "$PROJECT_DIR")

# Create logrotate config
sudo tee "/etc/logrotate.d/$PROJECT_NAME" > /dev/null << EOL
$PROJECT_DIR/logs/*/*.log {
    daily
    size 50M
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 $USER $USER
    postrotate
        # Send USR1 signal to restart logging (if needed)
        # pkill -USR1 node
    endscript
}
EOL

echo "✅ Logrotate configured for $PROJECT_NAME"
echo "Test with: sudo logrotate -d /etc/logrotate.d/$PROJECT_NAME"
EOF

chmod +x scripts/setup-logrotate.sh
```

### 3. Docker Logging Setup
```bash
# Create docker-compose logging config
cat > docker-compose.logging.yml << 'EOF'
version: '3.8'
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "10"
        labels: "service=app"
    volumes:
      - ./logs:/app/logs
    environment:
      - LOG_LEVEL=info

  # Optional: Add log aggregation
  fluentd:
    image: fluentd:latest
    volumes:
      - ./fluentd:/fluentd/etc
      - ./logs:/logs
    ports:
      - "24224:24224"
EOF

# Create fluentd config
mkdir -p fluentd
cat > fluentd/fluent.conf << 'EOF'
<source>
  @type tail
  path /logs/*/*.log
  pos_file /tmp/fluentd.log.pos
  tag app.logs
  format json
</source>

<match app.logs>
  @type stdout
  # Or send to external service:
  # @type elasticsearch
  # @type cloudwatch
</match>
EOF

echo "✅ Docker logging configuration created!"
```

## Setup Commands

### `/vibe-setup-logging`
**What it does:** Creates basic logging configuration for your project

```bash
echo "📝 PROJECT LOGGING SETUP"
echo "======================="

# Detect project type
if [ -f "package.json" ]; then
    echo "📦 Node.js project detected"
    
    # Add winston if not present
    if ! grep -q "winston" package.json; then
        echo "Adding winston logging..."
        npm install winston
    fi
    
    # Create logging config
    mkdir -p config logs/{app,error,debug,security}
    
    cat > config/logger.js << 'EOF'
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error/error.log', 
      level: 'error',
      maxsize: 50 * 1024 * 1024,
      maxFiles: 5,
      tailable: true
    }),
    new winston.transports.File({ 
      filename: 'logs/app/combined.log',
      maxsize: 50 * 1024 * 1024,
      maxFiles: 10,
      tailable: true
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
EOF

elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
    echo "🐍 Python project detected"
    
    mkdir -p logs config
    
    cat > config/logging.py << 'EOF'
import logging
import logging.handlers
import os

def setup_logging():
    # Create logs directory
    os.makedirs('logs/app', exist_ok=True)
    os.makedirs('logs/error', exist_ok=True)
    
    # Configure logger
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    
    # File handler for all logs
    file_handler = logging.handlers.RotatingFileHandler(
        'logs/app/app.log',
        maxBytes=50*1024*1024,  # 50MB
        backupCount=10
    )
    
    # Error file handler
    error_handler = logging.handlers.RotatingFileHandler(
        'logs/error/error.log',
        maxBytes=50*1024*1024,
        backupCount=5
    )
    error_handler.setLevel(logging.ERROR)
    
    # Console handler
    console_handler = logging.StreamHandler()
    
    # Formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    file_handler.setFormatter(formatter)
    error_handler.setFormatter(formatter)
    console_handler.setFormatter(formatter)
    
    logger.addHandler(file_handler)
    logger.addHandler(error_handler)
    logger.addHandler(console_handler)
    
    return logger
EOF

else
    echo "📄 Generic project - creating basic structure"
    mkdir -p logs/{app,error,debug}
fi

# Create log management scripts
mkdir -p scripts

cat > scripts/view-logs.sh << 'EOF'
#!/bin/bash
echo "📋 Available logs:"
find logs -name "*.log" -type f | while read logfile; do
    size=$(du -h "$logfile" | cut -f1)
    echo "  $logfile ($size)"
done

echo ""
echo "Usage:"
echo "  tail -f logs/app/app.log           # Follow app logs"
echo "  grep ERROR logs/error/error.log    # Search error logs"
echo "  ./scripts/rotate-logs.sh           # Manual rotation"
EOF

cat > scripts/rotate-logs.sh << 'EOF'
#!/bin/bash
echo "🔄 Manual log rotation"

timestamp=$(date +%Y%m%d_%H%M%S)

find logs -name "*.log" -size +50M | while read logfile; do
    if [ -f "$logfile" ]; then
        rotated="${logfile%.log}.${timestamp}.log"
        mv "$logfile" "$rotated"
        touch "$logfile"
        gzip "$rotated"
        echo "✅ Rotated: $logfile → ${rotated}.gz"
    fi
done

# Clean old logs (keep last 30)
find logs -name "*.log.*.gz" -type f | sort -r | tail -n +31 | while read oldlog; do
    rm -f "$oldlog"
    echo "🗑️ Cleaned: $oldlog"
done
EOF

chmod +x scripts/*.sh

echo "✅ Logging setup complete!"
echo ""
echo "Available commands:"
echo "  ./scripts/view-logs.sh     # View available logs"
echo "  ./scripts/rotate-logs.sh   # Manual log rotation"
echo ""
echo "Next steps:"
echo "1. Set LOG_LEVEL environment variable"
echo "2. Run ./scripts/setup-logrotate.sh for automatic rotation"
echo "3. Configure external log aggregation if needed"
```

### `/vibe-setup-cloud-logging`
**What it does:** Helps configure cloud logging services

```bash
echo "☁️ CLOUD LOGGING SETUP"
echo "====================="

echo "Choose your cloud logging provider:"
echo "1. AWS CloudWatch"
echo "2. Google Cloud Logging"
echo "3. Azure Monitor"
echo "4. Datadog"
echo "5. Elasticsearch/ELK"

read -p "Enter choice (1-5): " choice

case $choice in
    1)
        echo "📦 AWS CloudWatch setup"
        
        # Create CloudWatch config
        cat > config/cloudwatch.js << 'EOF'
const winston = require('winston');
const CloudWatchTransport = require('winston-cloudwatch');

const cloudwatchConfig = {
  logGroupName: process.env.AWS_LOG_GROUP || 'vibe-coding-app',
  logStreamName: process.env.AWS_LOG_STREAM || 'app-logs',
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  messageFormatter: ({ level, message, additionalInfo }) => 
    `[${level}] : ${message} \nAdditional Info: ${JSON.stringify(additionalInfo)}`
};

// Add to your winston logger
// logger.add(new CloudWatchTransport(cloudwatchConfig));
EOF

        echo "✅ CloudWatch config created!"
        echo "Install: npm install winston-cloudwatch"
        echo "Set environment variables: AWS_LOG_GROUP, AWS_REGION"
        ;;
        
    2)
        echo "📦 Google Cloud Logging setup"
        
        cat > config/gcp-logging.js << 'EOF'
const winston = require('winston');
const {LoggingWinston} = require('@google-cloud/logging-winston');

const loggingWinston = new LoggingWinston({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  logName: 'vibe-coding-app'
});

// Add to your winston logger
// logger.add(loggingWinston);
EOF

        echo "✅ GCP Logging config created!"
        echo "Install: npm install @google-cloud/logging-winston"
        echo "Set: GOOGLE_CLOUD_PROJECT, GOOGLE_APPLICATION_CREDENTIALS"
        ;;
        
    *)
        echo "Creating generic cloud logging setup..."
        
        cat > config/external-logging.md << 'EOF'
# External Logging Setup

## Environment Variables
Set these based on your provider:

```bash
# Common variables
export LOG_LEVEL=info
export APP_NAME=vibe-coding-app
export ENVIRONMENT=production

# Provider-specific
export LOGGING_ENDPOINT=https://logs.provider.com/api
export LOGGING_API_KEY=your-api-key
export LOGGING_INDEX=app-logs
```

## HTTP Log Shipping
For HTTP-based log shipping:

```javascript
const winston = require('winston');
const Transport = require('winston-transport');

class HTTPTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.endpoint = opts.endpoint;
    this.apiKey = opts.apiKey;
  }

  log(info, callback) {
    // Ship logs via HTTP
    fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(info)
    });
    callback();
  }
}
```
EOF
        ;;
esac

echo "📋 Setup checklist:"
echo "□ Install required packages"
echo "□ Configure environment variables"
echo "□ Test log shipping"
echo "□ Set up log retention policies"
echo "□ Configure alerts and dashboards"
```

### `/vibe-setup-log-monitoring`
**What it does:** Creates basic log monitoring and alerting

```bash
echo "📊 LOG MONITORING SETUP"
echo "======================"

# Create log monitoring script
cat > scripts/log-monitor.sh << 'EOF'
#!/bin/bash
# Basic log monitoring script

LOG_DIR="logs"
ERROR_THRESHOLD=10
ALERT_EMAIL="${ALERT_EMAIL:-admin@example.com}"

check_error_rate() {
    # Count errors in last 10 minutes
    error_count=$(find "$LOG_DIR" -name "*.log" -exec grep -c "ERROR\|FATAL" {} + | awk '{sum+=$1} END {print sum+0}')
    
    if [ "$error_count" -gt "$ERROR_THRESHOLD" ]; then
        echo "🚨 High error rate detected: $error_count errors"
        
        # Create alert (customize based on your notification system)
        echo "High error rate in application logs: $error_count errors detected" | \
            mail -s "Log Alert: High Error Rate" "$ALERT_EMAIL" 2>/dev/null || \
            echo "Alert: Configure mail system for email notifications"
    else
        echo "✅ Error rate normal: $error_count errors"
    fi
}

check_disk_usage() {
    log_size=$(du -sm "$LOG_DIR" 2>/dev/null | cut -f1)
    if [ "$log_size" -gt 1000 ]; then  # 1GB
        echo "⚠️ Log directory size: ${log_size}MB"
        echo "Consider running log rotation"
    fi
}

# Run checks
check_error_rate
check_disk_usage
EOF

# Create cron setup script
cat > scripts/setup-log-monitoring.sh << 'EOF'
#!/bin/bash
echo "⏰ Setting up log monitoring cron job"

# Add to crontab (check every 5 minutes)
(crontab -l 2>/dev/null; echo "*/5 * * * * $(pwd)/scripts/log-monitor.sh") | crontab -

echo "✅ Log monitoring scheduled"
echo "View with: crontab -l"
echo "Remove with: crontab -r"
EOF

chmod +x scripts/log-monitor.sh scripts/setup-log-monitoring.sh

echo "✅ Log monitoring setup created!"
echo ""
echo "To activate:"
echo "1. Set ALERT_EMAIL environment variable"
echo "2. Run: ./scripts/setup-log-monitoring.sh"
echo "3. Test: ./scripts/log-monitor.sh"
```

## Available Setup Commands

```bash
# Core logging setup
/vibe-setup-logging          # Basic project logging configuration

# Cloud integration
/vibe-setup-cloud-logging    # Cloud service integration

# Monitoring and alerts
/vibe-setup-log-monitoring   # Basic monitoring and alerting

# Docker/containerized logging
/vibe-setup-docker-logging   # Container logging configuration
```

This agent provides practical, immediately implementable logging solutions using standard tools and services, while guiding users through external service integration when needed.