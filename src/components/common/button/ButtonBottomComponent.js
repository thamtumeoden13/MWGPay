import React from 'react'
import {
    View,
    StyleSheet
} from 'react-native'
import { Button } from 'react-native-elements'

export const ButtonBottomComponent = (props) => {

    return (
        <View style={[styles.containerButtonGroup, props.containerButtonGroup]} >
            <Button
                title={props.title ? props.title : "Xác nhận"}
                buttonStyle={[styles.buttonStyle, props.buttonStyle]}
                containerStyle={[styles.containerButton, props.containerButton]}
                textStyle={styles.title}
                type="solid"
                onPress={props.onPress}
                disabled={props.disabled}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    containerButtonGroup: {
        height: 80,
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "flex-end",
        marginVertical: 20
    },
    containerButton: {
        width: "90%",
        height: 40,
    },
    title: {
        textAlign: 'center'
    },
    buttonStyle: {
        // backgroundColor: '#0f0',
        borderRadius: 2,
    }
});