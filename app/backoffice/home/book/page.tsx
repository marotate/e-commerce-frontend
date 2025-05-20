"use client";

import React, { useEffect, useState } from "react";
import { Config } from "@/app/config";
import type { BookInterface } from "@/app/interface/BookInterface";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "../components/Modal";

export default function Book() {
  const [books, setBooks] = useState<BookInterface[]>([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [isbn, setIsbn] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState<File | null>();
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

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
        text: err.message,
        icon: "error",
      });
    }
  };

  const openModal = () => {
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setId('');
        setIsbn('');
        setName('');
        setPrice(0);
        setDescription('');
    }

     const handleSave = async () => {
        try {
            let response: any;
            const data = new FormData();
            data.append("image", image as Blob);
            data.append("isbn", isbn);
            data.append("name", name);
            data.append("price", price.toString());
            data.append("description", description);
    
            if (id == '') {
                //insert
                const url = Config.apiUrl + '/api/book/create';
                response = await axios.post(url, data);
                
            } else {
                // update
                const url = Config.apiUrl + '/api/book/update/' + id;
                response = await axios.put(url, data);
            }

            if (response.status == 200) {
                Swal.fire({
                    title: 'Add book',
                    text: 'Successfully add information',
                    icon: 'success',
                    timer: 1000
                })
                fetchData();
                closeModal();
            }
        } catch (err: any) {
            Swal.fire({
                title: 'error',
                text: err.message,
                icon: 'error'
            })
        }
    }

    const handleEdit = (book: BookInterface) => {
        setId(book.id);
        setIsbn(book.isbn ?? '');
        setName(book.name);
        setPrice(book.price);
        setDescription(book.description ?? '');
        setImageUrl(book.image as string);

        openModal();
    }

    const handleDelete = async (book: BookInterface) => {
        const button = await Swal.fire({
            title: 'Delete Information',
            text: 'Do you want to delete ' + book.name,
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        })

        if (button.isConfirmed) {
            const url = Config.apiUrl + '/api/book/delete/' + book.id;
            const response = await axios.delete(url);

            if (response.status == 200) {
                Swal.fire({
                    title: 'Delete information',
                    text: 'Successfully delete information',
                    icon: 'success',
                    timer: 1000
                })

                fetchData();
            }
        }
    }

     const chooseFile = (files: any) => {
        if (files.length > 0) {
            const file: File = files[0];
            setImage(file);
        }
    }
    
  return (
    <div>
      <div className="container">
        <div className="title">Book</div>

        <div>
          <button onClick={openModal}>
            <i className="fa fa-plus mr-2"></i>
            Add book
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>ISBN</th>
              <th>Name</th>
              <th style={{ textAlign: "right" }}>Price</th>
              <th>Info</th>
              <th className="w-[120px]">action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book: BookInterface) => (
              <tr key={book.id}>
                <td className="text-center">
                  {book.image ? (
                    <img
                      src={Config.apiUrl + "/public/uploads/" + book.image}
                      className="w-[150px] rounded-xl shadow-md"
                    />
                  ) : (
                    <i className="fa fa-image text-6xl text-gray-500"></i>
                  )}
                </td>
                <td>{book.isbn}</td>
                <td>{book.name}</td>
                <td className="text-right">{book.price.toLocaleString()}</td>
                <td>{book.description}</td>
                <td>
                  <div className="flex gap-1 items-center">
                    <button
                      className="btn-edit"
                      onClick={(e) => handleEdit(book)}
                    >
                      <i className="fa fa-edit"></i>
                    </button>
                    <button
                      className="btn-delete"
                      onClick={(e) => handleDelete(book)}
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showModal ?
                <Modal onClose={closeModal} title="Book Information">
                    <div>
                        <label>ISBN</label>
                        <input value={isbn} onChange={(e) => setIsbn(e.target.value)} />
                    </div>

                    <div>
                        <label>Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div>
                        <label>Price</label>
                        <input type="number" value={price}
                            onChange={(e) => setPrice(parseInt(e.target.value))} />
                    </div>

                    <div>
                        <label>Information</label>
                        <input value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>

                    <div>
                        <label>Image</label>
                        {imageUrl != null ?
                            <img src={Config.apiUrl + '/public/uploads/' + imageUrl}
                                className="rounded-lg mt-3 mb-3"
                            />
                            : null}
                        <input type="file" onChange={(e) => chooseFile(e.target.files)} />
                    </div>

                    <div className="mt-5 flex items-center justify-center">
                        <button className="modal-btn-submit modal-btn " onClick={handleSave}>
                            Add
                        </button>
                    </div>
                </Modal>
                : null
            }
        </div>
    )
}