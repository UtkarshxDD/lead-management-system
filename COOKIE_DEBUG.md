# Cookie Debugging Guide

## Issue: Cookies Not Being Sent Back to Backend

From the logs, we can see that:
1. ✅ CORS is working correctly
2. ✅ Login is successful and cookies are being set
3. ❌ Cookies are not being received by the backend on subsequent requests

## Debugging Steps

### 1. Test Cookie Setting
Visit this URL in your browser to test if cookies are being set:
```
https://your-backend-url.onrender.com/api/cookie-test
```

### 2. Check Browser Developer Tools
1. Open Developer Tools (F12)
2. Go to Application/Storage tab
3. Look for Cookies
4. Check if cookies are being set for your backend domain

### 3. Test Login Flow
1. Open Developer Tools
2. Go to Network tab
3. Attempt to login
4. Check the response headers for `Set-Cookie`
5. Check subsequent requests to see if cookies are being sent

### 4. Manual Cookie Test
In browser console, test:
```javascript
// Test if cookies are accessible
document.cookie

// Test setting a cookie manually
document.cookie = "test=value; path=/; secure; samesite=none"
```

## Common Issues and Solutions

### Issue 1: SameSite Cookie Policy
**Problem**: Modern browsers block cross-site cookies with `sameSite: 'none'` unless `secure: true`

**Solution**: ✅ Already implemented in the code

### Issue 2: Domain Mismatch
**Problem**: Cookie domain doesn't match the request domain

**Solution**: ✅ Using relative domain (no domain specified)

### Issue 3: HTTPS Requirement
**Problem**: `sameSite: 'none'` requires HTTPS

**Solution**: ✅ Both frontend and backend are on HTTPS

### Issue 4: Browser Privacy Settings
**Problem**: Browser blocking third-party cookies

**Solution**: Check browser settings and try incognito mode

## Testing Commands

### Test Backend Health
```bash
curl https://your-backend-url.onrender.com/api/health
```

### Test Cookie Endpoint
```bash
curl -H "Origin: https://lead-management-system-orcin.vercel.app" \
     -H "Cookie: test=value" \
     https://your-backend-url.onrender.com/api/cookie-test
```

### Test Login Flow
```bash
# Login
curl -X POST https://your-backend-url.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -H "Origin: https://lead-management-system-orcin.vercel.app" \
     -d '{"email":"demo@leadmanagement.com","password":"demo123"}' \
     -c cookies.txt

# Test with saved cookies
curl -H "Origin: https://lead-management-system-orcin.vercel.app" \
     -b cookies.txt \
     https://your-backend-url.onrender.com/api/auth/me
```

## Next Steps

1. **Deploy the updated backend** with the new debugging endpoints
2. **Test the cookie-test endpoint** to see if cookies are being set
3. **Check browser developer tools** for cookie storage
4. **Monitor the logs** for the new debugging information
5. **Try the manual curl commands** to isolate the issue

## Expected Behavior

After login, you should see in the logs:
```
Setting cookie with options: { httpOnly: true, secure: true, sameSite: 'none', ... }
Token being set: eyJhbGciOiJIUzI1NiIs...
Set-Cookie header: token=eyJhbGciOiJIUzI1NiIs...; HttpOnly; Secure; SameSite=None; Path=/
```

And on subsequent requests:
```
Auth middleware - Cookies: { token: 'eyJhbGciOiJIUzI1NiIs...' }
```

If you're still not seeing cookies, the issue might be:
1. Browser privacy settings
2. Network/proxy interference
3. Domain configuration issues
