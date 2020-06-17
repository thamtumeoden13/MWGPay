import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground
} from 'react-native';
import Modal from "react-native-modal";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Input, Icon, Button } from 'react-native-elements';

const initStyle = {
    nameIcon: "check",
    typeIcon: "antdesign",
    colorIcon: "#fff",
    backgroundColor: "#008000"
}

export const ModalCenterAlert = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(props.isVisible)
    const [styleModal, setStyleModal] = useState(initStyle)
    const [isCancel, setIsCancel] = useState(false)
    const [isOK, setIsOK] = useState(false)

    const onCloseModal = (value) => {
        setIsModalVisible(false)
        if (props.onCloseModalAlert) {
            props.onCloseModalAlert(value)
        }
    }
    useEffect(() => {
        setIsModalVisible(props.isVisible)
    }, [props.isVisible])

    useEffect(() => {
        let styleModal = {
            nameIcon: "check",
            typeIcon: "antdesign",
            colorIcon: "#008000",
            colorButton: "#008000",
            borderColor: "#008000",
            backgroundColor: "#fff"
        };
        switch (props.typeModal) {
            case 'success':
                styleModal = {
                    nameIcon: "check",
                    typeIcon: "antdesign",
                    colorIcon: "#008000",
                    colorButton: "#008000",
                    borderColor: "#008000",
                    backgroundColor: "#fff"
                }
                break;
            case 'info':
                styleModal = {
                    nameIcon: "info",
                    typeIcon: "antdesign",
                    colorIcon: "#008eff",
                    colorButton: "#008eff",
                    borderColor: "#008eff",
                    backgroundColor: "#fff"
                }
                break;
            case 'confirm':
                styleModal = {
                    nameIcon: "question",
                    typeIcon: "antdesign",
                    colorIcon: "#0027ff",
                    colorButton: "#0027ff",
                    borderColor: "#0027ff",
                    backgroundColor: "#fff"
                }
                break;
            case 'warning':
                styleModal = {
                    nameIcon: "exclamation",
                    typeIcon: "antdesign",
                    colorIcon: "#ffc107",
                    colorButton: "#ffc107",
                    borderColor: "#ffc107",
                    backgroundColor: "#fff"
                }
                break;
            case 'error':
                styleModal = {
                    nameIcon: "close",
                    typeIcon: "antdesign",
                    colorIcon: "#fb5757",
                    colorButton: "#fb5757",
                    borderColor: "#fb5757",
                    backgroundColor: "#fff"
                }
                break;
        }
        setStyleModal(styleModal);
    }, [props.typeModal])

    useEffect(() => {
        setIsCancel(props.isCancel)
    }, [props.isCancel])

    useEffect(() => {
        setIsOK(props.isOK)
    }, [props.isOK])

    return (
        <View style={styles.outContainer}>
            <Modal
                isVisible={isModalVisible}
                onSwipeComplete={() => setIsModalVisible(false)}
                backdropColor="#7b7a7a"
                backdropOpacity={0.6}
                animationIn="zoomInDown"
                animationOut="zoomOutUp"
                animationInTiming={500}
                animationOutTiming={500}
                backdropTransitionInTiming={300}
                backdropTransitionOutTiming={300}
            >
                <KeyboardAwareScrollView contentContainerStyle={styles.container}>
                    <View style={styles.modal}>
                        <View style={styles.containerHeader}>
                            {/* <View style={styles.outHeader}>
                            </View> */}
                            <View style={styles.inHeader}>
                                <View style={{
                                    height: 70,
                                    width: 70,
                                    borderColor: styleModal.borderColor,
                                    borderWidth: 5,
                                    borderRadius: 35,
                                    justifyContent: 'center',
                                    backgroundColor: styleModal.backgroundColor
                                }}>
                                    <Icon
                                        name={styleModal.nameIcon}
                                        type={styleModal.typeIcon}
                                        color={styleModal.colorIcon}
                                        size={35}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.containerDetail}>
                            <Text style={{ fontSize: 25, color: '#333', fontWeight: "700", textAlign: 'center' }}>{props.titleModal}</Text>
                            <Text style={{ marginVertical: 10, textAlign: 'center' }}>{props.contentModal}</Text>
                            <View style={styles.containerButton}>
                                {/* {isCancel &&
                                    <Button
                                        title="BỎ QUA"
                                        activeOpacity={1}
                                        underlayColor="transparent"
                                        onPress={() => onCloseModal(false)}
                                        loadingProps={{
                                            size: 'large',
                                            color: '#000',
                                            hidesWhenStopped: true,
                                        }}
                                        buttonStyle={{
                                            height: 50,
                                            width: "100%",
                                            backgroundColor: styleModal.backgroundColor,
                                            borderWidth: 2,
                                            borderColor: 'rgba(171, 189, 219, 1)',
                                            borderRadius: 10,
                                        }}
                                        containerStyle={{ width: '45%' }}
                                        titleStyle={{ fontWeight: '600', color: '#fff' }}
                                    />
                                } */}
                                {isOK &&
                                    <Button
                                        title="ĐỒNG Ý"
                                        activeOpacity={1}
                                        underlayColor="transparent"
                                        onPress={() => onCloseModal(true)}
                                        loadingProps={{
                                            size: 'large',
                                            color: '#000',
                                            hidesWhenStopped: true,
                                        }}
                                        buttonStyle={{
                                            height: 50,
                                            width: "100%",
                                            backgroundColor: styleModal.backgroundColor,
                                            borderWidth: 2,
                                            borderColor: styleModal.borderColor,
                                            borderRadius: 10,
                                        }}
                                        containerStyle={{ width: '45%' }}
                                        titleStyle={{ fontWeight: '600', color: styleModal.colorButton }}
                                    />
                                }
                            </View>
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
        flex: 1,
        justifyContent: 'center',

    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingBottom: 20,
    },
    containerHeader: {
        alignItems: "center",
        justifyContent: 'center',
    },
    outHeader: {
        backgroundColor: 'rgba(255, 243, 216,1)',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 50,
    },
    inHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 50,
        bottom: 25,
    },
    containerDetail: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    containerButton: {
        width: "100%",
        marginTop: 20,
        marginBottom: 10,
        flexDirection: 'row',
        // justifyContent: 'space-between',
        justifyContent: 'center',
    }
});