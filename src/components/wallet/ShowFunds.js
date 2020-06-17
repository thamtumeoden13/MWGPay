import React, { Component, useState } from 'react';
import { FlatListComponent } from '../common/flatList'
import AsyncStorage from '@react-native-community/async-storage'

import { formatMoney } from '@utils/function'

export default class ShowFunds extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [{
                leftTitle: "Số dư ví",
                rightTitle: "0",
            }],
        }
    }

    componentDidMount = () => {
        this.storeData()
    }

    storeData = async () => {
        const StorageInfo = await AsyncStorage.getItem('UserInfo')
        if (StorageInfo) {
            let userInfo = JSON.parse(StorageInfo)
            if (userInfo && userInfo.currentAmount) {
                const dataSource = [{
                    leftTitle: "Số dư ví",
                    rightTitle: formatMoney(userInfo.currentAmount, 0),
                }]
                this.setState({ dataSource })
            }
        }
    }

    render() {
        const { dataSource } = this.state
        return (
            <FlatListComponent
                data={dataSource}
                rowItemType="RowItemLabel"
                headerTitle={this.props.headerTitle}
            />
        )
    }
}