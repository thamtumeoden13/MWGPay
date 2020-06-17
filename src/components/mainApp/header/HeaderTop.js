
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native'

import { SearchInput } from '../../common/Header/SearchInput';
import { NotificationBadge } from '../../common/Header/NotificationBadge';
import { SignOutIcon } from '../../common/Header/SignOutIcon';


export const HeaderTop = ({ navigation }) => {
    const [input, setInput] = useState('')

    return (
        <View style={styles.search}>
            <View style={styles.searchBar}>
                <SearchInput />
            </View>
            <View style={styles.notification}>
                <NotificationBadge navigation={navigation} />
            </View>
            <View style={styles.logOut}>
                <SignOutIcon navigation={navigation} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    search: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: "space-around"
    },
    searchBar: {
        width: '75%',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        top: 10,
        marginLeft: 6,
    },
    notification: {
        width: "15%",
        justifyContent: "center",
        alignItems: "center",
        alignContent: 'center',
    },
    logOut: {
        width: "15%",
        justifyContent: "center",
        alignContent: 'center',
        alignItems: "center",
    }
})