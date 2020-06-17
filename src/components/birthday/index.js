import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import { Input } from 'react-native-elements';

const Birthday = (props) => {

    const inputDay = React.createRef();
    const inputMonth = React.createRef();
    const inputYear = React.createRef();

    const [state, setState] = useState({ day: '01', month: '01', year: '2019' })
    const handleChange = (name, value) => {
        const valueObject = { ...state, [name]: value }
        setState(valueObject)
        if (props.onChangeBirthday)
            props.onChangeBirthday(valueObject)
    }
    useEffect(() => {
        inputDay.current.focus();
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.containerLabel}>
                <Text style={{ fontSize: 15, color: '#000', textAlign: "left", fontWeight: 'bold', }}>Ngày sinh</Text>
            </View>
            <View style={styles.containerDetail}>
                <View style={styles.containerInput}>
                    <View style={styles.input}>
                        <Input
                            ref={inputDay}
                            name="day"
                            placeholder='ngày'
                            keyboardType="number-pad"
                            value={state.day}
                            onChangeText={(value) => handleChange("day", value)}
                            inputStyle={{ color: '#000', borderBottomWidth: 0, height: '100%', textAlign: 'center' }}
                            inputContainerStyle={{ borderBottomWidth: 0, height: '100%' }}
                            maxLength={2}
                        />
                    </View>
                </View>
                <View style={styles.slash}>
                    <Text style={{ lineHeight: 40, color: '#333' }}>/</Text>
                </View>
                <View style={styles.containerInput}>
                    <View style={styles.input}>
                        <Input
                            ref={inputMonth}
                            name="month"
                            placeholder='tháng'
                            value={state.month}
                            onChangeText={(value) => handleChange("month", value)}
                            inputStyle={{ color: '#000', borderBottomWidth: 0, height: '100%', textAlign: 'center' }}
                            inputContainerStyle={{ borderBottomWidth: 0, height: '100%' }}
                            maxLength={2}
                            keyboardType="number-pad"
                        />
                    </View>
                </View>
                <View style={styles.slash}>
                    <Text style={{ lineHeight: 40, color: '#333' }}>/</Text>
                </View>
                <View style={styles.containerInput}>
                    <View style={styles.input}>
                        <Input
                            ref={inputYear}
                            name="year"
                            placeholder='năm'
                            value={state.year}
                            onChangeText={(value) => handleChange("year", value)}
                            inputStyle={{ color: '#000', borderBottomWidth: 0, height: '100%', textAlign: 'center' }}
                            inputContainerStyle={{ borderBottomWidth: 0, height: '100%' }}
                            maxLength={4}
                            keyboardType="number-pad"
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

export default Birthday;

const styles = StyleSheet.create({
    container: {
        height: 80,
        width: "100%",
        paddingHorizontal: 10
    },
    containerLabel: { width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start' },
    containerDetail: { width: '100%', height: 40, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 10 },
    containerInput: { width: '20%', justifyContent: 'center', alignItems: 'center' },
    input: { borderWidth: 1, borderColor: '#e1e4e8', width: '100%', height: '100%', borderRadius: 4 },
    slash: { width: '8%', justifyContent: 'center', alignItems: 'center' }
});