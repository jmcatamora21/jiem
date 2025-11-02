"use client"

import { useEffect, useState, use, useRef, useLayoutEffect } from "react"
import { getAnonId } from "../../../lib/anon"
import {supabase} from "../../../lib/supabase"
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

interface Names {
  sender_name: string;
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
  const [names, setNames] = useState<Names[]>([]);

  const ref = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  function addMessage() {
    const newDiv = document.createElement('div')
    newDiv.innerHTML = `
    <span class="fs-13 fs-300 italic" style="color:var(--orange)">Your reply:</span>
    <p class="fs-13 fw-200" style="color:var(--orange)">${user_message}</p>`;
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

    
    const run = async () => {
      
        const DATA = await validateToken(token);
    
        setAnonId(DATA.anon_id)

        const now = new Date()
        const expiresAt = new Date(DATA.expires_at);
        if (expiresAt > now) {
            const remainingMs = expiresAt.getTime() - now.getTime()
            const remHrs = Math.floor((remainingMs / (1000 * 60 * 60)) % 24)
            
            setHeaderlabel(`This page will expire in ${remHrs} ${remHrs > 1 ? 'hours' : 'hour'}`)
            setLoading(false)
        
            const res = await fetch(`/api/get-messages?anon_id=${DATA.anon_id}&token=${token}`)
            const data = await res.json()

            if (data.data.is_success) {
                setAnonMessages(data.data.data);
                //mark as read
                await fetch(`/api/convo-read?anon_id=${DATA.anon_id}&token=${token}`)
                
                const res = await fetch(`/api/get-anon-names?anon_id=${DATA.anon_id}`)
                const namesData = await res.json()
                const distinct_names: Names[] = namesData.data.data;
                const uniqueNames = Array.from(
                    new Map(distinct_names.map(m => [m.sender_name, m])).values()
                );
                setNames(uniqueNames);
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

    const createConvo = await fetch('/api/convo-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender_name: "Admin", message, anon_id : anonId, token:  token, is_admin: true, read: true })
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

            <div style={{textAlign:"left",paddingLeft:"10px", fontWeight:100}} className="mt-10">
                <p className="fs-9">
                Token: {token}<br></br>
                Anon ID: {anonId}<br></br>
                Names: [{
                    names.map((name, idx) => {
                        return <span key={idx}> {name.sender_name}, </span>
                    })
                    
                }]
                </p>
            </div>
        </div>
        <div className="messages-wrapper mt-20">
          {
            loading ? <Skeleton className="animate-pulse sk1" enableAnimation style={{opacity:".1",background:"#fff"}}/> :  !expiredUrl ?
            <div className="messages-container">
              <div className="messages" ref={ref}>
                <div ref={containerRef}>
                  {anonMessages.map((data, index) => (
                    data['is_admin'] ? 
                    <div key={index} className="mt-5" >
                      <span className="fs-13 fs-300 italic" style={{color:"var(--orange)"}}>Your reply:</span>
                      <p className="fs-13 fw-200" style={{color:"var(--orange)"}}>{data['message']}</p>
                    </div> : 
                    <div key={index} className="mt-5">
                      <span className="fs-13 fs-300 italic">Client:</span>
                      <p className="fs-13 fw-100">{data['message']}</p>
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
           ) : !expiredUrl ?
           <div className="anon-form">
            <h4 className="fs-13 mt-20" style={{fontWeight:"300"}}>Response:</h4>
            <textarea spellCheck="false" rows={7} className="fs-92 mt-10" value={user_message} onChange={(e) => {set_message(e.target.value)}}  placeholder="Write your reply.."></textarea>
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
