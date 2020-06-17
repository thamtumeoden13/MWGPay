import { createStackNavigator } from 'react-navigation-stack';
// import {
//     createStackNavigator,
// } from 'react-navigation';

import SignInScreen from '@screens/signIn/SignInScreen';
import ReSignInScreen from '@screens/signIn/ReSignInScreen';

export const AuthStack = createStackNavigator(
    {
        ReSignIn: ReSignInScreen,
        SignIn: SignInScreen,
        // Lock: Lock
    },
    {
        headerMode: "none",
    }
);