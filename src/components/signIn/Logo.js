import React from 'react';
import { View, StyleSheet, Text } from 'react-native'

export const Logo = () => {

    return (
        <View style={styles.mwgLogo}>
            <Text style={styles.mwgLogoTitle} >Giao Hàng</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    mwgLogo: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
        height: 150,
        backgroundColor: "green",
        borderRadius: 75,
        borderWidth: 2,
        borderColor: '#ffee00',
        marginBottom: 50
    },
    mwgLogoTitle: {
        color: '#ffee00',
        fontSize: 28,
        fontWeight: 'bold',
    },
});