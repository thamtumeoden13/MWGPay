import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Alert,

} from 'react-native';

import { FlatListComponent } from '../../common/flatList'

const PartnerConnectList = (props) => {

    const [state, setState] = useState({ bankAccountList: [], accountMWGList: [] })

    const onSelectPartner = (item, index) => {
        if (props.onSelectPartner)
            props.onSelectPartner(item, index)
    }

    const onSelectPartnerMWG = (item, index) => {
        if (props.onSelectPartner)
            props.onSelectPartnerMWG(item, index)
    }
    useEffect(() => {
        setState({
            bankAccountList: props.bankAccountList ? props.bankAccountList : [],
            accountMWGList: props.accountMWGList ? props.accountMWGList : [],
        })
    }, [props.bankAccountList, props.accountMWGList])

    return (
        <View style={styles.container}>
            {state.bankAccountList && state.bankAccountList.length > 0 &&
                <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', }}>
                    <FlatListComponent
                        data={state.bankAccountList}
                        numColumns={1}
                        rowItemType="RowItemCard"
                        logo={require('@assets/img/logoBank/ICB.png')}
                        onPress={onSelectPartner}
                        headerTitle="Ngân hàng liên kết"
                        headerType="HeaderTitleFlatList"
                        flatListStyle={styles.flatListStyle}
                    />
                </View>
            }
            {state.accountMWGList && state.accountMWGList.length > 0 &&
                <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', }}>
                    <FlatListComponent
                        data={state.accountMWGList}
                        numColumns={1}
                        rowItemType="RowItemCard2"
                        logo={require('@assets/img/mwgLogo.jpeg')}
                        onPress={onSelectPartnerMWG}
                        headerTitle="Tín dụng liên kết"
                        headerType="HeaderTitleFlatList"
                        flatListStyle={styles.flatListStyle}
                    />
                </View>
            }
        </View>
    );
}
export default PartnerConnectList;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    flatListStyle: {
        marginVertical: 5
    }
});