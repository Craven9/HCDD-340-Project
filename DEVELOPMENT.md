# Expense Tracker - Development Setup

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <your-repo-url>
   cd HCDD-340-Project
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Development Server**
   ```bash
   # Default port (5173)
   npm run dev
   
   # Alternative port (3000)
   npm run dev:port
   
   # Accessible from network
   npm run dev:host
   ```

## Troubleshooting

### Port Already in Use Error
If you get "permission denied" or port conflicts:

**Windows:**
```bash
# Find process using port 5173
netstat -ano | findstr :5173

# Kill the process (replace PID with actual number)
taskkill /PID <process-id> /F
```

**Mac/Linux:**
```bash
# Find and kill process
lsof -ti:5173 | xargs kill -9
```

### Common Issues
- **TypeScript errors**: Run `npm run type-check`
- **Node modules issues**: Delete `node_modules` and run `npm install`
- **Cache issues**: Run `npm run clean` then `npm install`

## Available Scripts
- `npm run dev` - Start development server
- `npm run dev:port` - Start on port 3000
- `npm run dev:host` - Start with network access
- `npm run build` - Build for production
- `npm run type-check` - Check TypeScript without building
- `npm run clean` - Clean cache and dependencies