import { ArgFunction, VoidFunction } from '@/types';
import { useState, useEffect } from 'react';

const useKeyListener = ({ callback, key, args = [], dependencies = [], run = true }: { callback: ArgFunction<any> | VoidFunction, key: string, args?: any[], dependencies?: any[], run?: boolean }) => {
    const keyevent = (event: KeyboardEvent) => {
        if (run === false) return;
        if (String(event.key).toLowerCase() === String(key).toLowerCase()) {
            callback(...args);
        }
    }
    useEffect(() => {
        if (run === false) return;
        window.addEventListener('keydown', keyevent);
        return () => {
            window.removeEventListener('keydown', keyevent);
        };
    }, [...dependencies, run]);

}

export default useKeyListener;
