# fxpro - Image Sharing Platform

A professional image sharing platform with user authentication and Instagram-style interface. Upload, manage, and share images with a sleek, modern UI.

## Features

- User authentication (registration and login)
- Secure image upload and storage
- Instagram-style grid gallery view
- Image lightbox viewer with navigation
- User session management
- SQLite database for data persistence
- Dockerized deployment
- Responsive design

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Authentication**: bcryptjs, express-session
- **File Upload**: Multer
- **Frontend**: Vanilla JavaScript, HTML, CSS
- **Containerization**: Docker, Docker Compose

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Docker and Docker Compose (for containerized deployment)

## Installation

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd image-uploader
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

### Docker Deployment

#### Using Docker Compose (Recommended)

1. Start the application:
```bash
npm run docker:compose:up
```

2. View logs:
```bash
npm run docker:compose:logs
```

3. Stop the application:
```bash
npm run docker:compose:down
```

#### Using Docker Directly

1. Build the Docker image:
```bash
npm run docker:build
```

2. Run the container:
```bash
npm run docker:run
```

## Environment Variables

You can configure the following environment variables:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)
- `SESSION_SECRET` - Secret key for session management (change in production!)

For Docker Compose, create a `.env` file:
```env
SESSION_SECRET=your-secure-secret-key-here
```

## Project Structure

```
image-uploader/
├── src/
│   ├── server.js       # Main Express server
│   ├── auth.js         # Authentication logic
│   ├── database.js     # SQLite database setup
│   └── upload.js       # Image upload handling
├── public/
│   ├── login.html      # Login/registration page
│   └── dashboard.html  # Main dashboard with image gallery
├── uploads/            # Uploaded images storage
├── database/           # SQLite database files
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose configuration
└── package.json        # Project dependencies
```

## API Endpoints

### Authentication

- `POST /api/register` - Register a new user
- `POST /api/login` - Login with existing credentials
- `POST /api/logout` - Logout current user
- `GET /api/user` - Get current user session info

### Images

- `POST /api/upload` - Upload a new image (requires authentication)
- `GET /api/images` - Get all images for current user (requires authentication)

### Development/Debug

- `GET /api/database/users` - View all users (requires authentication)
- `GET /api/database/images` - View all images (requires authentication)

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Upload Images**: Click the upload area or drag and drop images
3. **View Gallery**: Browse your uploaded images in an Instagram-style grid
4. **Image Viewer**: Click any image to open the lightbox viewer with navigation

## Security Notes

- Passwords are hashed using bcryptjs before storage
- Sessions are managed securely with express-session
- File uploads are validated and stored securely
- Docker container runs as non-root user
- **Important**: Change the session secret in production!

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run build` - Install production dependencies
- `npm test` - Run tests (currently placeholder)
- `npm run production` - Start server in production mode
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run Docker container
- `npm run docker:compose:up` - Start with Docker Compose
- `npm run docker:compose:down` - Stop Docker Compose
- `npm run docker:compose:logs` - View Docker Compose logs

## Development

To contribute or modify:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Health Check

The application includes health check endpoints:
- Endpoint: `/api/user`
- Docker health check runs every 30 seconds
- Retries 3 times before marking as unhealthy

## Data Persistence

When using Docker Compose, data is persisted in named volumes:
- `app_data` - SQLite database files
- `app_uploads` - Uploaded images

## License

ISC

## Support

For issues or questions, please open an issue in the repository.
