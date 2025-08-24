# Deployment Fix Guide

## Issues Identified and Fixed

### 1. Frontend API Configuration
- **Problem**: Missing backend URL for production deployment
- **Fix**: Updated `vercel.json` with proper environment variable

### 2. CORS Configuration
- **Problem**: Missing CORS_ORIGIN environment variable in Render
- **Fix**: Added to `render.yaml`

### 3. Cookie Authentication Issues
- **Problem**: Cross-site cookie handling for different devices
- **Fix**: Improved cookie configuration with proper sameSite settings

## Deployment Steps

### For Render (Backend)

1. **Update Environment Variables** in your Render dashboard:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CORS_ORIGIN=https://lead-management-system-orcin.vercel.app
   PORT=10000
   ```

2. **Redeploy** your backend service on Render after updating environment variables.

### For Vercel (Frontend)

1. **Check your Vercel deployment URL** and update if different:
   - If your actual Vercel URL is different from `https://lead-management-system-orcin.vercel.app`
   - Update the `CORS_ORIGIN` in Render environment variables
   - Update the `VITE_API_URL` in `vercel.json`

2. **Add Environment Variables** in Vercel dashboard:
   ```
   VITE_API_URL=https://lead-management-backend-latest.onrender.com/api
   ```

3. **Redeploy** your frontend on Vercel.

### Backend URL Verification

Your backend should be deployed at a URL like:
- `https://lead-management-backend-latest.onrender.com`
- or `https://your-app-name.onrender.com`

Make sure to update the `VITE_API_URL` in `vercel.json` with your actual Render backend URL.

## Testing

1. **Clear browser cache and cookies** on all devices
2. **Test from different devices/networks**
3. **Check browser developer tools** for:
   - Network errors
   - CORS errors
   - Cookie issues
   - Console errors

## Common Issues and Solutions

### Issue: "Network Error" on login
- **Solution**: Check if backend URL is accessible
- **Verify**: Backend is deployed and running on Render

### Issue: Login works but data doesn't load
- **Solution**: Check CORS configuration
- **Verify**: CORS_ORIGIN matches your Vercel deployment URL

### Issue: Authentication lost on page refresh
- **Solution**: Check cookie settings
- **Verify**: Cookies are being set with proper domain and sameSite settings

### Issue: Different behavior on different devices
- **Solution**: Ensure HTTPS is used for production
- **Verify**: Both frontend and backend are using HTTPS

## Manual Verification Steps

1. **Check Backend Health**:
   ```
   curl https://your-backend-url.onrender.com/api/health
   ```

2. **Check CORS Setup**:
   ```
   curl -H "Origin: https://your-frontend-url.vercel.app" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        https://your-backend-url.onrender.com/api/cors-test
   ```

3. **Browser Developer Tools**:
   - Open Network tab
   - Attempt login
   - Check for failed requests
   - Look for CORS errors in Console

## Updated Files

1. `render.yaml` - Added CORS_ORIGIN environment variable
2. `frontend/vercel.json` - Added VITE_API_URL environment variable
3. `backend/server.js` - Improved CORS handling
4. `backend/controllers/authController.js` - Enhanced cookie configuration
5. `frontend/src/services/api.js` - Better error handling and logging

## Next Steps

1. Deploy these changes to both platforms
2. Update environment variables as specified
3. Test from multiple devices
4. Monitor logs for any remaining issues

If issues persist, check the browser developer tools and backend logs for specific error messages.
