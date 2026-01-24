import swaggerJsdoc from 'swagger-jsdoc';
import config from './env.config.js';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Prompt Pal Backend API',
    version: '1.0.0',
    description: 'Backend API for Prompt Pal',
    contact: {
      name: 'CCTechEt',
    },
  },
  servers: [
    {
      url: 'http://localhost:8000/api/v1',
      description: 'Local development server',
    },
    {
      url: 'https://prompt-pal-tyyl.onrender.com/api/v1',
      description: 'Production server (Render)',
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'jwt',
        description: 'JWT token stored in httpOnly cookie',
      },
    },
  },
  security: [],
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and authorization endpoints',
    },
    {
      name: 'Users',
      description: 'User profile management',
    },
    {
      name: 'Admin',
      description: 'Admin endpoints for platform management',
    },
    {
      name: 'Analytics',
      description: 'Analytics and statistics endpoints for platform insights',
    },
    {
      name: 'Prompts',
      description: 'Prompt creation, management, and discovery endpoints',
    },
    {
      name: 'Comments',
      description: 'Comment management endpoints',
    },
    {
      name: 'Prompt Optimizer',
      description: 'Prompt optimization endpoints for improving prompt quality',
    },
    {
      name: 'Blogs',
      description: 'Blog post creation, management, and discovery endpoints',
    },
    {
      name: 'Admin - Blogs',
      description: 'Admin endpoints for blog moderation and management',
    },
  ],
};

const options: swaggerJsdoc.Options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
