import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Alert,

} from 'react-native';

import { FlatListComponent } from '../common/flatList'

const HistoryList = (props) => {

    const [state, setState] = useState({ result: [] })

    const onSelectDetail = (item, index) => {
        if (props.onSelectDetail)
            props.onSelectDetail(item, index)
    }

    useEffect(() => {
        setState({
            ...state,
            result: props.result ? props.result : [],
        })
    }, [props.result])

    return (
        <View style={styles.container}>
            <FlatListComponent
                data={state.result}
                numColumns={1}
                rowItemType="RowItemCard"
                logo={require('@assets/img/logoBank/ICB.png')}
                uri={'https://cdn.tgdd.vn/Products/Images/2002/153825/panasonic-cu-cs-xu9ukh-8-10-550x160.jpg'}
                onPress={onSelectDetail}
                flatListStyle={styles.flatListStyle}
            />
        </View>
    );
}
export default HistoryList;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
    },
    flatListStyle: {
        marginVertical: 5
    }
});