# RetailGenie Backend API

This is the backend API for RetailGenie, a retail management platform.

## Requirements

- Node.js 18.0.0 or higher
- MongoDB

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with your configuration values (see `example.env` for the required variables)

## Development

Start the development server with:

```
npm run dev
```

## Production Deployment

1. Set up your environment variables (see `example.env`)
2. Start the production server with:

```
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Brand Owner
- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product

### Brand Manager
- `GET /api/team` - Get team information
- `POST /api/team` - Create team members

### Buyer
- `GET /api/meetings` - Get all meetings
- `POST /api/meetings` - Create a meeting

## Deployment Instructions

### Render.com Deployment

#### Option 1: Using Render Dashboard
1. Create an account on [Render.com](https://render.com)
2. Create a new Web Service:
   - Connect your GitLab repository
   - Select the branch to deploy
   - Set the build command: `npm install`
   - Set the start command: `npm start`
3. Configure Environment Variables:
   - Add all variables from your `example.env` file:
     - `PORT` (Render will set this automatically)
     - `NODE_ENV=production`
     - `MONGO_URI=your_mongo_connection_string`
     - `JWT_SECRET=your_jwt_secret_key`
     - Add any other required variables
4. Deploy your application

#### Option 2: Using Blueprint (render.yaml)
This project includes a `render.yaml` blueprint file for one-click deployment:

1. Fork/clone this repository to your GitLab account
2. On Render.com, go to "Blueprints" in your dashboard
3. Connect your GitLab account and select this repository
4. Click "Apply Blueprint"
5. Fill in the required environment secrets (MONGO_URI, JWT_SECRET)
6. Deploy the blueprint

### GitLab CI/CD Integration

This project includes a `.gitlab-ci.yml` file for continuous integration with GitLab:

1. Configure GitLab CI/CD variables in your GitLab repository settings:
   - Go to Settings > CI/CD > Variables
   - Add the required environment variables:
     - `MONGO_URI`
     - `JWT_SECRET`
     - `JWT_EXPIRE`
2. Commits to main/master branch will trigger the CI/CD pipeline
3. The pipeline will:
   - Build the application
   - Verify deployment readiness
   - Prepare for deployment to Render.com

## Deployment Platforms

### Primary: Render.com
Render is our recommended deployment platform because:
- Simple Git-based deployments
- Automatic HTTPS/SSL
- Free tier available for testing
- CI/CD integration with GitLab
- Easy environment variable management

### Alternative Platforms
The application can also be deployed to:
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Railway 