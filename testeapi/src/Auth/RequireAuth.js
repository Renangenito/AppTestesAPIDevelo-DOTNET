import {Navigate} from "react-router-dom"

export const RequireAuth = ({children}) => {
    const auth = sessionStorage.getItem("auth");

    if(!auth){
        return <Navigate to ='/login'/>
    }

    return children

}