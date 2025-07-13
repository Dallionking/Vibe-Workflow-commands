#!/usr/bin/env node

/**
 * Phase 2 Validation Script
 * Validates Phase 2: Retrofit Context Enhancement implementation
 */

const fs = require('fs').promises;
const path = require('path');

class Phase2Validator {
    constructor() {
        this.validationResults = [];
        this.errors = [];
        this.warnings = [];
    }

    async validatePhase2() {
        console.log('🔍 Validating Phase 2: Retrofit Context Enhancement');
        console.log('═'.repeat(60));

        try {
            // Validate file structure
            await this.validateFileStructure();
            
            // Validate implementation completeness
            await this.validateImplementation();
            
            // Validate integration points
            await this.validateIntegration();
            
            // Generate validation report
            this.generateReport();
            
        } catch (error) {
            this.errors.push(`Validation failed: ${error.message}`);
            this.generateReport();
        }
    }

    async validateFileStructure() {
        console.log('\n📁 Validating File Structure...');
        
        const requiredStructure = {
            'retrofit/patterns/detector.ts': 'Pattern Detection Engine',
            'retrofit/patterns/types.ts': 'Pattern Type Definitions', 
            'retrofit/parsers/types.ts': 'Parser Interface Definitions',
            'retrofit/parsers/javascript.ts': 'JavaScript/TypeScript Parser',
            'retrofit/context-layers.ts': 'Four-tier Context System',
            'retrofit/analyzer/enhanced-analyzer.ts': 'Enhanced Codebase Analyzer',
            'retrofit/agents/adaptive-generator.ts': 'Adaptive Agent Generation',
            'retrofit/compatibility/assurance-system.ts': 'Compatibility Assurance',
            'retrofit/commands/enhanced-commands.ts': 'Enhanced Command Suite',
            'retrofit/incremental/incremental-system.ts': 'Incremental Retrofit System',
            'retrofit/testing/comprehensive-tests.ts': 'Comprehensive Test Suite'
        };

        for (const [filePath, description] of Object.entries(requiredStructure)) {
            try {
                await fs.access(filePath);
                this.validationResults.push({
                    type: 'file',
                    name: description,
                    status: 'pass',
                    details: `✅ ${filePath} exists`
                });
                console.log(`  ✅ ${description}`);
            } catch (error) {
                this.errors.push(`Missing file: ${filePath} (${description})`);
                this.validationResults.push({
                    type: 'file',
                    name: description,
                    status: 'fail',
                    details: `❌ ${filePath} missing`
                });
                console.log(`  ❌ ${description} - File missing`);
            }
        }
    }

    async validateImplementation() {
        console.log('\n🔍 Validating Implementation Completeness...');
        
        const implementations = [
            {
                name: 'Pattern Recognition Engine',
                file: 'retrofit/patterns/detector.ts',
                requiredMethods: ['detectPatterns', 'learnPatterns'],
                requiredClasses: ['PatternDetector']
            },
            {
                name: 'Context Layers System', 
                file: 'retrofit/context-layers.ts',
                requiredInterfaces: ['RetrofitContext', 'DiscoveryContext', 'PreservationContext', 'ImprovementContext', 'EvolutionContext'],
                requiredClasses: ['RetrofitContextBuilder']
            },
            {
                name: 'Enhanced Analyzer',
                file: 'retrofit/analyzer/enhanced-analyzer.ts',
                requiredMethods: ['analyzePatterns', 'extractConventions', 'detectAntiPatterns', 'quantifyTechnicalDebt', 'generateContextProfile'],
                requiredClasses: ['EnhancedCodebaseAnalyzer']
            },
            {
                name: 'Adaptive Agent Generator',
                file: 'retrofit/agents/adaptive-generator.ts',
                requiredMethods: ['generateFromPatterns', 'customizeForProject', 'validateConsistency', 'evolveWithFeedback'],
                requiredClasses: ['AdaptiveAgentGenerator']
            },
            {
                name: 'Compatibility System',
                file: 'retrofit/compatibility/assurance-system.ts',
                requiredMethods: ['checkVersions', 'validateDependencies', 'verifyAPIContracts', 'preventRegressions', 'generateMigrationPath'],
                requiredClasses: ['CompatibilityAssuranceSystem']
            }
        ];

        for (const impl of implementations) {
            await this.validateImplementationFile(impl);
        }
    }

    async validateImplementationFile(impl) {
        try {
            const content = await fs.readFile(impl.file, 'utf8');
            
            // Check for required classes
            if (impl.requiredClasses) {
                for (const className of impl.requiredClasses) {
                    if (content.includes(`class ${className}`)) {
                        console.log(`  ✅ ${impl.name}: ${className} class implemented`);
                    } else {
                        this.errors.push(`${impl.name}: Missing class ${className}`);
                        console.log(`  ❌ ${impl.name}: Missing class ${className}`);
                    }
                }
            }

            // Check for required methods
            if (impl.requiredMethods) {
                for (const method of impl.requiredMethods) {
                    if (content.includes(`${method}(`)) {
                        console.log(`  ✅ ${impl.name}: ${method} method implemented`);
                    } else {
                        this.warnings.push(`${impl.name}: Method ${method} might be missing or incomplete`);
                        console.log(`  ⚠️ ${impl.name}: Method ${method} might be missing`);
                    }
                }
            }

            // Check for required interfaces
            if (impl.requiredInterfaces) {
                for (const interfaceName of impl.requiredInterfaces) {
                    if (content.includes(`interface ${interfaceName}`)) {
                        console.log(`  ✅ ${impl.name}: ${interfaceName} interface defined`);
                    } else {
                        this.errors.push(`${impl.name}: Missing interface ${interfaceName}`);
                        console.log(`  ❌ ${impl.name}: Missing interface ${interfaceName}`);
                    }
                }
            }

            this.validationResults.push({
                type: 'implementation',
                name: impl.name,
                status: 'pass',
                details: 'Implementation validated'
            });

        } catch (error) {
            this.errors.push(`Failed to validate ${impl.name}: ${error.message}`);
            this.validationResults.push({
                type: 'implementation',
                name: impl.name,
                status: 'fail',
                details: error.message
            });
        }
    }

