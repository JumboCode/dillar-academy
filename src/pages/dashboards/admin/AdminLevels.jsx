import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { Link } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getLevels } from '@/api/class-wrapper.js';

const AdminLevels = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [levels, setLevels] = useState([]);

  // Always call hooks at the top
  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        setAllowRender(true);
      }
    }
  }, [isLoaded, isSignedIn]);

  // Now safely return UI without breaking hooks order
  if (!allowRender) {
    return <div></div>;
  }

  if (!user || user.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="page-format space-y-10">
      <h3 className="font-extrabold">All Levels</h3>
      <div className="flex items-center justify-between">
        <p className="font">Browse, add and delete levels.</p>
        <button 
          onClick={() => setLocation("/admin/levels/new")} 
          className="px-3 py-0 bg-white text-gray-500 border border-gray-500 rounded"
        >
          + Add Level
        </button>
      </div>
      <div className="space-y-4">
      {levels.map((level) => (
          <Link key={level.id} href={`/admin/levels/${level.id}`}>
            <Level level={level} isSimplified={true} />
          </Link>
        ))}

      </div>
    </div>
  );
};

export default AdminLevels;
