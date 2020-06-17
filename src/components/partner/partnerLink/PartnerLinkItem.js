import React from 'react'
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    ImageBackground
} from 'react-native'

import { Icon, Image } from 'react-native-elements'

export const PartnerLinkItem = ({ item, numColumns, onPress }) => {
    const styles = StyleSheet.create({
        item: {
            backgroundColor: '#ffffff',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            margin: 1,
            height: Dimensions.get('window').width / numColumns
        },
        itemVisible: {
            backgroundColor: 'transparent',
            borderRightWidth: 0,
            borderBottomWidth: 0,
        },
        itemText: {
            color: 'black'
        }
    });
    if (item.empty === true) {
        return (
            <View style={[styles.item, styles.itemVisible]} />
        )
    }
    const size = Math.floor((Dimensions.get('window').width / numColumns))
    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => onPress()}>
                <View style={styles.item}>
                    {/* <Image
                        source={item.url_logo}
                        title={item.tile}
                        style={{
                            height: size,
                            width: size,
                            resizeMode: "center"
                        }}
                    /> */}

                    <ImageBackground
                        resizeMode='contain'
                        source={item.url_logo}
                        style={{
                            height: size,
                            width: size,
                        }}>
                    </ImageBackground>
                </View>
            </TouchableOpacity>
        </View>
    )
}
