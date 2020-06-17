import { createStackNavigator } from 'react-navigation';

// Home MWG
import Home from '@screens/home';
import Wallet from '@screens/wallet';
import Contact from '@screens/contact';
import Notification from '@screens/notification';
import TransferOut from '@screens/transferOut';
import TransferOutToMWGPay from '@screens/transferOut/TransferOutToMWGPay';
import TransferOutToMWGPayContent from '@screens/transferOut/TransferOutToMWGPayContent';
import TransferIn from '@screens/transferIn';
import QRCodeScannerScreen from '@screens/qrCodeScannerScreen';
import QRCodeData from '@screens/qrCodeScannerScreen/QRCodeData';
import TopUp from '@screens/wallet/topUp';
import TopUpFromBankConnected from '@screens/wallet/topUp/TopUpFromBankConnected';
import TopUpFromERP from '@screens/wallet/topUp/TopUpFromERP';
import ConfirmOTPTopUp from '@screens/wallet/topUp/ConfirmOTP';
import CashOut from '@screens/wallet/cashOut';
import Service from '@screens/service';
import PhoneCard from '@screens/service/phoneCard';
import PhoneRecharge from '@screens/service/phoneRecharge';
import WaterProvider from '@screens/service/waterBill/WaterProvider';
import WaterProviderByProvince from '@screens/service/waterBill/WaterProviderByProvince';
import WaterInvoiceInfo from '@screens/service/waterBill/WaterInvoiceInfo';
import ElectricPaymentUnit from '@screens/service/electricBill/PaymentUnit';
import CustomerInfo from '@screens/service/electricBill/CustomerInfo';
import ServicePhonePostpaid from '@screens/service/servicePhonePostpaid';
import InvoiceInfoPhonePostpaid from '@screens/service/servicePhonePostpaid/invoiceInfo';
import PaymentDetail from '@screens/service/paymentDetail';
import PreviewPaymentDetail from '@screens/service/previewPaymentDetail'
import Internet from '@screens/service/internet';
import ServiceTypeInternet from '@screens/service/internet/ServiceTypeInternet';
import CustomerInfoInternet from '@screens/service/internet/CustomerInfoInternet';
import PhonePermanent from '@screens/service/phonePermanent';
import GetAllPhonePermanent from '@screens/service/phonePermanent/GetAllPhonePermanent';
import PhonePostPaid from '@screens/service/phonePostPaid';
import GetAllPhonePostPaid from '@screens/service/phonePostPaid/GetAllPhonePostPaid';
import CreditPayment from '@screens/service/creditPayment';
import GetAllCreditPayment from '@screens/service/creditPayment/GetAllCreditPayment';
import CabTV from '@screens/service/cabTV';
import GameCard from '@screens/service/gameCard';
import Plane from '@screens/service/plane';
import Train from '@screens/service/train';
import CreditMWG from '@screens/partner/detailPartner/CreditMWG';
import Lock from '@screens/signIn/Lock';

// Lịch sử
import History from '@screens/history';
import HistoryDetail from '@screens/history/HistoryDetail';

// Ưu đãi
import Preferential from '@screens/preferential';

// Ví của tôi
import Profile from '@screens/profile';
import PersonalInfo from '@screens/personalInfo';
import PreAccAuth from '@screens/personalInfo/PreAccAuth';
import Setting from '@screens/setting';
import Support from '@screens/support';
import QRCode from '@screens/personalInfo/QRCode';
import QRCodePersonalInfo from '@screens/personalInfo/qrCodePersonalInfo';
import OldPassword from '@screens/setting/changePassword/OldPassword'
import NewPassword from '@screens/setting/changePassword/NewPassword'
import Information from '@screens/personalInfo/updateInfo';
import AccountAuthentication from '@screens/personalInfo/accAuth';
import AccountAuthInputInfo from '@screens/personalInfo/accAuth/InputInfoAcc';
import PartnerConnect from '@screens/partner/partnerConnect';
import DetailPartner from '@screens/partner/detailPartner';
import PartnerLink from '@screens/partner/partnerLink';
import PartnerLinkInputDetail from '@screens/partner/partnerLink/PartnerLinkInputDetail';
import PartnerLinkInputOTP from '@screens/partner/partnerLink/PartnerLinkInputOTP';
import CreditLink from '@screens/partner/creditLink';
import CreditLinkInputDetail from '@screens/partner/creditLink/CreditLinkInputDetail';
import CreditLinkInputOTP from '@screens/partner/creditLink/CreditLinkInputOTP';

import PhotoCamera from '@screens/photoCamera/PhotoCamera';
import ImagePicker from '@screens/imagePicker';

