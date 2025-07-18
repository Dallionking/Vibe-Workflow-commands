---
description: Systematically retrofit API endpoints to modern standards
allowed-tools:
  - mcp__context7__resolve-library-id
  - mcp__context7__get-library-docs
  - mcp__perplexity-mcp__perplexity_search_web
  - mcp__perplexity-ask__perplexity_ask
  - Read
  - Write
  - Edit
  - MultiEdit
  - Bash
  - TodoWrite
  - Glob
  - Grep
  - LS
parameters:
  - endpoint-pattern
  - --rest-to-graphql
  - --add-versioning
  - --enhance-validation
  - --add-rate-limiting
  - --improve-errors
  - --add-documentation
  - --dry-run
---

# vibe-retrofit-api

Systematically retrofit API endpoints to modern standards

## Usage
`/vibe-retrofit-api <endpoint-pattern> [--rest-to-graphql] [--add-versioning] [--enhance-validation] [--add-rate-limiting] [--improve-errors] [--add-documentation] [--dry-run]`

# API Endpoint Orchestrator Agent
# Auto-generated for Node.js/Express backend

agent:
  name: "api_endpoint_orchestrator"
  version: "1.0.0"
  purpose: "Manage API endpoint creation, documentation, and testing"
  generated_from: "architecture_pattern"
  codebase_type: "express_rest_api"

metadata:
  description: |
    Orchestrates all aspects of API endpoint development including
    creation, validation, documentation, and testing.
  detected_patterns:
    framework: "express"
    database: "postgresql"
    orm: "sequelize|typeorm|prisma"
    authentication: "jwt"
    validation: "joi|yup|express-validator"
    documentation: "swagger|openapi"

tools_required:
  claude_code:
    - Read      # Read existing API files
    - Write     # Create new endpoint files
    - Edit      # Modify existing endpoints
    - MultiEdit # Update multiple files
    - Glob      # Find API patterns
    - TodoWrite # Track progress

configuration:
  api_structure:
    routes_location: "/routes"
    controllers_location: "/controllers"
    middlewares_location: "/middlewares"
    models_location: "/models"
    services_location: "/services"
  
  endpoint_patterns:
    naming_convention: "kebab-case"
    versioning: "url_path"  # /api/v1/
    response_format: "json"
    error_handling: "centralized"

