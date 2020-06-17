import React, { Component } from 'react';
import { CreateAppContainer } from './navigators'
import { Provider } from 'react-redux';
import store from './store';
import { YellowBox, Alert } from 'react-native';
import firebase from "react-native-firebase";
import RNRestart from 'react-native-restart';
import { setJSExceptionHandler } from "react-native-exception-handler";
//import {HashingSHA256} from './common/library/cryptography/DotNetRSACrypto.js';
import 'react-native-gesture-handler';
console.disableYellowBox = true

const exceptionhandler = (error, isFatal) => {
    if (isFatal) {
        Alert.alert(
            'Unexpected error occurred',
            `
                Error: ${(isFatal) ? 'Fatal:' : ''} ${error.name} ${error.message}
        
                We will need to restart the app.
                `,
            [{
                text: 'OK',
                onPress: () => {
                    console.log("save log")
                }
            }]
        );
    } else {
        console.log("exceptionhandler", error); // So that we can see it in the ADB logs in case of Android if needed
    }

};
setJSExceptionHandler(exceptionhandler, true);


class App extends Component {

    componentDidMount() {
        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    // user has permissions
                    firebase.messaging().getToken()
                        .then(fcmToken => {
                            if (fcmToken) {
                                // user has a device token
                                // console.log("FCM TOKEN :", fcmToken);
                            } else {
                                // user doesn't have a device token yet
                            }
                        });
                } else {
                    // user doesn't have permission
                    firebase.messaging().requestPermission()
                        .then(() => {
                            // User has authorised  
                        })
                        .catch(error => {
                            // User has rejected permissions  
                        });
                }
            });

    }
    render() {
        //const hashTest = HashingSHA256("Trung tâm khí tượng Việt Nam nhận định ngày 30/12, các tỉnh miền Bắc sẽ giảm mưa, chuyển nắng về trưa và chiều. Từ 31/12, mức nhiệt cao nhất ở Bắc Bộ không quá 23 độ, các tỉnh vùng núi dưới 20 độ. Về đêm, nhiệt độ khu vực đồng bằng dưới 17 độ, miền núi dưới 15 độ.");
        //console.log("hashTest:", hashTest);
        return <Provider store={store}><CreateAppContainer /></Provider>;
    }
}

export default App;