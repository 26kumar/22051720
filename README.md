# 22051720
 Afford Medical Technologies Test


# Social Media Analytics Dashboard & Average Calculator Microservice

## Project Overview

This repository contains two distinct applications:

1. **Social Media Analytics Dashboard**: A React-based frontend application that provides real-time analytical insights from social media data.
2. **Average Calculator Microservice**: A Node.js service that calculates averages from various number sequences with a sliding window implementation.

![image](https://github.com/user-attachments/assets/956927c4-5fbe-4bc2-9adb-26f990307b9c)


## Technologies Used

### Social Media Analytics Dashboard
- React
- Vite
- Tailwind CSS
- React Router
- Axios

### Average Calculator Microservice
- Node.js
- Express
- Axios
- Winston (logging)
- UUID

## Installation Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- Git

### Social Media Analytics Dashboard
1. Clone the repository:
   ```bash
   git clone [https://github.com/26kumar/22051720]
   cd Social_Media_Analytics
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the application at:
   ```
   http://localhost:3000
   ```

### Average Calculator Microservice
1. Navigate to the microservice directory:
   ```bash
   cd Average_HTTP_Calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. The service will be available at:
   ```
   http://localhost:9876
   ```

## API Endpoints

### Social Media Analytics Dashboard
- `/` - Top Users by post count
- `/trending` - Trending posts by comment count
- `/feed` - Real-time post feed

### Average Calculator Microservice
- `/numbers/p` - Prime numbers average
- `/numbers/f` - Fibonacci numbers average
- `/numbers/e` - Even numbers average
- `/numbers/r` - Random numbers average

## Configuration

### Environment Variables
Create a `.env` file in the respective project root with the following variables:

For Social Media Analytics:
```
VITE_API_BASE_URL=http://20.244.56.144/evaluation-service
```

For Average Calculator:
```
API_BASE_URL=http://20.244.56.144/evaluation-service
WINDOW_SIZE=10
TIMEOUT_MS=500
```

## Testing

Run tests for both applications with:
```bash
npm test
```

## Deployment

### Production Build
For the React application:
```bash
npm run build
```

For the Node.js microservice, use a process manager like PM2:
```bash
pm2 start src/server.js
```

## Project Structure

```
/
├── social-media-analytics/       # Frontend application
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── App.jsx              # Main application
│   │   └── ...
│   └── vite.config.js           # Vite configuration
│
├── average-calculator/          # Microservice
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   ├── utils/              # Utility functions
│   │   ├── server.js           # Main server file
│   │   └── ...
│   └── ...
└── README.md                   # This file
```


### Error generated during development while handling API:
![image](https://github.com/user-attachments/assets/7e6c0be1-90c0-4eff-8da4-22a3aaef53da)
![image](https://github.com/user-attachments/assets/8b70f8fb-3b62-44e4-913b-180d3cae6b94)


