import { useState, useEffect } from 'react';

const useSwipeDetector = () => {
    const [swipeDirection, setSwipeDirection] = useState<-1 | 0 | 1>(0);
    const [startX, setStartX] = useState(0);

    const handleStart = (e: TouchEvent | MouseEvent) => {
        setStartX(getXPosition(e));
    };

    const handleEnd = (e: TouchEvent | MouseEvent) => {
        const endX = getXPosition(e);
        const deltaX = endX - startX;

        if (deltaX > 50) {
            setSwipeDirection(1);
        } else if (deltaX < -50) {
            setSwipeDirection(-1);
        } else {
            setSwipeDirection(0);
        }
    };

    const getXPosition = (e: any) => {
        return e.touches ? e.touches[0].clientX : e.clientX;
    };

    useEffect(() => {
        const container = document.documentElement;

        container.addEventListener('touchstart', handleStart);
        container.addEventListener('mousedown', handleStart);

        container.addEventListener('touchend', handleEnd);
        container.addEventListener('mouseup', handleEnd);

        return () => {
            container.removeEventListener('touchstart', handleStart);
            container.removeEventListener('mousedown', handleStart);

            container.removeEventListener('touchend', handleEnd);
            container.removeEventListener('mouseup', handleEnd);
        };
    }, [startX]);

    return swipeDirection;
};

export default useSwipeDetector;
