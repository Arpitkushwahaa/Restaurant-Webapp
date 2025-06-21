# Deployment Guide for Restaurant Web App

This guide will walk you through deploying the Restaurant Web App with the backend on Render and the frontend on Vercel.

## Backend Deployment on Render

1. **Create a Render account**
   - Sign up at [render.com](https://render.com)
   - Connect your GitHub repository

2. **Create a new Web Service**
   - Click "New" and select "Web Service"
   - Select your repository
   - Configure the service:
     - Name: restaurant-webapp-backend
     - Root Directory: / (leave blank to use repository root)
     - Environment: Node
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`

3. **Set up environment variables**
   - In the Render dashboard, add the following environment variables:
     - `NODE_ENV`: production
     - `PORT`: 8080
     - `MONGODB_URI`: your MongoDB connection string
     - `JWT_SECRET`: your JWT secret
     - `CLOUDINARY_CLOUD_NAME`: your Cloudinary cloud name
     - `CLOUDINARY_API_KEY`: your Cloudinary API key
     - `CLOUDINARY_API_SECRET`: your Cloudinary API secret
     - Add any other environment variables your app needs

4. **Deploy the service**
   - Click "Create Web Service"
   - Render will automatically build and deploy your backend

## Frontend Deployment on Vercel

1. **Create a Vercel account**
   - Sign up at [vercel.com](https://vercel.com)
   - Connect your GitHub repository

2. **Create a new project**
   - Click "Add New" and select "Project"
   - Select your repository
   - Configure the project:
     - Framework Preset: Vite
     - Root Directory: client
     - Build Command: npm run build
     - Output Directory: dist

3. **Set up environment variables**
   - In the Vercel dashboard, add the following environment variables:
     - `VITE_API_URL`: https://restaurant-webapp-backend.onrender.com/api/v1

4. **Deploy the project**
   - Click "Deploy"
   - Vercel will automatically build and deploy your frontend

## Connecting Frontend and Backend

1. **Update CORS configuration**
   - The backend's CORS configuration has been updated to include your Vercel domain
   - If you use a different domain, update the `allowedOrigins` array in `server/index.ts`

2. **Update API URL**
   - The frontend uses an environment variable `VITE_API_URL` to connect to the backend
   - Create a `.env.production` file in the client directory with:
     ```
     VITE_API_URL=https://your-render-app-name.onrender.com/api/v1
     ```

3. **Test the connection**
   - After deployment, test the login and other API-dependent features
   - Check the browser console for any CORS errors

## Troubleshooting

- **CORS issues**: Make sure your Vercel domain is listed in the `allowedOrigins` array
- **Environment variables**: Verify all required environment variables are set in both Render and Vercel
- **Build failures**: Check the build logs for any errors
- **API connection issues**: Verify the API URL is correctly set in the frontend

## Maintenance

- Both Render and Vercel provide automatic deployments when you push to your repository
- Monitor your application's performance and logs in the Render and Vercel dashboards 