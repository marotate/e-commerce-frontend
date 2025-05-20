"use client";
import { Config } from "@/app/config";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function page() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = async () => {
    try {
      if (password !== confirmPassword) {
        Swal.fire({
          // title: 'Wrong password, Please fill again',
          text: "Wrong password, Please fill again",
          icon: "warning",
        });
      }
      const url = Config.apiUrl + "/api/admin/update";

      const payload = {
        name: name,
        username: username,
        password: password,
      };

      const token = localStorage.getItem(Config.tokenName);

      const headers = {
        authorization: token,
      };

      const response = await axios.put(url, payload, { headers });

      if (response.status == 200) {
        Swal.fire({
          title: "Save Data",
          text: "Successfully update profile",
          icon: "success",
          timer: 1000,
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: "error",
        text: error.message,
        icon: "error",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const url = Config.apiUrl + "/api/admin/info";
      const token = localStorage.getItem(Config.tokenName);

      const headers = {
        authorization: token,
      };

      const response = await axios.get(url, { headers });

      if (response.status == 200) {
        setName(response.data.name);
        setUsername(response.data.username);
      }
    } catch (error: any) {
      console.log(error);

      Swal.fire({
        title: "error",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="container">
      <div className="title">Edit Profile</div>
      <div>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password *If not edited, don't fill it out</label>
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <label>Confirm Password *If not edited, don't fill it out</label>
        <input
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleSave}>
          <i className="fa fa-check mr-2" />
          Save
        </button>
      </div>
    </div>
  );
}
