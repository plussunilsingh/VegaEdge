# UI Logging Standards - VegaEdge

> **Mirrors Backend Logging Standards** - See backend `docs/log_standards.md`

---

## Console Logging Pattern

### Structure

```typescript
logger.error({
  message: "Brief description",
  code: ErrorCodes.VEGA_XXX_NNN,
  where: "Component.method:line",
  action: "What to do next",
  error: actualError
});
```

---

## Emoji Taxonomy (Same as Backend)

| Emoji | Meaning | Usage |
|-------|---------|-------|
| 🚀 | App Start | App initialization |
| 🛑 | App Stop | App shutdown |
| ✅ | Success | Successful operations |
| ❌ | Error | General errors |
| ⚠️ | Warning | Non-critical warnings |
| 🔐 | Auth | Authentication events |
| 🔌 | API | API calls |
| 🌐 | Network | Network requests |
| 📋 | Validation | Form validation |
| 👤 | User | User actions |

---

## Error Codes (Matches Backend)

```typescript
ErrorCodes.VEGA_AUTH_001  // Login failed
ErrorCodes.VEGA_AUTH_002  // Session expired
ErrorCodes.VEGA_API_001   // API timeout
ErrorCodes.VEGA_API_002   // Connection error
ErrorCodes.VEGA_VAL_001   // Validation failed
```

---

## Examples

### Authentication Error
```typescript
logger.error({
  message: "Login failed",
  code: ErrorCodes.VEGA_AUTH_001,
  where: "AuthContext.login:289",
  action: "Check credentials or backend status",
  error
});
```

**Console Output**:
```
❌ [ERROR] Login failed
🔢 ERROR_CODE: VEGA-AUTH-001
📍 WHERE: AuthContext.login:289
❌ WHAT: Invalid email or password
🔧 ACTION: Check credentials or backend status
📜 TRACE: (stack trace in DEV mode)
```

---

## Browser DevTools Pattern

### Color Coding

- **Green**: Success, app start
- **Yellow**: Warnings, retries
- **Red**: Errors, failures

### Grouping

Logs are grouped using `console.group()` for better readability:

```
▼ ❌ [ERROR] API request failed
  🔢 ERROR_CODE: VEGA-API-002
  📍 WHERE: api.get:/market/history
  ❌ WHAT: Network error
  🔧 ACTION: Check backend connectivity
  📜 TRACE: Error: fetch failed...
```

---

## Production Considerations

### DEV vs PROD

```typescript
if (import.meta.env.DEV) {
  // Show stack traces
  console.log("📜 TRACE:", error.stack);
} else {
  // Production - no stack traces
  // Send to monitoring service instead
}
```

### External Monitoring

Integrate with services like:
- Sentry (error tracking
)
- LogRocket (session replay)
- DataDog (APM)

---

## Consistency with Backend

| Feature | Backend | Frontend |
|---------|---------|----------|
| Emoji list | `LogEmojis` | `LogEmojis` |
| Error codes | `ErrorCodeTaxonomy` | `ErrorCodes` |
| Log format | Structured | Structured |
| Documentation | `log_standards.md` | This file |

---

**Keep UI and Backend logs identical in structure for unified monitoring!**
