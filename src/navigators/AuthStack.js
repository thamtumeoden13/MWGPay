import {
    createStackNavigator,
} from 'react-navigation';

import SignInScreen from '@screens/signIn/SignInScreen';
import ReSignInScreen from '@screens/signIn/ReSignInScreen';
import SignUp from '@screens/signUp';
import ConfirmOTPSignUp from '@screens/signUp/ConfirmOTP'
import ConfirmPasswordSignUp from '@screens/signUp/ConfirmPassword';
import InfoCustomer from '@screens/signUp/InfoCustomer';
import ForgotPassword from '@screens/forgotPassword';
import ConfirmOTPForgotPassword from '@screens/forgotPassword/ConfirmOTP';
import ConfirmPasswordForgotPassword from '@screens/forgotPassword/ConfirmPassword';
import ConfirmOTPChangeDevice from '@screens/signIn/ConfirmOTP'

export const AuthStack = createStackNavigator(
    {
        ReSignIn: ReSignInScreen,
        SignIn: SignInScreen,
        SignUp: SignUp,
        ConfirmOTPSignUp: ConfirmOTPSignUp,
        ConfirmPasswordSignUp: ConfirmPasswordSignUp,
        InfoCustomer: InfoCustomer,
        ForgotPassword: ForgotPassword,
        ConfirmOTPForgotPassword: ConfirmOTPForgotPassword,
        ConfirmPasswordForgotPassword: ConfirmPasswordForgotPassword,
        ConfirmOTPChangeDevice: ConfirmOTPChangeDevice,
        // Lock: Lock
    },
    {
        headerMode: "none",
    }
);