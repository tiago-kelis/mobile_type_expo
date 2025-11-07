import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
// import { LinearGradient } from 'expo-linear-gradient';

export const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",        
        padding: 5,        
        fontWeight: "black",
        gap: 40,
       

    },


    boxImage: {      
        textAlign: "center",
        backgroundColor: "#0308399e",
        width: "27%",
        height: "10%",
        marginBottom: 20,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#4f156aff",        

    },


    boxSaudacao: {
        color: "#235975ff",
        marginTop: -40,
        marginBottom: 20,
        fontWeight: "bold",
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
        alignItems: "center",     
        width: "30%",
        height: "5%",
        paddingLeft:35,
        paddingRight:35,
        backgroundColor: "#0308399e",
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#4f156aff"      

    },

    buttonText: {
        justifyContent: "center",
        textAlign: "center",
        color: '#235975ff',
        fontWeight: 'bold',
        
       
    },


    imageSize: {
        width: 100, 
        height: 80,
    },

    boxText: {
        textAlign: "justify",
        color: "#0d4a79ff",
    
    },

    Input: {              
        width:"50%",
        height: "100%",
        color: "#050c27ff",       
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
        borderColor: "#9817c3e9"
        
    },

    

    boxSignUp: {
        marginTop: 100,
        color: "#7272749e"
    },

    link: {
        color: "blue",
        textDecorationLine: "none"
    }

    



})