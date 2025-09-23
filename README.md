# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Error Handling with Sentry

This project includes [Sentry](https://sentry.io/) for comprehensive error tracking and monitoring. Sentry is already configured and ready to use.

### Configuration

Sentry is initialized in `app/_layout.tsx` with the following features:

- **Error Tracking**: Automatically captures JavaScript errors and crashes
- **Session Replay**: Records user sessions for debugging (10% sample rate, 100% on errors)
- **User Feedback**: Allows users to submit feedback directly from the app
- **Performance Monitoring**: Tracks app performance metrics

### Basic Error Handling

#### Capturing Exceptions

```typescript
import * as Sentry from "@sentry/react-native";

// Capture a caught exception
try {
  // Some risky operation
  riskyFunction();
} catch (error) {
  Sentry.captureException(error);
}

// Capture a manual error
Sentry.captureException(new Error("Something went wrong"));
```

#### Capturing Messages

```typescript
// Log important events
Sentry.captureMessage("User completed onboarding", "info");

// Log warnings
Sentry.captureMessage("API response was slower than expected", "warning");
```

#### Adding Context

```typescript
// Add user context
Sentry.setUser({
  id: "123",
  email: "user@example.com",
  username: "johndoe",
});

// Add tags for filtering
Sentry.setTag("feature", "checkout");
Sentry.setTag("environment", "production");

// Add extra context
Sentry.setContext("checkout", {
  cartValue: 99.99,
  itemCount: 3,
  paymentMethod: "credit_card",
});
```

### Advanced Error Handling Patterns

#### React Error Boundaries

```typescript
import * as Sentry from "@sentry/react-native";

class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      scope.setTag("errorBoundary", true);
      scope.setContext("errorInfo", errorInfo);
      Sentry.captureException(error);
    });
  }
}
```

#### Async Error Handling

```typescript
// Wrap async functions
const safeAsyncFunction = Sentry.wrap(async () => {
  const response = await fetch("/api/data");
  return response.json();
});

// Or use withScope for more control
const fetchUserData = async (userId: string) => {
  return Sentry.withScope(async (scope) => {
    scope.setTag("operation", "fetchUserData");
    scope.setContext("userId", { userId });

    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      Sentry.captureException(error);
      throw error; // Re-throw if you want to handle it elsewhere
    }
  });
};
```

#### Network Error Handling

```typescript
// Global fetch wrapper
const originalFetch = global.fetch;
global.fetch = async (...args) => {
  try {
    const response = await originalFetch(...args);

    // Log slow requests
    if (response.status >= 400) {
      Sentry.addBreadcrumb({
        message: `HTTP ${response.status}`,
        category: "http",
        level: "warning",
        data: { url: args[0], status: response.status },
      });
    }

    return response;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
```

### Testing Error Handling

You can test Sentry integration by using the test button in your app:

```typescript
// Test button (already implemented in index.tsx)
<Button
  title='Test Sentry!'
  onPress={() => {
    Sentry.captureException(new Error('Test error from button'))
  }}
/>
```

### Best Practices

1. **Don't capture every error**: Only capture errors that are unexpected or need investigation
2. **Add context**: Include relevant user data, app state, and environment information
3. **Use appropriate severity levels**: `fatal`, `error`, `warning`, `info`, `debug`
4. **Filter sensitive data**: Be careful not to log passwords, tokens, or personal information
5. **Test in development**: Use different DSNs for development and production

### Sentry Dashboard

Visit your [Sentry dashboard](https://sentry.io/) to:

- View error reports and stack traces
- Monitor app performance
- Review session replays
- Manage alerts and notifications
- Analyze error trends and patterns

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
- [Sentry React Native documentation](https://docs.sentry.io/platforms/react-native/): Comprehensive guide to using Sentry with React Native.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
