import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Slider } from 'react-native-elements'

export const NumberCard = (props) => {

    const [number, setNumber] = useState(props.number ? props.number : 1)

    useEffect(() => {
        setNumber(props.number)
    }, [props.number])

    const _onNumberChange = (value) => {
        setNumber(value)
        if (props.onPress)
            props.onPress(value)
    }

    return (
        <View style={styles.containerNumber}>
            <View style={styles.labelNumber}>
                <Text style={{ textAlign: "center", fontSize: 16, }}>
                    Số lượng: {number}
                </Text>
            </View>
            <View style={styles.sliderNumber}>
                <Slider
                    value={number}
                    onValueChange={(value) => _onNumberChange(value)}
                    maximumValue={10}
                    minimumValue={1}
                    step={1}
                    thumbStyle={{ backgroundColor: 'blue' }}
                />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    containerNumber: {
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        marginVertical: 10
    },
    labelNumber: {
        flex: 1,
        width: "95%",
        justifyContent: "center",
        alignItems: "flex-start"
    },
    sliderNumber: {
        flex: 1,
        width: "95%",
        alignItems: 'stretch',
        justifyContent: 'center'
    },
});