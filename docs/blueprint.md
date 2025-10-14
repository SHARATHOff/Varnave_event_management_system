# **App Name**: TicketFlow

## Core Features:

- Registration Form: Allow 'Randomly' role to register participant details (name, phone, email, college, event day) and store in Firestore with 'pending' status.
- Admin Dashboard: Display a list of pending registrations to 'Admin' and 'Super Admin' roles, allowing them to verify payments and assign pre-printed ticket IDs from the 'tickets' collection. Then sends data to firestore
- QR Code Scanner: Scan QR codes at the entrance to validate ticket IDs and payment status. Update 'checkedIn' status in Firestore and display appropriate messages ('Already Used', 'Valid Ticket').
- Dashboard Statistics: Display key statistics such as total registered users, paid vs unpaid, day 1 vs day 2 participants, and checked-in vs not checked-in on the Super Admin dashboard.
- Data Export: Allow 'Super Admin' to export registration data as CSV/Excel for further analysis and reporting. Use a tool to confirm proper schema is applied.
- Role-Based Access Control: Implement role-based access control using Firebase Auth to restrict access to different features based on user roles ('superAdmin', 'admin', 'randomly').

## Style Guidelines:

- Primary color: Deep Indigo (#4B0082) to convey professionalism and trustworthiness.
- Background color: Very Light Grey (#F5F5F5), near-white to provide a clean and modern backdrop. This keeps the focus on the ticket information and reduces visual distraction.
- Accent color: Electric Purple (#BF00FF) to highlight key actions, CTAs, and important information.  Provides a noticeable contrast without being jarring.
- Headline font: 'Space Grotesk' (sans-serif) for headlines and shorter text sections. Body font: 'Inter' (sans-serif) for longer sections of text.
- Use a consistent set of icons from a library like FontAwesome or Material Icons, styled in a simple, line-art style with the primary color.
- Use a grid-based layout to maintain a clean and organized interface. Employ white space effectively to prevent the interface from feeling cluttered.
- Incorporate subtle transitions and animations to provide visual feedback on user interactions. Avoid overly distracting or unnecessary animations.