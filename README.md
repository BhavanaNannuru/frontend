# Healthcare Appointment Booking System

A full-stack, cloud-native appointment booking platform designed for healthcare providers and patients. The system streamlines scheduling, medical record management, and notifications — reducing administrative overhead while improving the patient-doctor experience.

---

## Features

### Doctor / Provider
- Schedule view with daily, weekly, and monthly calendar options, filterable by appointment type and status.  
- Appointment control: confirm or reject requests with reasons; auto-rejection for requests made within 24 hours.  
- Dashboard insights: upcoming appointments, daily and monthly summaries, and workload analytics.  
- Medical records: upload, view, and manage patient files securely.  
- Notifications: daily morning schedule summary, status changes, and reminders (in-app and email).  

### Patient
- Search and book appointments with preferred doctors.  
- Access personal medical records uploaded by doctors.  
- Track appointments with real-time status updates (confirmed, pending, rejected, completed).  
- Receive notifications for confirmations, rejections with reasons, and reminders (24 hours before and on the day of the appointment).  
- Chatbot assistant for navigating the system and answering FAQs.  

---

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS (deployed via Azure Static Web Apps)  
- **Backend:** Node.js, Express API  
- **Database:** Azure SQL Database  
- **Storage:** Azure Blob Storage (for medical records)  
- **Notifications:** Azure Functions and Logic Apps (event-driven email triggers)  
- **CI/CD:** GitHub Actions (automated deployment)  

---

## Security Highlights

- Passwords hashed using bcrypt (10 salt rounds).  
- Role-based access control:
  - Doctors can only access their own patients’ medical records.  
  - Limited visibility into basic patient information outside their own records.  
- Future improvement: secure just-in-time SAS token generation for Blob Storage with limited expiry.  

---

## Dashboards

- **Doctor view:** appointments by day, week, or month.  
- **Patient view:** track appointment statuses (confirmed, pending, rejected, completed).  
- **Analytics:** appointment trends, monthly summaries, and workload statistics.  

---

## Roadmap

- Secure SAS token generation for medical record access.  
- Google/Outlook calendar integration.  
- Advanced analytics (e.g., no-show prediction, response time metrics).  
- Native mobile application for patients.  

---

## Impact

This system goes beyond basic CRUD operations by modeling real healthcare workflows:
- Saves time for doctors with daily schedule digests and automated reminders.  
- Reduces patient frustration through transparent appointment statuses and timely notifications.  
- Cloud-native design ensures scalability, resilience, and maintainability.
