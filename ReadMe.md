#  Resource Visualizer: A Dynamic Mind-Mapping Tool

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

An innovative full-stack application that allows users to create, visualize, and manage complex information through interactive mind maps and resource graphs. Turn your ideas into structured, explorable diagrams!

**[Live Demo](https://campus-connect-rust.vercel.app/)**

##  Praise for the Innovation

This project redefines note-taking and knowledge management. Instead of static lists and documents, the Resource Visualizer provides a dynamic and interactive way to map out thoughts, dependencies, and connections. The use of a graph-based interface, powered by `@xyflow/react`, makes learning and exploration intuitive and engaging. This is more than just a tool; it's a new way of thinking.

## Key Features

*   **Interactive Mind Map View:** Create, connect, and edit nodes on an infinite canvas.
*   **User Authentication:** Secure user accounts with Clerk.
*   **Full-Stack Application:** A robust backend powered by Node.js and a responsive frontend built with React.
*   **Modern Tech Stack:** Utilizes the latest technologies for a smooth and fast user experience.

## Technologies Used

### Frontend

*   **React:** A JavaScript library for building user interfaces.
*   **Vite:** A fast build tool for modern web projects.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **@xyflow/react:** A library for creating interactive node-based graphs.
*   **Clerk:** For user authentication.

### Backend

*   **Node.js:** A JavaScript runtime for building server-side applications.
*   **Express:** A minimal and flexible Node.js web application framework.
*   **MongoDB:** A NoSQL database for storing application data.
*   **Mongoose:** An elegant MongoDB object modeling tool for Node.js.
*   **Clerk:** For user authentication.

## Getting Started

### Prerequisites

*   Node.js (v14 or later)
*   npm
*   MongoDB instance (local or cloud)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory and add the following:
    ```
    MONGO_URI=your_mongodb_connection_string
    CLERK_SECRET_KEY=your_clerk_secret_key
    ```
    Create a `.env` file in the `frontend` directory and add the following:
    ```
    VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    ```

## Usage

1.  **Start the backend server:**
    ```bash
    cd backend
    npm run dev
    ```
    The server will start on `http://localhost:5000` (or your configured port).

2.  **Start the frontend development server:**
    ```bash
    cd frontend
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is licensed under the ISC License. See the `LICENSE` file for details.
