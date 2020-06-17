import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import { SearchBar, Icon, ListItem } from 'react-native-elements';
import { formatMoney } from '@utils/function';


export const HistoryItem = ({ item, index, onPress }) => {
    const amount = formatMoney(item.amount, 0);
    const tempDate = new Date(item.transactionDate)
    const milliseconds = tempDate.getTime() - (7 * 3600 * 1000)
    // const date = new Date(item.transactionDate.replace(' ', 'T'))
    const date = new Date(milliseconds)
    const key = item.transactionID
    const title = item.cashflowTypeName//item.transactionTypeName
    const day = parseInt(date.getDate()) > 9 ? date.getDate().toString() : '0' + date.getDate().toString()
    const month = parseInt(date.getMonth() + 1) > 9 ? parseInt(date.getMonth() + 1).toString() : '0' + parseInt(date.getMonth() + 1).toString()
    const hours = parseInt(date.getHours()) > 9 ? date.getHours().toString() : '0' + date.getHours().toString()
    const minutes = parseInt(date.getMinutes()) > 9 ? date.getMinutes().toString() : '0' + date.getMinutes().toString()
    const subtitle = day + "/" + month + " " + hours + ":" + minutes
    let iconName = ''
    let iconType = ''
    switch (item.transactionTypeID.toString()) {
        case "1":
            iconName = "indent-right"
            iconType = 'antdesign'
            break;
        case "4":
            iconName = "dollar-bill"
            iconType = 'foundation'
            break;
        case "5":
            iconName = "dollar"
            iconType = 'foundation'
            break;
        default:
            iconName = 'gift'
            iconType = 'feather'
    }

    let textBadge = 'red'
    let badge = '-'
    if (item.isIncomeCashflow) {
        textBadge = 'blue'
        badge = '+'
    }

    return (
        <TouchableOpacity onPress={() => onPress(item)}>
            <ListItem
                key={key}
                title={title}
                subtitle={subtitle}
                containerStyle={{ backgroundColor: "#fff", }}
                leftIcon={{ name: iconName, type: iconType }}
                rightIcon={{ name: "chevron-right" }}
                bottomDivider={true}
                topDivider={true}
                badge={{
                    value: `${badge} ${amount}`,
                    textStyle: { color: textBadge },
                    containerStyle: { backgroundColor: '#fff' },
                    badgeStyle: { backgroundColor: '#fff' }
                }}
            />
        </TouchableOpacity>
    )
}
