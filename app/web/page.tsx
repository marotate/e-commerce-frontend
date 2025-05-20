// app/web/page.tsx
"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Config } from "../config";
import { BookInterface } from "../interface/BookInterface";
import { CartInterface } from "../interface/CartInterface";
import Link from "next/link";

export default function Home() {
  const [books, setBooks] = useState<BookInterface[]>([]);
  const [token, setToken] = useState("");
  const [carts, setCarts] = useState<CartInterface[]>([]);
  const [memberId, setMemberId] = useState("");
  const [qtyInCart, setQtyInCart] = useState(0);

  useEffect(() => {
    readToken();
    fetchData();

    if (memberId != "") {
      fetchDataCart();
    }
  }, [memberId]);

  const readToken = async () => {
    const token = localStorage.getItem(Config.tokenMember) ?? "";
    setToken(token);

    try {
      if (token) {
        const url = Config.apiUrl + "/api/member/info";
        const headers = {
          Authorization: "Bearer " + token,
        };
        const response = await axios.get(url, { headers });

        if (response.status == 200) {
          setMemberId(response.data.id);
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

  const fetchData = async () => {
    try {
      const url = Config.apiUrl + "/api/book/list";
      const response = await axios.get(url);

      if (response.status == 200) {
        setBooks(response.data);
      }
    } catch (err: any) {
      Swal.fire({
        title: "error",
        text: err,
        icon: "error",
      });
    }
  };

  const fetchDataCart = async () => {
    try {
      if (token != "") {
        const url = Config.apiUrl + "/api/cart/list/" + memberId;
        const response = await axios.get(url);

        if (response.status == 200) {
          setCarts(response.data);
          let sum = 0;

          for (let i = 0; i < response.data.length; i++) {
            const item = response.data[i];
            sum += item.qty;
          }

          setQtyInCart(sum);
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

  const handleAddToCart = async (bookId: string) => {
    try {
      const url = Config.apiUrl + "/api/cart/add";
      const payload = {
        memberId: memberId,
        bookId: bookId,
      };
      const response = await axios.post(url, payload);

      if (response.status == 200) {
        fetchDataCart();
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
    <div className="p-3">
      <div className="flex flex-row items-center justify-between mb-5 gap-6">
        <h1 className="text-3xl font-semibold text-amber-900">
          Recommend Book
        </h1>
        {token != "" ? (
        <div className="flex items-center flex-wrap gap-4 text-xl text-amber-900">
          <div>
            Total  {" "}
            <span className="font-bold text-amber-500 px-1">
              {qtyInCart}
            </span>{" "}
            items
          </div>
          <Link
            href="/web/member/cart"
            className="ml-4 bg-amber-700 px-5 py-2 rounded-4xl text-white shadow-md text-sm hover:bg-amber-900 transition duration-300"
          >
            <i className="fa fa-shopping-cart mr-3"></i>
            My Cart
          </Link>
        </div>
        ) : null}
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-8 lg:grid-cols-6 gap-5 px-4">
        {books.map((book: BookInterface) => (
          <div
            key={book.id}
            className="bg-amber-950 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
          >
            <div>
              <img
                src={Config.apiUrl + "/public/uploads/" + book.image}
                className="rounded-md w-full h-60 object-cover"
              />
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between">
              <h2 className="text-md font-semibold text-orange-100 mb-3">
                {book.name}
              </h2>
              <div className="flex flex-col justify-between bg-amber-100 rounded p-1 mt-auto">
                <span className="font-bold text-lg text-amber- text-center">
                  {book.price.toLocaleString()} ฿
                </span>

                {token != "" ? (
                  <button
                    onClick={(e) => handleAddToCart(book.id)}
                    className="flex items-center justify-center gap-1 bg-amber-600 hover:bg-amber-700
               text-white text-sm font-medium px-4 py-2 rounded-lg
               shadow-md transition duration-300 ease-in-out"
                  >
                    <i className="fa fa-shopping-cart text-base"></i>
                    add to cart
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
