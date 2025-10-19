import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../lib/api';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate(); // Initialize useNavigate
    
    const { mutate: logoutMutation, isPending , error } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            // Clear user data from cache and redirect instantly upon logout success
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            // Redirect to the login page
            navigate("/login"); 
        },
    });

    return {logoutMutation , isPending , error};
}

export default useLogout;
