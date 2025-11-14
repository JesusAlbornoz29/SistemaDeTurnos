# **App Name**: CitaPresto

## Core Features:

- Appointment Number Generation: Generates a unique, sequential appointment number for each patient visit, resetting daily to avoid excessively large numbers. Daily limits prevent number overflow. This process involves tracking the last generated number and updating this value in a 'other' database to maintain continuity.
- Service Selection: Allows patients to select the type of service they need (e.g., general check-up, specialist consultation).
- Number Display: Displays the generated appointment number prominently to the patient.
- Admin Interface: Provides an administrative interface to manage service types and view the current appointment number sequence.
- Calling Queue: A feature that uses AI to analyze wait times, and automatically predict calling order to minimize wait times while maintaining fairness. The LLM is a tool for analyzing past wait times and reordering.

## Style Guidelines:

- Primary color: Soft blue (#64B5F6) to evoke calmness and trust.
- Background color: Very light blue (#E3F2FD) for a clean and professional feel.
- Accent color: Muted green (#81C784) for positive feedback and confirmations.
- Font pairing: 'Inter' (sans-serif) for both headlines and body text, providing a modern and readable experience.
- Use simple, clear icons to represent different services and actions.
- A clean, responsive layout that adapts to different screen sizes, ensuring usability on both desktop and mobile devices.
- Subtle transitions and animations to provide feedback and enhance the user experience, without being distracting.