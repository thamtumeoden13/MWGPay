import React, { useState, useEffect } from 'react';
import DatePicker from 'react-native-date-picker';

export const ModalConfigBirthday = (props) => {
    const [birthday, setBirthday] = useState(props.birthday ? props.birthday : new Date())
    useEffect(() => {
        if (props.onChangeText)
            props.onChangeText(birthday)
    }, [birthday])

    return (
        <DatePicker
            style={{ height: 150 }}
            date={birthday}
            onDateChange={date => setBirthday(date)}
            mode="date"
            locale="vi"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
        />
    );
}