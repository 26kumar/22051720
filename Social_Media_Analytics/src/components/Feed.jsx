import { useState, useEffect } from 'react';

const Feed = ({ authToken }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialPosts = async () => {
      try {
        // Fetch all users with authorization
        const usersResponse = await fetch('http://20.244.56.144/evaluation-service/users', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (!usersResponse.ok) {
          throw new Error(`Failed to fetch users: ${usersResponse.status}`);
        }
        
        const usersData = await usersResponse.json();
        const users = usersData.users;

        // Fetch posts for each user
        const allPosts = [];
        for (const [userId, userName] of Object.entries(users)) {
          const postsResponse = await fetch(
            `http://20.244.56.144/evaluation-service/users/${userId}/posts`,
            {
              headers: {
                'Authorization': `Bearer ${authToken}`
              }
            }
          );
          
          if (!postsResponse.ok) {
            console.error(`Failed to fetch posts for user ${userId}`);
            continue;
          }
          
          const postsData = await postsResponse.json();
          if (postsData.posts) {
            allPosts.push(...postsData.posts.map(post => ({
              ...post,
              userName,
              userId,
              timestamp: Date.now() - Math.floor(Math.random() * 10000000) // Simulate different timestamps
            })));
          }
        }

        // Sort by timestamp (newest first)
        const sortedPosts = allPosts.sort((a, b) => b.timestamp - a.timestamp);
        setPosts(sortedPosts);
      } catch (err) {
        setError(err.message);
        console.error("Error in fetchInitialPosts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialPosts();

    // Set up polling for new posts
    const intervalId = setInterval(async () => {
      try {
        // In a real app, we would only fetch new posts since the last fetch
        // For this demo, we'll just refetch a random user's posts
        const randomUserId = Math.floor(Math.random() * 20) + 1;
        const postsResponse = await fetch(
          `http://20.244.56.144/evaluation-service/users/${randomUserId}/posts`,
          {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          }
        );
        
        if (!postsResponse.ok) {
          console.error(`Failed to fetch posts for user ${randomUserId}`);
          return;
        }
        
        const postsData = await postsResponse.json();
        
        if (postsData.posts && postsData.posts.length > 0) {
          // Get a random post to add to the feed
          const randomPostIndex = Math.floor(Math.random() * postsData.posts.length);
          const randomPost = postsData.posts[randomPostIndex];
          
          // Find the user's name
          const usersResponse = await fetch('http://20.244.56.144/evaluation-service/users', {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          });
          
          if (!usersResponse.ok) {
            console.error("Failed to fetch users for name lookup");
            return;
          }
          
          const usersData = await usersResponse.json();
          const userName = usersData.users[randomUserId.toString()];

          setPosts(prevPosts => [
            {
              ...randomPost,
              userName,
              userId: randomUserId,
              timestamp: Date.now()
            },
            ...prevPosts
          ]);
        }
      } catch (err) {
        console.error("Error fetching new posts:", err);
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId);
  }, [authToken]);

  if (loading) return <div className="text-center py-8">Loading feed...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Real-Time Feed</h2>
      <div className="grid gap-6">
        {posts.map(post => (
          <div key={`${post.id}-${post.timestamp}`} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <img 
                src={`https://i.pravatar.cc/50?img=${post.userId}`} 
                alt={post.userName} 
                className="rounded-full mr-3"
              />
              <div>
                <h3 className="font-semibold">{post.userName}</h3>
                <p className="text-sm text-gray-500">{new Date(post.timestamp).toLocaleString()}</p>
              </div>
            </div>
            <p className="mb-4">{post.content}</p>
            <div className="flex justify-end">
              <button className="text-blue-500 hover:text-blue-700 text-sm font-semibold">
                View Comments
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;