export const HomeStack = createStackNavigator(
    {
        Home: { screen: Home },
        Wallet: Wallet,
        PhoneCard: PhoneCard,
        PhoneRecharge: PhoneRecharge,
        Contact: Contact,
        Notification: Notification,
        TransferOut: TransferOut,
        TransferOutToMWGPay: TransferOutToMWGPay,
        TransferOutToMWGPayContent: TransferOutToMWGPayContent,
        TransferIn: TransferIn,
        QRCodeScannerScreen: QRCodeScannerScreen,
        QRCodeData: QRCodeData,
        ElectricPaymentUnit: ElectricPaymentUnit,
        CustomerInfo: CustomerInfo,
        TopUp: TopUp,
        ConfirmOTPTopUp: ConfirmOTPTopUp,
        TopUpFromBankConnected: TopUpFromBankConnected,
        TopUpFromERP: TopUpFromERP,
        CashOut: CashOut,
        WaterInvoiceInfo: WaterInvoiceInfo,
        WaterProvider: WaterProvider,
        WaterProviderByProvince: WaterProviderByProvince,
        Service: Service,
        ServicePhonePostpaid: ServicePhonePostpaid,
        InvoiceInfoPhonePostpaid: InvoiceInfoPhonePostpaid,
        PaymentDetail: PaymentDetail,
        PreviewPaymentDetail: PreviewPaymentDetail,
        Internet: Internet,
        ServiceTypeInternet: ServiceTypeInternet,
        CustomerInfoInternet: CustomerInfoInternet,
        PhonePostPaid: PhonePostPaid,
        GetAllPhonePostPaid: GetAllPhonePostPaid,
        PhonePermanent: PhonePermanent,
        GetAllPhonePermanent: GetAllPhonePermanent,
        CreditPayment: CreditPayment,
        GetAllCreditPayment: GetAllCreditPayment,
        CabTV: CabTV,
        GameCard: GameCard,
        Plane: Plane,
        Train: Train,
        PartnerConnect1: { screen: PartnerConnect, params: { rootRoute: 'Home' } },
        DetailPartner1: { screen: DetailPartner, params: { rootRoute: 'Home' } },
        PartnerLink1: { screen: PartnerLink, params: { rootRoute: 'Home' } },
        PartnerLinkInputDetail1: { screen: PartnerLinkInputDetail, params: { rootRoute: 'Home' } },
        PartnerLinkInputOTP1: { screen: PartnerLinkInputOTP, params: { rootRoute: 'Home' } },
        CreditLink1: { screen: CreditLink, params: { rootRoute: 'Home' } },
        CreditLinkInputDetail1: { screen: CreditLinkInputDetail, params: { rootRoute: 'Home' } },
        CreditLinkInputOTP1: { screen: CreditLinkInputOTP, params: { rootRoute: 'Home' } },
        CreditMWG1: { screen: CreditMWG, params: { rootRoute: 'Home' } },
        Lock: Lock
    },
);

HomeStack.navigationOptions = ({ navigation }) => {

    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return {
        tabBarVisible,
    };
};

export const HistoryStack = createStackNavigator(
    {
        History: History,
        HistoryDetail: HistoryDetail,
        Lock1: Lock
    }
);

HistoryStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return {
        tabBarVisible,
    };
};

export const PreferentialStack = createStackNavigator(
    {
        Preferential: Preferential,
        Lock2: Lock
    }
);

PreferentialStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return {
        tabBarVisible,
    };
};

export const ProfileStack = createStackNavigator(
    {
        Profile: Profile,
        PersonalInfo: PersonalInfo,
        PreAccAuth: PreAccAuth,
        Setting: Setting,
        Support: Support,
        QRCode: QRCode,
        QRCodePersonalInfo: QRCodePersonalInfo,
        OldPassword: OldPassword,
        NewPassword: NewPassword,
        AccountAuthentication: AccountAuthentication,
        AccountAuthInputInfo: AccountAuthInputInfo,
        Information: Information,
        // PhotoCamera: ImagePicker,
        ImagePicker: ImagePicker,
        PartnerConnect2: { screen: PartnerConnect, params: { rootRoute: 'Profile' } },
        DetailPartner2: { screen: DetailPartner, params: { rootRoute: 'Profile' } },
        PartnerLink2: { screen: PartnerLink, params: { rootRoute: 'Profile' } },
        PartnerLinkInputDetail2: { screen: PartnerLinkInputDetail, params: { rootRoute: 'Profile' } },
        PartnerLinkInputOTP2: { screen: PartnerLinkInputOTP, params: { rootRoute: 'Profile' } },
        CreditLink2: { screen: CreditLink, params: { rootRoute: 'Profile' } },
        CreditLinkInputDetail2: { screen: CreditLinkInputDetail, params: { rootRoute: 'Profile' } },
        CreditLinkInputOTP2: { screen: CreditLinkInputOTP, params: { rootRoute: 'Profile' } },
        CreditMWG2: { screen: CreditMWG, params: { rootRoute: 'Profile' } },
        Lock3: Lock
    }
);

ProfileStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return {
        tabBarVisible,
    };
};