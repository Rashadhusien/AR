"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const Section = ({ title, initAvatar, bgcolor, onCheckboxChange }) => {
  const storageKey = `items-${title}`;
  const avatarKey = `avatar-${title}`;
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newText, setNewText] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem(storageKey)) || [];
    setItems(storedItems);
    const storedAvatar = localStorage.getItem(avatarKey);
    if (storedAvatar) setAvatar(storedAvatar);
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
    onCheckboxChange();
  }, [items]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
        localStorage.setItem(avatarKey, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    if (newText.trim()) {
      let updatedItems;
      if (editIndex !== null) {
        updatedItems = items.map((item, i) =>
          i === editIndex ? { ...item, text: newText } : item
        );
        setEditIndex(null);
      } else {
        updatedItems = [...items, { text: newText, checked: false }];
      }
      setItems(updatedItems);
      setNewText("");
      setShowModal(false);
    }
  };

  const deleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const toggleCheck = (index) => {
    setItems(
      items.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <div className="p-4 font-[Cairo]">
      <div
        className={`flex items-center justify-between ${bgcolor} p-3 rounded-lg`}
      >
        <div className={`flex items-center gap-3 `}>
          <label htmlFor={`avatar-upload-${title}`} className="cursor-pointer">
            <Image
              src={avatar || `/${initAvatar}-avatar.svg`}
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-white"
              width={500}
              height={500}
            />
          </label>
          <input
            type="file"
            id={`avatar-upload-${title}`}
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
          />
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          اطلب
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#FBFBFB] p-4 rounded shadow-lg">
            <input
              type="text"
              value={newText}
              placeholder="اي طلبك ؟"
              onChange={(e) => setNewText(e.target.value)}
              className="border p-2 w-full"
            />
            <button
              onClick={addItem}
              className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
            >
              احفظ
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="bg-red-500 text-white px-4 py-2 mt-2 mr-2 rounded"
            >
              الغاء
            </button>
          </div>
        </div>
      )}

      {items.map((item, index) => (
        <motion.div
          key={index}
          className={`flex items-center justify-between p-2 mt-2 bg-white rounded shadow ${
            item.checked ? "bg-[#f7f7f7f7]" : ""
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className={` mr-5 text-md`}>{item.text}</span>

          <div className="flex gap-2 items-center">
            <button
              onClick={() => {
                setNewText(item.text);
                setEditIndex(index);
                setShowModal(true);
              }}
              className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
            >
              <Image
                src={"/edit.png"}
                alt="edit"
                width={50}
                height={50}
                className="w-5 h-5"
              />
            </button>
            <button
              onClick={() => deleteItem(index)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              <Image
                src={"/trash.png"}
                alt="delet"
                width={50}
                height={50}
                className="w-5 h-5"
              />
            </button>
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleCheck(index)}
              className="w-5 h-5"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default function Home() {
  const [allItems, setAllItems] = useState([]);

  const updateProgress = () => {
    const allStoredItems = [
      ...(JSON.parse(localStorage.getItem("items-طلبات مشتركة")) || []),
      ...(JSON.parse(localStorage.getItem("items-طلباتي")) || []),
      ...(JSON.parse(localStorage.getItem("items-طلباتك")) || []),
    ];
    setAllItems(allStoredItems);
  };

  const progress =
    (allItems.filter((item) => item.checked).length / allItems.length) * 100 ||
    0;

  return (
    <>
      <div className="w-full bg-gray-200 h-3   absolute top-0 left-0">
        <motion.div
          className="h-3 bg-green-500 rounded-l"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      <div className="font-[Cairo] mx-3 w-[1000px] relative  max-h-[80vh] overflow-auto bg-[#333] rounded-3xl">
        <Section
          title="طلبات مشتركة"
          initAvatar="both"
          bgcolor="bg-[#FF6D28]"
          onCheckboxChange={updateProgress}
        />
        <Section
          title="طلباتي"
          initAvatar="rashad"
          bgcolor="bg-[#73C7C7]"
          onCheckboxChange={updateProgress}
        />
        <Section
          title="طلباتك"
          initAvatar="arwa"
          bgcolor="bg-[#F7CFD8]"
          onCheckboxChange={updateProgress}
        />
      </div>
    </>
  );
}
