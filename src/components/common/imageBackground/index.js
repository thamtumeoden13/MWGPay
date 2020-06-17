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
