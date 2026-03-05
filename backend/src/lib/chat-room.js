export function parseRoomParticipants(roomId) {
  if (!roomId || typeof roomId !== "string") return null;
  const participants = roomId.split("-");
  if (participants.length !== 2) return null;
  return participants;
}

export function canUserAccessRoom(user, roomId) {
  const participants = parseRoomParticipants(roomId);
  if (!participants || !user?._id) return false;

  const userId = user._id.toString();
  if (!participants.includes(userId)) return false;

  const otherUserId = participants[0] === userId ? participants[1] : participants[0];
  return (user.friends || []).some((friendId) => friendId.toString() === otherUserId);
}
