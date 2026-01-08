"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  async function fetchNotes() {
    const res = await fetch("/api/notes");
    setNotes(await res.json());
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/notes/${editingId}` : "/api/notes";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    setTitle("");
    setContent("");
    setEditingId(null);
    fetchNotes();
  }

  async function deleteNote(id) {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    fetchNotes();
  }

  function editNote(note) {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note._id);
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">📝 Notes App</h1>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          className="w-full border p-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button className="bg-black text-white px-4 py-2 rounded">
          {editingId ? "Update Note" : "Add Note"}
        </button>
      </form>

      <ul className="space-y-4">
        {notes.map((note) => (
          <li key={note._id} className="border p-4 rounded">
            <h2 className="font-semibold">{note.title}</h2>
            <p className="text-sm text-gray-600">
              {new Date(note.createdAt).toLocaleString()}
            </p>
            <p className="mt-2">{note.content}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => editNote(note)}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteNote(note._id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
