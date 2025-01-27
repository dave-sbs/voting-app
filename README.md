# Voting Project

A modern, mobile-first voting application built with React Native and Expo, designed to streamline the voting process with secure authentication, real-time updates, and payment tracking capabilities.

## Features

- Secure user authentication
- Real-time voting system
- Payment tracking and management
- Mobile-responsive design
- Cross-platform compatibility (iOS, Android)
- Signature capture functionality
- Offline data persistence

## Tech Stack

- **Frontend Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: React Hooks & Context
- **Database**: Supabase
- **Authentication**: Expo Auth Session
- **Styling**: NativeWind (TailwindCSS for React Native)
- **Testing**: Jest
- **Type Safety**: TypeScript

## Project Structure

```
voting-project/
├── app/                    # Main application screens and navigation
│   └── (tabs)/            # Tab-based navigation screens
├── components/            # Reusable UI components
├── constants/             # App-wide constants and configurations
├── hooks/                 # Custom React hooks
├── scripts/              # Utility scripts and data
├── services/             # API and external service integrations
├── server/               # Backend server configuration
├── tests/                # Test suites
└── assets/               # Static assets (images, fonts, etc.)
```

## Getting Started

1. **Prerequisites**
   - Node.js (v14 or higher)
   - npm or yarn
   - Expo CLI
   - iOS Simulator or Android Emulator (for mobile development)

2. **Installation**
   ```bash
   # Clone the repository
   git clone [repository-url]

   # Install dependencies
   npm install

   # Start the development server
   npm start
   ```

3. **Environment Setup**
   - Create a `.env` file in the root directory
   - Configure necessary environment variables

## Running the App

- **iOS**: `npm run ios`
- **Android**: `npm run android`
- **Web**: `npm run web`

## Testing

Run the test suite:
```bash
npm test
```

## Project Dependencies

Key dependencies include:
- expo
- react-native
- @react-navigation
- @supabase/supabase-js
- nativewind
- typescript

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
