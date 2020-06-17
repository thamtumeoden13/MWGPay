import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import { CDN_IMG } from "@constants/systemVars.js";

export const RenderRowItemModal = (props) => {
    const { item, index, indexSelect } = props

    return (
        <TouchableOpacity onPress={() => props.onPress()}>
            <View style={styles.container}>
                <View style={styles.containerLogo}>
                    <View style={styles.Logo}>
                        <ImageBackground
                            resizeMode='contain'
                            source={{
                                uri: CDN_IMG + item.image_url
                            }}
                            style={{ width: 40, height: 40, }}>
                        </ImageBackground>
                    </View>
                    <View style={styles.title}>
                        <Text style={{ textAlign: 'center' }}>{item.title}</Text>
                    </View>
                </View>
                <View style={styles.rightTitle}>
                    {index === indexSelect ? <Icon name="check" type="antdesign" color="green" /> : null}
                    <Text style={{ color: '#03A9F4', fontSize: 12, alignItems: "center" }}>{item.rightTitle}</Text>
                </View>
                <View>
                    <Divider style={{ height: 1, width: '100%', backgroundColor: 'gray' }} />
                </View>
            </View>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: "white",
        marginVertical: 10,
        width: '95%',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: 50,
    },
    containerLogo: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: '60%',
    },
    Logo: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
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
        flexDirection: 'row',
        justifyContent: "flex-end",
        alignItems: "center",
        width: '40%'
    }
});