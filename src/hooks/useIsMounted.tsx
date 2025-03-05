import { useState, useEffect } from 'react';

function useIsMounted() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        // This function runs when the component unmounts
        return () => {
            setIsMounted(false);
        };
    }, []);

    return isMounted;
}

export default useIsMounted;
