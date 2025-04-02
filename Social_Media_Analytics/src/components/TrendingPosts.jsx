import { useState, useEffect } from 'react';

const TrendingPosts = ({ authToken }) => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to fetch with authorization
  const fetchWithAuth = async (url) => {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  };

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. First verify the token is still valid
        const now = Math.floor(Date.now() / 1000);
        const tokenExpiry = 1743599474; // From your token
        
        if (now > tokenExpiry) {
          throw new Error("Authentication token has expired");
        }

        // 2. Fetch all users
        const usersData = await fetchWithAuth('http://20.244.56.144/evaluation-service/users');
        const users = usersData.users;

        // 3. Fetch posts for each user
        const allPosts = [];
        for (const [userId, userName] of Object.entries(users)) {
          try {
            const postsData = await fetchWithAuth(
              `http://20.244.56.144/evaluation-service/users/${userId}/posts`
            );
            
            if (postsData.posts) {
              allPosts.push(...postsData.posts.map(post => ({
                ...post,
                userName,
                userId
              })));
            }
          } catch (err) {
            console.error(`Failed to fetch posts for user ${userId}:`, err);
            continue;
          }
        }

        // 4. Fetch comments for each post
        const postsWithCommentCounts = await Promise.all(
          allPosts.map(async post => {
            try {
              const commentsData = await fetchWithAuth(
                `http://20.244.56.144/evaluation-service/posts/${post.id}/comments`
              );
              const commentCount = commentsData.comments ? commentsData.comments.length : 0;
              return { ...post, commentCount };
            } catch (err) {
              console.error(`Failed to fetch comments for post ${post.id}:`, err);
              return { ...post, commentCount: 0 };
            }
          })
        );

        // 5. Find trending posts
        const maxComments = Math.max(...postsWithCommentCounts.map(p => p.commentCount), 0);
        const trending = postsWithCommentCounts.filter(p => p.commentCount === maxComments);
        
        setTrendingPosts(trending);
      } catch (err) {
        setError(err.message);
        console.error("Error in fetchTrendingPosts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, [authToken]);

  if (loading) return <div className="text-center py-8">Loading trending posts...</div>;
  
  if (error) return (
    <div className="text-center py-8">
      <div className="text-red-500 font-bold mb-2">Error loading data</div>
      <div className="text-gray-600 mb-4">{error}</div>
      <div className="text-sm text-gray-500">
        {error.includes("401") && "Please check your authentication token."}
        {error.includes("expired") && "Your session has expired. Please obtain a new token."}
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Trending Posts (Most Comments)</h2>
      {trendingPosts.length === 0 ? (
        <p className="text-center">No trending posts found.</p>
      ) : (
        <div className="grid gap-6">
          {trendingPosts.map((post, index) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <img 
                  src={`https://i.pravatar.cc/50?img=${post.userId}`} 
                  alt={post.userName} 
                  className="rounded-full mr-3"
                />
                <div>
                  <h3 className="font-semibold">{post.userName}</h3>
                  <p className="text-sm text-gray-500">User ID: {post.userId}</p>
                </div>
              </div>
              <p className="mb-4">{post.content}</p>
              <div className="flex justify-between items-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {post.commentCount} comments
                </span>
                <span className="text-sm text-gray-500">Post ID: {post.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingPosts;