
import Level from '@/components/Class/Level';
import Button from '@/components/Button/Button';
import SkeletonLevel from '@/components/Skeletons/SkeletonLevel';
import { useContext, useEffect, useState } from "react";
import { UserContext } from '@/contexts/UserContext.jsx';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@clerk/clerk-react';
import { getLevels } from '@/api/class-wrapper';
import Unauthorized from "@/pages/Unauthorized";
import useDelayedSkeleton from '@/hooks/useDelayedSkeleton';

const AdminLevels = () => {
  const { user } = useContext(UserContext);
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [levels, setLevels] = useState([]);
  const [allowRender, setAllowRender] = useState(false);
  const showSkeleton = useDelayedSkeleton(!allowRender);

  useEffect(() => {
    const fetchLevels = async () => {
      if (user) {
        const levels = await getLevels();
        setLevels(levels);
        setAllowRender(true);
      }
    };

    if (isLoaded) {
      if (!isSignedIn) {
        setLocation("/login");
      } else {
        fetchLevels();
      }
    }
  }, [isLoaded, isSignedIn, user]);

  if (user && user.privilege !== "admin") {
    return <Unauthorized />;
  }

  return (
    <div className="page-format max-w-[96rem] space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-extrabold mb-2">All Levels</h1>
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
        {allowRender ? (
          <>
            {levels
              .sort((l1, l2) => l1.level - l2.level)
              .map((level) => (
                <Link key={level.level} href={`/admin/levels/${level.level}`}>
                  <div className="rounded-lg">
                    <Level
                      level={level}
                      numLevels={levels.length}
                      isSimplified
                      isArrowRight
                    />
                  </div>
                </Link>
              ))}
            <Link href="/admin/levels/conversations">
              <div className="rounded-lg">
                <Level
                  level={{
                    level: "conversation",
                    name: "",
                  }}
                  isSimplified
                  isArrowRight
                />
              </div>
            </Link>
          </>
        ) : showSkeleton && (
          <SkeletonLevel count={6} isSimplified isArrowRight />
        )}
      </div>
    </div>
  );
};

export default AdminLevels;
