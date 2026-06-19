# BinUthman Water Delivery

This is a full-stack web application for water delivery. The project is structured as a monorepo containing a React frontend and a Node.js/Express backend.

## Project Structure

- `frontend/`: Contains the React application built with Vite.
- `backend/`: Contains the Node.js Express server and SQLite database.
- `misc/`: Contains miscellaneous scripts and scratchpad files.

## Local Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation
1. Install dependencies for all workspaces from the root directory:
   ```bash
   npm install
   ```

### Running the App
Since this is a monorepo, you can run the services individually or add root scripts to manage them.

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Deployment

### Frontend (Vercel)
The frontend is configured to be deployed on Vercel. 
- The `vercel.json` at the root of the project handles routing requests to the frontend or proxying API calls to the backend.

### Backend (Render.com)
The backend is configured to be deployed as a Web Service on Render.com using the included `render.yaml` Blueprint.

1. Create an account on [Render.com](https://render.com) and connect your GitHub repository.
2. Render will automatically detect the `render.yaml` Blueprint at the root of your repository.
3. Apply the Blueprint to deploy the backend service.

**Important Note regarding the Database on Render:**
The backend uses a local SQLite database (`binuthman.db`). Render Web Services use ephemeral disks by default, meaning the database will be reset on every deployment or server restart.
The `render.yaml` configuration is set up to mount a persistent disk at `/data` to prevent data loss. The application code must be updated to store the SQLite database file in the `/data` directory when deployed on Render, otherwise data will still be lost.
