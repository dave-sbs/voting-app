## 7-Eleven Administrative App

While I'm cleaning up my design system, I still want to share my experiments and learning process with the designs. https://www.figma.com/design/FRmtJPPoAjxVDT2UkECtIR/Taye-App-Design?node-id=0-1&p=f&t=p2updOWNKp6zJrub-0

A modern, mobile-first voting application built with React Native and Expo, designed to streamline the voting process with secure authentication, real-time updates, and payment tracking capabilities. What started as a simple voting app has evolved into a product that automates a lot more of the tedious tasks the board members used to carry out. 

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

## Project Dependencies

Key dependencies include:
- expo
- react-native
- @react-navigation
- @supabase/supabase-js
- nativewind
- typescript
