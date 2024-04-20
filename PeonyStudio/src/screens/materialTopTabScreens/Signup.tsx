import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, ScrollView, Dimensions, ActivityIndicator } from 'react-native'
import React from 'react'
import Color from '../../Color'
import AccountBlockForm from '../../components/AccountBlockForm'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'

import EmailValidation from '../../functions/EmailValidation'
import CustomButton from '../../components/CustomButton'

import { useSelector, useDispatch } from 'react-redux';
import { closeModal, openModal } from '../../redux/reducers/ForgotPasswordReducer'
import { RootState } from '../../redux/store'
import BottomModal from '../../components/BottomModal'

import axios from 'axios'
import OTPModal from '../../components/OTPModal'

import NotifyModal from '../../components/NotifyModal'
import GenerateRandomOTPCode from '../../functions/GenerateRandomOTPCode'
import LoadingModal from '../../components/LoadingModal'
import GenerateRandomId from '../../functions/GenerateRandomId'

const { width, height } = Dimensions.get('window')

const Signup: React.FC = () => {
  const dispatch = useDispatch()

  const [notifyVisible, setNotifyVisible] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [signupStatus, setSignupStatus] = React.useState<boolean>(false)
  const [otpVisible, setOtpVisible] = React.useState<boolean>(false)

  const [titleNotify, setTitleNotify] = React.useState<string>('')
  const [contentNotify, setContentNotify] = React.useState<string>('')

  const [username, setUsername] = React.useState<string>('')
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const [errUsername, setErrUsername] = React.useState<string>('')
  const [errEmail, setErrEmail] = React.useState<string>('')
  const [errPassword, setErrPassword] = React.useState<string>('')
  const [textEntryChecked, setTextEntryChecked] = React.useState(true)

  const [OTP, setOTP] = React.useState<string>('empty')
  const [OTPConfirm, setOTPConfirm] = React.useState<string>('')

  const resetErrUsername = () => {
    setErrUsername('')
  }

  const resetErrEmaill = () => {
    setErrEmail('')
  }

  const resetErrPassword = () => {
    setErrPassword('')
  }

  const resetSignupInput = () => {
    setUsername('')
    setEmail('')
    setPassword('')
    resetErrUsername()
    resetErrEmaill()
    resetErrPassword()
    setSignupStatus(false)
    setTitleNotify('')
    setContentNotify('')
    setOTP('empty')
    setOTPConfirm('')
  }

  const handleSignup = async () => {

    let checkUserInput = false, checkEmailInput = false, checkPasswordInput = false
    if (username === '') {
      setErrUsername('Vui lòng điền tên đăng nhập')
      checkUserInput = true
    }

    if (email === '') {
      setErrEmail('Vui lòng điền email')
      checkEmailInput = true
    }

    if (!EmailValidation(email)) {
      setErrEmail('Địa chỉ email không hợp lệ')
      checkEmailInput = true
    }

    if (password === '') {
      setErrPassword('Vui lòng điền mật khẩu')
      checkPasswordInput = true
    }

    if (password === '') {
      setErrPassword('Vui lòng điền mật khẩu')
      checkPasswordInput = true
    }

    if (password.length < 8) {
      setErrPassword('Mật khẩu phải có độ dài từ 8 ký tự ')
      return
    }

    if (checkUserInput || checkEmailInput || checkPasswordInput) {
      return
    }

    setLoading(true)
    let checkEmail = false, checkUser = false
    try {
      const responseEmail = await axios.post('https://dark-cyan-eel-wrap.cyclic.app/find-user-with-email', { email: email })
      const responseUser = await axios.post('https://dark-cyan-eel-wrap.cyclic.app/find-user-with-username', { username: username })
      if (responseEmail.status === 200) {
        setErrEmail('Email đã được đăng ký')
        checkEmail = true
      }
      if (responseUser.status === 200) {
        setErrUsername('Tên đăng nhập đã tồn tại')
        checkUser = true
      }
    } catch (error) {
      console.log('Lỗi đăng ký: ', error)
    }

    if (checkEmail || checkUser) {
      setLoading(false)
      return
    }

    console.log('Ok ok ok ')

    let OTPCode = GenerateRandomOTPCode()
    setOTP(OTPCode)
    try {
      const sendOTP = await axios.post('https://dark-cyan-eel-wrap.cyclic.app/send-otp', {
        to: email,
        subject: 'Đăng ký tài khoản',
        text: 'Mã xác thực OTP của bạn là: ' + OTPCode
      })
      if (sendOTP.status === 200) {
        setLoading(false)
        setOtpVisible(true)
      } else {
        setLoading(false)
        setTitleNotify('Thất bại')
        setContentNotify('Mạng yếu vui lòng thử lại')
        setNotifyVisible(true)
      }
    } catch (error) {
      console.log('Lỗi otp đăng ký: ', error)
    }
  }

  const handleCancelOTP = () => {
    setOTP('empty')
    setOTPConfirm('')
    setOtpVisible(false)
  }

  const handleConfirmOTP = async () => {
    if (OTPConfirm === '') {
      return
    }

    setLoading(true)
    if (OTPConfirm !== OTP) {
      setOTP('empty')
      setOTPConfirm('')
      setTitleNotify('Thất bại')
      setContentNotify('Mã xác thực OTP không khớp')
      setNotifyVisible(true)
      setOtpVisible(false)
      setLoading(false)
    } else {

      try {
        const id = GenerateRandomId('US')
        const user = {
          id: id,
          firstName: id,
          lastName: 'user',
          email: email,
          phoneNumber: '',
          address: '',
          username: username,
          password: password,
          avatar: 'https://cdn2.iconfinder.com/data/icons/web-solid/32/user-512.png',
          status: true
        }

        const response = await axios.post('https://dark-cyan-eel-wrap.cyclic.app/add-user', user)
        if (response.status === 200) {
          setOTP('empty')
          setOTPConfirm('')
          resetSignupInput()
          setTitleNotify('Thành công')
          setContentNotify('Đăng ký tài khoản thành công')
          setNotifyVisible(true)
        } else {
          setOTP('empty')
          setOTPConfirm('')
          setTitleNotify('Thất bại')
          setContentNotify('Đăng ký tài khoản thất bại')
          setNotifyVisible(true)
        }
        setLoading(false)
        setOtpVisible(false)
      } catch (error) {
        console.log('Lỗi tạo tài khoản: ', error)
      }
    }
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ backgroundColor: '#fff', width, height: height * 0.55, justifyContent: 'center', paddingHorizontal: 15 }}>

      <LoadingModal visible={loading} />

      <OTPModal
        visible={otpVisible}
      >
        <View style={styles.modalOTPContainer}>
          <View style={styles.modalOTPContent}>
            <View style={{ padding: 15 }}>
              <Text style={{ color: Color.deepPink, fontSize: 18, textAlign: 'center', fontWeight: 'bold' }}>Xác thực OTP</Text>
              <Text style={{ color: Color.pink300, fontSize: 15, textAlign: 'center', lineHeight: 22, marginVertical: 15 }}
              >Hệ thống đã gửi OTP đến email của bạn, vui lòng kiểm tra trong hòm thư và thư rác</Text>

              <TextInput placeholder='Nhập mã OTP'
                placeholderTextColor={Color.pink100}
                keyboardType='numeric'
                selectionColor={Color.deepPink}
                onChangeText={text => setOTPConfirm(text)}
                style={{ paddingBottom: 5, borderBottomColor: Color.deepPink, borderBottomWidth: 1, color: Color.deepPink }}
              />
            </View>
            <View style={{ marginTop: 15, borderTopColor: Color.purpleA100, borderTopWidth: 0.8, flexDirection: 'row' }}>
              <CustomButton title='Hủy'
                onPress={() => handleCancelOTP()}

                titleStyle={{ color: Color.purpleA100, fontSize: 15 }}
                viewStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.4, borderColor: Color.purpleA100, padding: 15 }}
              />
              <CustomButton title='Xác nhận'
                onPress={() => handleConfirmOTP()}
                titleStyle={{ color: Color.deepPink, fontSize: 15, fontWeight: 'bold' }}
                viewStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.4, borderColor: Color.purpleA100, padding: 15 }}
              />
            </View>
          </View>
        </View>
      </OTPModal>

      <NotifyModal
        visible={notifyVisible}
      >
        <View style={styles.modalOTPContainer}>
          <View style={styles.modalOTPContent}>
            <View style={{ padding: 15 }}>
              <Text style={{ color: Color.deepPink, fontSize: 18, textAlign: 'center', fontWeight: 'bold' }}
              >{titleNotify}</Text>
              <Text style={{ color: Color.pink300, fontSize: 15, textAlign: 'center', lineHeight: 22, marginVertical: 15 }}
              >{contentNotify}</Text>

            </View>
            <View style={{ marginTop: 15, borderTopColor: Color.purpleA100, borderTopWidth: 0.8, }}>
              <CustomButton title='Đóng'
                onPress={() => {
                  if (signupStatus) {
                    resetSignupInput()
                  }
                  setTitleNotify('')
                  setContentNotify('')
                  setNotifyVisible(false)
                }}
                titleStyle={{ color: Color.deepPink, fontSize: 15 }}
                viewStyle={{ justifyContent: 'center', alignItems: 'center', padding: 15 }}
              />
            </View>
          </View>
        </View>
      </NotifyModal>

      <AccountBlockForm
        title='Tên đăng nhập'
        titleStyle={styles.titleStyle}
        viewStyle={styles.viewStyle}
      >
        <View style={styles.viewTextInput}>
          <FontAwesome name='user' size={25} color={Color.pink300} />
          <TextInput
            value={username}
            style={styles.textInput}
            onChangeText={text => setUsername(text)}
            onPressIn={resetErrUsername}
            placeholder='Tên đăng nhập'
            placeholderTextColor={Color.pink100}
            selectionColor={Color.deepPink}
          />
        </View>
        {errUsername !== '' && <Text style={styles.textError}>{errUsername}</Text>}
      </AccountBlockForm>

      <AccountBlockForm
        title='Email'
        titleStyle={styles.titleStyle}
        viewStyle={styles.viewStyle}
      >
        <View style={styles.viewTextInput}>
          <MaterialIcons name='mail' size={24} color={Color.pink300} />
          <TextInput
            value={email}
            style={styles.textInput}
            onChangeText={text => setEmail(text)}
            onPressIn={resetErrEmaill}
            placeholder='Email'
            placeholderTextColor={Color.pink100}
            selectionColor={Color.deepPink}
          />

        </View>
        {errEmail !== '' && <Text style={styles.textError}>{errEmail}</Text>}
      </AccountBlockForm>

      <AccountBlockForm
        title='Mật khẩu'
        titleStyle={styles.titleStyle}
        viewStyle={styles.viewStyle}
      >
        <View style={styles.viewTextInput}>
          <FontAwesome name='lock' size={25} color={Color.pink300} />
          <TextInput
            value={password}
            style={styles.textInput}
            onChangeText={text => setPassword(text)}
            onPressIn={resetErrPassword}
            placeholder='Mật khẩu'
            placeholderTextColor={Color.pink100}
            selectionColor={Color.deepPink}
            secureTextEntry={textEntryChecked}
          />
          <TouchableOpacity onPress={() => setTextEntryChecked(!textEntryChecked)}>
            <Ionicons name={textEntryChecked ? 'eye-outline' : 'eye-off-outline'} size={25} color={Color.pink300} />
          </TouchableOpacity>
        </View>
        {errPassword !== '' && <Text style={styles.textError}>{errPassword}</Text>}
      </AccountBlockForm>

      <CustomButton title='Đăng Ký'
        onPress={handleSignup}
        titleStyle={{ color: Color.white, fontSize: 18, fontWeight: 'bold' }}
        viewStyle={{ paddingVertical: 8, marginVertical: 15, borderRadius: 10, backgroundColor: Color.deepPink, justifyContent: 'center', alignItems: 'center' }} />

      <Text style={{ fontSize: 14, color: Color.deepPink, textAlign: 'center', marginBottom: 20, fontWeight: 'bold' }}>Hoặc đăng ký bằng</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity style={{
          justifyContent: 'center', alignItems: 'center', padding: 8, backgroundColor: Color.white, borderRadius: 50,
          shadowColor: '#000', shadowOffset: { width: 0, height: 0, }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 4
        }}>
          <Image style={{ width: 30, height: 30 }} source={require('../../images/icons/google.png')} />
        </TouchableOpacity>

        <TouchableOpacity style={{
          marginHorizontal: 30,
          justifyContent: 'center', alignItems: 'center', padding: 8, backgroundColor: Color.white, borderRadius: 50,
          shadowColor: '#000', shadowOffset: { width: 0, height: 0, }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 4
        }}>
          <Image style={{ width: 30, height: 30 }} source={require('../../images/icons/facebook.png')} />
        </TouchableOpacity>

        <TouchableOpacity style={{
          justifyContent: 'center', alignItems: 'center', padding: 8, backgroundColor: Color.white, borderRadius: 50,
          shadowColor: '#000', shadowOffset: { width: 0, height: 0, }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 4
        }}>
          <Image style={{ width: 30, height: 30 }} source={require('../../images/icons/appleD.png')} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default Signup

const styles = StyleSheet.create({
  viewStyle: {
    marginTop: 10
  },
  titleStyle: {
    fontSize: 15,
    color: Color.deepPink
  },
  viewTextInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 10,
    borderColor: '#F48FB1',
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 2
  },
  textInput: {
    flex: 1,
    marginLeft: 5,
    color: Color.pink300
  },
  textError: {
    fontSize: 12,
    color: Color.purpleA100,
    fontStyle: 'italic'
  },
  modalOTPContainer: {
    flex: 1,
    backgroundColor: Color.blackOpacity30,
    width,
    height,
    justifyContent: 'center',
    padding: 20
  },
  modalOTPContent: {
    backgroundColor: Color.white,
    borderRadius: 15,
  }
})