capabilities:
  create_endpoint:
    description: "Generate new API endpoints with full stack"
    parameters:
      - name: "resource_name"
        type: "string"
        required: true
      - name: "methods"
        type: "array"
        values: ["GET", "POST", "PUT", "PATCH", "DELETE"]
        default: ["GET", "POST", "PUT", "DELETE"]
      - name: "auth_required"
        type: "boolean"
        default: true
      - name: "validation_schema"
        type: "object"
        required: false
    
    generates:
      route_file: |
        const express = require('express');
        const router = express.Router();
        const {{resource_name}}Controller = require('../controllers/{{resource_name}}Controller');
        const { authenticate } = require('../middlewares/auth');
        const { validate } = require('../middlewares/validation');
        const {{resource_name}}Validation = require('../validations/{{resource_name}}Validation');
        
        {{#each methods}}
        {{#if (eq this "GET")}}
        // Get all {{resource_name_plural}}
        router.get(
          '/',
          {{#if auth_required}}authenticate,{{/if}}
          {{resource_name}}Controller.getAll
        );
        
        // Get single {{resource_name}}
        router.get(
          '/:id',
          {{#if auth_required}}authenticate,{{/if}}
          validate({{resource_name}}Validation.getById),
          {{resource_name}}Controller.getById
        );
        {{/if}}
        
        {{#if (eq this "POST")}}
        // Create new {{resource_name}}
        router.post(
          '/',
          {{#if auth_required}}authenticate,{{/if}}
          validate({{resource_name}}Validation.create),
          {{resource_name}}Controller.create
        );
        {{/if}}
        
        {{#if (eq this "PUT")}}
        // Update {{resource_name}}
        router.put(
          '/:id',
          {{#if auth_required}}authenticate,{{/if}}
          validate({{resource_name}}Validation.update),
          {{resource_name}}Controller.update
        );
        {{/if}}
        
        {{#if (eq this "DELETE")}}
        // Delete {{resource_name}}
        router.delete(
          '/:id',
          {{#if auth_required}}authenticate,{{/if}}
          validate({{resource_name}}Validation.delete),
          {{resource_name}}Controller.delete
        );
        {{/if}}
        {{/each}}
        
        module.exports = router;
      
      controller_file: |
        const {{resource_name}}Service = require('../services/{{resource_name}}Service');
        const { asyncHandler } = require('../utils/asyncHandler');
        const { ApiResponse } = require('../utils/ApiResponse');
        
        class {{resource_name}}Controller {
          {{#each methods}}
          {{#if (eq this "GET")}}
          getAll = asyncHandler(async (req, res) => {
            const { page = 1, limit = 10, ...filters } = req.query;
            const result = await {{resource_name}}Service.findAll({
              page: parseInt(page),
              limit: parseInt(limit),
              filters
            });
            
            return ApiResponse.success(res, {
              message: '{{resource_name_plural}} retrieved successfully',
              data: result.data,
              pagination: result.pagination
            });
          });
          
          getById = asyncHandler(async (req, res) => {
            const { id } = req.params;
            const {{resource_name_lower}} = await {{resource_name}}Service.findById(id);
            
            if (!{{resource_name_lower}}) {
              return ApiResponse.notFound(res, '{{resource_name}} not found');
            }
            
            return ApiResponse.success(res, {
              message: '{{resource_name}} retrieved successfully',
              data: {{resource_name_lower}}
            });
          });
          {{/if}}
          
          {{#if (eq this "POST")}}
          create = asyncHandler(async (req, res) => {
            const {{resource_name_lower}} = await {{resource_name}}Service.create({
              ...req.body,
              createdBy: req.user?.id
            });
            
            return ApiResponse.created(res, {
              message: '{{resource_name}} created successfully',
              data: {{resource_name_lower}}
            });
          });
          {{/if}}
          
          {{#if (eq this "PUT")}}
          update = asyncHandler(async (req, res) => {
            const { id } = req.params;
            const {{resource_name_lower}} = await {{resource_name}}Service.update(id, {
              ...req.body,
              updatedBy: req.user?.id
            });
            
            if (!{{resource_name_lower}}) {
              return ApiResponse.notFound(res, '{{resource_name}} not found');
            }
            
            return ApiResponse.success(res, {
              message: '{{resource_name}} updated successfully',
              data: {{resource_name_lower}}
            });
          });
          {{/if}}
          
          {{#if (eq this "DELETE")}}
          delete = asyncHandler(async (req, res) => {
            const { id } = req.params;
            const deleted = await {{resource_name}}Service.delete(id);
            
            if (!deleted) {
              return ApiResponse.notFound(res, '{{resource_name}} not found');
            }
            
            return ApiResponse.success(res, {
              message: '{{resource_name}} deleted successfully'
            });
          });
          {{/if}}
          {{/each}}
        }
        
        module.exports = new {{resource_name}}Controller();
      
      service_file: |
        const { {{resource_name}} } = require('../models');
        const { Op } = require('sequelize');
        
        class {{resource_name}}Service {
          async findAll({ page, limit, filters }) {
            const offset = (page - 1) * limit;
            const where = this.buildWhereClause(filters);
            
            const { count, rows } = await {{resource_name}}.findAndCountAll({
              where,
              limit,
              offset,
              order: [['createdAt', 'DESC']]
            });
            
            return {
              data: rows,
              pagination: {
                total: count,
                page,
                limit,
                pages: Math.ceil(count / limit)
              }
            };
          }
          
          async findById(id) {
            return await {{resource_name}}.findByPk(id);
          }
          
          async create(data) {
            return await {{resource_name}}.create(data);
          }
          
          async update(id, data) {
            const {{resource_name_lower}} = await this.findById(id);
            if (!{{resource_name_lower}}) return null;
            
            return await {{resource_name_lower}}.update(data);
          }
          
          async delete(id) {
            const {{resource_name_lower}} = await this.findById(id);
            if (!{{resource_name_lower}}) return false;
            
            await {{resource_name_lower}}.destroy();
            return true;
          }
          
          buildWhereClause(filters) {
            const where = {};
            // Add filter logic based on your needs
            return where;
          }
        }
        
        module.exports = new {{resource_name}}Service();

  add_validation:
    description: "Add validation schemas to endpoints"
    validation_libraries:
      joi_schema: |
        const Joi = require('joi');
        
        const {{resource_name}}Validation = {
          create: Joi.object({
            body: Joi.object({
              // Define your fields here
              name: Joi.string().required().min(3).max(255),
              description: Joi.string().optional(),
              // Add more fields as needed
            })
          }),
          
          update: Joi.object({
            params: Joi.object({
              id: Joi.string().uuid().required()
            }),
            body: Joi.object({
              name: Joi.string().optional().min(3).max(255),
              description: Joi.string().optional(),
              // Add more fields as needed
            })
          }),
          
          getById: Joi.object({
            params: Joi.object({
              id: Joi.string().uuid().required()
            })
          }),
          
          delete: Joi.object({
            params: Joi.object({
              id: Joi.string().uuid().required()
            })
          })
        };
        
        module.exports = {{resource_name}}Validation;

  generate_tests:
    description: "Create comprehensive API tests"
    test_template: |
      const request = require('supertest');
      const app = require('../app');
      const { {{resource_name}} } = require('../models');
      const { generateToken } = require('../utils/auth');
      
      describe('{{resource_name}} API Endpoints', () => {
        let authToken;
        let test{{resource_name}};
        
        beforeAll(async () => {
          // Setup test data and auth
          authToken = generateToken({ id: 'test-user-id' });
        });
        
        afterEach(async () => {
          // Cleanup
          await {{resource_name}}.destroy({ where: {} });
        });
        
        describe('GET /api/v1/{{resource_name_plural}}', () => {
          it('should return all {{resource_name_plural}}', async () => {
            // Create test data
            await {{resource_name}}.bulkCreate([
              { name: 'Test 1' },
              { name: 'Test 2' }
            ]);
            
            const response = await request(app)
              .get('/api/v1/{{resource_name_plural}}')
              .set('Authorization', `Bearer ${authToken}`);
            
            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.pagination).toBeDefined();
          });
          
          it('should support pagination', async () => {
            // Test pagination logic
          });
        });
        
        describe('POST /api/v1/{{resource_name_plural}}', () => {
          it('should create a new {{resource_name}}', async () => {
            const newData = {
              name: 'New {{resource_name}}',
              description: 'Test description'
            };
            
            const response = await request(app)
              .post('/api/v1/{{resource_name_plural}}')
              .set('Authorization', `Bearer ${authToken}`)
              .send(newData);
            
            expect(response.status).toBe(201);
            expect(response.body.data.name).toBe(newData.name);
          });
          
          it('should validate required fields', async () => {
            const response = await request(app)
              .post('/api/v1/{{resource_name_plural}}')
              .set('Authorization', `Bearer ${authToken}`)
              .send({});
            
            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
          });
        });
        
        // Add more test cases for PUT, DELETE, etc.
      });

  generate_documentation:
    description: "Create OpenAPI/Swagger documentation"
    swagger_template: |
      /**
       * @swagger
       * components:
       *   schemas:
       *     {{resource_name}}:
       *       type: object
       *       required:
       *         - name
       *       properties:
       *         id:
       *           type: string
       *           format: uuid
       *         name:
       *           type: string
       *         description:
       *           type: string
       *         createdAt:
       *           type: string
       *           format: date-time
       *         updatedAt:
       *           type: string
       *           format: date-time
       */
      
      /**
       * @swagger
       * /api/v1/{{resource_name_plural}}:
       *   get:
       *     summary: Get all {{resource_name_plural}}
       *     tags: [{{resource_name}}]
       *     security:
       *       - bearerAuth: []
       *     parameters:
       *       - in: query
       *         name: page
       *         schema:
       *           type: integer
       *           default: 1
       *       - in: query
       *         name: limit
       *         schema:
       *           type: integer
       *           default: 10
       *     responses:
       *       200:
       *         description: List of {{resource_name_plural}}
       *       401:
       *         description: Unauthorized
       */

prompts:
  system: |
    You are an API Endpoint Orchestrator for a Node.js/Express application.
    
    Project Context:
    - Framework: Express.js
    - Database: {{database_type}}
    - ORM: {{orm_type}}
    - Authentication: {{auth_type}}
    - API Style: RESTful
    
    Follow these principles:
    1. Use consistent naming conventions
    2. Implement proper error handling
    3. Include validation for all inputs
    4. Follow RESTful best practices
    5. Include comprehensive tests
    6. Generate OpenAPI documentation
    7. Implement proper security measures
    
  endpoint_creation: |
    Create a new API endpoint for "{{resource_name}}" with:
    - Methods: {{methods}}
    - Authentication: {{auth_required}}
    - Validation: {{validation_requirements}}
    
    Ensure the endpoint:
    - Follows RESTful conventions
    - Has proper error handling
    - Includes input validation
    - Is well-documented
    - Has comprehensive tests

interactions:
  depends_on:
    - "database_migration_agent"
    - "model_generator_agent"
    - "auth_middleware_agent"
    
  triggers:
    - command: "/api create"
    - event: "new_endpoint_needed"
    - file_change: "models/*.js"
    
  provides_to:
    - "api_documentation_agent"
    - "postman_collection_agent"
    - "client_sdk_generator"

validation:
  endpoint_checks:
    - Unique route paths
    - Valid HTTP methods
    - Proper middleware order
    - Authentication setup
    - Error handling present
    
  integration_tests:
    - All CRUD operations work
    - Authentication enforced
    - Validation functioning
    - Error responses correct

phase_awareness:
  route_files: "phase_4_interface"
  controllers: "phase_4_interface"
  services: "phase_3_core_logic"
  models: "phase_3_core_logic"
  tests: "phase_6_testing"