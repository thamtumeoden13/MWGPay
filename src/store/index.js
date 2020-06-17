import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import authenticationReducer from "../reducers";
import { composeWithDevTools } from 'redux-devtools-extension';


const customMiddleWare = store => next => action => {

  /*if(action.type == FETCH_API_FAILURE)
  {
    console.log("Middleware check FETCH_API_FAILURE:", store.getState());
    //RegisterClientInfo
    const unAuthenStatus = [10,11,12,13,18];
    const state = store.getState();
    if(unAuthenStatus.includes(action.ErrorStatus))
    {
        store.dispatch(logout());
        return;
    }
    
  }*/
 

  
  next(action);
}

const store = createStore(authenticationReducer, 
  applyMiddleware(thunkMiddleware,customMiddleWare)
);

export default store;