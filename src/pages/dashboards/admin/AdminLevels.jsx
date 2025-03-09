
import Level from '@/components/Class/Level';
import Button from '@/components/Button/Button';
import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getLevels } from '@/api/class-wrapper';

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

  if (user.privilege !== "admin") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="page-format max-w-[96rem] space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="font-extrabold mb-2">All Levels</h3>
          <p>Browse, add, and delete levels.</p>
        </div>
        <div>
          <Button
            label="+ Add Level"
            isOutline
            onClick={() => setLocation("/admin/levels/new")} />
        </div>
      </div>

      {/* Levels List */}
      <div className="grid md:grid-cols-2 gap-6">
        {levels.length > 0 ? (
          levels.map((level) => (
            // change to pass level.level, add function to get level by num?
            <Link key={level.level} href={`/admin/levels/${level.level}`}>
              <div className="rounded-lg">
                <Level level={level} isSimplified />
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No levels available.</p>
        )}
        <Link href="/admin/levels/conversations">
          <Level level={{
            level: "Conversation Classes",
            name: "",
          }}
            isSimplified />
        </Link>
      </div>
    </div>
  );
};

export default AdminLevels;
