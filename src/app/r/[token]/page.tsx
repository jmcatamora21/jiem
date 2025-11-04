"use client"

import { useEffect, useState, use, useRef, useLayoutEffect } from "react"
import { getAnonId } from "../../lib/anon"
import {supabase} from "../../lib/supabase"
import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton from "react-loading-skeleton";

interface AnonPageProps {
  params: Promise<{ token: string }>
}

async function validateToken(token: string) {
  const { data, error } = await supabase
  .from('anon_links')
  .select('*')
  .eq('token', token)
  .maybeSingle()

 

  return data;
  
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);

    media.addEventListener("change", listener); 
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}



export default function AnonPage({ params }: AnonPageProps) {
  const { token } = use(params)
  const [anonId, setAnonId] = useState("")
  const [loading, setLoading] = useState(true)
  const [expiredUrl, setExpiredUrl] = useState(false);
  const [headerlabel, setHeaderlabel] = useState("");
  const [anonMessages, setAnonMessages] = useState([])
  const [user_message, set_message] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [notCurrentSession, setNotCurrentSession] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  function addMessage() {
    const newDiv = document.createElement('div')
    newDiv.innerHTML = `
    <div class="message">
      <div>
        <div class="fs-13 fw-200">${user_message}</div>
      </div>
    </div>`;
    containerRef.current?.appendChild(newDiv)

    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
   
  }

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }

  }, [anonMessages])

  useEffect(() => {
    document.body.style.overflowY = "auto";
    
    const id = getAnonId()
    setAnonId(id)
    const run = async () => {
      
      const DATA = await validateToken(token);
      const expiresAt = new Date(DATA.expires_at)

      const now = new Date()
      if (DATA.anon_id != id) {
        setNotCurrentSession(true);
      }
      if (expiresAt > now) {
        const remainingMs = expiresAt.getTime() - now.getTime()
        const remHrs = Math.floor((remainingMs / (1000 * 60 * 60)) % 24)
        
        setHeaderlabel(`This page will expire in ${remHrs} ${remHrs > 1 ? 'hours' : 'hour'}`)
        setLoading(false)
        const res = await fetch(`/api/get-messages?anon_id=${DATA.anon_id}&token=${token}`)
        const data = await res.json()

        if (data.data.is_success) {
          console.log(data.data.data)
          setAnonMessages(data.data.data);
        }

      } else {
        setHeaderlabel("Link expired")
        setExpiredUrl(true);

        setLoading(false)
      }
      
    }
    run();
  }, [])
  
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  async function sendMessage(message: string) {
    const createConvo = await fetch('/api/convo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender_name: anonMessages[0]['sender_name'], message, anon_id : anonId, token:  token, is_admin: false })
    })

    const data = await createConvo.json();
    if (data.data.is_success) {
      set_message("");
      setIsSending(false);

      addMessage();
    }
  }

  return (
    <div className="main anon-page">
      <div className="main-wrapper">
        <div className="text-center">
          { loading ? 
          
          <Skeleton className="animate-pulse" enableAnimation height={17} style={{opacity:".1",background:"#fff"}} width={250} /> : <p className="fs-13">{headerlabel}</p> }
          
          
        </div>
        <div className="messages-wrapper mt-20">
          {
            loading ? <Skeleton className="animate-pulse sk1" enableAnimation style={{opacity:".1",background:"#fff"}}/> :  !expiredUrl ?
            <div className="messages-container">
              <div className="messages" ref={ref}>
                <div ref={containerRef}>
                  {anonMessages.map((data, index) => (
                    data['is_admin'] ? 
                    <div key={index} className="mt-5 ">
                      <div className="left-message">
                        <div className="icon-container">
                          <img style={{height:20,width:20}} src="/favicon.ico"/>
                        </div>
                        <div className="message">
                          <div>
                            <div className="fs-13 fw-200" style={{color:"var(--orange)"}}>{data['message']}</div>
                          </div>
                        </div>
                      </div>
                    </div> : 
                    <div key={index} className="mt-5">
                      <div className="message">
                        <div>
                          <div className="fs-13 fw-200">{data['message']}</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            </div> : false
          }
          

          { loading ? 
          (
            <>
            <Skeleton className="animate-pulse mt-20" enableAnimation height={17} width={200} style={{opacity:".1",background:"#fff"}}/>
            <Skeleton className="animate-pulse mt-10" enableAnimation height={100} style={{opacity:".1",background:"#fff"}}/>
            <div className="text-right">
              <Skeleton className="animate-pulse mt-10" enableAnimation height={35} width={120} style={{opacity:".1",background:"#fff"}}/>
            </div>
            </>
           ) : !expiredUrl && !notCurrentSession ?
           <div className="anon-form">
            <h4 className="fs-13 mt-20" style={{fontWeight:"300"}}>Send another message</h4>
            <textarea spellCheck="false" rows={7} className="fs-92 mt-10" value={user_message} onChange={(e) => {set_message(e.target.value)}}  placeholder="Write a message"></textarea>
            <button type="submit" disabled={isSending ? true : false} className="fs-92 mt-10" onClick={()=>{
              if(user_message.length > 0) {
                sendMessage(user_message)
                setIsSending(true);
              }
              
            }}>Submit</button>
           </div> : false
            
           }
        
        </div>
       
      </div>
    </div>
  )
}
