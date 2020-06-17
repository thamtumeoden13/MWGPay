import React, { Fragment, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Dimensions,
    ImageBackground
} from 'react-native';
const ImageBackgroundCom = (props) => {
    return (
        <Fragment>
            <ImageBackground style={{ width: '100%', height: '100%' }}
                source={require('@assets/bg/background_login.png')}
            >
                {
                    typeof props.children.length == "undefined"
                        ? props.children
                        : props.children.map(child => {
                            return child
                        })
                }
            </ImageBackground>
        </Fragment>
    )
}
export default ImageBackgroundCom;

const styles = StyleSheet.create({
    containerContact: {
        // flex: 1,
        flexDirection: "row",
        width: '100%',

    },
    inputPhoneNumber: {
        width: '90%',
        flexDirection: 'column',
        paddingLeft: 10,
    },
    iconContact: {
        flexDirection: 'column',
        width: '10%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: 61,
    },
});