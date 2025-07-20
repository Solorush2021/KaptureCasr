
<div align="center">
  <br />
  <p>
    <img src="https://placehold.co/150x150/283046/1EC2B6.png?text=KC" alt="KaptureCast Logo" width="140" />
  </p>
  <h1 align="center">KaptureCast</h1>
  <p align="center">
    An intelligent, omni-channel customer support simulation platform.
    <br />
    Built to demonstrate a modern, scalable, and AI-powered CX environment.
  </p>
</div>

<p align="center">
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/AI-Genkit-4A90E2?style=for-the-badge&logo=google-cloud&logoColor=white" alt="Genkit AI">
</p>

---

## ✨ Overview

KaptureCast is a full-stack, enterprise-grade simulation of a modern Customer Experience (CX) platform. It's designed to showcase a rich, interactive, and data-driven application that mirrors the complex workflows of a real-world customer support hub. From dynamic analytics to AI-powered ticket routing, KaptureCast provides a comprehensive look at how technology can be leveraged to create exceptional customer interactions at scale.

This project goes beyond a simple CRUD application, integrating a generative AI backend to make intelligent decisions, simulating a live environment with real-time notifications, and providing a clean, professional user interface for managing every aspect of the support lifecycle.

---

## 🚀 Core Features

KaptureCast is packed with features that demonstrate a deep understanding of both user experience and backend architecture.

| Feature                    | Description                                                                                                                                                             | Key Technologies        |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| 📊 **Analytics Dashboard**     | A central hub with interactive charts and key performance indicators (KPIs) like SLA compliance, tickets solved, and customer satisfaction scores.                      | `React`, `Recharts`     |
| 🤖 **Intelligent Routing**     | A powerful AI system that analyzes incoming tickets and assigns them to the best agent based on skills and priority. Features a user-configurable rules engine.          | `Genkit`, `Zod`         |
| 🎫 **Omni-Channel Simulation** | Create and manage support tickets from simulated channels like Email, Chat, and Phone, each with its own dedicated interface.                                         | `Next.js`, `React Hook Form` |
| 👥 **Agent Management**       | A complete CRUD interface for managing support agents, including their skills, status, and workload capacity.                                                         | `TypeScript`, `ShadCN UI` |
| 🛰️ **Live Status Board**       | A real-time view of all agents, their current status (Online, Busy, Offline), and their active ticket workload, complete with progress bars.                         | `React`, `Tailwind CSS` |
| 🔔 **Ambient Notifications**   | A global, real-time notification system using toasts to alert users of important events, such as high-priority tickets or agent achievements.                           | `React Hooks`, `Toast`  |
| 🔍 **Dynamic Search**         | A fully functional, client-side search that allows for real-time filtering of tickets by ID, title, or description.                                                    | `React Hooks`           |

<br/>

### 🧠 Intelligent Ticket Routing in Action

The standout feature of KaptureCast is its hybrid routing system. It combines a deterministic **Rules Engine** with a flexible **AI Model** to ensure tickets are handled efficiently.

1.  **Rules Engine Pre-processing**: First, incoming tickets are checked against a set of user-defined `if/then` rules. This handles common, high-priority scenarios instantly.

    *Example Rule:*
    ```
    IF ticket_description CONTAINS "payment failed"
    THEN SET priority = "URGENT"
    ```

2.  **AI-Powered Assignment**: For tickets not handled by the rules, the system sends the ticket details and a list of available agent skills to a generative AI model. The AI then determines the most suitable agent and provides a justification for its choice.

---

## 🛠️ Tech Stack & Architecture

This project is built with a modern, robust, and scalable technology stack, emphasizing type safety, developer experience, and performance.

-   **Frontend**:
    -   **Framework**: [Next.js (App Router)](https://nextjs.org/) - For server components, optimized routing, and performance.
    -   **Language**: [TypeScript](https://www.typescriptlang.org/) - For strong typing and improved code quality.
    -   **UI Library**: [React](https://react.dev/) - For building interactive and reusable components.
    -   **Styling**: [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
    -   **Components**: [ShadCN UI](https://ui.shadcn.com/) - A beautifully designed, accessible component library.
    -   **State Management**: `React Hooks` & `Context API` - For managing local and global state.
    -   **Data Visualization**: `Recharts` - For creating beautiful and interactive charts.

-   **Backend (AI & Server-Side Logic)**:
    -   **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) - A modern AI framework for building production-ready AI-powered features.
    -   **Schema Validation**: `Zod` - For ensuring data integrity between the client and AI model.
    -   **Server Actions**: `Next.js Server Actions` - For secure and efficient form submissions and data mutations.

---

## ⚙️ Getting Started

Follow these steps to get a local copy of KaptureCast up and running on your machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18.0 or newer)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 1. Clone the Repository

First, clone the project to your local machine:
```sh
git clone <YOUR_REPOSITORY_URL>
cd kapturecast
```

### 2. Install Dependencies

Install all the necessary npm packages:
```sh
npm install
```

### 3. Set Up Environment Variables

This project uses Genkit for its AI capabilities. You will need to create a `.env` file in the root of the project and add your API key for the generative model.

```env
# .env
GEMINI_API_KEY=your_api_key_here
```
*You can obtain an API key from a provider that supports generative models.*

### 4. Run the Development Servers

KaptureCast requires two development servers to run concurrently: one for the Next.js frontend and one for the Genkit AI backend.

-   **Start the Next.js Frontend:**
    ```sh
    npm run dev
    ```
    This will start the main application, typically available at `http://localhost:9002`.

-   **Start the Genkit AI Backend (in a separate terminal):**
    ```sh
    npm run genkit:dev
    ```
    This starts the Genkit development server, which powers the AI routing functionality.

Once both servers are running, you can open your browser to `http://localhost:9002` to see the application in action!

---
<div align="center">
  <p>Thank you for exploring KaptureCast!</p>
</div>
