'use client';
import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT: number = 768;
type Mobile = boolean | undefined;

export function useIsMobile(): Mobile {
    const [isMobile, setIsMobile] = useState<Mobile>(undefined);

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
        const onChange = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };
        mql.addEventListener('change', onChange);
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        return () => mql.removeEventListener('change', onChange);
    }, []);

    return !!isMobile;
}
