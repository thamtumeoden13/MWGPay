import React from 'react'

import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    FlatList,
    ScrollView,
    Dimensions
} from 'react-native'


export const ImageBackgroundBanner = (props) => {

    const renderItemCategory = ({ item, index }) => {
        let rowItem = <View style={{
            flexDirection: 'column',
            height: '100%',
            backgroundColor: 'blue',
            alignItems: 'flex-start',
            padding: 2,
            marginRight: 5,
            marginLeft: 2
        }}>
            <View style={{
                height: '100%',
                width: Dimensions.get('window').width - 10,
            }}>
                <ImageBackground
                    // source={require('@assets/img/banner.jpeg')}
                    source={require('@assets/img/banner/banner.jpeg')}
                    style={{ width: '100%', height: '100%' }}
                />
            </View>
        </View>

        return rowItem
    }
    return (
        <ScrollView contentContainerStyle={{ flex: 1 }}>
            <FlatList
                style={[styles.categoryStyles, props.style]}
                contentContainerStyle={styles.flatListStyles}
                horizontal
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index}

                renderItem={renderItemCategory}
                data={props.data}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    categoryStyles: {
        backgroundColor: 'transparent',
    },
    flatListStyles: {
        flexGrow: 1,
    },
});