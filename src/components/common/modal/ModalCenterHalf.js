import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Modal from "react-native-modal";
import { Icon } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export const ModalCenterHalf = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(props.isVisible)
    const [content, setContent] = useState(props.content)
    useEffect(() => {
        setIsModalVisible(props.isVisible)
    }, [props.isVisible])

    useEffect(() => {
        setContent(props.content)
    }, [props.content])
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
                    <View style={{ position: 'relative' }}>
                        <View style={{ backgroundColor: '#f00', width: 30, height: 30, position: 'absolute', top: -10, right: 10, zIndex: 99, borderRadius: 15, paddingTop: 3 }}>
                            <Icon
                                name="close"
                                type="antdesign"
                                color="#fff"
                                size={20}
                                onPress={() => props.onClose()}
                            />

                        </View>
                        <View style={{}}>
                            {content}
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </Modal>
        </View>
    );
}
const styles = StyleSheet.create({
    outContainer: {

    },
    container: {

        justifyContent: 'center',
        flex: 1,
    },

});