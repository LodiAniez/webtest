import React, { useState, useEffect } from 'react';

export type OSType = "Android"
    | "iOS"
    | "Windows"
    | 'Windows Phone'
    | "Unknown"

const useOSInfo = () => {
    const [os, setOS] = useState<OSType>('Unknown');

    useEffect(() => {

        // @ts-ignore
        const userAgent = navigator.userAgent || navigator.vendor || window?.opera;

        if (/android/i.test(userAgent)) {
            setOS('Android');
            // @ts-ignore
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !window?.MSStream) {
            setOS('iOS');
        } else if (/windows phone/i.test(userAgent)) {
            setOS('Windows Phone');
        } else if (/windows/i.test(userAgent)) {
            setOS('Windows');
        } else {
            setOS('Unknown');
        }
    }, []);

    return os;
};

export default useOSInfo;