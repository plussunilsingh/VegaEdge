# VegaEdge (UI) - AI/LLM Development Instructions

> **Master Instruction File for AI/LLM Code Assistance on Frontend**
>
> This document serves as the primary context for any AI, LLM, or automated code assistant working on the VegaEdge React application.

---

## 📋 Application Overview

**VegaEdge** is the frontend UI for Vega Market Edge - a real-time options trading analytics platform.

### Technology Stack

```typescript
React 18.x          // UI Library
TypeScript 5.x      // Type Safety
Vite 5.x            // Build Tool
TailwindCSS 3.x     // Styling
React Query         // Server State Management
React Router 6.x    // Routing
Recharts           // Financial Charting
Sonner             // Toast Notifications
```

---

## 🏗️ Architecture Principles

### SOLID Principles (Mandatory)

1. **Single Responsibility**: Each component has ONE purpose
   - ✅ `AuthContext` - Manages authentication state only
   - ✅ `logger.ts` - Handles logging only
   - ❌ Don't create God Components

2. **Open/Closed**: Extend behavior without modifying existing code
   - Use composition over modification
   - Example: Add new error codes to `ErrorCodes` enum, don't change existing ones

3. **Dependency Inversion**: Depend on abstractions
   - Components receive props/context, not hardcoded values
   - Use React Context for shared state

### DRY Principle

- **NO code duplication**
- Extract common logic into hooks (`use*.ts`)
- Share utilities in `lib/` folder
- Reuse components from `components/`

---

## 📁 Project Structure

```
VegaEdge/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ProtectedRoute.tsx
│   │   ├── SessionExpiredModal.tsx
│   │   └── ...
│   ├── contexts/          # React Context providers
│   │   └── AuthContext.tsx
│   ├── lib/              # Utilities & helpers
│   │   ├── logger.ts     # Centralized logging
│   │   ├── api.ts        # API client
│   │   └── ...
│   ├── pages/            # Route-level components
│   ├── config.ts         # App configuration
│   └── main.tsx          # App entry point
├── docs/
│   └── ai_instruction/   # AI/LLM instructions (YOU ARE HERE)
└── public/              # Static assets
```

---

## 🎨 Logging Standards

### Consistent Pattern (Mirrors Backend)

**EVERY log must follow this structure:**

```typescript
logger.error({
  message: "Brief error description",
  code: ErrorCodes.VEGA_AUTH_001,
  where: "ComponentName.methodName:lineNumber",
  action: "What user should do next",
  error: actualError,
});
```

### Emoji Usage

**Use the SAME emojis as backend** - see `lib/logger.ts`:

```typescript
export const LogEmojis = {
  APP_START: "🚀",
  APP_STOP: "🛑",
  SUCCESS: "✅",
  ERROR: "❌",
  WARNING: "⚠️",
  AUTH: "🔐",
  API: "🔌",
  CACHE: "🗄️",
  VALIDATION: "📋",
  // ... (complete list in logger.ts)
};
```

### Error Codes

**Mirror backend taxonomy exactly**:

```typescript
export enum ErrorCodes {
  // Auth errors
  VEGA_AUTH_001 = "VEGA-AUTH-001", // Login failed
  VEGA_AUTH_002 = "VEGA-AUTH-002", // Session expired
  VEGA_AUTH_003 = "VEGA-AUTH-003", // Invalid stored user

  // API errors
  VEGA_API_001 = "VEGA-API-001", // API timeout
  VEGA_API_002 = "VEGA-API-002", // Connection error

  // ... (complete list in logger.ts)
}
```

---

## ✅ Code Standards

### TypeScript Requirements

1. **Strict Type Safety**

   ```typescript
   // ✅ GOOD
   interface User {
     id: number;
     email: string;
     name: string;
   }

   function processUser(user: User): void {
     // ...
   }

   // ❌ BAD
   function processUser(user: any) {
     // ...
   }
   ```

2. **No `any` Type** - Use proper types or `unknown`

3. **Export Interfaces** - Share types across files

### React Best Practices

1. **Functional Components Only**

   ```typescript
   // ✅ GOOD
   export const MyComponent: React.FC<Props> = ({ prop1 }) => {
     return <div>{prop1}</div>;
   };

   // ❌ BAD - No class components
   class MyComponent extends React.Component { }
   ```

2. **Use Hooks Properly**
   - `useState` for local state
   - `useContext` for shared state
   - `useEffect` for side effects (cleanup required!)
   - `useMemo` / `useCallback` for optimization ONLY when needed

3. **Structured Error Handling**
   ```typescript
   try {
     await apiCall();
   } catch (error) {
     logger.error({
       message: "API call failed",
       code: ErrorCodes.VEGA_API_002,
       where: "MyComponent.handleSubmit:45",
       action: "Check  network connection or retry",
       error,
     });
   }
   ```

---

## 🔒 Authentication Pattern

### AuthContext Usage

**Every protected page must use**:

```typescript
import { useAuth } from "@/contexts/AuthContext";

export const MyPage = () => {
  const { user, status } = useAuth();

  if (status === AuthStatus.LOADING) {
    return <div>Loading...</div>;
  }

  return <div>Welcome {user?.name}</div>;
};
```