    async validateIntegration() {
        console.log('\n🔗 Validating Integration Points...');
        
        const integrationChecks = [
            {
                name: 'TypeScript Definitions',
                check: async () => {
                    // Check for proper TypeScript interfaces and exports
                    const files = [
                        'retrofit/patterns/types.ts',
                        'retrofit/parsers/types.ts'
                    ];
                    
                    for (const file of files) {
                        const content = await fs.readFile(file, 'utf8');
                        if (!content.includes('export interface') && !content.includes('export enum')) {
                            throw new Error(`${file} missing proper exports`);
                        }
                    }
                    return true;
                }
            },
            {
                name: 'Command Integration',
                check: async () => {
                    const commandFile = 'retrofit/commands/enhanced-commands.ts';
                    const content = await fs.readFile(commandFile, 'utf8');
                    
                    const requiredCommands = [
                        'vibeRetrofitExisting',
                        'vibeAnalyzeCodebase', 
                        'vibeRetrofitContext'
                    ];
                    
                    for (const command of requiredCommands) {
                        if (!content.includes(command)) {
                            throw new Error(`Missing command: ${command}`);
                        }
                    }
                    return true;
                }
            },
            {
                name: 'Test Coverage',
                check: async () => {
                    const testFile = 'retrofit/testing/comprehensive-tests.ts';
                    const content = await fs.readFile(testFile, 'utf8');
                    
                    const requiredTestSuites = [
                        'Pattern Detection Accuracy',
                        'Convention Detection Validation',
                        'Agent Generation Quality',
                        'Compatibility Assurance',
                        'Performance Benchmarks'
                    ];
                    
                    for (const suite of requiredTestSuites) {
                        if (!content.includes(suite)) {
                            throw new Error(`Missing test suite: ${suite}`);
                        }
                    }
                    return true;
                }
            }
        ];

        for (const check of integrationChecks) {
            try {
                await check.check();
                console.log(`  ✅ ${check.name}`);
                this.validationResults.push({
                    type: 'integration',
                    name: check.name,
                    status: 'pass',
                    details: 'Integration point validated'
                });
            } catch (error) {
                console.log(`  ❌ ${check.name}: ${error.message}`);
                this.errors.push(`Integration check failed - ${check.name}: ${error.message}`);
                this.validationResults.push({
                    type: 'integration',
                    name: check.name,
                    status: 'fail',
                    details: error.message
                });
            }
        }
    }

    generateReport() {
        console.log('\n📊 Validation Report');
        console.log('═'.repeat(60));

        const passed = this.validationResults.filter(r => r.status === 'pass').length;
        const failed = this.validationResults.filter(r => r.status === 'fail').length;
        const total = this.validationResults.length;

        console.log(`\n✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`⚠️ Warnings: ${this.warnings.length}`);
        console.log(`📊 Success Rate: ${Math.round((passed / total) * 100)}%`);

        if (this.errors.length > 0) {
            console.log('\n❌ Critical Issues:');
            this.errors.forEach(error => console.log(`  • ${error}`));
        }

        if (this.warnings.length > 0) {
            console.log('\n⚠️ Warnings:');
            this.warnings.forEach(warning => console.log(`  • ${warning}`));
        }

        // Phase 2 completion assessment
        const isComplete = this.errors.length === 0;
        const completionPercentage = Math.round((passed / total) * 100);

        console.log('\n🎯 Phase 2 Completion Assessment');
        console.log('─'.repeat(40));
        
        if (isComplete && completionPercentage >= 95) {
            console.log('🟢 Phase 2: COMPLETE ✅');
            console.log('   All core requirements implemented');
            console.log('   Ready for integration and testing');
        } else if (completionPercentage >= 80) {
            console.log('🟡 Phase 2: MOSTLY COMPLETE ⚠️');
            console.log('   Core functionality implemented');
            console.log('   Minor issues to address');
        } else {
            console.log('🔴 Phase 2: INCOMPLETE ❌');
            console.log('   Major implementation gaps');
            console.log('   Requires significant work');
        }

        console.log(`\n📈 Implementation Progress: ${completionPercentage}%`);
        
        if (this.warnings.length === 0 && this.errors.length === 0) {
            console.log('\n🚀 Ready for Phase 3: Advanced Context Features');
        }

        return {
            complete: isComplete,
            percentage: completionPercentage,
            passed,
            failed,
            warnings: this.warnings.length,
            errors: this.errors.length
        };
    }
}

// Run validation if called directly
if (require.main === module) {
    const validator = new Phase2Validator();
    validator.validatePhase2().catch(console.error);
}

module.exports = Phase2Validator;