# Deployment Guide

This guide will help you deploy your Lead Management System to Vercel (frontend) and Render (backend).

## Prerequisites

1. GitHub account
2. Vercel account (free)
3. Render account (free)
4. MongoDB Atlas account (free tier available)

## Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Push your code to GitHub:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `lead-management-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong secret key (generate one)
   - `CORS_ORIGIN`: Your Vercel frontend URL (will be added after frontend deployment)

6. Click "Create Web Service"
7. Wait for deployment to complete
8. Copy the Render URL (e.g., `https://your-app.onrender.com`)

## Step 3: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:
   - `VITE_API_URL`: Your Render backend URL + `/api` (e.g., `https://your-app.onrender.com/api`)

6. Click "Deploy"
7. Wait for deployment to complete
8. Copy the Vercel URL (e.g., `https://your-app.vercel.app`)

## Step 4: Update CORS Origin

1. Go back to your Render dashboard
2. Update the `CORS_ORIGIN` environment variable with your Vercel URL
3. Redeploy the backend service

## Step 5: Test Your Deployment

1. Visit your Vercel frontend URL
2. Try to register/login
3. Test all CRUD operations for leads

## Environment Variables Reference

### Backend (Render)
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure `CORS_ORIGIN` is set correctly in Render
2. **API Connection**: Verify `VITE_API_URL` is correct in Vercel
3. **MongoDB Connection**: Ensure your MongoDB Atlas cluster is accessible
4. **Build Failures**: Check the build logs in Vercel/Render

### Useful Commands

```bash
# Check deployment status
curl https://your-backend.onrender.com/api/health

# Test API endpoints
curl -X POST https://your-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'
```

## Security Notes

1. **JWT Secret**: Use a strong, random secret key
2. **MongoDB**: Use connection string with username/password
3. **Environment Variables**: Never commit `.env` files to Git
4. **CORS**: Only allow your frontend domain

## Cost Optimization

- **Vercel**: Free tier includes 100GB bandwidth/month
- **Render**: Free tier includes 750 hours/month
- **MongoDB Atlas**: Free tier includes 512MB storage

## Monitoring

- **Vercel**: Built-in analytics and performance monitoring
- **Render**: Built-in logs and uptime monitoring
- **MongoDB Atlas**: Built-in monitoring and alerts
