import React, { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
    const notesInitial = []
    const [notes, setNotes] = useState(notesInitial)

     
  //get all notes
  const getNotes = async () => {
    //Api call
    const response = await fetch(`${host}/api/notes/fetchdata`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token')
      },    
    });
    
    const json = await response.json() 
   setNotes(json)

  }
    //Add note
    const addnote = async (title, description, tag) => {
      //API Call
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token":localStorage.getItem('token')
        },
        body: JSON.stringify({title,description,tag}),
      });
      const note = await response.json();
      setNotes(notes.concat(note))
    }
    //DELETE a note
    const deleteNote =async (id) => {
          //API Call
          const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "auth-token":localStorage.getItem('token')
            },
            // body: JSON.stringify({title,description,tag}),
          });
          const json = response.json();
           console.log(json)
      const newNotes = notes.filter((note) => {
        return note._id !== id;
      });
      setNotes(newNotes);
    }

     //edit a note
     const editNote = async (id, title, description, tag) => {
      // API CALL
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token":localStorage.getItem('token')
        },
        body: JSON.stringify({title,description,tag}),
      });
      const json = await response.json();
      console.log(json)

      let newNotes = JSON.parse(JSON.stringify(notes))
      //Logic to edit in client
      for (let index = 0; index <  newNotes.length; index++) {
        const element =  newNotes[index];
        if (element._id === id) {
          newNotes[index].title = title;
          newNotes[index].description = description;
          newNotes[index].tag = tag;
          break;
        }
      }
      setNotes(newNotes);
     }
    
    return(
        <NoteContext.Provider value= {{notes, addnote, deleteNote, editNote, getNotes }}>
        {  props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;