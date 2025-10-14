# 🎫 Varnave - Event Management System

A comprehensive Next.js-based event management system built with Firebase, featuring role-based access control, QR code scanning, and real-time analytics.

## 🌟 Features

### Core Functionality
- **📝 Registration System**: Public registration form for event participants
- **👥 Role-Based Access Control**: Three-tier access system (Super Admin, Admin, Randomly)
- **📊 Admin Dashboard**: Real-time analytics and registration management
- **📱 QR Code Scanner**: Ticket validation and check-in system
- **🍽️ Food Check-in**: Separate food service tracking
- **📈 Analytics Dashboard**: Comprehensive statistics and reporting
- **📤 Data Export**: CSV/Excel export functionality for Super Admins
- **🎨 Modern UI**: Clean, responsive design with Tailwind CSS

### User Roles
- **Super Admin**: Full system access, data export, user management
- **Admin**: Registration verification, payment confirmation, ticket assignment
- **Randomly**: Registration creation and basic access

## 🚀 Tech Stack

- **Frontend**: Next.js 15.3.3, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Firebase (Firestore, Authentication)
- **AI Integration**: Google Genkit for AI-powered features
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- Firebase project with Firestore enabled
- Google Cloud Console access for AI features

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Event_Mangement_system_varnave.git
   cd Event_Mangement_system_varnave
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Firebase Configuration**
   - Set up Firestore database
   - Configure Authentication (Email/Password)
   - Deploy Firestore security rules
   - Create initial admin users

## 🏃‍♂️ Running the Application

### Development Mode
```bash
# Start the Next.js development server
npm run dev

# Start AI development server (optional)
npm run genkit:dev
```

The application will be available at `http://localhost:9002`

### Production Build
```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── (app)/             # Protected routes
│   │   ├── dashboard/     # Admin dashboard
│   │   ├── register/      # Registration management
│   │   ├── registrations/ # Registration list
│   │   ├── check-in/      # QR code scanner
│   │   ├── food-check-in/ # Food service check-in
│   │   ├── export/        # Data export
│   │   ├── users/         # User management
│   │   └── certificates/  # Certificate generation
│   ├── api/               # API routes
│   ├── event-signup/      # Public registration
│   └── login/             # Authentication
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── dashboard/        # Dashboard components
│   ├── registrations/    # Registration components
│   └── layout/           # Layout components
├── lib/                  # Utilities and configurations
│   ├── firebase.ts       # Firebase configuration
│   ├── types.ts          # TypeScript definitions
│   └── utils.ts          # Helper functions
├── hooks/                # Custom React hooks
└── ai/                   # AI integration (Genkit)
```

## 🎨 Design System

### Color Palette
- **Primary**: Deep Indigo (#4B0082) - Professional and trustworthy
- **Background**: Very Light Grey (#F5F5F5) - Clean and modern
- **Accent**: Electric Purple (#BF00FF) - Highlights and CTAs

### Typography
- **Headlines**: Space Grotesk (sans-serif)
- **Body Text**: Inter (sans-serif)

### UI Principles
- Grid-based layout for organization
- Consistent white space usage
- Subtle transitions and animations
- Mobile-first responsive design

## 🔐 Security Features

- **Firestore Security Rules**: Role-based data access control
- **Authentication**: Firebase Auth with email/password
- **Input Validation**: Zod schema validation
- **CSRF Protection**: Built-in Next.js security features

## 📊 Database Schema

### Collections
- **users**: User profiles and roles
- **registrations**: Event participant data
- **tickets**: Pre-printed ticket management

### Key Fields
- Registration status tracking (pending/success)
- Check-in timestamps
- Payment verification
- Event day assignment

## 🚀 Deployment

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
firebase deploy
```

### Environment Variables
Ensure all required environment variables are set in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in `/docs`

## 🔄 Version History

- **v0.1.0**: Initial release with core functionality
- Basic registration and admin dashboard
- QR code scanning implementation
- Role-based access control

---

**Built with ❤️ for efficient event management**