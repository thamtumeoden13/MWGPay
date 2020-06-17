import React, { Component, useState, useEffect } from 'react'
import { Alert, View, Text, StyleSheet, StatusBar, UIManager, Linking, Platform, Dimensions } from 'react-native';
import { ListItem, Divider, Icon, Input, Button } from 'react-native-elements';

export const CancelShipmentOrder = (props) => {

    const [state, setState] = useState({
        reason: '',
        note: ''
    })

    const [errors, setErrors] = useState({
        reason: '', note: ''
    })

    const onChangeText = (name, value) => {
        setState({ ...state, [name]: value })
    }

    const cancelOrder = () => {
        if (state.reason.toString().trim().length <= 0) {
            setErrors({ ...errors, reason: 'Vui lòng nhập lí do huỷ' })
        }
        else {
            if (props.cancelOrder) {
                props.cancelOrder(state)
            }
        }
    }

    useEffect(() => {
        console.log(state)
    }, [state])

    return (

        <View style={styles.container}>
            <Input
                leftIcon={
                    <Icon
                        name="description"
                        type="material"
                        color="#288ad6"
                        size={18}
                    />
                }
                onChangeText={(value) => onChangeText('reason', value)}
                value={state.reason}
                inputStyle={{ marginLeft: 10, color: '#000', fontSize: 16 }}
                keyboardAppearance="light"
                placeholder={"Lý do huỷ"}
                autoFocus={true}
                autoCapitalize="none"
                // maxLength={10}
                autoCorrect={true}
                // keyboardType="number-pad"
                blurOnSubmit={true}
                placeholderTextColor="gray"
                errorStyle={{ textAlign: 'left' }}
                errorMessage={errors.reason}
            />
            <Input
                leftIcon={
                    <Icon
                        name="description"
                        type="material"
                        color="#288ad6"
                        size={18}
                    />
                }
                onChangeText={(value) => onChangeText('note', value)}
                value={state.note}
                inputStyle={{ marginLeft: 10, color: '#000', fontSize: 16 }}
                keyboardAppearance="light"
                placeholder={"Ghi chú"}
                autoCapitalize="none"
                // maxLength={10}
                autoCorrect={true}
                // keyboardType="number-pad"
                blurOnSubmit={true}
                placeholderTextColor="gray"
                errorStyle={{ textAlign: 'left' }}
                errorMessage={errors.note}
            />
            <View style={{
                width: "100%",
                marginTop: 20,
                marginBottom: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'stretch'
            }}>
                <Button
                    title="Huỷ giao hàng"
                    activeOpacity={0.7}
                    underlayColor="rgba(255, 243, 216,1)"
                    onPress={() => cancelOrder()}
                    loadingProps={{
                        size: 'large',
                        color: '#000',
                        hidesWhenStopped: true,
                    }}
                    buttonStyle={{
                        height: 50,
                        width: "100%",
                        backgroundColor: '#fff',
                        borderWidth: 2,
                        borderColor: '#288ad6',
                        borderRadius: 10,
                    }}
                    containerStyle={{ width: '45%' }}
                    titleStyle={{ fontWeight: '600', color: '#288ad6' }}
                />
                <Button
                    activeOpacity={0.7}
                    icon={
                        <Icon
                            name="close"
                            size={24}
                            color="#f00"
                        />
                    }
                    buttonStyle={{
                        height: 50,
                        width: "100%",
                        backgroundColor: '#fff',
                        borderWidth: 2,
                        borderColor: '#f00',
                        borderRadius: 10,
                    }}
                    title="Đóng"
                    titleStyle={{ fontWeight: '600', color: '#f00' }}
                    containerStyle={{ width: 100, marginHorizontal: 10, justifyContent: "center", alignItems: "center" }}
                    onPress={props.onCloseModalInputForm}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#288ad6',
        backgroundColor: '#fff'
    },
});