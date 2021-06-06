import React, { useEffect } from 'react';

/**
 * 
 * @param {() => Promise<void>} asyncCallback 
 * @param {() => Promise<void>} cleanup 
 * @param {React.DependencyList} deps 
 */
export const useAsyncEffect = (asyncCallback, cleanup, deps) => {
    useEffect(() => {
        asyncCallback();

        return () => {
            cleanup?.();
        };
    }, deps);
};