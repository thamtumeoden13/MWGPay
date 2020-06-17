import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    Dimensions,
} from 'react-native';
import Modal from "react-native-modal";
import { Button } from 'react-native-elements';

export const ModalDropList = (props) => {
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
                style={styles.TopModal}
                propagateSwipe
            >

                <View behavior="padding" style={styles.container}>
                    {props.content}
                </View>
                <View style={styles.containerButtonGroup}>
                    <Button
                        title="Huỷ"
                        type="solid"
                        buttonStyle={styles.cancelButton}
                        containerStyle={styles.containerButton}
                        textStyle={styles.title}
                        onPress={props.onClose}
                    />
                </View>
            </Modal>

        </View>
    );
}
const styles = StyleSheet.create({
    outContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    container: {
        justifyContent: 'flex-start',
        height: '100%',
        width: "100%",
        justifyContent: "flex-start",
    },
    TopModal: {
        justifyContent: 'flex-start',
        margin: 0,
    },
    containerButtonGroup: {
        height: 50,
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "flex-end",
        marginVertical: 20,
        backgroundColor: 'blue',
    },
    containerButton: {
        width: Dimensions.get("screen").width / 3,
        height: 40,
    },
    title: {
        textAlign: 'center'
    },
    cancelButton: {
        backgroundColor: 'gray',
        borderRadius: 2,
    },
});