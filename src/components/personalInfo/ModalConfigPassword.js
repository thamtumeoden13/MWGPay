import React, { useState, useEffect } from 'react';
import { TextField } from 'react-native-material-textfield';
import {
    View,
    TouchableHighlight,
    AlertIOS,
    TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';


export const ModalConfigPassword = (props) => {
    const [password, setPassword] = useState(props.password ? props.password : '')
    const [errors, setErrors] = useState(props.errors ? props.errors : {})
    const [allowTouchID, setAllowTouchID] = useState(false)

    useEffect(() => {
        setErrors(props.errors ? props.errors : {})
    }, [props.errors])

    useEffect(() => {
        if (props.onChangeText)
            props.onChangeText(password)
        setErrors({})
    }, [password])

    useEffect(() => {
        appSettingData();
    }, [])

    const appSettingData = async () => {
        const StorageInfo = await AsyncStorage.getItem('AppSetting')
        const appSetting = JSON.parse(StorageInfo)
        setAllowTouchID(appSetting.allowTouchID)
    }

    return (
        <React.Fragment>
            <TextField
                label='Nhập mật khẩu'
                inputContainerStyle={{ width: '100%', borderBottomColor: '#b7b7b7', borderBottomWidth: 1, }}
                value={password}
                onChangeText={(value) => setPassword(value)}
                clearButtonMode="always"
                keyboardType="number-pad"
                secureTextEntry={true}
                maxLength={6}
                autoFocus={true}
                error={errors.password}
                errorColor="red"
            />
            <View style={{
                height: 60,
                width: "95%",
                justifyContent: 'center'
            }}>
                {
                    allowTouchID &&
                    <TouchableOpacity onPress={props.onConfirmTouchID}>
                        <Icon
                            name="fingerprint"
                            type="material-community"
                            color="#2f2f2f"
                            size={50}
                        />
                    </TouchableOpacity>
                }
            </View>
        </React.Fragment>
    );
}