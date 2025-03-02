import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getLevels } from '@/api/class-wrapper';
import { Link } from "wouter";
import Level from '@/components/Level';

const AdminLevels = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [allowRender, setAllowRender] = useState(false);
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        setAllowRender(true);
      }
    }
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const levels = await getLevels();
        setLevels(levels);
      } catch (error) {
        console.error("Error fetching levels:", error);
      }
    };
    fetchLevels();
  }, []);

  if (!allowRender) {
    return <div></div>;
  }

  if (user?.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="h-full p-8 space-y-10">
      <h3 className="font-extrabold text-2xl">All Levels</h3>
      <div className="font-semibold">Browse, add, and delete levels.</div>
      
      {/* Levels List */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
        {levels.length > 0 ? (
          levels.map((level) => (
            <Link key={level.level} href={`/admin/levels/${level._id}`}>
              <div className="rounded-lg">
                <Level level={level} isSimplified={true} />
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No levels available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminLevels;
