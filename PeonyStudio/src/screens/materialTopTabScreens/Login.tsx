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

import BottomModal from '../../components/BottomModal'

import axios from 'axios'
import LocalData from '../../LocalData'
import OTPModal from '../../components/OTPModal'

import NotifyModal from '../../components/NotifyModal'
import GenerateRandomOTPCode from '../../functions/GenerateRandomOTPCode'
import LoadingModal from '../../components/LoadingModal'

import { useNavigation, useRoute } from '@react-navigation/native'

const { width, height } = Dimensions.get('window')

const handleSaveLocal = (user: any) => {
  LocalData.save({
    key: 'remember',
    data: {
      remember: true
    }
  })
  LocalData.save({
    key: 'user',
    data: {
      user: user
    }
  })
}

const Login: React.FC = () => {
  const navigation = useNavigation()

  const [visible, setVisible] = React.useState<boolean>(false)
  const [notifyVisible, setNotifyVisible] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [styleForm, setStyleForm] = React.useState<boolean>(false)
  const [otpVisible, setOtpVisible] = React.useState<boolean>(false)

  const [remember, setRemember] = React.useState<boolean>(false)
  const [username, setUsername] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const [rePassword, setRePassword] = React.useState<string>('')
  const [errUsername, setErrUsername] = React.useState<string>('')
  const [errPassword, setErrPassword] = React.useState<string>('')
  const [errRePassword, setErrRePassword] = React.useState<string>('')
  const [textEntryChecked, setTextEntryChecked] = React.useState(true)
  const [reTextEntryChecked, setReTextEntryChecked] = React.useState(true)

  const [updateUser, setUpdateUser] = React.useState<any>(null)
  const [updateStatus, setUpdateStatus] = React.useState<boolean>(false)

  const [OTP, setOTP] = React.useState<string>('empty')
  const [OTPConfirm, setOTPConfirm] = React.useState<string>('')

  const [email, setEmail] = React.useState<string>('')
  const [errEmail, setErrEmail] = React.useState<string>('')

  const handleForgotPassword = () => {
    setVisible(true)
    resetLoginInput()
    resetForgotInput()
  }

  const resetLoginInput = () => {
    setUsername('')
    setPassword('')
    resetErrUsername()
    resetErrPassword()
    setTextEntryChecked(true)
  }

  const resetForgotInput = () => {
    setOTP('empty')
    setOTPConfirm('')
    setEmail('')
    resetErrEmail()
    setRePassword('')
    resetErrRePassword()
    setReTextEntryChecked(true)
  }

  const resetErrUsername = () => {
    setErrUsername('')
  }

  const resetErrPassword = () => {
    setErrPassword('')
  }

  const resetErrEmail = () => {
    setErrEmail('')
  }

  const resetErrRePassword = () => {
    setErrRePassword('')
  }

  const handleLogin = async () => {
    let checkUserInput = false, checkPasswordInput = false
    if (username === '') {
      setErrUsername('Vui lòng điền tên đăng nhập')
      checkUserInput = true
    }
    if (password === '') {
      setErrPassword('Vui lòng điền mật khẩu')
      checkPasswordInput = true
    }

    if (checkUserInput || checkPasswordInput) {
      return
    }

    setLoading(true)
    if (EmailValidation(username)) {
      try {
        const response = await axios.post('https://mobile-react-native-workshop-server.onrender.com/find-user-with-email', { email: username })
        const user = response.data
        setLoading(true)
        if (response.status === 200) {
          if (user.password === password) {
            if (remember) {
              handleSaveLocal(user)
              console.log('lưu')
            } else {
              console.log('k lưu')
            }
            resetLoginInput()
            resetForgotInput()
            setLoading(false)
            navigation.navigate('Menu', { user: user })
          } else {
            setErrPassword('Mật khẩu không đúng')
            setLoading(false)
          }
        } else {
          setErrUsername('Email chưa được đăng ký')
          setLoading(false)
        }

      } catch (error) {
        console.log('Lỗi email: ', error)
      }
    } else {
      try {
        const response = await axios.post('https://mobile-react-native-workshop-server.onrender.com/find-user-with-username', { username: username })
        const user = response.data
        setLoading(true)
        if (response.status === 200) {
          if (user.password === password) {
            if (remember) {
              handleSaveLocal(user)
              console.log('lưu')
            } else {
              console.log('k lưu')
            }
            resetLoginInput()
            resetForgotInput()
            setLoading(false)
            navigation.navigate('Menu', { user: user })
          } else {
            setErrPassword('Mật khẩu không đúng')
            setLoading(false)
          }
        } else {
          setErrUsername('Tên đăng nhập không tồn tại')
          setLoading(false)
        }

      } catch (error) {
        console.log('Lỗi username: ', error)
      }
    }
  }

  const handleSendOTP = async () => {
    if (email === '') {
      setErrEmail('Vui lòng nhập email')
      return
    }

    if (!EmailValidation(email)) {
      setErrEmail('Email không hợp lệ')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post('https://mobile-react-native-workshop-server.onrender.com/find-user-with-email', { email: email })
      if (response.status === 200) {
        setUpdateUser(response.data)
        let OTPCode = GenerateRandomOTPCode()
        setOTP(OTPCode)
        try {
          const sendOTP = await axios.post('https://mobile-react-native-workshop-server.onrender.com/send-otp', {
            to: email,
            subject: 'Quên mật khẩu',
            text: 'Mã xác thực OTP của bạn là: ' + OTPCode
          })
          if (sendOTP.status === 200) {
            setLoading(false)
            setOtpVisible(true)
          } else {
            setLoading(false)
            setErrEmail('Đã xảy ra lỗi, Vui lòng thử lại')
          }
        } catch (error) {
          setLoading(false)
          setErrEmail('Đã xảy ra lỗi, Vui lòng thử lại')
        }
      } else {
        setLoading(false)
        setErrEmail('Email chưa được đăng ký')
      }
    } catch (error) {
      console.log('Lỗi quên mật khẩu: ', error)
    }

  }

  const handleCancelOTP = () => {
    setOTP('empty')
    setOTPConfirm('')
    setOtpVisible(false)
  }

  const handleConfirmOTP = () => {
    if (OTPConfirm === '') {
      return
    }

    if (OTPConfirm !== OTP) {
      setOTP('empty')
      setOTPConfirm('')
      setErrEmail('Mã OTP không khớp, Vui lòng thử lại')
      setOtpVisible(false)
    } else {
      setOTP('empty')
      setOTPConfirm('')
      setStyleForm(true)
      setOtpVisible(false)
    }
  }

  const handleChangePassword = async () => {
    if (rePassword === '') {
      setErrRePassword('Vui lòng điền mật khẩu mới')
      return
    }

    if (rePassword.length < 8) {
      setErrRePassword('Mật khẩu phải có độ dài từ 8 ký tự ')
      return
    }
    updateUser.password = rePassword

    try {
      const response = await axios.post('https://mobile-react-native-workshop-server.onrender.com/update-user', updateUser)
      if (response.status === 200) {
        setUpdateStatus(true)
        setNotifyVisible(true)
      } else {
        setUpdateStatus(false)
        setNotifyVisible(true)
      }
    } catch (error) {
      console.log('Lỗi lấy lại mật khẩu: ', error)
    }
  }

  return (

    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ backgroundColor: '#fff', width, height: height * 0.55, justifyContent: 'center', paddingHorizontal: 15 }}>

      <LoadingModal visible={loading} />

      <BottomModal
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false)
                  resetForgotInput()
                  setStyleForm(false)
                }}
                style={{ justifyContent: 'flex-end', flexDirection: 'row', marginTop: 15, marginBottom: 10 }}
              ><Feather name='x' size={30} color={Color.purpleA100} /></TouchableOpacity>
              <Text style={{ textAlign: 'center', fontSize: 20, color: Color.deepPink, fontWeight: 'bold' }}>
                {styleForm ? 'ĐỔI MẬT KHẨU' : 'QUÊN MẬT KHẨU'}
              </Text>

              {!styleForm && <View>
                <Text style={{ fontSize: 16, marginVertical: 10, fontStyle: 'italic', color: Color.purpleA100, lineHeight: 25 }}>
                  Để lấy lại tài khoản, hãy điền email đăng ký tài khoản của bạn và tiếp tục</Text>

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
                      onPressIn={resetErrEmail}
                      onChangeText={text => setEmail(text)}
                      placeholder='Email'
                      placeholderTextColor={Color.pink100}
                      selectionColor={Color.deepPink}
                    />

                  </View>
                  {errEmail !== '' && <Text style={styles.textError}>{errEmail}</Text>}
                </AccountBlockForm>
              </View>}

              {styleForm && <View>
                <Text style={{ fontSize: 16, marginVertical: 10, fontStyle: 'italic', color: Color.purpleA100, lineHeight: 25 }}>
                  Xác thực email thành công, hãy đặt lại mật khẩu của bạn</Text>

                <AccountBlockForm
                  title='Mật khẩu mới'
                  titleStyle={styles.titleStyle}
                  viewStyle={styles.viewStyle}
                >
                  <View style={styles.viewTextInput}>
                    <FontAwesome name='lock' size={25} color={Color.pink300} />
                    <TextInput
                      value={rePassword}
                      style={styles.textInput}
                      onChangeText={text => setRePassword(text)}
                      onPressIn={resetErrRePassword}
                      placeholder='Mật khẩu mới'
                      placeholderTextColor={Color.pink100}
                      selectionColor={Color.deepPink}
                      secureTextEntry={reTextEntryChecked}
                    />
                    <TouchableOpacity onPress={() => setReTextEntryChecked(!reTextEntryChecked)}>
                      <Ionicons name={reTextEntryChecked ? 'eye-outline' : 'eye-off-outline'} size={25} color={Color.pink300} />
                    </TouchableOpacity>
                  </View>
                  {errRePassword !== '' && <Text style={styles.textError}>{errRePassword}</Text>}
                </AccountBlockForm>
              </View>}

            </View>
            <CustomButton
              onPress={() => { !styleForm ? handleSendOTP() : handleChangePassword() }}
              title={!styleForm ? 'Tiếp tục' : 'Hoàn tất'}
              titleStyle={{ color: Color.white, fontSize: 18, fontWeight: 'bold' }}
              viewStyle={{ paddingVertical: 8, marginVertical: 15, borderRadius: 10, backgroundColor: Color.deepPink, justifyContent: 'center', alignItems: 'center' }} />

          </View>
        </View>
      </BottomModal>

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
              <Text style={{ color: Color.deepPink, fontSize: 18, textAlign: 'center', fontWeight: 'bold' }}>
                {updateStatus ? 'Thành Công' : 'Thất Bại'}</Text>
              <Text style={{ color: Color.pink300, fontSize: 15, textAlign: 'center', lineHeight: 22, marginVertical: 15 }}
              >{updateStatus ? 'Mật khẩu đã thay đổi thành công, Bây giờ bạn có thể tiếp tục đăng nhập vào tài khoản của mình'
                : 'Đã xảy ra lỗi trong quá trình lấy lại mật khẩu, Vui lòng thử lại'}</Text>

            </View>
            <View style={{ marginTop: 15, borderTopColor: Color.purpleA100, borderTopWidth: 0.8, }}>
              <CustomButton title='Đóng'
                onPress={() => {
                  if (updateStatus) {
                    resetForgotInput()
                    setVisible(false)
                  } else {
                    resetForgotInput()
                  }
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
        <View
          style={styles.viewTextInput}>
          <FontAwesome name='user' size={25} color={Color.pink300} />
          <TextInput
            value={username}
            onPressIn={resetErrUsername}
            style={styles.textInput}
            onChangeText={text => setUsername(text)}
            placeholder='Tên đăng nhập/ Email'
            placeholderTextColor={Color.pink100}
            selectionColor={Color.deepPink}
          />
        </View>
        {errUsername !== '' && <Text style={styles.textError}>{errUsername}</Text>}
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
            onPressIn={resetErrPassword}
            style={styles.textInput}
            onChangeText={text => setPassword(text)}
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

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setRemember(!remember)}>
            <FontAwesome name={remember ? 'check-square-o' : 'square-o'} size={25} color={Color.pink300} />
          </TouchableOpacity>
          <Text style={[styles.titleStyle, { marginLeft: 5 }]}>Lưu tài khoản</Text>
        </View>
        <CustomButton
          onPress={handleForgotPassword}
          title='Quên mật khẩu?' titleStyle={{ fontSize: 15, color: Color.purpleA100, fontStyle: 'italic' }} viewStyle={{}} />
      </View>

      <CustomButton
        onPress={() => { handleLogin() }}
        title='Đăng Nhập'
        titleStyle={{ color: Color.white, fontSize: 18, fontWeight: 'bold' }}
        viewStyle={{ paddingVertical: 8, marginVertical: 15, borderRadius: 10, backgroundColor: Color.deepPink, justifyContent: 'center', alignItems: 'center' }} />

      <Text style={{ fontSize: 14, color: Color.deepPink, textAlign: 'center', marginBottom: 20, fontWeight: 'bold' }}>Hoặc đăng nhập bằng</Text>

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

export default Login

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
  modalContainer: {
    flex: 1,
    backgroundColor: Color.blackOpacity30,
    width,
    height,
  },
  modalContent: {
    flex: 1,
    backgroundColor: Color.white,
    marginTop: height * 0.32,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: 'space-between',
    paddingHorizontal: 15
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
