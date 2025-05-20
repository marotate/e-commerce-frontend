// app/web/layout.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Config } from "../config";
import axios from "axios";

export default function WebLayout({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState("");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem(Config.tokenMember);

      if (token != undefined) {
        const headers = {
          Authorization: "Bearer " + token,
        };
        const url = Config.apiUrl + "/api/member/info";
        const response = await axios.get(url, { headers });

        if (response.status == 200) {
          setUsername(response.data.username);
        }
      }
    } catch (err: any) {
      Swal.fire({
        title: "error",
        text: err,
        icon: "error",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSignOut = async () => {
    const button = await Swal.fire({
      title: "Logout",
      text: "Do you want to logout?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
    });

    if (button.isConfirmed) {
      localStorage.removeItem(Config.tokenMember);
      window.location.href = "/web";
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-amber-800 via-amber-600 to-amber-500 p-10 text-white">
        <div className="flex justify-between">
          <div>
            <div className="text-3xl">
              <i className="fa fa-book-open mr-3"></i>
              Online BookStore
            </div>
            <div className="text-xl">Reading helps your mind</div>
          </div>
          <div>
            {username != "" ? (
              <>
                <i className="fa fa-user mr-2"></i>
                {username}
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-amber-950 text-orange-100 p-4 flex gap-7">
        <Link href="/web">
          <i className="fa fa-home mr-2"></i>
          Home
        </Link>
        {username == "" ? (
          <>
            <Link href="/web/member/register">
              <i className="fa fa-user-plus mr-2"></i>
              Register
            </Link>
            <Link href="/web/member/sign-in">
              <i className="fa fa-lock mr-2"></i>
              Login
            </Link>
          </>
        ) : (
          <>
            <button onClick={handleSignOut}>
              <i className="fa fa-sign-out mr-2"></i>
              Logout
            </button>
          </>
        )}
      </div>

      <div className="p-4">{children}</div>
    </>
  );
}
