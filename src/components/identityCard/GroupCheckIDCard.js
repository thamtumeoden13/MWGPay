import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import { Avatar, CheckBox } from 'react-native-elements';

export const IdentityCard = (props) => {
    const initState = {
        checked0: false,
        checked1: false,
        checked2: false
    }
    const [state, setState] = useState(initState)

    const stateValue = (identityTypeID) => {
        let stateTemp = {
            checked0: false,
            checked1: false,
            checked2: false
        };
        switch (identityTypeID.toString()) {
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

    const onchangeIdentityTypeID = (identityTypeID) => {
        let stateTemp = stateValue(identityTypeID);
        setState(stateTemp)
        let returnIdentityTypeID = identityTypeID
        if (JSON.stringify(stateTemp) === JSON.stringify(initState)) {
            returnIdentityTypeID = "-1"
        }
        if (props.onchangeIdentityTypeID) {
            props.onchangeIdentityTypeID(returnIdentityTypeID)
        }
    }

    useEffect(() => {
        let stateTemp = stateValue(props.initIdentityTypeID ? props.initIdentityTypeID : "0");
        setState(stateTemp)
    }, [props.initIdentityTypeID])


    return (
        <React.Fragment>
            <Text style={{ fontSize: 16, color: '#000', textAlign: "left", fontWeight: 'bold', paddingLeft: 10 }}>
                Chọn loại giấy xác thực
            </Text>
            <View>
                <CheckBox
                    center
                    title='Chứng minh nhân dân'
                    checkedColor='green'
                    checked={state.checked0}
                    onPress={() => onchangeIdentityTypeID("0")}
                    containerStyle={{ alignItems: 'flex-start' }}
                />
                <CheckBox
                    center
                    title='Căn cước công dân'
                    checkedColor='green'
                    checked={state.checked1}
                    onPress={() => onchangeIdentityTypeID("1")}
                    containerStyle={{ alignItems: 'flex-start' }}
                />
                <CheckBox
                    center
                    title='Hộ chiếu'
                    checkedColor='green'
                    checked={state.checked2}
                    onPress={() => onchangeIdentityTypeID("2")}
                    containerStyle={{ alignItems: 'flex-start' }}
                />
            </View>
        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        // paddingHorizontal: 5
    },
    containerAvatar: {
        width: '100%',
        marginTop: 10,
        paddingHorizontal: 5,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: "center",
    },
    containerName: {
        width: '100%',
        paddingHorizontal: 5,
        paddingVertical: 10,
    }
});