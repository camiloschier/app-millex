import React, { Component } from 'react';
import axios from 'axios';
import { StyleSheet, View, TextInput, Button, TouchableOpacity, Image, WebView, ImageBackground } from 'react-native';
import { Text, CheckBox } from 'native-base'

//esto necesito para el login
var RCTNetworking = require("RCTNetworking");
import { AsyncStorage } from 'react-native';

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            rememberMe: true,
            img: require('../assets/images/fdo-modulo.jpg'),
            cookies: '',

        }
        this.probandoApi = this.probandoApi.bind(this)
    }
    
    probandoApi() {
        var bodyFormData = new FormData();
        bodyFormData.append('user', 'lucio@sawubona.com.ar');
        bodyFormData.append('pass', '12345');
        self = this;
        //borro las cookies para que el server me traiga otras (las verdaderas cookies las
        //guardo en el asyncstorage)
        //RCTNetworking.clearCookies();
        RCTNetworking.clearCookies(() => {});
        console.log("COOKIES")

        axios({
            method: 'post',
            url: 'https://www.millex.com.ar/login/loginAPP',
            data: bodyFormData,
            headers: { 'Content-Type': 'multipart/form-data; boundary=--------------------------977792974663220062803566' }
        })
            .then(async function (response) {
                if (response.responseHeaders != '') {
                    console.log("Obtengo cookies")
                    self.setState({ cookies: response.headers['set-cookie'][0]})
                    console.log("Cookies son",response.headers['set-cookie'][0])
                   await AsyncStorage.setItem("Cookies", response.headers['set-cookie'][0]);
                }
            })
            .catch(function (response) {
                console.log(response);
            });

    }

    rememberPressed() {
        this.setState({ rememberMe: !this.state.rememberMe })
    }

    render() {

        return (
            <View style={{ width: '100%', display: 'flex', alignItems: 'center', marginTop: 0 }}>
                <View style={{backgroundColor: 'red', height: '35%', width: '100%'}}>
                    {/* ACA VA LA IMAGEN */}
                    <Image source={require('../assets/images/logo-millex.jpg')} style={{width: '100%', height: '100%', resizeMode:'center'}}></Image>
                </View>

                <ImageBackground source={require('../assets/images/fdo-modulo.jpg')} style={styles.backgroundImage}>
                    <View style={{ width: '100%', display: 'flex', alignItems: 'center' }}>

                        <View style={{ width: '70%', display: 'flex' }}>

                            <Text style={styles["text-description"]}>Usuario</Text>

                            <TextInput
                                style={styles["text-input"]}
                                onChangeText={text => this.setState({ username })}
                            />
                            <View style={{ marginTop: 15 }}>
                                <Text style={styles["text-description"]}>Contraseña</Text>
                            </View>

                            <TextInput
                                style={styles["text-input"]}
                                onChangeText={text => this.setState({ password })}
                            />
                            <View >
                                <TouchableOpacity
                                    style={styles["login-button"]}
                                    onPress={this.probandoApi}
                                ><Text>LOGIN</Text>
                                </TouchableOpacity>

                                <View style={{ marginTop: 15, flexDirection: 'row', display: 'flex', justifyContent: 'flex-start' }}>
                                    <CheckBox
                                        style={{ marginTop: 0 }}
                                        checked={this.state.rememberMe}
                                        onPress={this.rememberPressed.bind(this)}

                                    />
                                    <Text style={{ marginLeft: 20 }}>Recordarme</Text>
                                </View>

                            </View>
                        </View>
                    </View>
                </ImageBackground>
                <View style={{backgroundColor: 'red', height: '30%', width: '100%'}}></View>
            </View>
        )

    }
}

const styles = StyleSheet.create({
    backgroundImage: {
        alignSelf: 'stretch',
        resizeMode: 'repeat',
        width: 100 + '%',
        height: 35 + '%'
    },
    'text-description': {
        paddingBottom: 8,
        paddingTop: 5,
        fontSize: 18
    },
    'text-input': {
        backgroundColor: 'transparent',
        borderColor: '#000',
        borderWidth: 1.7,
        borderStyle: "dashed",
        borderRadius: 1
    },
    'login-button': {
        marginTop: 25,
        paddingTop: 5,
        paddingBottom: 5,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderColor: '#000',
        borderWidth: 1.7,
        borderStyle: "dashed",
        borderRadius: 1
    }
})

