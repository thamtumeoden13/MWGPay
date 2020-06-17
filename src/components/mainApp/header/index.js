
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, ImageBackground } from 'react-native'

import { HeaderTop } from './HeaderTop'
import Content from './Content'

export const Search = ({ navigation }) => {
    return (
        <ImageBackground resizeMode='stretch' source={require('@assets/bg/header/bg-form-search.jpg')} style={{ width: '100%', height: 195, paddingTop: 50 }}>
            <View style={styles.container}>
                <HeaderTop navigation={navigation} />
                <Content navigation={navigation} />
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
    },
})