import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native'
import { Input, Icon, Button } from 'react-native-elements';

export const IconTouchID = (props) => {
    const [allowTouchID, setAllowTouchID] = useState(false);

    const clickHandler = () => {
        if (props.clickHandler)
            props.clickHandler()
    }

    useEffect(() => {
        setAllowTouchID(props.allowTouchID)
    }, [props.allowTouchID])

    return (
        <View style={styles.container}>
            {allowTouchID &&
                <TouchableHighlight onPress={() => clickHandler()}>
                    <Icon
                        name="fingerprint"
                        type="material-community"
                        color="rgba(171, 189, 219, 1)"
                        size={50}
                    />
                </TouchableHighlight>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        width: "95%",
        justifyContent: 'center'
    },
});