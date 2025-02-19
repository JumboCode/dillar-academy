import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react';

const EditConversation = () => {
    const { user } = useContext(UserContext);
    const [, setLocation] = useLocation();
    const { isSignedIn, isLoaded } = useAuth();
    const [allowRender, setAllowRender] = useState(false);

    useEffect(() => {
        if (isLoaded) {
            if (!isSignedIn) {
                setLocation("/login");
            } else {
                setAllowRender(true);
            }
        }

        // fetchUsers();
    }, [isLoaded, isSignedIn, user]);

    if (!allowRender) {
        return <div></div>;
    }

    if (user?.privilege !== "admin") {
        return <div>Unauthorized</div>;
    }

    return (
        <div className="h-full p-8 space-y-10">
            <h3 className="font-extrabold">Edit Conversation Class</h3>
        </div>
    )
}

export default EditConversation;