import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Dimensions
} from 'react-native';
import { CheckBox } from 'react-native-elements'

export const ModalConfigGender = (props) => {

    const [gender, setGender] = useState(props.gender ? props.gender : true)
    useEffect(() => {
        if (props.onChangeText)
            props.onChangeText(gender)
    }, [gender])

    useEffect(() => {
        setGender(props.gender)
    }, [props.gender])

    return (
        <View >
            <CheckBox
                center
                title='Nam'
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checked={gender}
                onPress={() => setGender(true)}
                containerStyle={{ alignItems: "flex-start" }}
            />
            <CheckBox
                center
                title='Nữ'
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checked={!gender}
                onPress={() => setGender(false)}
                containerStyle={{ alignItems: "flex-start" }}
            />
        </View>
    );
}