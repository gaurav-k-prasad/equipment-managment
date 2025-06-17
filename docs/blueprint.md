# **App Name**: EquipTrack

## Core Features:

- User Authentication: Login and authentication using Email/Password and Google OAuth via Firebase Auth with role-based access (Admin vs. Regular User). Protected routes.
- Equipment Dashboard: Dashboard displaying equipment in a table with sorting and filtering by Category, Status, and Warranty Expiry.
- Equipment Management: Functionality to add, edit, and delete equipment entries from the dashboard.
- Shipping Tracking: Shipping tracking using UI to input/display courier tracking status, allowing users to monitor the shipment progress of equipment.
- Admin Panel: An admin panel with options to toggle custom columns and perform bulk actions such as exporting CSV and batch updates.
- AI-powered data verification: An AI-powered tool which detects anomalies or unexpected data patterns in the equipment data, suggesting possible explanations or errors. For example, this tool might cross-reference data from different tables and highlight data discrepancies such as incorrectly entered serial numbers.

## Style Guidelines:

- Primary color: Vibrant blue (#29ABE2) to convey trust and reliability in equipment management.
- Background color: Light gray (#F0F2F5) for a clean, uncluttered interface that ensures readability and focus.
- Accent color: Yellow (#FFC107) to highlight important actions and notifications, drawing attention without being intrusive.
- Headline font: 'Space Grotesk' (sans-serif) for headlines and short amounts of body text. Body font: 'Inter' (sans-serif) for body text.
- Use simple, consistent icons from a library like FontAwesome or Material Design to represent equipment categories, statuses, and actions.
- Maintain a clean, minimalist layout similar to the Vercel Dashboard, with a focus on mobile-first responsiveness.
- Implement subtle animations, such as loading skeletons for asynchronous data and smooth transitions between pages, to enhance the user experience.