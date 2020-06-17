import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    Image
} from 'react-native';

export const RenderRowItemCard = (props) => {

    return (
        <TouchableOpacity onPress={() => props.onPress()}>
            <View style={[styles.rowContainer, { backgroundColor: "#93d5f6" }]}>
                <View style={{ width: '100%', height: 80, }}>
                    <View style={styles.rowLogo}>
                        <Image
                            source={props.logo}
                            resizeMode="cover"
                            style={styles.imageLogoBank}
                        />
                    </View>
                    <View style={styles.rowNumberSerial}>
                        <Text style={styles.author} numberOfLines={1} ellipsizeMode={'tail'}>
                            {props.item.CardMask}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        height: 100,
        width: "100%",
        marginTop: 10,
        borderRadius: 4,
        shadowOffset: { width: 1, height: 1, },
        shadowColor: '#CCC',
        shadowOpacity: 1.0,
        shadowRadius: 1,
        backgroundColor: '#5fbc90'
    },
    title: {
        paddingLeft: 10,
        paddingTop: 5,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#777'
    },
    author: {
        paddingLeft: 10,
        marginTop: 5,
        fontSize: 20,
        color: '#777'
    },
    thumbnail: {
        flex: 1,
    },
    rowLogo: {
        height: '70%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    rowNumberSerial: {
        height: '30%',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    imageLogoBank: {
        height: '100%',
        width: '40%',
    }
});