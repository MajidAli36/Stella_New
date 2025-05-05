import { localStorageGet,localStorageSet,localStorageDelete } from '../utils/localStorage';


export class SignInManager {
   
    constructor() {

    }
   
    get IsAuthenticated(): boolean {
        const token = this.GetToken();
       // console.log(token);
       const e = Number(localStorage.getItem('expiry'));
      // const g = localStorage.getItem('generated');
        if (token ) {
           // if(token){
          //  const expiry = new Date(e);
            //  return expiry> new Date();
          
           return true;
           
        } else {
            return false;
        }
    }
    UserRole() {

    }
    SetToken(claims: ClaimsModel)  {

        const expireTime = Date.now() + 300000;
        localStorageSet("expireTime", expireTime.toString());
        localStorageSet('token', claims.token || "");
        localStorageSet('expiry', claims.expiry);
        localStorageSet('generated', new Date().toISOString());
      
      
      }
    GetToken() {
        return localStorageGet('token') || '' as string | null
    }

    public get AccessToken(): string {
        const token = this.GetToken();
        if (token) {
            return token;
        }
        else {
            return '';
        }
    }

    RemoveToken() {
        localStorageDelete('token');
        localStorageDelete('generated');
        localStorageDelete('expiry');
       
    }
}