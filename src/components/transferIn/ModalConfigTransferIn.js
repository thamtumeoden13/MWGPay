import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Platform,
    TextInput,
} from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { Button } from 'react-native-elements';

import { formatMoney, getOnlyNumber } from '@utils/function';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export const ModalConfigTransferIn = (props) => {
    const [value, setValue] = useState(props.value)
    const [message, setMessage] = useState('')
    const [errors, setErrors] = useState(props.error ? props.error : {})
    const maxLength = 10;
    const onChangeText = (amount) => {
        const formatValue = getOnlyNumber(amount, maxLength)
        setValue(formatValue)
        if (props.onChangeText)
            props.onChangeText(formatValue)
        setErrors({})
    }

    useEffect(() => {
        setErrors(props.errors)
    }, [props.errors])

    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.containerScrollView}>
            <View style={styles.container} >
                <View style={styles.containerTextField}>
                    <TextField
                        label='Nhập số tiền muốn nhận'
                        inputContainerStyle={{ borderBottomColor: '#b7b7b7', borderBottomWidth: 1, }}
                        containerStyle={{ width: '100%' }}
                        value={value == '0' ? '' : value}
                        onChangeText={(value) => onChangeText(value)}
                        clearButtonMode="always"
                        prefix="$"
                        error={errors.value}
                        errorStyle={{ textAlign: 'left', fontSize: 12, }}
                        keyboardType='number-pad'
                        maxLength={maxLength}
                        autoFocus={true}
                    />
                </View>
                <View style={styles.containerButtonGroup}>
                    <Button
                        title="Huỷ"
                        type="solid"
                        buttonStyle={styles.cancelButton}
                        containerStyle={styles.containerButton}
                        textStyle={styles.title}
                        onPress={props.onClose}
                    />
                    <Button
                        title="Xác nhận"
                        buttonStyle={styles.confirmButton}
                        containerStyle={styles.containerButton}
                        textStyle={styles.title}
                        type="solid"
                        onPress={() => props.onConfirm(value)}
                    />
                </View>
            </View>
        </KeyboardAwareScrollView>

    );
}
const styles = StyleSheet.create({
    containerScrollView: {
        flexGrow: 1,
        justifyContent: "flex-end",
    },
    container: {
        height: Platform.OS === "ios" ? "20%" : "30%",
        width: "100%",
        backgroundColor: '#fff',
        justifyContent: "flex-start",
    },
    containerTextField: {
        width: '95%',
        flexDirection: 'row',
        height: 50,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 10,

    },
    containerButtonGroup: {
        flexDirection: "row",
        justifyContent: 'space-around',
        width: "100%",
        marginVertical: 20,
        paddingTop: 10,
    },
    containerButton: {
        width: Dimensions.get("screen").width / 3,
        height: 40,
    },
    title: {
        textAlign: 'center'
    },
    cancelButton: {
        backgroundColor: 'gray',
        borderRadius: 2,
    },
    confirmButton: {
        backgroundColor: 'blue',
        borderRadius: 2,
    }
});