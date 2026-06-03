export const dummyRepositories = [
  {
    id: "1",
    name: "mern-app",
    url: "https://github.com/user/mern-app",
    description: "Full-stack MERN application with authentication and REST API",
    language: "JavaScript",
    stars: 142,
    files: 87,
    knowledgeObjects: 312,
    components: 24,
    routes: 18,
    status: "indexed" as const,
    indexedAt: "2024-01-15T10:30:00Z",
    languages: [
      { name: "JavaScript", percentage: 62, color: "#f7df1e" },
      { name: "TypeScript", percentage: 18, color: "#3178c6" },
      { name: "CSS", percentage: 12, color: "#264de4" },
      { name: "HTML", percentage: 8, color: "#e34c26" },
    ],
  },
  {
    id: "2",
    name: "fastapi-backend",
    url: "https://github.com/user/fastapi-backend",
    description: "High-performance Python API with async support and Pydantic models",
    language: "Python",
    stars: 89,
    files: 54,
    knowledgeObjects: 198,
    components: 12,
    routes: 32,
    status: "indexed" as const,
    indexedAt: "2024-01-14T08:15:00Z",
    languages: [
      { name: "Python", percentage: 88, color: "#3572A5" },
      { name: "Shell", percentage: 7, color: "#89e051" },
      { name: "Dockerfile", percentage: 5, color: "#384d54" },
    ],
  },
  {
    id: "3",
    name: "react-dashboard",
    url: "https://github.com/user/react-dashboard",
    description: "Analytics dashboard built with React, Recharts, and Tailwind CSS",
    language: "TypeScript",
    stars: 203,
    files: 112,
    knowledgeObjects: 445,
    components: 48,
    routes: 12,
    status: "indexing" as const,
    indexedAt: "2024-01-16T14:00:00Z",
    languages: [
      { name: "TypeScript", percentage: 74, color: "#3178c6" },
      { name: "CSS", percentage: 16, color: "#264de4" },
      { name: "HTML", percentage: 10, color: "#e34c26" },
    ],
  },
];

export const dummyChatHistory = [
  {
    id: "1",
    title: "Authentication flow explanation",
    preview: "How does the JWT authentication work?",
    timestamp: "2024-01-15T11:00:00Z",
    repoId: "1",
  },
  {
    id: "2",
    title: "API routes overview",
    preview: "List all available API endpoints",
    timestamp: "2024-01-15T09:30:00Z",
    repoId: "1",
  },
  {
    id: "3",
    title: "Database schema",
    preview: "Explain the MongoDB models",
    timestamp: "2024-01-14T16:45:00Z",
    repoId: "1",
  },
];

export const dummyInsights = {
  architectureSummary:
    "This is a full-stack MERN application following a layered architecture. The backend uses Express.js with JWT-based authentication, MongoDB for persistence, and follows RESTful API design. The frontend is a React SPA with Redux for state management and React Router for navigation.",
  importantComponents: [
    { name: "AuthMiddleware", file: "backend/middleware/auth.js", importance: 95, type: "middleware" },
    { name: "UserController", file: "backend/controllers/userController.js", importance: 88, type: "controller" },
    { name: "App", file: "client/src/App.jsx", importance: 85, type: "component" },
    { name: "store", file: "client/src/store/index.js", importance: 82, type: "state" },
    { name: "apiSlice", file: "client/src/features/api/apiSlice.js", importance: 78, type: "api" },
  ],
  apiEndpoints: [
    { method: "POST", path: "/api/auth/login", description: "Authenticate user and return JWT" },
    { method: "POST", path: "/api/auth/register", description: "Register new user account" },
    { method: "GET", path: "/api/users/profile", description: "Get authenticated user profile" },
    { method: "PUT", path: "/api/users/profile", description: "Update user profile" },
    { method: "GET", path: "/api/posts", description: "List all posts with pagination" },
    { method: "POST", path: "/api/posts", description: "Create a new post" },
    { method: "DELETE", path: "/api/posts/:id", description: "Delete a post by ID" },
  ],
  databaseModels: [
    { name: "User", fields: ["_id", "name", "email", "password", "avatar", "createdAt"], file: "backend/models/User.js" },
    { name: "Post", fields: ["_id", "title", "content", "author", "tags", "likes", "createdAt"], file: "backend/models/Post.js" },
    { name: "Comment", fields: ["_id", "content", "author", "post", "createdAt"], file: "backend/models/Comment.js" },
  ],
  dependencies: [
    { name: "express", version: "4.18.2", type: "runtime", usage: "HTTP server framework" },
    { name: "mongoose", version: "7.5.0", type: "runtime", usage: "MongoDB ODM" },
    { name: "jsonwebtoken", version: "9.0.2", type: "runtime", usage: "JWT authentication" },
    { name: "bcryptjs", version: "2.4.3", type: "runtime", usage: "Password hashing" },
    { name: "react", version: "18.2.0", type: "runtime", usage: "UI framework" },
    { name: "redux-toolkit", version: "1.9.5", type: "runtime", usage: "State management" },
  ],
};

export const dummyRepoTree = [
  {
    name: "backend",
    type: "folder" as const,
    children: [
      {
        name: "controllers",
        type: "folder" as const,
        children: [
          { name: "userController.js", type: "file" as const, language: "javascript" },
          { name: "postController.js", type: "file" as const, language: "javascript" },
          { name: "authController.js", type: "file" as const, language: "javascript" },
        ],
      },
      {
        name: "middleware",
        type: "folder" as const,
        children: [
          { name: "auth.js", type: "file" as const, language: "javascript" },
          { name: "errorHandler.js", type: "file" as const, language: "javascript" },
        ],
      },
      {
        name: "models",
        type: "folder" as const,
        children: [
          { name: "User.js", type: "file" as const, language: "javascript" },
          { name: "Post.js", type: "file" as const, language: "javascript" },
          { name: "Comment.js", type: "file" as const, language: "javascript" },
        ],
      },
      { name: "server.js", type: "file" as const, language: "javascript" },
      { name: "package.json", type: "file" as const, language: "json" },
    ],
  },
  {
    name: "client",
    type: "folder" as const,
    children: [
      {
        name: "src",
        type: "folder" as const,
        children: [
          {
            name: "components",
            type: "folder" as const,
            children: [
              { name: "Navbar.jsx", type: "file" as const, language: "jsx" },
              { name: "PostCard.jsx", type: "file" as const, language: "jsx" },
              { name: "AuthForm.jsx", type: "file" as const, language: "jsx" },
            ],
          },
          {
            name: "features",
            type: "folder" as const,
            children: [
              { name: "apiSlice.js", type: "file" as const, language: "javascript" },
              { name: "authSlice.js", type: "file" as const, language: "javascript" },
            ],
          },
          { name: "App.jsx", type: "file" as const, language: "jsx" },
          { name: "index.js", type: "file" as const, language: "javascript" },
        ],
      },
      { name: "package.json", type: "file" as const, language: "json" },
    ],
  },
  { name: "README.md", type: "file" as const, language: "markdown" },
  { name: ".gitignore", type: "file" as const, language: "text" },
];

export const exampleQuestions = [
  "How does authentication work?",
  "Which API routes exist?",
  "Explain the overall architecture",
  "List all React components",
  "What database models are defined?",
  "Generate an onboarding guide",
  "How is state managed?",
  "What are the main dependencies?",
];
