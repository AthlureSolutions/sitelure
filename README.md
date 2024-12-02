# SiteLure

A modern website builder that allows users to create and deploy professional websites with ease. Built with React, Node.js, Astro, and Prisma.

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- Netlify account (for deployments)
- npm (for package management)

## Environment Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/sitelure.git
cd sitelure
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a copy of `.env.example` in `packages/backend` and rename it to `.env`:

```bash
cd packages/backend
cp .env.example .env
```

Update the `.env` file with your own values:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A secure random string for JWT encryption
- `NETLIFY_API_TOKEN`: Your Netlify personal access token

4. Set up the database:

```bash
cd packages/backend
npm prisma generate
npm prisma migrate dev
```

## Security Notes

- Never commit your `.env` file
- Use strong, unique values for JWT_SECRET
- Keep your Netlify API token secure
- Use environment-specific database credentials
- Follow security best practices for production deployments

## Running the Application

1. Start the development servers:

```bash
# From the root directory
npm dev
```

This will start:
- Frontend at http://localhost:3000
- Backend at http://localhost:4000
- Astro template at http://localhost:4321

## Project Structure

```
sitelure/
├── packages/
│   ├── frontend/          # React frontend
│   ├── backend/           # Node.js backend
│   └── astro-template/    # Astro website template
```

## Features

- User authentication
- Website builder with live preview
- Custom template system
- Automatic deployment to Netlify
- SEO optimization
- Responsive design

## Development Workflow

1. Create a new branch for your feature:

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit them:

```bash
git add .
git commit -m "Description of your changes"
```

3. Push your changes and create a pull request:

```bash
git push origin feature/your-feature-name
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check your database connection string
   - Ensure database exists and user has proper permissions

2. **Build Errors**
   - Clear turbo cache: `rm -rf .turbo`
   - Reinstall dependencies: `npm install`

3. **Deployment Issues**
   - Verify your Netlify token has correct permissions
   - Check Netlify site settings

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 