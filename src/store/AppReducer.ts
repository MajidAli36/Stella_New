// import { localStorageSet } from '../utils/localStorage';
// import { AppStoreState } from './AppStore';

// /**
//  * Reducer for global AppStore using "Redux styled" actions
//  * @param {object} state - current/default state
//  * @param {string} action.type - unique name of the action
//  * @param {*} [action.payload] - optional data object or the function to get data object
//  */
// const AppReducer: React.Reducer<AppStoreState, any> = (state, action) => {
//
//   switch (action.type || action.action) {
//     case 'CURRENT_USER':
//       return {
//         ...state,
//         currentUserClaim: action?.currentUserClaim || action?.payload,
//       };
//     case 'SIGN_UP':
//     case 'LOG_IN':
//       return {
//         ...state,
//         isAuthenticated: true,
//       };
//     case 'LOG_OUT':
//       return {
//         ...state,
//         isAuthenticated: false,
//         currentUserClaim: undefined, // Also reset previous user data
//       };
//     case 'DARK_MODE': {
//       const darkMode = action?.darkMode ?? action?.payload;
//       localStorageSet('darkMode', darkMode);
//       return {
//         ...state,
//         darkMode,
//       };
//     }
//     default:
//       return state;
//   }
// };

// export default AppReducer;
