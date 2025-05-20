"use client";

import axios from "axios";
import Swal from "sweetalert2";
import { Config } from "@/app/config";
import { CartInterface } from "@/app/interface/CartInterface";
import { useEffect, useState } from "react";

export default function Cart() {
  const [carts, setCarts] = useState<CartInterface[]>([]);
  const [memberId, setMemberId] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchDataMember();

    if (memberId != "") {
      fetchData();
    }
  }, [memberId]);

  useEffect(() => {
    computeTotalAmount();
  }, [carts]);

  const computeTotalAmount = () => {
    let sum = 0;

    for (let i = 0; i < carts.length; i++) {
      const item = carts[i];
      sum += item.qty * item.book.price;
    }

    setTotalAmount(sum);
  };

  const fetchDataMember = async () => {
    try {
      const url = Config.apiUrl + "/api/member/info";
      const headers = {
        Authorization: "Bearer " + localStorage.getItem(Config.tokenMember),
      };
      const response = await axios.get(url, { headers }); //to get username and id

      if (response.status == 200) {
        setMemberId(response.data.id);
      }
    } catch (err: any) {
      Swal.fire({
        title: "error",
        text: err,
        icon: "error",
      });
    }
  };

  const fetchData = async () => {
    try {
      const url = Config.apiUrl + "/api/cart/list/" + memberId;
      const response = await axios.get(url);

      if (response.status == 200) {
        setCarts(response.data);
      }
    } catch (err: any) {
      Swal.fire({
        title: "error",
        text: err,
        icon: "error",
      });
    }
  };
  return (
    <div className="drop-shadow-lg">
      <h1 className="text-2xl font-bold text-amber-950 text-center mb-6">
        My Cart
      </h1>
      <table className="table">
        <thead>
          <tr>
            <th className="w-[200px] text-left">Book</th>
            <th className="text-left">Name</th>
            <th className="text-center w-[100px]">Price</th>
            <th className="text-center w-[100px]">Item</th>
            <th className="text-center w-[100px]">Total</th>
            <th className="text-center w-[120px]"></th>
          </tr>
        </thead>
        <tbody>
          {carts.map((cart: CartInterface) => (
            <tr key={cart.id}>
              <td>
                <img
                  src={Config.apiUrl + "/public/uploads/" + cart.book.image}
                />
              </td>
              <td>{cart.book.name}</td>
              <td className="text-center text-gray-700">
                {cart.book.price.toLocaleString()}
              </td>
              <td className="text-center text-gray-700">{cart.qty}</td>
              <td className="text-center text-gray-700">
                {(cart.qty * cart.book.price).toLocaleString()}
              </td>
              <td>
                <div className="flex gap-2 items-center justify-center">
                  <button className="btn-plus">
                    <i className="fa fa-plus"></i>
                  </button>
                  <button className="btn-minus">
                    <i className="fa fa-minus"></i>
                  </button>
                  <button className="btn-delete">
                    <i className="fa fa-times"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="w-full max-w-5xl mx-auto text-right mt-6 text-xl font-semibold text-amber-950">
        Total price : {totalAmount.toLocaleString()} Baht
      </div>
    </div>
  );
}
