import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import axiosInstance from '~/lib/apiClient';
import { Errors } from '~/lib/types';



const Login: React.FC = () => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<Errors>({});
    const router = useRouter();

    const validateForm = (): boolean => {
        Keyboard.dismiss();
        let isValid = true;
        const newErrors: Errors = {};

        if (!email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } 
        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleLogin = async (): Promise<void> => {
        if (!validateForm()) return;

        try {
            const res = await axiosInstance.post( 'auth/login' , {
                email: email,
                password: password,
            });

            if (res.status === 200 || res.status === 201) {

                await AsyncStorage.setItem('userId', res.data.user._id);
                await AsyncStorage.setItem('token', res.data.token);
                router.push('/Home');
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'login failed';
            Alert.alert('Error', message);
        }
    };

    return (

        
        <LinearGradient
        colors={['#0F172A', '#1E293B']}
        style={styles.container}
      >
        <View >

              
            <Text style={styles.title}>🎬 Login To Your Account</Text>

          
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, errors.password && styles.inputError]}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>


            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            
        </View>
 </LinearGradient>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 30,        
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        marginBottom: 40,
        textAlign: 'center',
        color: '#E11D48',
        letterSpacing: 0.5,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#E11D48',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#1E1E1E',
        color: 'white',
    },
    inputError: {
        borderColor: '#FF4444', 
    },
    errorText: {
        color: '#FF4444',
        marginTop: 4,
        marginLeft: 4,
        fontSize: 14,
    },
    button: {
        height: 50,
        borderRadius: 8,
        backgroundColor: '#E11D48',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#FFF', 
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});

export default Login;