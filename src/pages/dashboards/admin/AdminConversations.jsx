
import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import SupplementaryClass from '@/components/Class/SupplementaryClass';
import Button from '@/components/Button/Button';
import { getConversations } from '@/wrappers/conversation-wrapper';
import BackButton from "@/components/Button/BackButton";
import Unauthorized from "@/pages/Unauthorized";
import SkeletonLevel from '@/components/Skeletons/SkeletonLevel';
import useDelayedSkeleton from '@/hooks/useDelayedSkeleton';

const AdminConversations = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [conversationClasses, setConversationClasses] = useState([]);
  const showSkeleton = useDelayedSkeleton(!allowRender);

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        fetchConversations();
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const fetchConversations = async () => {
    try {
      const data = await getConversations();
      setConversationClasses(data);
      setAllowRender(true);
    } catch (error) {
      console.error("Failed to fetch conversation classes", error);
    }
  };

  if (user && user.privilege !== "admin") {
    return <Unauthorized />;
  }

  return (
    <div className="page-format max-w-[96rem] space-y-10">
      <BackButton label={"All Levels"} />
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-extrabold mb-2">All Conversation Classes</h1>
          <p>Browse, edit and delete conversation classes.</p>
        </div>
        <div>
          <Button
            label="+ Add Conversation Class"
            isOutline
            onClick={() => setLocation("/admin/levels/conversations/new")} />
        </div>
      </div>
      <div className="grid auto-rows-fr grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allowRender
          ? conversationClasses.map((conversation) => (
            <SupplementaryClass
              key={conversation._id}
              cls={conversation}
              modes={["edit"]}
              editURL="/admin/levels/conversations"
            />
          ))
          : showSkeleton && <SkeletonLevel count={3} />}
      </div>
    </div>
  );
};

export default AdminConversations;
