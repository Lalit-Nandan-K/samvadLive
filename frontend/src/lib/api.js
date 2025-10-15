import { axiosInstance } from "./axios";

//App.jsx
export const getAuthUser = async () => {
  try {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  } catch (error) {
    console.error("Error in getAuthUser",error);
    return null;
  }
};

//SignUpPage
export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

//LoginPage
export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

//LogoutPage
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

//OnboardingPage
export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

//HomePage
export async function getUserFriends(){
  const response= await axiosInstance.get("/users/friends");
  return response.data;
}

//HomePage
export async function getRecommendedUsers(){
  const response= await axiosInstance.get("/users");
  return response.data;
}

//HomePage
export async function getOutgoingFriendReqs(){
  const response=await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}

//HomePage
export async function sendFriendRequests(userId){
  const response=await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}

//NotificationPage
export async function getFriendRequests(){
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}

//NotificationPage
export async function acceptFriendRequest(requestId){
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

//Chat Page
export async function getStreamToken(){
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}