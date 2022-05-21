import React from "react";

export const PlatformContext = React.createContext()

export function  PlatformProvider({children}){
    //const apiKey = place your key
    const h = window.H;
    const platform = new h.service.Platform({
        apikey: apiKey,
    });

    return(
        <PlatformContext.Provider value={{
            H:h,
            Platform:platform
        }}>
            {children}
        </PlatformContext.Provider>
    )
}