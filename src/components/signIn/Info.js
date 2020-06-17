import React, { Fragment } from 'react';
import { View, StyleSheet, Text } from 'react-native'

export const Info = (props) => {
    const { fullName, phoneNumber } = props;

    return (
        <Fragment>
            <Text style={{ fontSize: 18, textAlign: "center", fontWeight: "bold", color: "#525252" }}>
                Xin chào!
                            </Text>
            <Text style={{ fontSize: 16, textAlign: "center", color: "#000" }}>
                {fullName}
            </Text>
            <Text style={{ fontSize: 14, textAlign: "center", color: "#000" }}>
                {phoneNumber}
            </Text>
        </Fragment>
    )
}

const styles = StyleSheet.create({
    mwgLogo: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
        height: 150,
        backgroundColor: "yellow",
        borderRadius: 75,
        marginBottom: 50
    },
    mwgLogoTitle: {
        color: 'black',
        fontSize: 28,
        fontWeight: 'bold',
    },
});