import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TopUsers from './components/TopUsers';
import TrendingPosts from './components/TrendingPosts';
import Feed from './components/Feed';

// Store your auth token (in a real app, you'd handle this more securely)
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNTk5NDc0LCJpYXQiOjE3NDM1OTkxNzQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImViZmE3MmE1LTU3MDgtNDMxOC1hOTk3LWRkNmQzZmQ0MjQzNiIsInN1YiI6IjIyMDUxNzIwQGtpaXQuYWMuaW4ifSwiZW1haWwiOiIyMjA1MTcyMEBraWl0LmFjLmluIiwibmFtZSI6InJ1cGVzaCBrdW1hciIsInJvbGxObyI6IjIyMDUxNzIwIiwiYWNjZXNzQ29kZSI6Im53cHdyWiIsImNsaWVudElEIjoiZWJmYTcyYTUtNTcwOC00MzE4LWE5OTctZGQ2ZDNmZDQyNDM2IiwiY2xpZW50U2VjcmV0IjoiZHpwcnRUQ0FRWlJVcEpiVyJ9.aMOB-_NRv6xxIoNLQxvmSg2hICfr6oAz-W4EFboyF8A";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Social Media Analytics</h1>
              <ul className="flex space-x-6">
                <li>
                  <Link to="/" className="hover:underline">Top Users</Link>
                </li>
                <li>
                  <Link to="/trending" className="hover:underline">Trending Posts</Link>
                </li>
                <li>
                  <Link to="/feed" className="hover:underline">Feed</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<TopUsers authToken={AUTH_TOKEN} />} />
            <Route path="/trending" element={<TrendingPosts authToken={AUTH_TOKEN} />} />
            <Route path="/feed" element={<Feed authToken={AUTH_TOKEN} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;