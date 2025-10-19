import { MapPinIcon } from "lucide-react";
import { Link } from "react-router";

const Friendcard = ({ friend }) => {
  return (
    <div
      key={friend._id}
      className="card bg-base-200 hover:shadow-lg transition-all duration-300"
    >
      <div className="card-body p-5 space-y-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar size-16 rounded-full">
            <img src={friend.profilePic} alt={friend.fullName} />
          </div>
          {/*Name & Location */}
          <div>
            <h3 className="font-semibold text-lg">{friend.fullName}</h3>
            {friend.location && (
              <div className="flex items-center text-xs opacity-70 mt-1">
                <MapPinIcon className="size-3 mr-1" />
                {friend.location}
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {friend.bio && <p className="text-sm opacity-70">{friend.bio}</p>}

        {/* Button */}
        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};

export default Friendcard;
