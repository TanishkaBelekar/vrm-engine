# Frontend Module - VRM System

## Tech Stack

- Framework: React (Vite)
- Language: TypeScript
- State Management: React Query (@tanstack/react-query)
- Routing: React Router DOM v6
- HTTP Client: Axios
- Styling: Tailwind CSS
- Notifications: react-hot-toast

---

## Versions

- Node.js: v18+ (recommended)
- React: ^18.x
- React Router: ^6.x
- React Query: ^5.x
- Axios: ^1.x
- Tailwind CSS: ^3.x

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>

```
### 2. Navigate to frontend folder
```bash
cd frontend
```

### 3. Install all dependencies 
```bash
npm install
```

### 4. Create .env file
```bash
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

### 5. Start development server
```bash
npm run dev
```


## features implemented
-Login and authentication flow
-Protected routes
-Dashboard UI
-Vendor management UI
-Assessment workflow UI
-Notifications UI (API integrated)
-Evidence listing UI

## Notes
-Evidence upload depends on backend APIs not fully available
-Notifications may be empty if backend has no data
-Multiple role testing not done due to missing credentials
-UI is aligned with available backend APIs