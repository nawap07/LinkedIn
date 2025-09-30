import React from 'react'
import { createContext } from 'react'

export const authContext = createContext({});


const AuthContext = ({ children }) => {
    const serverUrl = "https://linkedin-backend-lz2h.onrender.com"
    const value = {
        serverUrl
    }

    return (
        <authContext.Provider value={value}>
            {children}
        </authContext.Provider>
    )
}

export default AuthContext