### Protected Routes

```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

## 🌐 API Integration

### Pattern: Centralized API Client

```typescript
// lib/api.ts
export const api = {
  get: async <T>(url: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      logger.error({
        message: "API request failed",
        code: ErrorCodes.VEGA_API_002,
        where: `api.get:${url}`,
        action: "Check backend logs or network",
        error: await response.text(),
      });
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },
};
```

---

## 🎨 Styling Guidelines

### TailwindCSS Conventions

1. **Use Semantic Class Names**

   ```typescript
   // ✅ GOOD
   <button className="btn-primary">Submit</button>

   // Define in index.css:
   @layer components {
     .btn-primary {
       @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded;
     }
   }
   ```

2. **Responsive Design**
   - Mobile-first approach
   - Use `sm:`, `md:`, `lg:` breakpoints
   - Test on all screen sizes

3. **Dark Mode Support**
   - Use `dark:` variants
   - Store preference in localStorage

---

## 🧪 Testing Requirements

### Unit Tests (Vitest)

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Test Coverage

- **Minimum**: 70% coverage
- **Target**: 85% coverage
- Run: `npm run test:coverage`

---

## 📊 Performance Optimization

### Bundle Size

- **Target**: < 500KB gzipped
- Use code splitting: `React.lazy()` for routes
- Tree-shake unused libraries

### Rendering Performance

```typescript
// ✅ GOOD - Memoize expensive computations
const processedData = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

// ❌ BAD - Recalculates every render
const processedData = expensiveCalculation(data);
```

---

## 🚀 Deployment

### Build Process

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Environment Variables

```env
VITE_API_BASE_URL=https://api.vegaedge.com
VITE_APP_NAME=VegaEdge
```

**Access in code**:

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## 🔗 Backend Integration

### Matching Patterns

| Backend             | Frontend           | Purpose             |
| ------------------- | ------------------ | ------------------- |
| `LogEmojis`         | `LogEmojis`        | Same emoji taxonomy |
| `ErrorCodeTaxonomy` | `ErrorCodes`       | Same error codes    |
| Structured logging  | Structured logging | Same log format     |

**Example - Auth Error in Both**:

**Backend**:

```python
logger.error(
    f"{LogEmojis.AUTH} AUTH_EXPIRED | VEGA-AUTH-002 | "
    f"Where: AuthContext.login:289"
)
```

**Frontend**:

```typescript
logger.error({
  message: "Login failed",
  code: ErrorCodes.VEGA_AUTH_002,
  where: "AuthContext.login:289",
  action: "Re-login required",
});
```

---

## 📝 Documentation

### Component Documentation

```typescript
/**
 * MyComponent - Brief description
 *
 * @param {Props} props - Component props
 * @param {string} props.title - The title to display
 * @returns {JSX.Element} Rendered component
 *
 * @example
 * <MyComponent title="Hello World" />
 */
export const MyComponent: React.FC<Props> = ({ title }) => {
  return <h1>{title}</h1>;
};
```

---

## ⚠️ Common Pitfalls

### 1. State Updates in Loops

```typescript
// ❌ BAD
items.forEach((item) => {
  setCount(count + 1); // Only updates once!
});

// ✅ GOOD
setCount((prev) => prev + items.length);
```

### 2. Missing useEffect Dependencies

```typescript
// ❌ BAD
useEffect(() => {
  fetchData(userId); // userId not in deps!
}, []);

// ✅ GOOD
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

### 3. Memory Leaks

```typescript
// ✅ GOOD - Always cleanup
useEffect(() => {
  const timer = setInterval(() => {
    // ...
  }, 1000);

  return () => clearInterval(timer); // Cleanup!
}, []);
```

---

## 🔄 State Management

### When to Use What

| State Type               | Solution    | Example        |
| ------------------------ | ----------- | -------------- |
| Local (one component)    | `useState`  | Form input     |
| Shared (few components)  | Props       | Parent → Child |
| Global (many components) | Context     | Auth, Theme    |
| Server data              | React Query | API responses  |

---

## 📚 Resources

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

---

## ✅ Pre-Commit Checklist

Before committing:

- [ ] TypeScript compiles (`npm run build`)
- [ ] No console.errors/warnings
- [ ] Used structured logging (not `console.log`)
- [ ] Added tests for new features
- [ ] Followed naming conventions
- [ ] Updated documentation if needed

---

## 🎯 Quick Decision Guide

**Where should this code go?**

| Code Type        | Location      | Example                     |
| ---------------- | ------------- | --------------------------- |
| Reusable UI      | `components/` | Button, Card, Modal         |
| Page/Route       | `pages/`      | Dashboard, Login, Settings  |
| Business logic   | `lib/`        | API client, data processing |
| Type definitions | `types/`      | User, MarketData interfaces |
| Shared state     | `contexts/`   | AuthContext, ThemeContext   |

---

**Remember**: This UI mirrors the backend architecture. Consistency between frontend and backend is critical for maintainability over decades.

🚀 **Happy Coding!**
