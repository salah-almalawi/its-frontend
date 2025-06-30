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

The application expects `NEXT_PUBLIC_API_BASE_URL` to be defined in your environment. It should point to the backend API root URL.

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

Additional configuration files include `next.config.mjs`, `eslint.config.mjs` and `jsconfig.json` in the project root.
