
import axios from "axios";
import { NavigateFunction } from "react-router-dom";
import { SignInManager } from "../hooks";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";

// export const GetAxios = (navigate?: NavigateFunction, dispatch?: Dispatch<AnyAction>) => {
//     const token = new SignInManager().AccessToken;
//     axios.interceptors.request.use(
//         config => {
//             if (token) {
//                 if (config.headers) {
//                     config.headers['Authorization'] = 'Bearer ' + token
//                 }
//             }
//             // config.headers['Content-Type'] = 'application/json';
//             axios.interceptors.request.clear();
//             return config
//         },
//         error => {
//             axios.interceptors.request.clear();
//             Promise.reject(error)
//         }
//     )
//     axios.interceptors.response.use((resp) => {
//         axios.interceptors.response.clear();
//         return resp;
//     }, (error) => {
//         console.error(error);
//         if (error.response) {
//             console.error(error.response);
//             if (error.response.status === 401) {
//                 if (navigate) {
//                    // dispatch(setShowModel(true));
//                    navigate('/auth/login');
//                     axios.interceptors.response.clear();
//                     return Promise.reject(error?.response);
//                 }
//                 else {
//                    // alert("You are not allowed");
//                     axios.interceptors.response.clear();
//                     return Promise.reject(error?.response);
//                 }
//             } else if (error.response.status === 403) {
//                 if (navigate) {
//                     navigate('/forbidden403');
//                     axios.interceptors.response.clear();
//                     return Promise.reject(error?.response);
//                 }
//                 else {
//                    // alert("You are not allowed");
//                     axios.interceptors.response.clear();
//                     return Promise.reject(error?.response);
//                 }
//             }
//         }
//         axios.interceptors.response.clear();
//         if (error?.response && error?.response?.data) {
//             return Promise.reject(error?.response?.data);
//         }
//         return Promise.reject(error);
//     });
//     return axios;
// }
export const GetAxiosLite = () => {
    const token = new SignInManager().AccessToken;
    axios.interceptors.request.use(
        config => {
            if (token) {
                if (config.headers) {
                    config.headers['Authorization'] = 'Bearer ' + token
                }
            }
            // config.headers['Content-Type'] = 'application/json';
            axios.interceptors.request.clear();
            return config
        },
        error => {
            axios.interceptors.request.clear();
            Promise.reject(error)
        }
    )
    axios.interceptors.response.use((resp) => {
        axios.interceptors.response.clear();
        return resp;
    }, (error) => {
        console.error(error);
        if (error.response) {
            console.error(error.response);
            
        }
        axios.interceptors.response.clear();
        if (error?.response && error?.response?.data) {
            return Promise.reject(error?.response?.data);
        }
        return Promise.reject(error);
    });
    return axios;
}


export interface ApiResponse {
    success: boolean,
    message?: string,
    timeStamp: Date
};

export interface ApiResponseE<T> {
    data: T,
    success: boolean,
    message?: string,
    timeStamp: Date
};

export const GetAxios = (navigate?: NavigateFunction, dispatch?: Dispatch<AnyAction>) => {
    const token = new SignInManager().AccessToken;
    const requestInterceptor = axios.interceptors.request.use(
        config => {
            if (token) {
                if (config.headers) {
                    config.headers['Authorization'] = 'Bearer ' + token
                }
            }
            return config
        },
        error => {
            return Promise.reject(error)
        }
    );

    const responseInterceptor = axios.interceptors.response.use((resp) => {
        return resp;
    }, (error) => {
        console.error(error);
        if (error.response) {
            console.error(error.response);
            if (error.response.status === 401) {
                if (navigate) {
                    navigate('/auth/login');
                    axios.interceptors.response.eject(responseInterceptor);
                    return Promise.reject(error?.response);
                }
                else {
                    axios.interceptors.response.eject(responseInterceptor);
                    return Promise.reject(error?.response);
                }
            } else if (error.response.status === 403) {
                if (navigate) {
                    navigate('/forbidden403');
                    axios.interceptors.response.eject(responseInterceptor);
                    return Promise.reject(error?.response);
                }
                else {
                    axios.interceptors.response.eject(responseInterceptor);
                    return Promise.reject(error?.response);
                }
            }
        }

        if (error?.response && error?.response?.data) {
            return Promise.reject(error?.response?.data);
        }
        return Promise.reject(error);
    });

    return axios;
}
