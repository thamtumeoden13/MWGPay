import React, { Component, useState, useEffect, Fragment } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Text
} from 'react-native';
import { Button, Avatar } from 'react-native-elements';

export const IdentityCardImage = (props) => {
    const [behindImageBase64, setBehindImageBase64] = useState('')
    const [forwardImageBase64, setForwardImageBase64] = useState('')
    const [errors, setErrors] = useState({})

    const onPressBehindImage = () => {
        if (props.onPressBehindImage) {
            props.onPressBehindImage()
        }
        setErrors({})
    }

    const onPressForwardImage = () => {
        if (props.onPressForwardImage) {
            props.onPressForwardImage()
        }
        setErrors({})
    }

    useEffect(() => {
        setErrors(props.errors)
    }, [props.errors])

    useEffect(() => {
        setBehindImageBase64(props.behindImageBase64)
    }, [props.behindImageBase64])

    useEffect(() => {
        setForwardImageBase64(props.forwardImageBase64)
    }, [props.forwardImageBase64])

    return (
        <View style={styles.container}>
            <View style={styles.containerLabel}>
                <Text style={{ fontSize: 12, color: '#000', textAlign: "left", fontWeight: 'bold', paddingLeft: 10 }}>
                    ẢNH CHỤP 2 MẶT CMND/CCCD
                </Text>
            </View>
            <View style={styles.containerImage}>
                <View style={styles.containerBorder}>
                    <View style={styles.containerDetail}>
                        {behindImageBase64 && behindImageBase64.length > 0
                            ?
                            <Avatar
                                // size={90}
                                // rounded
                                source={{ uri: 'data:image/jpeg;base64,' + behindImageBase64 }}
                                containerStyle={{ height: '90%', width: '90%', backgroundColor: '#f1b7ca73' }}
                                avatarStyle={{ height: '100%', width: '100%', marginHorizontal: 'auto', marginVertical: 'auto' }}
                                overlayContainerStyle={{ backgroundColor: '#f1b7ca73' }}
                                onPress={() => onPressBehindImage()}
                                activeOpacity={0.7}
                            />
                            :
                            <Fragment>
                                <Avatar
                                    size={60}
                                    rounded
                                    icon={{ name: 'image-plus', type: 'material-community', color: '#ff3175f7' }}
                                    overlayContainerStyle={{ backgroundColor: '#f1b7ca73' }}
                                    onPress={() => onPressBehindImage()}
                                    activeOpacity={0.7}
                                />
                                <Text style={{ fontSize: 12, color: 'gray', textAlign: "center" }}>
                                    Mặt trước CMND/CCCD
                                </Text>
                            </Fragment>
                        }
                    </View>
                </View>
                <View style={styles.containerBorder}>
                    <View style={styles.containerDetail}>
                        {forwardImageBase64 && forwardImageBase64.length > 0
                            ?
                            <Avatar
                                // size={90}
                                // rounded
                                // source={{ uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg', }}
                                source={{ uri: 'data:image/jpeg;base64,' + forwardImageBase64 }}
                                containerStyle={{ height: '90%', width: '90%', backgroundColor: '#f1b7ca73' }}
                                avatarStyle={{ height: '100%', width: '100%', marginHorizontal: 'auto', marginVertical: 'auto' }}
                                overlayContainerStyle={{ backgroundColor: '#f1b7ca73' }}
                                onPress={() => onPressForwardImage()}
                                activeOpacity={0.7}
                            />
                            :
                            <Fragment>
                                <Avatar
                                    size={60}
                                    rounded
                                    icon={{ name: 'image-plus', type: 'material-community', color: '#ff3175f7' }}
                                    overlayContainerStyle={{ backgroundColor: '#f1b7ca73' }}
                                    onPress={() => onPressForwardImage()}
                                    activeOpacity={0.7}
                                />
                                <Text style={{ fontSize: 12, color: 'gray', textAlign: "center" }}>
                                    Mặt sau CMND/CCCD
                                </Text>
                            </Fragment>
                        }
                    </View>
                </View>
            </View>
            <View style={styles.containerErrorLabel}>
                <Text style={{ fontSize: 12, color: '#f00', textAlign: "left", paddingLeft: 10 }}>
                    {errors.documentImage}
                </Text>
            </View>
        </View>
    )
}
const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        // backgroundColor: '#F5FCFF',
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: getRandomColor()
    },
    containerLabel: { justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%' },
    containerErrorLabel: { justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%' },
    containerImage: {
        height: 150,
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerBorder: {
        width: '45%',
        height: 100,
        borderWidth: 1,
        backgroundColor: "#fff",
        borderColor: '#d2a1188c',
        borderRadius: 10,
        marginHorizontal: 5,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerDetail: { height: 100, width: '100%', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }
});