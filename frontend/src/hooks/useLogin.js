import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const useLogin = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate(); // Initialize useNavigate
    
    const { mutate, isPending, error } = useMutation({
        mutationFn: login,
        onSuccess: () => {
            // FIX: Introduce a small delay (100ms) before invalidating the query.
            // This prevents the race condition where the protected query 
            // runs before the browser finishes setting the HttpOnly cookie.
            setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ["authUser"] });
                // Navigate to the main page (or protected route) after successful login
                navigate("/"); 
            }, 100);
        },
    });

    return { isPending, error, loginMutation: mutate };
};

export default useLogin;
