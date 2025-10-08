import React, { useState } from "react";

import { View, Text, Image, TextInput, Button, TouchableOpacity } from "react-native"
import { style } from "./styles";
import imageLogo from "../../assets/login.png"
import { MaterialIcons } from '@react-native-vector-icons/material-icons';



export default function Login() {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");


    return (
        <View style={style.container}>

            <View style={style.boxImage}>
               <Image
                    source={imageLogo}
                    alt="Image"
                   style={style.imageSize}
                
                />
                
            </View>

            <Text style={style.boxSaudacao}>Seja-Bem vindo novamente</Text>

            <View style={style.boxLabelEmail}>
                
                <Text style={style.boxText}>Email</Text>

                <View style={style.boxInput}>

                    <TextInput style={style.Input}
                        placeholder="Digite seu email"
                        value={email}
                        onChangeText={(e) => setEmail(e)}
                     />

                    <MaterialIcons 
                        name="email"
                        size={20} 
                        color="#9e9e9e9e"     
                        
                    />
                </View>
            </View>

            <View style={style.boxLabelSenha}>
                <Text style={style.boxText}>Senha</Text>

                <View style={style.boxInput}>

                    <TextInput style={style.Input} 
                            placeholder="Digite sua senha"
                            secureTextEntry={true} // ativa a máscara de senha
                            value={senha}
                            onChangeText={(e) => setSenha(e)}
                     />

                    <MaterialIcons 
                        name="lock"
                        size={20} 
                        color="#9e9e9e9e"     
                        
                    />
                </View>
                

            </View>

             <TouchableOpacity style={style.boxButton} onPress={() => {}}>
                    <Text style={style.buttonText}>Enter</Text>
                </TouchableOpacity>

            <Text style={style.boxSignUp}>Não tem conta crie agora</Text>

        </View>
    )
}