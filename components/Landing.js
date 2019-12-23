import React, { Component } from 'react';
import Login from './Login';
import axios from 'axios';
import { StyleSheet, View, TextInput, Button, TouchableOpacity, TouchableHighlight, Image, WebView, ImageBackground, StatusBar, Alert, ActivityIndicator, } from 'react-native';
import { Text, CheckBox } from 'native-base'
import LoadingDots from "react-native-loading-dots";
import { AsyncStorage } from 'react-native';

//esto necesito para el login
var RCTNetworking = require("RCTNetworking");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButton: {
        backgroundColor: '#ce1f2d',
        borderColor: '#ce1f2d',
        borderWidth: 1,
        height: 40,
        width: 110,
        borderRadius: 10,
        
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
        right: 10,
        
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 0
        }
    },
    backgroundImage: {
        alignSelf: 'stretch',
        resizeMode: 'repeat',
        width: 100 + '%',
        height: '100%'
    },
    'text-description': {
        fontFamily: 'raleway-light',
        fontWeight: '400',
        paddingBottom: 8,
        paddingTop: 5,
        fontSize: 18
    },
    'text-input': {
        backgroundColor: 'transparent',
        borderColor: '#000',
        borderWidth: 1.7,
        borderStyle: "dashed",
        borderRadius: 1,
        paddingLeft: 10
    },
    'login-text-input': {
        fontFamily: 'raleway-light',
        fontWeight: '400',
        paddingBottom: 8,
        paddingTop: 5,
        fontSize: 18
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
    },
    loadingScreen: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    dotsWrapper: {
        width: 100
    }

});
export default class Landing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            flag: false,
            username: '',
            password: '',
            rememberMe: true,
            img: require('../assets/images/fdo-modulo.jpg'),
            cookies: '',
            estaLogueado: false,
            animating: false,
            isLoading: false
        }
        this.probandoApi = this.probandoApi.bind(this)
    }
    async componentDidMount() {
        this._retrieveData();
    }
    probandoApi() {
        //aca tendria que empezar la animacion de carga.
        this.setState({ isLoading: true })
        var bodyFormData = new FormData();
        bodyFormData.append('user', this.state.username);
        bodyFormData.append('pass', this.state.password);

        //borro las cookies para que el server me traiga otras (las verdaderas cookies las
        //guardo en el asyncstorage)
        //RCTNetworking.clearCookies();
        RCTNetworking.clearCookies(() => { });
        console.log("COOKIES")
        that = this;

        axios({
            method: 'post',
            url: 'https://www.millex.com.ar/login/loginAPP',
            data: bodyFormData,
            headers: { 'Content-Type': 'multipart/form-data; boundary=--------------------------977792974663220062803566' }
        })
            .then(async function (response) {
                if (typeof (response.headers['set-cookie']) != 'undefined') {

                    /* that.setState({animating: true}) */

                    console.log(response)
                    //aca si se logueo bien, porque me dio las cookies
                    console.log("Obtengo cookies")
                    //self.setState({ cookies: response.headers['set-cookie'][0]})
                    console.log("Cookies son", response.headers['set-cookie'][0])
                    await AsyncStorage.setItem("Cookies", response.headers['set-cookie'][0]);
                    await that._retrieveData()
                }
                else {
                    //aca va cuando se loguea mal


                    Alert.alert(
                        'Datos incorrectos',
                        'Usuario o contraseña incorrecto',
                        [
                            { text: 'OK' },
                        ],
                        { cancelable: false },
                    );
                    that.setState({ isLoading: false })
                    console.log("Datos erroneos")
                }
            })
            .catch(function (response) {
                console.log(response);
            });

    }

    rememberPressed() {
        this.setState({ rememberMe: !this.state.rememberMe })
    }
    _retrieveData = async () => {
        const value = await AsyncStorage.getItem('Cookies');
        if (value !== null) {
            console.log("VALUE", value)
            this.setState({ flag: true })

        }
        else {
            this.setState({ flag: false })
            return console.log("no hay cookies", value)
        }
        this.setState({ isLoading: false })
    }
    async borrarAsyncStorage() {
        console.log("BORRAR");
        RCTNetworking.clearCookies(() => { });
        await AsyncStorage.removeItem('Cookies');
        this._retrieveData();

    }
    renderCondicional() {
        const isLoading = this.state.isLoading;
        if (isLoading) {
            return (
                <View style={styles.loadingScreen}>
                    <View style={styles.dotsWrapper}>
                        <LoadingDots />
                    </View>
                </View>
            )
        } else {
            if (this.state.flag) {
                return (
                    <>

                        <WebView
                            source={{ uri: 'https://www.millex.com.ar/login/index' }}
                            style={{ marginTop: 20 }}
                        />

                        <View style={{ position: 'absolute', marginTop: '8%',marginLeft:'15%', height: 30, width: 30 }}>
                            <TouchableHighlight style={styles.addButton}
                                underlayColor='#ff7043' onPress={this.borrarAsyncStorage.bind(this)}>
                                <Text style={{ fontSize: 12, color: 'white' }}>CERRAR SESION</Text>
                            </TouchableHighlight>
                        </View>

                    </>
                );
            }
            else {
                /* this.setState({animating:false}) */
                return (
                    //FRONT LOGIN
                    <View style={{ backgroundColor: '#DFDFDF', width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
                        {/*<ImageBackground source={require('../assets/images/fondo2.png')} style={styles.backgroundImage}>*/}
                        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

                        <View style={{ height: '30%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ce1f2d' }}>
                            {/* ACA VA LA IMAGEN */}
                            <Image source={require('../assets/images/logo-millex.png')} style={{ resizeMode: 'contain' }}></Image>
                        </View>


                        <View style={{ width: '100%', display: 'flex', alignItems: 'center', marginTop: 10 }}>
                            <ActivityIndicator
                                animating={this.state.animating}
                                color='#bc2b78'
                                size="large" />
                        </View>
                        <View style={{ width: '70%', display: 'flex' }}>

                            <Text style={styles["text-description"]}>Usuario</Text>

                            <TextInput
                                style={styles["text-input"]}
                                onChangeText={text => this.setState({ username: text })}
                                autoCapitalize='none'
                            />
                            <View style={{ marginTop: 15 }}>
                                <Text style={styles["text-description"]}>Contraseña</Text>
                            </View>

                            <TextInput
                                style={styles["text-input"]}
                                onChangeText={text => this.setState({ password: text })}
                                autoCapitalize='none'
                                secureTextEntry
                            />
                            <View >
                                <TouchableOpacity
                                    style={styles["login-button"]}
                                    onPress={this.probandoApi}
                                ><Text style={styles["login-text-input"]}>LOGIN</Text>
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
                        {/* <View style={{ backgroundColor: '#DFDFDF', height: '30%', width: '100%' }}></View> */}
                        {/*</ImageBackground>*/}
                    </View>

                );
            }
        }

    }
    render() {
        return (
            this.renderCondicional()
        );

    }

}