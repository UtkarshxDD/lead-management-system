# Cookie Testing Guide

## Current Status
✅ Login working - cookies are being set  
✅ CORS working - requests are allowed  
❌ Cookies not being received on subsequent requests  

## Test Steps

### 1. Test Cookie Setting (Manual)
Visit this URL in your browser:
```
https://lead-management-system-h78s.onrender.com/api/cookie-test
```

Expected response:
```json
{
  "status": "Cookie test",
  "receivedCookies": {},
  "cookieHeader": null,
  "setCookieHeader": "test-cookie=test-value; HttpOnly; Secure; SameSite=None; Path=/"
}
```

### 2. Test Login Flow (Manual)
1. Open browser developer tools
2. Go to Network tab
3. Login with demo credentials
4. Check response headers for `Set-Cookie`
5. Check subsequent requests for `Cookie` header

### 3. Browser Cookie Check
1. Open Developer Tools (F12)
2. Go to Application/Storage tab
3. Look for Cookies under your backend domain
4. Check if cookies are stored

### 4. Manual Curl Test
```bash
# Test login and cookie setting
curl -X POST https://lead-management-system-h78s.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://lead-management-system-orcin.vercel.app" \
  -d '{"email":"demo@leadmanagement.com","password":"demo123"}' \
  -c cookies.txt \
  -v

# Test with saved cookies
curl -H "Origin: https://lead-management-system-orcin.vercel.app" \
  -b cookies.txt \
  https://lead-management-system-h78s.onrender.com/api/auth/me \
  -v
```

## Possible Issues

### Issue 1: Browser Privacy Settings
**Test**: Try incognito/private browsing mode
**Solution**: Check browser settings for third-party cookies

### Issue 2: SameSite Policy
**Test**: Check if cookies have `SameSite=None; Secure`
**Solution**: ✅ Already implemented

### Issue 3: Domain Mismatch
**Test**: Check cookie domain vs request domain
**Solution**: ✅ Using relative domain

### Issue 4: HTTPS Requirement
**Test**: Verify both sites use HTTPS
**Solution**: ✅ Both sites are HTTPS

## Debugging Commands

### Check Backend Health
```bash
curl https://lead-management-system-h78s.onrender.com/api/health
```

### Test CORS
```bash
curl -H "Origin: https://lead-management-system-orcin.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  https://lead-management-system-h78s.onrender.com/api/cors-test
```

### Test Cookie Endpoint
```bash
curl -H "Origin: https://lead-management-system-orcin.vercel.app" \
  https://lead-management-system-h78s.onrender.com/api/cookie-test
```

## Expected Logs

After successful login:
```
Setting cookie with options: { httpOnly: true, secure: true, sameSite: 'none', ... }
Token being set: eyJhbGciOiJIUzI1NiIs...
Set-Cookie header: token=...; HttpOnly; Secure; SameSite=None; Path=/
```

On subsequent requests:
```
Auth middleware - Cookies: { token: 'eyJhbGciOiJIUzI1NiIs...' }
```

## Next Steps

1. **Deploy the updated backend** with domain fix
2. **Test the cookie-test endpoint** manually
3. **Check browser developer tools** for cookie storage
4. **Try the curl commands** to isolate the issue
5. **Test in incognito mode** to rule out browser settings

## Alternative Solutions

If cookies still don't work, we can implement:
1. **Token in localStorage** (less secure but more reliable)
2. **Authorization header** with token from localStorage
3. **Session-based authentication** instead of JWT cookies

Let me know the results of these tests!
