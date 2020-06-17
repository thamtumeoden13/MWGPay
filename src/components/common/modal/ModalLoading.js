import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    StatusBar,
    ActivityIndicator,
    ImageBackground,
    Platform,
} from 'react-native';
import Modal from "react-native-modal";
import LottieView from 'lottie-react-native';

export const ModalLoading = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(props.isVisible)

    useEffect(() => {
        setIsModalVisible(props.isVisible)
    }, [props.isVisible])

    return (
        <View style={styles.outContainer}>
            <Modal
                isVisible={isModalVisible}
                style={styles.bottomModal}
                animationOutTiming={50}
                animationInTiming={50}
            >
                {
                    Platform.OS == 'ios' ?
                        <ImageBackground style={{ width: 60, height: 60 }}
                            resizeMode='contain'
                            source={require('@assets/bg/loading.gif')}
                        >
                            <Text></Text>
                        </ImageBackground>
                        :
                        <LottieView
                            source={require('@assets/bg/material-wave-loading.json')}
                            colorFilters={[{
                                keypath: "button",
                                color: "#F00000"
                            }, {
                                keypath: "Sending Loader",
                                color: "#F00000"
                            }]}
                            style={{ width: 80, height: 80 }}
                            autoPlay
                            loop
                        />
                }

                {/* <ActivityIndicator size="large" color="#fff" /> */}
                <StatusBar barStyle="dark-content" hidden />
            </Modal>
        </View>
    );
}
const styles = StyleSheet.create({
    outContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    bottomModal: {
        justifyContent: 'center',
        alignItems: "center",
        margin: 0,
        backgroundColor: "#00000033"
    },
});