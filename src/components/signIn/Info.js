import React, { Fragment } from 'react';
import { View, StyleSheet, Text } from 'react-native'
import { Avatar } from 'react-native-elements';
export const Info = (props) => {
    const { fullName, userName, uriAvatar } = props;

    return (
        <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 18, textAlign: "center", fontWeight: "bold", color: "blue" }}>
                Xin chào!
            </Text>
            <Avatar
                rounded
                size="xlarge"
                source={{
                    uri: uriAvatar ? uriAvatar :
                        'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                }}
                containerStyle={{ marginVertical: 10 }}
            />
            <Text style={{ fontSize: 14, textAlign: "center", color: "#000" }}>
                {userName}
            </Text>
            <Text style={{ fontSize: 16, textAlign: "center", color: "#000", fontWeight: 'bold' }}>
                {fullName}
            </Text>
        </View>
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