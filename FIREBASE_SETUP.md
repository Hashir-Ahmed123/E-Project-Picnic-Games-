# Firebase Authentication Setup Guide

This guide will help you set up Firebase authentication for the Picnic Games project.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter your project name (e.g., "picnic-games")
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication Methods

1. In the Firebase Console, go to **Authentication** in the left sidebar
2. Click **Get started** on the Authentication page
3. Enable **Email/Password** authentication:
   - Click "Email/Password" in the Sign-in method list
   - Enable it and click "Save"
4. Enable **Google** authentication:
   - Click "Google" in the Sign-in method list
   - Enable it
   - Enter your project's support email
   - Click "Save"

## Step 3: Get Firebase Configuration

1. In the Firebase Console, click the **Settings icon** (gear) next to "Project Overview"
2. Select **Project settings**
3. In the "Your apps" section, click the **Web app** icon (</>)
4. Copy the Firebase configuration object
5. Update the `firebaseConfig` object in `firebase-config.js` with your actual config

Example:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyYourActualApiKeyHere",
  authDomain: "picnic-games.firebaseapp.com",
  projectId: "picnic-games",
  storageBucket: "picnic-games.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Step 4: Configure Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** > **Credentials**
4. Find the OAuth 2.0 client ID created by Firebase
5. Click on it to view and edit settings
6. Add your development URL to "Authorized JavaScript origins":
   - `http://localhost:3000` (if using local server)
   - `http://127.0.0.1:5500` (if using Live Server)
   - Your actual domain when deployed

## Step 5: Test the Authentication

1. Open the project in your browser
2. Navigate to `signup.html`
3. Try creating an account with email/password
4. Try signing in with Google
5. Check the `dashboard.html` page to see user information

## Features Implemented

### Authentication Methods
- **Email/Password**: Traditional signup and login
- **Google Sign-In**: One-click authentication with Google account

### User Management
- **User Dashboard**: View profile information and account stats
- **Authentication State**: Automatic redirects based on login status
- **Logout**: Secure sign-out functionality

### Security Features
- **Password Validation**: Minimum 6 characters required
- **Error Handling**: User-friendly error messages
- **Session Management**: Persistent login state

## File Structure

```
firebase-config.js    # Firebase configuration and initialization
auth.js              # Authentication logic and event handlers
dashboard.html       # User dashboard page
dashboard.js         # Dashboard functionality
login.html          # Updated with Firebase auth
signup.html         # Updated with Firebase auth
```

## Troubleshooting

### Common Issues

1. **"Firebase not initialized" error**
   - Make sure `firebase-config.js` is loaded before `auth.js`
   - Check that your Firebase config is correct

2. **Google Sign-In not working**
   - Verify OAuth consent screen is configured
   - Check authorized JavaScript origins
   - Make sure pop-ups are not blocked

3. **Email/Password not working**
   - Ensure Email/Password auth is enabled in Firebase Console
   - Check for typos in email/password

4. **Redirect loops**
   - Check authentication state in `auth.js`
   - Verify redirect URLs are correct

### Debug Mode

To enable debug mode, add this to your HTML:
```javascript
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
```

## Next Steps

1. **Add User Profiles**: Extend the dashboard to allow profile editing
2. **Booking System**: Connect authentication to the booking system
3. **User Preferences**: Save user preferences to Firestore
4. **Admin Panel**: Create admin interface for managing users

## Security Considerations

- Always validate input on both client and server
- Use HTTPS in production
- Implement proper session management
- Consider adding two-factor authentication
- Regular security audits of Firebase settings

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify Firebase project settings
3. Review Firebase documentation
4. Test in different browsers

For more information, visit the [Firebase Authentication documentation](https://firebase.google.com/docs/auth).
