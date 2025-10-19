import { useQuery, useQueryClient } from '@tanstack/react-query'
import NoFriendsFound from '../components/NoFriendsFound';
import { Link } from 'react-router';
import { UserIcon } from 'lucide-react';
import Friendcard from '../components/Friendcard';
import { getUserFriends } from '../lib/api';

const FriendsPage = () => {
  const queryClient = useQueryClient();
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });
  return (
    <div className="min-h-screen bg-base-100 p-4 sm:p-6 lg:p-8">
    <div className="container mx-auto space-y-10">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UserIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
    </div>
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <Friendcard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
    </div>
    </div>
  )
}

export default FriendsPage
