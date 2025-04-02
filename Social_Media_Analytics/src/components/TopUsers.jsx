import { useState, useEffect } from 'react';

const TopUsers = ({ authToken }) => {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        // Fetch all users with authorization
        const usersResponse = await fetch('http://20.244.56.144/evaluation-service/users', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (!usersResponse.ok) {
          throw new Error(`HTTP error! status: ${usersResponse.status}`);
        }
        
        const usersData = await usersResponse.json();
        const users = usersData.users;

        // Fetch posts for each user and count them
        const usersWithPostCounts = await Promise.all(
          Object.entries(users).map(async ([userId, userName]) => {
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
              return { id: userId, name: userName, postCount: 0 };
            }
            
            const postsData = await postsResponse.json();
            const postCount = postsData.posts ? postsData.posts.length : 0;
            return { id: userId, name: userName, postCount };
          })
        );

        // Sort users by post count and take top 5
        const sortedUsers = usersWithPostCounts.sort((a, b) => b.postCount - a.postCount).slice(0, 5);
        setTopUsers(sortedUsers);
      } catch (err) {
        setError(err.message);
        console.error("Error in fetchTopUsers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, [authToken]);

  if (loading) return <div className="text-center py-8">Loading top users...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Top Users by Post Count</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {topUsers.map((user, index) => (
          <div key={user.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img 
              src={`https://i.pravatar.cc/150?img=${index + 10}`} 
              alt={user.name} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
              <p className="text-gray-600">Posts: <span className="font-bold">{user.postCount}</span></p>
              <p className="text-blue-500 mt-2">Rank: #{index + 1}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopUsers;