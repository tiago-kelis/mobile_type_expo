import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { style } from "./styles";
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { validateLogin } from '../../database/services/userServices';
import { RootStackParamList } from '../../routers/types';

const imageLogo = require("../../../assets/login.png");

// ✅ Tipagem correta da navegação
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function Login() {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);

   function handleLogin() {
    setLoading(true);

    try {
        if(!email || !senha) {
            Alert.alert("Atenção:", "Informe os campos obrigatórios!");
            setLoading(false);
            return;
        }

        const user = validateLogin(email, senha);

        if (user) {
            console.log("✅ Login realizado:", user);
            Alert.alert("Sucesso", `Bem-vindo, ${user.name}!`);
            
            // ✅ Navegar para Dashboard ao invés de Home
            navigation.navigate('Dashboard', {user} );
        } else {
            Alert.alert("Erro", "Email ou senha incorretos!");
        }
        
    } catch (error) {
        console.error("❌ Erro no login:", error);
        Alert.alert("Erro", "Ocorreu um erro ao fazer login");
    }

    setLoading(false);
}

    return (
        <View style={style.container}>
            <View style={style.boxImage}>
               <Image
                    source={imageLogo}
                    style={style.imageSize}
                    resizeMode="contain"
                />
            </View>

            <Text style={style.boxSaudacao}>Seja-Bem vindo novamente</Text>

            <View style={style.boxLabelEmail}>
                <Text style={style.boxText}>Email</Text>
                <View style={style.boxInput}>
                    <TextInput 
                        style={style.Input}
                        placeholder="Digite seu email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                    />
                    <MaterialIcons name="email" size={20} color="#9e9e9e" />
                </View>
            </View>

            <View style={style.boxLabelSenha}>
                <Text style={style.boxText}>Senha</Text>
                <View style={style.boxInput}>
                    <TextInput 
                        style={style.Input} 
                        placeholder="Digite sua senha"
                        secureTextEntry={true}
                        value={senha}
                        onChangeText={setSenha}
                        editable={!loading}
                    />
                    <MaterialIcons name="lock" size={20} color="#9e9e9e" />
                </View>
            </View>

            <TouchableOpacity 
                style={[style.boxButton, loading && { opacity: 0.6 }]} 
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={style.buttonText}>Enter</Text>
                )}
            </TouchableOpacity>

            <Text style={style.boxSignUp}>
                Não tem conta? 
                <Text 
                    style={style.link} 
                    onPress={() => navigation.navigate('User')}
                >
                    {" "}Crie agora
                </Text>
            </Text>
        </View>
    );
}