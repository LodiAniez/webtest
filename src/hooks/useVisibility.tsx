import { sleep } from '@/utils/functions';
import { MutableRefObject, useEffect, useRef, useState } from 'react';


interface VisibilityHookProps {
    targetContainerRef: MutableRefObject<HTMLElement | null>;
    onBecomeVisible?: () => void;
    dependencies?: any[]
}

const useVisibility = ({ targetContainerRef, onBecomeVisible, dependencies = [] }: VisibilityHookProps) => {

    const [isVisible, setIsVisible] = useState(true)
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (!isVisible && entry.isIntersecting && onBecomeVisible) onBecomeVisible();
            // setIsVisible(entry.isIntersecting)
            sleep().then(() => setIsVisible(entry.isIntersecting))
        });
        if (targetContainerRef.current) observer.observe(targetContainerRef.current);
        return () => {
            observer.disconnect();
        };
    }, [isVisible, ...dependencies]);
};

export default useVisibility;