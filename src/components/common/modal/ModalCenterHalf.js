import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Modal from "react-native-modal";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export const ModalCenterHalf = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(props.isVisible)
    useEffect(() => {
        setIsModalVisible(props.isVisible)
    }, [props.isVisible])

    return (
        <View style={styles.outContainer}>
            <Modal
                isVisible={isModalVisible}
                onSwipeComplete={() => setIsModalVisible(false)}
                backdropColor="#B4B3DB"
                backdropOpacity={0.8}
                animationIn="zoomInDown"
                animationOut="zoomOutUp"
                animationInTiming={600}
                animationOutTiming={600}
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600}
            >
                <KeyboardAwareScrollView contentContainerStyle={styles.container}>
                    {props.content}
                </KeyboardAwareScrollView>
            </Modal>
        </View>
    );
}
const styles = StyleSheet.create({
    outContainer: {

    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },

});