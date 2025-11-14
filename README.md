# NexLearn: Online Exam Platform

A responsive online exam platform built with Next.js (App Router), Redux Toolkit, and Tailwind CSS. It features a complete user authentication flow using phone OTP and a full-featured, persistent exam interface.

!(https://i.imgur.com/example.png)
## ✨ Key Features

* **📱 Phone OTP Authentication:** Secure login/signup flow using a mobile number and one-time password.
* **🔐 Session Management:** Uses NextAuth.js to manage user sessions.
* **👤 User Profiles:** Users can create and update their profiles, including a profile image upload.
* **📚 Dynamic Exam Module:**
    * Fetches questions and exam rules (time, marks) from a live API.
    * Includes a countdown timer that auto-submits when time runs out.
    * Features a "Mark for Review" option.
* **🎨 Question Palette:** A responsive grid that visualizes the status of every question (Answered, Not Answered, Not Visited, Marked for Review).
* **💾 Persistent State:** Uses `redux-persist` to save the exam state (`result`, `examMetaData`) to `localStorage`, allowing users to refresh the results page.
* **📊 Confirmation & Results:**
    * A confirmation modal appears before final submission, showing a summary of the user's attempt.
    * An instant, shareable results page displays the score, correct, incorrect, and unattended answers.
* **📱 Responsive Design:** Fully responsive layout for all components, from the login page to the exam interface.
* **🔒 Protected Routes:** Middleware handles redirecting unauthenticated users to the login page.

---

## 🚀 Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
* **State Persistence:** [Redux Persist](https://github.com/rt2zz/redux-persist)
* **Authentication:** [NextAuth.js](https://next-auth.js.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Data Fetching:** [Axios](https://axios-http.com/)
* **Icons:** [Lucide React](https://lucide.dev/)

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone [https://github.com/your-username/nexlearn-project.git](https://github.com/your-username/nexlearn-project.git)
cd nexlearn-project
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up Environment Variables

# The base URL for the backend API
NEXT_PUBLIC_API_URL=[https://nexlearn.noviindusdemosites.in](https://nexlearn.noviindusdemosites.in)

# NextAuth.js configuration
# Generate a secret: `openssl rand -base64 32`
NEXTAUTH_SECRET=your_super_secret_string_here
NEXTAUTH_URL=http://localhost:3000

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

## 🔧 Project Structure

* `/src/app`: Contains all pages and routes (App Router).
    * `/login`: The authentication page.
    * `/instructions`: The pre-exam instructions page (clears old state).
    * `/mcq`: The main exam interface.
    * `/results/[id]`: The dynamic results page.
* `/src/components`: Reusable components (e.g., `QuestionPalette`, `SubmitModal`).
* `/src/redux`: Contains all Redux Toolkit logic.
    * `/slices`: Slices for `authSlice` and `examSlice`.
    * `/store.ts`: Store configuration with `redux-persist`.
* `/src/api`: Contains the configured `axiosInstance` for API calls.
* `/src/middleware.ts`: Handles route protection for authenticated users.
