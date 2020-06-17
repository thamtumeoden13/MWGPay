import React from 'react'
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    Image,
    ImageBackground
} from 'react-native'

import { Icon, Avatar } from 'react-native-elements';
import { CDN_IMG } from "@constants/systemVars.js";

export const RenderRowItemImage = (props) => {


    const styles = StyleSheet.create({
        item: {
            backgroundColor: '#ffffff',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            margin: 1,
            height: Dimensions.get('window').width / props.numColumns
        },
        itemVisible: {
            backgroundColor: 'transparent',
            borderRightWidth: 0,
            borderBottomWidth: 0,
        },
        itemText: {
            color: '#000',
            textAlign: 'center',
            flex: 0.8,
            justifyContent: 'center',
        }
    });

    if (props.item.empty === true) {
        return (
            <View style={[styles.item, styles.itemVisible]} />
        )
    }
    const size = Math.floor((Dimensions.get('window').width / props.numColumns) / 3)
    let isServiceLogoURL = false;
    if (props.item.ServiceLogoURL) {
        isServiceLogoURL = true
    }
    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => props.onPress(props.item.MobileScreenRoute)}>
                <View style={styles.item}>
                    <View style={{ marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row' }}>
                        {
                            isServiceLogoURL ?
                                <View style={{ width: ' 80%', height: Math.floor((Dimensions.get('window').width / 3) * 0.7), }}>
                                    <ImageBackground
                                        source={{
                                            uri: CDN_IMG + props.item.ServiceLogoURL,
                                        }}
                                        resizeMode='contain'
                                        style={{ width: '100%', height: 80, marginLeft: 'auto', marginRight: 'auto', }}
                                    />
                                </View>
                                :
                                <Icon
                                    name={props.item.icon}
                                    type={props.item.type}
                                    color={props.item.color}
                                    size={size}
                                />
                        }

                    </View>
                    <View style={{ flexDirection: 'row', width: '100%', textAlign: 'center', justifyContent: 'center', marginTop: 5 }}>
                        <Text style={styles.itemText} numberOfLines={1}>
                            {props.item.title}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View >
    )
}
