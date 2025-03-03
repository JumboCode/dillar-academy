// import { useContext, useEffect, useState } from "react";
// import { UserContext } from '@/contexts/UserContext.jsx';
// import { useLocation } from 'wouter';
// import { useAuth } from '@clerk/clerk-react';
// import ConversationClass from '@/components/ConversationClass';

// const AdminConversations = () => {
//     const { user } = useContext(UserContext);
//     const [, setLocation] = useLocation();
//     const { isSignedIn, isLoaded } = useAuth();
//     const [allowRender, setAllowRender] = useState(false);

//     useEffect(() => {
//         if (isLoaded) {
//             if (!isSignedIn) {
//                 setLocation("/login");
//             } else {
//                 setAllowRender(true);
//                 fetchConversations();
//             }
//         }

//         // TODO: fetch conversation classes
//     }, [isLoaded, isSignedIn, user]);


//     if (!allowRender) {
//         return <div></div>;
//     }

//     if (user?.privilege !== "admin") {
//         return <div>Unauthorized</div>;
//     }

//     return (
//         <div className="h-full p-8 space-y-10">
//             <h3 className="font-extrabold">All Conversation Classes</h3>
//         </div>
//     )
// }

// export default AdminConversations;

import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import ConversationClass from '@/components/ConversationClass';

import { getConversations } from '@/api/class-wrapper';

const AdminConversations = () => {
    const { user } = useContext(UserContext);
    const [, setLocation] = useLocation();
    const { isSignedIn, isLoaded } = useAuth();
    const [allowRender, setAllowRender] = useState(false);
    const [conversationClasses, setConversationClasses] = useState([]);

    useEffect(() => {
        if (isLoaded) {
            if (!isSignedIn) {
                setLocation("/login");
            } else {
                setAllowRender(true);
                fetchConversations();
            }
        }
    }, [isLoaded, isSignedIn, user]);

    const fetchConversations = async () => {
        try {
            const data = await getConversations();
            setConversationClasses(data);
        } catch (error) {
            console.error("Failed to fetch conversation classes", error);
        }
    };

    if (!allowRender) {
        return <div></div>;
    }

    if (user?.privilege !== "admin") {
        return <div>Unauthorized</div>;
    }

    return (
        <div className="h-full p-8 space-y-10">
            <h3 className="font-extrabold">All Conversation Classes</h3>
            <button 
                className="bg-blue-500 text-white px-4 py-2 rounded" 
                onClick={() => setLocation("/admin/levels/conversations/new")}>
                Create New Conversation Class
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {conversationClasses.map((conversation) => (
                    <ConversationClass 
                        key={conversation._id} 
                        conversation={conversation} 
                        modes={["edit"]} 
                        editURL="/admin/levels/conversations" 
                    />
                ))}
            </div>
        </div>
    );
};

export default AdminConversations;
