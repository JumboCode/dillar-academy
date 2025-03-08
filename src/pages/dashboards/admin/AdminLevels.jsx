import Button from '@/components/Button/Button';
import Level from '@/components/Class/Level';
import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@clerk/clerk-react';

const AdminLevels = () => {
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

  }, [isLoaded, isSignedIn, user])

  if (!allowRender) {
    return <div></div>;
  }

  if (user.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="page-format space-y-10">
      <h3 className="font-extrabold">All Levels</h3>
      <Link href="/admin/levels/conversations">
        <Level level={{
          level: "conversation",
          name: "conversation level",
        }}
          isSimplified />
      </Link>
    </div>
  );
};

export default AdminLevels;