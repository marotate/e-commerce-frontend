"use client";

import { Config } from "@/app/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export default function page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const url = Config.apiUrl + "/api/admin/signin";
      const payload = {
        username: username,
        password: password,
      };
      const result = await axios.post(url, payload);

      if (result.data.token != null) {
        localStorage.setItem(Config.tokenName, result.data.token);
        router.push('/backoffice/home/dashboard')
      }
    } catch (error: any) {
      Swal.fire({
        title: "error",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="signin-block">
      <div className="signin">
        <h1>Sign In To Back Office</h1>
        <div>
          <div>username</div>
          <input onChange={e => setUsername(e.target.value)}/>
        </div>
        <div>
          <div>password</div>
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit" onClick={handleSignIn}>Sign In</button>
      </div>
    </div>
  );
}
