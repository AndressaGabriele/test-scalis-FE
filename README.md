
# README for Test-Scalis-Frontend

## Overview

This frontend application is built using Next.js, a React framework that enables functionality such as server-side rendering and generating static websites for React-based web applications. It interacts with the backend service developed for managing bank accounts, allowing users to create new accounts, view account balances, and transfer funds between accounts. The application utilizes a responsive design, making it accessible on various devices.

## Technologies Used

- **Next.js**: A React framework for building user interfaces with server-side rendering and static site generation.
- **React**: A JavaScript library for building user interfaces.
- **Redux**: A predictable state container for JavaScript apps, used for managing application state.
- **Bootstrap** and **React-Bootstrap**: For styling and layout with pre-defined components.
- **Axios**: A promise-based HTTP client for making requests to the backend.
- **React Icons**: Provides common icons to be used in the React applications.

## Getting Started

To run this project locally, you need to have Node.js installed on your machine. Follow these steps to set up and start the project:

### Installation

1. Clone the repository to your local machine.
2. Navigate to the frontend project directory.
3. Install the dependencies:
   ```sh
   npm install
   ```

### Running the Application

- Start the development server:
  ```sh
  npm run dev
  ```
- The application will be available at `http://localhost:3000`.

## Features

- **User Management**: Users can view and select existing users from a dropdown menu.
- **Account Information**: Display checking and savings account balances for the selected user.
- **Fund Transfer**: Users can transfer funds between checking and savings accounts.
- **New Account Creation**: Allows the creation of new user accounts with initial checking and savings balances.

## Structure

- The `page.tsx` file contains the main React component that renders the UI, handling state management, user interactions, and API requests.
- Styles are managed using module CSS for component-specific styling, along with Bootstrap for layout and common UI elements.

## API Integration

The frontend application communicates with the backend through RESTful API endpoints using Axios for data fetching and operations like account creation and fund transfers.

## Conclusion

This README provides an overview and guide for running the Test-Scalis-Frontend application. It demonstrates a modern web application setup using Next.js, React, Redux, and Bootstrap, showcasing skills in frontend development and integration with a backend service.

