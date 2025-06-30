# ITS Frontend

This project is a React/Next.js frontend using Redux Toolkit for state management. It provides authentication flows and management interfaces that communicate with a backend API.

## Requirements

- **Node.js** >= 18.17 (Node 20 recommended)
- **npm**

## Installation

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and update the values before starting the app.
The `NEXT_PUBLIC_API_BASE_URL` variable should point to the backend API root URL.

## Scripts

- `npm run dev` – start the development server
- `npm run build` – create a production build
- `npm run start` – run the production build
- `npm run lint` – run ESLint

There are currently no automated tests configured.

## Folder structure

```
src/
  api/        # Axios instance and API helpers
  app/        # Next.js routes and layout
  components/ # Reusable UI components
  features/   # Redux slices
  hooks/      # Custom React hooks
  store/      # Redux store configuration
  styles/     # Global and module CSS
```

Additional configuration files include `next.config.mjs`, `eslint.config.mjs`, `jsconfig.json` and `.env.example` in the project root.
