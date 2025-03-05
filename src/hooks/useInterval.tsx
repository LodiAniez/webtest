import { ArgFunction } from "@/types";
import { useRef, useEffect } from "react";

const useInterval = (callback: ArgFunction<any>, dependencies: any[] = [], delay: number | null = 1000) => {
    const savedCallback = useRef<ArgFunction<any>>();
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            if (savedCallback.current) savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay, ...dependencies]);
}
export default useInterval;