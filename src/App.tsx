import { AppThemeProvider } from './theme';
import { AppStore } from './store';
import { Provider } from 'react-redux';
import { ErrorBoundary } from './components';
import Routes from './routes';
import { SnackbarProvider } from 'notistack';
import { BottomBar } from './layout/BottomBar/index';
import Button from '@mui/material/Button';
// import { useNavigate } from "react-router-dom";

// let navigate = useNavigate(); 
// const routeChange = () =>{ 
//   let path = '/policy'; 
//   navigate(path);
// }

/**
 * Root Application Component
 * @component MainApp
 */
const MainApp = () => {
  return (
    <div>
      <ErrorBoundary name="App">
      {/* <AppStore> */}
      <Provider store={AppStore}>
        <AppThemeProvider>
        <SnackbarProvider>
          <Routes />
          </SnackbarProvider>  
        </AppThemeProvider>
      {/* </AppStore> */}
      </Provider>
      {/* <Button color="primary" className="px-4"
            onClick={routeChange}
              >
              Policy
            </Button> */}

            <a href="https://majidalipl-001-site4.otempurl.com/Stella_Privacy_Policy_16052025.docx" target="_blank" rel="noopener noreferrer">
              <Button color="primary" className="px-4">
                Policy
              </Button>
            </a>

                                        
                                        
    </ErrorBoundary>
    </div>
   

  );
};

export default MainApp;
