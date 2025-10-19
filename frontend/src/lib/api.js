import axios from "./axios.js"; // default import

export const getAuthUser = async () => {
  try {
    const response = await axios.get("/auth/me"); // ✅ use axios, not axiosInstance
    return response.data;
  } catch (error) {
    console.error("Error in getAuthUser", error);
    return null;
  }
};

export const signup = async (signupData) => {
  const response = await axios.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axios.post("/auth/login", loginData);
  return response.data;
};

export const logout = async () => {
  const response = await axios.post("/auth/logout");
  return response.data;
};

export const completeOnboarding = async (userData) => {
  const response = await axios.post("/auth/onboarding", userData);
  return response.data;
};

export async function getUserFriends() {
  const response = await axios.get("/users/friends");
  return response.data;
}

export async function getRecommendedUsers() {
  const response = await axios.get("/users");
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axios.get("/users/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequests(userId) {
  const response = await axios.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axios.get("/users/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axios.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axios.get("/chat/token");
  return response.data;
}
