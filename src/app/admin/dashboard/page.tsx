
"use client"

import { useEffect, useState } from "react"

interface Message {
  anon_id: string;
  token: string;
  message: string;
  sender_name: string;
}


export default function AdminDashboard() {
  const [numOfConversations, setNumOfConversations] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([]);
  const [activebtn, setActivebtn] = useState(1);

  async function getAllUnreadMessages(){
    const res = await fetch(`/api/get-all-unread-messages`)
    const data = await res.json()
    console.log(data);
    if (data.data.is_success) {
      setUnreadMessages(data.data.data);
    }
  }

  async function getAllConversations(){
    const res = await fetch(`/api/get-all-conversations`)
    const data = await res.json()
    console.log(data);
    if (data.data.is_success) {
      setNumOfConversations(data.data.data);
    }
  }

  useEffect(() => {
    document.body.style.overflowY = "auto";
    getAllUnreadMessages();
    getAllConversations();
  }, [])

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" })
    window.location.href = "/admin/login"
  }

  function visitConversation(token: string) {
    window.location.href = "/admin/conversation/" + token
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard">
        <div className="dash-btns">
          <div className="btn fs-13">
            <span>19</span><br></br>
            <span>Anon</span>
          </div>
          <div className={activebtn == 1 ? "btn active fs-13" : "btn fs-13"} onClick={() => setActivebtn(1)}>
            <span>3</span><br></br>
            <span>Unread</span>
          </div>
          <div className={activebtn == 2 ? "btn fs-13 active" : "btn fs-13"} onClick={() => setActivebtn(2)}>
            <span>3</span><br></br>
            <span>Token</span>
          </div>
        </div>
        <div className="dash-container mt-10">
          {
            activebtn == 1?
            unreadMessages.map((m, index) => {
              const message = m['token'];
              const truncated = message.length > 100 ? message.slice(0, 100) + "..." : message;

              return (
                <div key={index} className="mt-5" onClick={() => visitConversation(m["token"])}>
                  <p className="fs-13 fw-300" style={{color:"var(--orange)"}}>{m['anon_id']} ({m['sender_name']})</p>
                  <p className="fs-13 fw-100">{truncated}</p>
                </div>
              );
            }) : false
          }

        {
            activebtn == 2?
            numOfConversations.map((m, index) => {
              return (
                <div key={index} className="mt-5" onClick={() => visitConversation(m["token"])}>
                  <p className="fs-13 fw-300" style={{color:"var(--orange)"}}>{m['anon_id']} ({m['name']})</p>
                  <p className="fs-13 fw-100">{m['token']}</p>
                </div>
              );
            }) : false
          }


        </div>
      </div>
    </div>
  )
}
