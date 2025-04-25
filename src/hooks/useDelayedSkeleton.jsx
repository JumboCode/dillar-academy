import { useState, useEffect } from "react";

const useDelayedSkeleton = (isLoading, delay = 200) => {
    const [showSkeleton, setShowSkeleton] = useState(false);

    useEffect(() => {
        let timeout;

        if (isLoading) {
            timeout = setTimeout(() => {
                setShowSkeleton(true);
            }, delay);
        } else {
            setShowSkeleton(false);
        }

        return () => clearTimeout(timeout);
    }, [isLoading, delay]);

    return showSkeleton;
};

export default useDelayedSkeleton;