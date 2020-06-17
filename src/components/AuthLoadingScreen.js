import React, { Component } from 'react';
import {
    ActivityIndicator,
    StatusBar,
    View,
    StyleSheet,
    ImageBackground,
    Platform,
    Alert,
    BackHandler,
    // AsyncStorage
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';
import JailMonkey from 'jail-monkey';
import { ModalCenterAlert } from "@componentsCommon/modal/ModalCenterAlert";
import RNExitApp from 'react-native-exit-app';

export default class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalAlert: false,
            typeModalAlert: '',
            titleModalAlert: '',
            contentModalAlert: '',
        };
    }

    componentDidMount() {
        setTimeout(() => {


            // console.log("JailMonkey.canMockLocation()", JailMonkey.canMockLocation())
            // console.log("JailMonkey.trustFall()", JailMonkey.trustFall())
            // console.log("JailMonkey.isOnExternalStorage()", JailMonkey.isOnExternalStorage())
            // console.log("JailMonkey.AdbEnabled()", JailMonkey.AdbEnabled())
            // console.log("JailMonkey.isDebuggedMode()", JailMonkey.isDebuggedMode())
            // console.log("JailMonkey.isDevelopmentSettingsMode()", JailMonkey.isDevelopmentSettingsMode())
        }, 500);
        setTimeout(() => {
            //const isJailBroken = JailMonkey.isJailBroken();
            const isJailBroken = false;
            //console.log("JailMonkey.isJailBroken()", isJailBroken);
            let contentAlert = ''
            if (Platform.OS === 'ios') {
                contentAlert = 'Máy của bạn đã bị jailbreak nên không thể đăng nhập';
            } else {
                contentAlert = 'Máy của bạn đã bị root nên không thể đăng nhập';
            }
            if (isJailBroken) {
                // Alert.alert(
                //     'Alert Title',
                //     'My Alert Msg',
                //     { text: 'OK', onPress: () => BackHandler.exitApp() },
                // )
                this.setState({
                    isModalAlert: true,
                    typeModalAlert: 'warning',
                    titleModalAlert: 'Lỗi đăng nhập',
                    contentModalAlert: contentAlert
                })
            }
            else {
                this.storeData();
            }
        }, 2000);
    }

    storeData = async () => {
        const StorageInfo = await AsyncStorage.getItem('UserInfo')
        if (StorageInfo) {
            const userInfo = JSON.parse(StorageInfo)
            if (userInfo && userInfo.hasSignIn) {
                this.props.navigation.navigate('ReSignIn', { isModalVisible: false, })
            }
            else {
                this.props.navigation.navigate('SignIn')
            }
        }
        else {
            this.props.navigation.navigate('SignIn')
        }
    }
    onCloseModalAlert = (value) => {
        this.setState({ isModalAlert: false, typeModalAlert: '', })
        RNExitApp.exitApp();
    }

    // Render any loading content that you like here
    render() {
        const { isModalAlert, typeModalAlert, titleModalAlert, contentModalAlert
        } = this.state;
        return (
            <View >
                <ActivityIndicator size="large" color="#0000ff" />
                <ModalCenterAlert
                    isCancel={true}
                    isOK={true}
                    isVisible={isModalAlert}
                    typeModal={typeModalAlert}
                    titleModal={titleModalAlert}
                    contentModal={contentModalAlert}
                    onCloseModalAlert={this.onCloseModalAlert}
                />
                {Platform.OS == 'ios' ?
                    <ImageBackground style={{ width: 60, height: 60, justifyContent: 'center', alignContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}
                        resizeMode='contain'
                        source={require('@assets/bg/loading.gif')}
                    ></ImageBackground>
                    :
                    <View style={styles.bottomModal}>
                        <LottieView
                            source={require('@assets/bg/material-wave-loading.json')}
                            colorFilters={[{
                                keypath: "button",
                                color: "#F00000"
                            }, {
                                keypath: "Sending Loader",
                                color: "#F00000"
                            }]}
                            style={{ width: 80, height: 80, justifyContent: 'center', }}
                            autoPlay
                            loop
                        />
                    </View>
                }
                <StatusBar backgroundColor="red" barStyle="dark-content" hidden />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },

    bottomModal: {
        justifyContent: 'center',
        alignItems: "center",
        margin: 0,
    },
})