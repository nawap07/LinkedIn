import React from 'react'
import { createContext } from 'react'

export const authContext = createContext({});


const AuthContext = ({ children }) => {
    const serverUrl = "http://localhost:3000"
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