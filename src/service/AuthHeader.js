//export function authHeader() {
//    // return authorization header with jwt token
//    let user = JSON.parse(localStorage.getItem('user'));
    
//    if (user && user.token) {
//        return { 'Authorization': 'Bearer ' + user.token };
//    } else {
//        return {};
//    }
//}

export function authHeader(data) {
    // return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.Token) {
        return {
           // Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + user.Token,
            'userID': user.Id,
            'data': data
        };
    } else {
        return {};
    }
}