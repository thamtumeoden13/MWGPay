import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Modal from "react-native-modal";


export const ModalBottomHalf = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(props.isVisible)
    useEffect(() => {
        setIsModalVisible(props.isVisible)
    }, [props.isVisible])

    return (
        <View style={styles.outContainer}>

            <Modal
                isVisible={isModalVisible}
                onSwipeComplete={() => setIsModalVisible(false)}
                swipeDirection={['up', 'left', 'right', 'down']}
                style={styles.bottomModal}
                propagateSwipe
            >

                {/* <KeyboardAvoidingView behavior="padding" style={styles.container}> */}
                {props.content}
                {/* </KeyboardAvoidingView> */}

            </Modal>

        </View>
    );
}
const styles = StyleSheet.create({
    outContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        height: "100%",
        justifyContent: 'flex-end',
        paddingTop: 20,
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
});