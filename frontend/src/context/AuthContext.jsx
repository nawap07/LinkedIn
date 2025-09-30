import React from 'react'
import { createContext } from 'react'

export const authContext = createContext({});


const AuthContext = ({ children }) => {
    const serverUrl = "https://linkedin-w07k.onrender.com"
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