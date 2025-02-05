import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

interface Errors {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

const Register: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errors, setErrors] = useState<Errors>({});
    const router = useRouter();

    const validateForm = (): boolean => {
        Keyboard.dismiss();
        let isValid = true;
        const newErrors: Errors = {};

        if (!username.trim()) {
            newErrors.username = 'Username is required';
            isValid = false;
        }
        if (!email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
            isValid = false;
        }
        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = 'Password needs at least 6 characters';
            isValid = false;
        }
        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleRegister = async (): Promise<void> => {
        if (!validateForm()) return;

        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', {
                name: username,
                email,
                password,
            });

            if (res.status === 200 || res.status === 201) {
                await AsyncStorage.setItem('token', res.data.token);
                router.push('/Home');
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Registration failed';
            Alert.alert('Error', message);
        }
    };

    return (

     <LinearGradient
             colors={['#0F172A', '#1E293B']}
             style={styles.container}
           >
        <View>
            <Text style={styles.title}>🎬 Create Account</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, errors.username && styles.inputError]}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                />
                {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
            </View>

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

            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, errors.confirmPassword && styles.inputError]}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Sign Up</Text>
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
        color: '#FFF', 
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
     backgroundColor: '#E11D48',
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'center',
     gap: 12,
     padding: 18,
     borderRadius: 15,
     shadowColor: '#E11D48',
     shadowOffset: { width: 0, height: 4 },
     shadowOpacity: 0.3,
     shadowRadius: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});

export default Register;