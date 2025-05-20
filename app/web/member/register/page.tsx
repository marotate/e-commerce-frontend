'use client'

import { useState } from "react"
import { Config } from "@/app/config"
import axios from "axios"
import Swal from "sweetalert2"

export default function Register() {
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault(); //error but still have a data not refresh

        try {
            if (password !== confirmPassword) {
                Swal.fire({
                    title: 'Verify Password',
                    text: 'Password does not correct',
                    icon: 'warning'
                })
                return
            }

            const url = Config.apiUrl + '/api/member/signup'
            const payload = {
                phone: phone,
                username: username,
                password: password
            }
            const response = await axios.post(url, payload);

            if (response.status == 200) {
                Swal.fire({
                    title: 'Register',
                    text: 'Register Successfully',
                    icon: 'success',
                    timer: 1000
                })
            }
        } catch (err: any) {
            Swal.fire({
                title: 'error',
                icon: 'error',
                text: 'Error ' + err
            })
        }
    }

    return (
        <div className="front">
            <div className="text-2xl text-center font-bold text-amber-950 m-2">BOOK STORE REGISTRATION</div>
            <form onSubmit={(e) => handleSignUp(e)}>
                <div>
                    <label>Phone</label>
                    <input onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                    <label>Username</label>
                    <input onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    <label>Comfirm Password</label>
                    <input type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div>
                    <button type="submit">
                        <i className="fa fa-check mr-2"></i>
                        Register
                    </button>
                </div>
            </form>
        </div>
    )
}