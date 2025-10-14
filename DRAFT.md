# TicketFlow: Event Management Application Features

This document outlines the core features and user flows of the TicketFlow application, a streamlined solution for event registration and participant management.

## 1. Core Concepts & User Roles

The application is designed around a clear separation of duties, managed through three distinct user roles:

-   **Super Admin:** Has complete control over the system. This role can manage users, view all data, configure settings, and perform all actions available to Admins. They are the only ones who can export registration data.
-   **Admin:** Manages the event operations. This role can view the dashboard, verify payments, assign tickets, and oversee the check-in process.
-   **Counter Staff (Randomly Role):** Handles on-site registrations. This role is primarily responsible for registering new participants who arrive without a ticket.

## 2. Feature-by-Feature Breakdown

### Registration Flow (Counter Staff)

-   **On-Site Registration:** A participant arrives at the event without a pre-registered ticket.
-   **Data Entry:** The Counter Staff uses the "New Registration" page to enter the participant's details (Name, Phone, Email, College, and Event Day).
-   **Pending Status:** Upon submission, a new registration record is created in the Firestore database with a `paymentStatus` of `pending`. No ticket is assigned at this stage.

### Payment Verification & Ticket Assignment (Admin / Super Admin)

-   **Pending Registrations List:** An Admin logs in and navigates to the "Registrations" page, where they can view a list of all participants with a `pending` payment status.
-   **Manual Payment Verification:** The Admin confirms that the participant has paid through an offline method (e.g., cash or card at the counter).
-   **Ticket Assignment:** The Admin uses the "Verify Payment & Assign Ticket" action for the corresponding registration. They enter the ID from a pre-printed physical ticket/QR code.
-   **Activation:** The system updates the registration record in Firestore, changing the `paymentStatus` to `success` and linking the unique `ticketId` to the participant. The ticket is now considered active and ready for check-in.

### Participant Check-In (QR Scan Simulation)

-   **Scanning at the Gate:** At the event entrance, staff use the "Check-In" page.
-   **ID Entry:** They enter the `ticketId` from the participant's physical ticket (simulating a QR code scan).
-   **System Verification:** The system performs a real-time check against the Firestore database to:
    1.  Confirm the `ticketId` exists and is valid.
    2.  Ensure `paymentStatus` is `success`.
    3.  Check if the ticket has already been `checkedIn`.
-   **Access Granted/Denied:**
    -   **Success:** If valid and not yet used, the participant's status is updated to `checkedIn = true` with a timestamp. The screen displays a success message.
    -   **Already Checked In:** If the ticket has already been used, the screen displays a warning message to prevent re-entry.
    -   **Invalid/Not Paid:** If the ticket is not found or payment is pending, an error message is shown, directing the participant to the registration counter.

### Dashboard & Analytics (Admin / Super Admin)

-   **Real-Time Statistics:** The main dashboard provides a live overview of key event metrics, fetched directly from Firestore:
    -   Total number of registered participants.
    -   A breakdown of Paid vs. Unpaid registrations.
    -   Total number of participants checked in.
    -   Counts of participants for Day 1 vs. Day 2.
-   **Visualizations:** A chart displays registration trends over time.
-   **Recent Activity:** A list of the most recent registrations is shown for quick reference.

### Data Export (Super Admin Only)

-   **Secure Access:** Only users with the Super Admin role can access the "Export Data" page.
-   **Format Selection:** The Super Admin can choose to export the complete list of participant registrations as either a **CSV** or an **Excel (.xlsx)** file.
-   **AI-Powered Conversion:** The system uses a Genkit AI flow to process and format the data, generating a downloadable file for reporting and analysis.
