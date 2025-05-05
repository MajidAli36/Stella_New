import { environment } from "./Environment";

export const api_base = process.env.REACT_APP_API_URL || '';
export const identity_base = process.env.REACT_APP_IDENTITY_URL || '';



export const config = environment.production ? {
    apiBase: api_base,
  
    
} : {
    apiBase: api_base,
   
};
