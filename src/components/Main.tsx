import { JSXElement, createContext, useContext, createSignal } from "solid-js"

// Create a context for user data
export const UserContext = createContext()

type MainProps = {
    children: JSXElement
}

export function MainCentered(props: MainProps) {
    return (
        <main class="text-center mx-auto text-gray-700 p-4">
            {props.children}
        </main>
    )
}

// Add a provider component for user data
export function UserProvider(props) {
    const [userData, setUserData] = createSignal(null)
    
    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {props.children}
        </UserContext.Provider>
    )
}

// Custom hook to access user data
export function useUser() {
    return useContext(UserContext)
}