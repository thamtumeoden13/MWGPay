import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import { Avatar, CheckBox } from 'react-native-elements';

const Sex = (props) => {
    const initState = {
        checked0: false,
        checked1: false,
        checked2: false
    }
    const [state, setState] = useState(initState)

    const stateValue = (identityID) => {
        let stateTemp = {
            checked0: false,
            checked1: false,
            checked2: false
        };
        switch (identityID.toString()) {
            case "0":
                stateTemp.checked0 = !state.checked0
                break;
            case "1":
                stateTemp.checked1 = !state.checked1
                break;
            case "2":
                stateTemp.checked2 = !state.checked2
                break;
        }
        return stateTemp
    }

    const onchangeIdentityID = (identityID) => {
        let stateTemp = stateValue(identityID);
        setState(stateTemp)
        let returnIdentityID = identityID
        if (JSON.stringify(stateTemp) === JSON.stringify(initState)) {
            returnIdentityID = "-1"
        }
        if (props.onchangeIdentityID) {
            props.onchangeIdentityID(returnIdentityID)
        }
    }

    useEffect(() => {
        let stateTemp = stateValue(props.initIdentityID ? props.initIdentityID : "0");
        setState(stateTemp)
    }, [props.initIdentityID])


    return (
        <View style={styles.container}>
            <View style={styles.containerLabel}>
                <Text style={{ fontSize: 15, color: '#000', textAlign: "left", fontWeight: 'bold', }}>Giới tính</Text>
            </View>
            <View style={styles.containerDetail}>
                <CheckBox
                    center
                    title='Nam'
                    checkedColor='green'
                    checked={state.checked0}
                    onPress={() => onchangeIdentityID("0")}
                    containerStyle={{ alignItems: 'flex-start', height: 40, width: '30%' }}
                    size={20}
                />
                <CheckBox
                    center
                    title='Nữ'
                    checkedColor='green'
                    checked={state.checked1}
                    onPress={() => onchangeIdentityID("1")}
                    containerStyle={{ alignItems: 'flex-start', height: 40, width: '30%' }}
                    size={20}
                />
                <CheckBox
                    center
                    title='Khác'
                    checkedColor='green'
                    checked={state.checked2}
                    onPress={() => onchangeIdentityID("2")}
                    containerStyle={{ alignItems: 'flex-start', height: 40, width: '30%' }}
                    size={20}
                />
            </View>
        </View>
    );
}
export default Sex;
const styles = StyleSheet.create({
    container: {
        height: 80,
        width: "100%",
        paddingHorizontal: 10
    },
    containerLabel: { width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start' },
    containerDetail: { flexDirection: 'row', width: '100%', height: 60, justifyContent: 'space-around', alignItems: 'center' },
});