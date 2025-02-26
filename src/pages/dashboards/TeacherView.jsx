import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react'

const TeacherView = () => {
    const { user, } = useContext(UserContext);
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
    }, [isLoaded, isSignedIn, user]);

    if (!allowRender) {
        return;
    }

    if (user?.privilege !== "teacher") {
        return <div>Unauthorized</div>
    }

    return (
        <div className="h-full flex-1">
            <h1>Teacher</h1>
        </div>
    );
};

export default TeacherView;
