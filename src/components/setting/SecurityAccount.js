import React, { component, useEffect, useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, Alert, AlertIOS, Platform } from 'react-native'
import { ListItem } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { TIMEOUT_LOCK_SCREEN } from '@constants/appSetting';
import TouchID from 'react-native-touch-id';
import { authenticateTouchID, supportedTouchID, supportedTouchIDAndroid } from '@utils/function';

const WIDTH = Dimensions.get('window').width
const ConfigObject = {
    unifiedErrors: false,
    passcodeFallback: false,
}

export const SecurityAccount = (props) => {
    const [switchToggle, SetSwitchToggle] = useState(props.appSetting.allowTouchID ? props.appSetting.allowTouchID : false)
    const [rightIcon, SetRightIcon] = useState({})


    const onChangeSwitch = () => {
        TouchID.isSupported(ConfigObject).then(biometryType => {
            if (biometryType === 'FaceID') {
                if (switchToggle) {
                    SetSwitchToggle(false);
                    const appSetting = {
                        timeout: TIMEOUT_LOCK_SCREEN,
                        allowTouchID: false
                    }
                    AsyncStorage.setItem('AppSetting', JSON.stringify(appSetting));
                    Alert.alert("Bạn đã tắt tính năng xác thực FaceID", "");
                }
                else {
                    SetSwitchToggle(true);
                    const appSetting = {
                        timeout: TIMEOUT_LOCK_SCREEN,
                        allowTouchID: true
                    }
                    AsyncStorage.setItem('AppSetting', JSON.stringify(appSetting))
                    Alert.alert("Bạn đã bật tính năng xác thực FaceID", "");
                }
            } else if (biometryType === 'TouchID') {
                if (switchToggle) {
                    SetSwitchToggle(false);
                    const appSetting = {
                        timeout: TIMEOUT_LOCK_SCREEN,
                        allowTouchID: false
                    }
                    AsyncStorage.setItem('AppSetting', JSON.stringify(appSetting));
                    Alert.alert("Bạn đã tắt tính năng xác thực TouchID", "");
                }
                else {
                    SetSwitchToggle(true);
                    const appSetting = {
                        timeout: TIMEOUT_LOCK_SCREEN,
                        allowTouchID: true
                    }
                    AsyncStorage.setItem('AppSetting', JSON.stringify(appSetting))
                    Alert.alert("Bạn đã bật tính năng xác thực TouchID", "");
                }
            }
            else if (biometryType === true) {
                if (switchToggle) {
                    SetSwitchToggle(false);
                    const appSetting = {
                        timeout: TIMEOUT_LOCK_SCREEN,
                        allowTouchID: false
                    }
                    AsyncStorage.setItem('AppSetting', JSON.stringify(appSetting));
                    Alert.alert("Bạn đã tắt tính năng xác thực TouchID", "");
                }
                else {
                    SetSwitchToggle(true);
                    const appSetting = {
                        timeout: TIMEOUT_LOCK_SCREEN,
                        allowTouchID: true
                    }
                    AsyncStorage.setItem('AppSetting', JSON.stringify(appSetting))
                    Alert.alert("Bạn đã bật tính năng xác thực TouchID", "");
                }
            }
        }).catch(error => {
            // console.log("Platform.OS", Platform.OS)
            let resultErrors;
            if (Platform.OS === "ios") {
                resultErrors = supportedTouchID(error.name);
            }
            if (Platform.OS === "android") {
                resultErrors = supportedTouchIDAndroid(error.code);
            }
            Alert.alert(resultErrors);
        });


    }

    const onChangePassword = () => {
        if (props.onChangePassword)
            props.onChangePassword()
    }


    useEffect(() => {
        if (switchToggle) {
            SetRightIcon({
                name: 'toggle-switch', type: 'material-community',
                color: '#2196f3eb', size: 50, iconStyle: { lineHeight: 40, height: 30 },
                onPress: () => onChangeSwitch()
            })
        }
        else {
            SetRightIcon({
                name: 'toggle-switch-off', type: 'material-community',
                color: '#80808091', size: 50, iconStyle: { lineHeight: 40, height: 30 },
                onPress: () => onChangeSwitch()
            })
        }
    }, [switchToggle])


    useEffect(() => {
        SetSwitchToggle(props.appSetting.allowTouchID)
    }, [props.appSetting.allowTouchID])

    return (
        <View style={styles.containerPaymentSetting}>
            <View style={styles.containerHeaderTitle}>
                <Text style={styles.HeaderTitle}>BẢO MẬT TÀI KHOẢN</Text>
            </View>
            <TouchableOpacity>
                <ListItem
                    title='Đổi mật khẩu'
                    rightIcon={{ name: "chevron-right", type: 'material-community', color: 'gray' }}
                    iconStyle
                    bottomDivider={true}
                    containerStyle={{ marginHorizontal: 5 }}
                    titleStyle={{ fontSize: 14, width: WIDTH * 0.5, textAlign: "left" }}
                    rightTitleStyle={{ fontSize: 14, width: WIDTH * 0.5, textAlign: "right" }}
                    onPress={() => onChangePassword()}
                />
            </TouchableOpacity>
            <TouchableOpacity>
                <ListItem
                    title='Tự động khoá ứng dụng'
                    rightTitle='10 phút'
                    rightIcon={{ name: "caret-down", type: 'font-awesome', color: 'gray' }}
                    iconStyle
                    bottomDivider={true}
                    containerStyle={{ marginHorizontal: 5 }}
                    titleStyle={{ fontSize: 14, width: WIDTH * 0.5, textAlign: "left" }}
                    rightTitleStyle={{ fontSize: 14, width: WIDTH * 0.5, textAlign: "right" }}

                />
            </TouchableOpacity>
            <TouchableOpacity>
                <ListItem
                    title='Xác thực sinh trắc học'
                    rightIcon={rightIcon}
                    iconStyle
                    bottomDivider={true}
                    containerStyle={{ marginHorizontal: 5 }}
                    titleStyle={{ fontSize: 14, width: WIDTH * 0.5, textAlign: "left" }}
                    rightTitleStyle={{ fontSize: 30, width: WIDTH * 0.5, textAlign: "right" }}
                />
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    containerPaymentSetting: {
        backgroundColor: "transparent",
        marginTop: 10,
        width: '100%',
    },
    containerHeaderTitle: {
        marginHorizontal: 10,
        marginTop: 10,
        marginBottom: 5
    },
    HeaderTitle: {
        textAlign: 'left',
        color: "#000",
        fontSize: 16
    },
});