import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    Image
} from 'react-native';
import { CDN_IMG } from "@constants/systemVars.js";

export const ModalItemDisplay = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={styles.containerPartner}>
                <View style={styles.containerLogo}>
                    <View style={styles.Logo}>
                        <ImageBackground
                            resizeMode='contain'
                            source={{
                                uri: CDN_IMG + props.image_url,
                            }}
                            style={{ width: 50, height: 50, }}>
                        </ImageBackground>

                    </View>
                    <View style={styles.title}>
                        <Text style={{ textAlignVertical: 'center' }}>{props.title}</Text>
                    </View>
                </View>
                <View style={styles.titleChangePartner}>
                    <Text style={{ color: '#03A9F4', fontSize: 15, }}>{props.rightTitle ? props.rightTitle : ""}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    containerPartner: {
        flexDirection: 'row',
        backgroundColor: "white",
        marginVertical: 10,
        width: '95%',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: 60,
    },
    titleChangePartner: {
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "flex-end",
        textAlign: 'right',
        alignContent: 'flex-end',
        width: '50%'
    },
    containerLogo: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: '50%',
    },
    Logo: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: '#b7b7b7',
        borderRadius: 5,
        padding: 5
    },
    title: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5
    },
    rightTitle: {
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "flex-end",
        textAlign: 'right',
        alignContent: 'flex-end',
        width: '40%'
    }
});