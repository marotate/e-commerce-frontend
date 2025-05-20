"use client";

import { Config } from "@/app/config";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export const SideBar = () => {
  const [name, setName] = useState();
  const [username, setUsername] = useState();
  const [level, setLevel] = useState();
  const router = useRouter();

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
      const res = await axios.get(url, { headers });

      if (res.data.name !== undefined) {
        setName(res.data.name);
        setLevel(res.data.level);
      }
    } catch (error) {
      Swal.fire({
        title: "",
        text: "",
      });
    }
  };

  const handleSignOut = async () => {
    const button = await Swal.fire({
    //   title: "Logout",
      text: "Do you want to logout?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
    });
    if (button.isConfirmed) {
      localStorage.removeItem(Config.tokenName);
      router.push('/backoffice/signin')
    }
  };
  return (
    <div className="sidebar">
      <div className="header">
        <h1>Back Office</h1>
        <p>
          <i className="fa fa-user mr-3" />
          {name}: {level}
        </p>
        <p className="button">
          <Link href="/backoffice/home/edit-profile">
            <i className="fa fa-user-edit mr-3" />
            edit
          </Link>
          <button onClick={handleSignOut}>
            <i className="fa-solid fa-arrow-right-from-bracket mr-3" />
            Logout
          </button>
        </p>
      </div>
      <div className="body">
        <Link href="/backoffice/home/dashboard">
          <i className="fa fa-chart-line" />
          Dashboard
        </Link>
        <Link href="/backoffice/home/book">
          <i className="fa fa-book" />
          Book
        </Link>
        <Link href="/backoffice/home/order">
          <i className="fa fa-cart-shopping" />
          Order
        </Link>
        <Link href="/backoffice/home/users">
          <i className="fa fa-user-cog" />
          Account
        </Link>
      </div>
      <div className="footer"></div>
    </div>
  );
};
