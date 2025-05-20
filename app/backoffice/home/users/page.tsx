"use client";
import { Config } from "@/app/config";
import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Swal from "sweetalert2";

export default function page() {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [levels, setLevels] = useState([
    { label: "admin", value: "admin" },
    { label: "user", value: "user" },
  ]);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [level, setLevel] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const url = Config.apiUrl + "/api/admin/list";
      const response = await axios.get(url);

      if (response.status == 200) {
        setAdmins(response.data);
      }
    } catch (error) {}
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSave = async () => {
    try {
      const payload = {
        name: name,
        username: username,
        password: password,
        level: level,
      };
      let response: any;

      if (id != "") {
        // update
        if (password != confirmPassword) {
          Swal.fire({
            title: "Check password",
            text: "Password not correct",
            icon: "warning",
            timer: 1000,
          });
          return;
        }

        const url = Config.apiUrl + "/api/admin/update-data/" + id;
        response = await axios.put(url, payload);
      } else {
        // insert
        if (password != confirmPassword) {
          Swal.fire({
            title: "Check password",
            text: "Password not correct",
            icon: "warning",
            timer: 1000,
          });
          return;
        }
        
        const url = Config.apiUrl + "/api/admin/create";
        response = await axios.post(url, payload);
      }

      if (response.status === 200) {
        Swal.fire({
          title: "Sucessfully",
          text: "Add information sucessfully",
          icon: "success",
          timer: 1000,
        });

        fetchData();
        closeModal();
      }
    } catch (err: any) {
      Swal.fire({
        title: "error",
        text: err.message,
        icon: "error",
      });
    }
  };

  const handleEdit = (admin: any) => {
    setId(admin.id);
    setName(admin.name);
    setUsername(admin.username);
    setLevel(admin.level);

    openModal();
  };

  const handleDelete = async (admin: any) => {
    const button = await Swal.fire({
      title: "Delete User",
      text: "Do you want to delete " + admin.name + " from the system?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
    });
    if (button.isConfirmed) {
      try {
        const url = Config.apiUrl + "/api/admin/delete/" + admin.id;
        const response = await axios.delete(url);

        if (response.status === 200) {
          Swal.fire({
            title: "Delete information",
            text: "Successfully delete user",
            icon: "success",
            timer: 2000,
          });

          fetchData();
        }
      } catch (err: any) {
        Swal.fire({
          title: "error",
          text: err.message,
          icon: "error",
        });
      }
    }
  };

  return (
    <div>
      <div className="container">
        <div className="title">Account</div>
        <div>
          <button onClick={openModal}>
            <i className="fa fa-plus mr-3"></i>
            add account
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>name</th>
              <th>username</th>
              <th>level</th>
              <th className="w-[120px]" style={{ textAlign: "center" }}>
                status
              </th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin: any) => (
              <tr key={admin.id}>
                <td>{admin.name}</td>
                <td>{admin.username}</td>
                <td>{admin.level}</td>
                <td>
                  <div className="flex gap-1 justify-center">
                    <button
                      className="btn-edit"
                      onClick={(e) => handleEdit(admin)}
                    >
                      <i className="fa fa-edit"></i>
                    </button>
                    <button
                      className="btn-delete"
                      onClick={(e) => handleDelete(admin)}
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

      {showModal ? (
        <div>
          <div>test</div>
          <Modal onClose={closeModal} title="Account Information">
            <div>
              <label>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label>Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div>
              <label>Level</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                {levels.map((level) => (
                  <option value={level.value} key={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-5 flex items-center justify-center">
              <button
                className="modal-btn-submit modal-btn"
                onClick={handleSave}
              >
                add
              </button>
            </div>
          </Modal>
        </div>
      ) : null}
    </div>
  );
}
