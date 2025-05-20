'use client'

import { useState } from "react"
import { Config } from "@/app/config"
import axios from "axios"
import Swal from "sweetalert2"

export default function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload = {
                username: username,
                password: password
            }
            const url = Config.apiUrl + '/api/member/signin'
            const response = await axios.post(url, payload);

            if (response.status == 200) {
                localStorage.setItem(Config.tokenMember, response.data.token)
                window.location.href = '/web'
            }
        } catch (err: any) {
            Swal.fire({
                title: 'username incorrect',
                text: 'user not found',
                icon: 'info',
                timer: 2000
            })
        }
    }

    return (
        <div className="front">
            <h1 className="text-2xl text-center font-bold text-amber-950 m-2">SIGN IN</h1>
            <form onSubmit={(e) => handleSignIn(e)}>
                <div>
                    <label>Username</label>
                    <input onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    <button type="submit">
                        <i className="fa fa-lock mr-3"></i>
                        Login
                    </button>
                </div>
            </form>
        </div>
    )
}