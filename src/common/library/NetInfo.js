import NetInfo from '@react-native-community/netinfo'
import { Platform } from 'react-native';
export async function getNetInfo() {
    let netInfo = {}
    await NetInfo.fetch().then(state => {
        if (state.isConnected == true) {
            //console.log("isConnected 1", isConnected)
            netInfo = {
                status: state.isConnected,
                message: '',
                messageDetail: '',
            };
        }
        else {
            //console.log("isConnected 2", isConnected)
            netInfo = {
                status: state.isConnected,
                message: 'Lỗi đăng nhập',
                messageDetail: "Không thể kết nối đến máy chủ",
            }
        }
    });
    return netInfo;
}