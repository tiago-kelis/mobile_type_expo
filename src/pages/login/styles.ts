import { StyleSheet } from "react-native";
// import { LinearGradient } from 'expo-linear-gradient';

export const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(162, 166, 173, 0.93)",
        padding: 5,        
        fontWeight: "black",
        gap: 40,
       

    },


    boxImage: {      
        textAlign: "center",
        backgroundColor: "#abc87cff",
        width: "27%",
        height: "10%",
        marginBottom: 20,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#2a2727e9",        

    },


    boxSaudacao: {
        color: "#3ea1d2ff",
        marginTop: -40,
        marginBottom: 20
    },


    boxLabelEmail: {       
       
        marginBottom: -200
       
    },

    boxLabelSenha: {

        marginBottom: -150

    },


    boxButton: {
        textAlign: "center", 
        justifyContent: "center",      
        width: "30%",
        height: "5%",
        paddingLeft: 45,
        backgroundColor: "#a0d5729e",
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#423f3fff"      

    },

    buttonText: {
        color: '#423f3fff',
        fontWeight: 'bold',
  },


    imageSize: {
        width: 100, 
        height: 80,
    },

    boxText: {
        textAlign: "justify",
        color: "#302d2dff",
    
    },

    Input: {              
        width:"50%",
        height: "100%",
        color: "#504e4e",       
        borderRadius: 12,
        borderBottomLeftRadius: 2,
        paddingLeft: 10,
       
    },

    boxInput: {
        flexDirection: "row",
        width: "120%",
        height: "20%",          
        backgroundColor: "#d2cdcdff",       
        justifyContent: "flex-start",
        alignItems: "center",
        paddingRight: 5,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#7e7878e9"
        
    },

    

    boxSignUp: {
        marginTop: 100,
        color: "#7272749e"
    }

    



})