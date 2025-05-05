import { createSlice } from "@reduxjs/toolkit"
import { SignInManager } from "../../hooks";
import { localStorageGet, localStorageSet } from '../../utils/localStorage';
import useMediaQuery from '@mui/material/useMediaQuery';


const initialState: AppAuthSlice = {
    isAuthenticated: new SignInManager().IsAuthenticated,
    darkMode: false
}

const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsAuthenticated: (state: AppAuthSlice, action: IAction<boolean>) => {
            state.isAuthenticated = action.payload
        },
        setCurrentUserToken: (state: AppAuthSlice, action: IAction<ClaimsModel | undefined | null>) => {
            if (action.payload && Object.keys(action.payload).length > 0) {

                const expireTime = Date.now() + 300000;
                const generated = new Date();
                generated.setSeconds(generated.getSeconds() + 86400     );
                const claims = {
                    token: action.payload.token,
                    expiry: action.payload.expiry,
                    expireTime: expireTime.toString(),
                    generated: new Date().toISOString(),
                   
                    validUntil: generated.toISOString()
                     
                } as ClaimsModel;
                state.accessToken = claims;

            }
            else {
                state.accessToken= undefined;

            }
        },
        setDarkMode: (state: AppAuthSlice, action: IAction<boolean>) => {
            // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
            //const previousDarkMode = Boolean(localStorageGet('darkMode'));
            // state.darkMode=previousDarkMode || prefersDarkMode;
            state.darkMode = action.payload;
            localStorageSet('darkMode', state.darkMode);
        },
        setSignout: (state: AppAuthSlice, action: IAction<boolean>) => {
            state.accessToken = undefined;
            state.isAuthenticated = false;

        },


    },
});

export const {
    setIsAuthenticated,
    setCurrentUserToken,
    setDarkMode,
    setSignout
} = userSlice.actions;

export default userSlice.reducer
