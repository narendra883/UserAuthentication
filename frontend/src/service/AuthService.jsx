import axios from "axios";


class AuthService{
    static BASE_URL = "http://localhost:5000";

    static async login(email, password){
        try{
            const response = await axios.post("http://localhost:8080/api/users/login", {email, password})
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async register(userData){
        try{
            const response = await axios.post(`${this.BASE_URL}/api/users/register`, userData);
            
            return response.data;
        }catch(err){
            throw err;
        }
    }
    static async getUserDetails() {
        
        const token = localStorage.getItem('token');
        const response = await axios.get(`${this.BASE_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        return response.data;
    }
    
    

    /**AUTHENTICATION CHECKER */
    static logout(){
        localStorage.removeItem('email')
        
    }

    static isAuthenticated(){
        const email = localStorage.getItem('email')
        return !!email
    }

    
}

export default AuthService;


    