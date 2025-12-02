
var thread = [];                 
var summaryMemory = "";           
const MAX_MESSAGES = 10;
var greetTO;

const userLastMessageTime = new Map();

function canSendMessage(userId) {
    const now = Date.now();
    const last = userLastMessageTime.get(userId) || 0;

    if (now - last < 2000) {
        return false;
    }

    userLastMessageTime.set(userId, now);
    return true;
}

const style = document.createElement('style');
style.textContent = `
    

    :root{
        --main: #D49C3C;
        --msg-fg: #30364A;
        --fg: #fff;
        --bg: #30364A;
        --border: rgba(255,255,255,0.1);
        --border5: rgba(255,255,255,0.5);
        --msg-bg2: rgba(212, 156, 60, 0.5);
    }

    ul, ol{
        list-style: none;
    }

    .ai-agent-wrapper{
        position:fixed;
        bottom:20px;
        right:20px;
        z-index:1000000000000000000;
    }

    .ai-agent-chat-wrapper{
        width:300px;
        height: 370px;
        background: var(--bg);
        box-shadow: 0 2px 2px rgba(0,0,0,0.5);
        border-radius:4px;
        border: 1px solid rgba(0,0,0,0.1);
        overflow: auto;
    }

    .ai-agent-chat-wrapper-header{
        position:absolute;
        top: 0;
        left: 0;
        width:100%;
        display: flex;
        justify-content: space-between;
        align-items:center;
        padding: 5px 10px;
        border-bottom: 1px solid var(--border);
        height: 40px;
        background: var(--bg);
        border-radius: 4px 4px 0 0;
    }

    .ai-agent-chat-wrapper-header span{
        font-size: 15px;
        font-weight: 200;
    }

    .pointer{
        cursor: pointer
    }

    .close-ai-agent-chat{
        display: grid;
        place-items:center;
    }

    .user-input-wrapper{
        position:absolute;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content:space-between;
        align-items:start;
        width:100%;
        padding: 7px;
        border-top: 1px solid var(--border);
        background: var(--bg);
        height:60px;
        border-radius: 0 0 4px 4px;
    }

    .user-input-wrapper .input-counter{
        position: absolute;
        bottom: 7px;
        left: 10px;
        font-size: 10px;
        color: var(--fg);
        font-weight: 100;
        display:flex;
    }

    .user-input-wrapper input{
        flex: 10;
        padding: 7px 10px;
        border: 1px solid var(--border5);
        border-radius:4px;
        background: var(--bg) !important;
        color: var(--fg);
        font-weight: 100;
    }
    .user-input-wrapper > div{
        flex: 2;
        display: grid;
        place-items: center;
        transform: translateY(15%)
    }

    .ai-agent-chat{
        height: 100%;
        display:flex;
        flex-direction:column;
        justify-content:end;
    }

    .ai-agent-chat > div{
        max-height: 100%;
        overflow: auto;
        padding: 45px 0 65px 0;
        scroll-behavior: smooth;
    }

    .ai-agent-chat > div::-webkit-scrollbar{
        display: none;
    }

    .ai-agent-chat h1,.ai-agent-chat h2,.ai-agent-chat h3,.ai-agent-chat h4,.ai-agent-chat h5, .ai-agent-chat h6{
        font-size: 13px;
    }

    .aagnt-message{
        display: flex;
        align-items:start;
        padding: 5px 10px;
        width:100%;
        column-gap: 5px;
    }

    .aagnt-message .mssg{
        max-width: 75%;
        padding: 8px 10px;
        border-radius: 10px;
        font-size: 13px;
        word-wrap: break-word;
    }

    .agent-message a{
        color: var(--msg-fg);
        font-weight: 400;
        text-decoration: underline;
    }

    .usr-message{
        justify-content: end;
    }

    .usr-message .mssg{
        background: var(--msg-bg2);
        color: var(--fg);
        font-weight: 200;
    }

    .agent-message .agent-icon{
        border: 1px solid var(--main);
        display:grid;place-items:center;
        border-radius:50%;
        width: 25px;
        height: 25px;

    }

    .agent-message .mssg{
        background: var(--main);
        color: var(--msg-fg);
    }

    
    .dflexjc{
        display:flex;align-items:center;
    }

    .loader-aggnt {
        padding: 5px 3px;
        display: flex;
        column-gap: 3px;
    }

    .loader-aggnt > div{
        width: 4px;
        height: 3px;
        border-radius: 50%;
        background: var(--msg-fg);
    }

    .loader-aggnt > div:nth-child(1){
        animation-name: tp1;
        animation-duration: 1s;
        animation-iteration-count: infinite;
        animation-direction: alternate-reverse;  
    }

    .loader-aggnt > div:nth-child(2){
        animation-name: tp2;
        animation-duration: 1s;
        animation-iteration-count: infinite;
        animation-direction: alternate-reverse;  
        animation-delay: .3s;
    }

    .loader-aggnt > div:nth-child(3){
        animation-name: tp3;
        animation-duration: 1s;
        animation-iteration-count: infinite;
        animation-delay: .5s;
        animation-direction: alternate-reverse;  
    }

    @keyframes tp1 {
        0% {
            opacity: 1
        } 50% {
            opacity: 0.5
        } 100% {
            opacity: 0
        }
    }

    @keyframes tp2 {
        0% {
            opacity: 1
        } 50% {
            opacity: 0.5;
            transform: translateY(-30%)
        } 100% {
            opacity: 0;
            transform: translateY(30%)
        }
    }

    @keyframes tp3 {
        0% {
            opacity: 1
        } 50% {
            opacity: 0.5
        } 100% {
            opacity: 0
        }
    }

    .ai-agent-chat-icon{
        display:flex;flex-direction:column;
        align-items:end;
    }

    .aggnt-d-none{
        display: none;
    }

    .ai-aggnt-intro {
        background: var(--main);
        color: var(--msg-fg);
        padding: 8px 10px;
        border-radius: 10px;
        font-size: 13px;
    }
`;


document.head.appendChild(style);

document.body.insertAdjacentHTML("beforeend", `
<div class="ai-agent-wrapper">
    <div class="ai-agent-chat-wrapper aggnt-d-none">
        <div class="ai-agent-chat-wrapper-header">
            <div class="dflexjc">
                <svg width="20" height="20" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.77719 8.27695C7.69251 6.66843 6.24685 6.00302 6.24685 6.00302C5.90145 5.84152 5.27523 5.52537 4.86465 5.31638C5.39068 4.74088 5.54605 3.80257 5.57024 3.66906C5.68002 3.06494 5.62477 2.3172 5.62477 2.3172C5.52439 0.863157 4.05634 0.840319 3.90261 0.841848C3.89412 0.841848 3.88861 0.841936 3.88861 0.841936C3.88861 0.841936 3.88392 0.841848 3.87696 0.841936C3.73758 0.840128 2.25337 0.854848 2.15244 2.3172C2.15244 2.3172 2.09719 3.06485 2.20697 3.66906C2.2141 3.70797 2.23271 3.81638 2.268 3.96299C2.54452 4.32599 2.97141 4.504 3.32178 4.59112C3.36584 4.54832 3.42587 4.52169 3.4924 4.52169H4.131C4.26615 4.52169 4.37556 4.63119 4.37556 4.76634C4.37556 4.90158 4.26615 5.01116 4.131 5.01116H3.4924C3.39156 5.01116 3.30536 4.95033 3.26771 4.86356C3.00637 4.8 2.70394 4.68933 2.43402 4.49894C2.54171 4.77852 2.69518 5.07841 2.91274 5.31647C2.50216 5.52546 1.87621 5.8415 1.53054 6.00302C1.53054 6.00302 0.0850717 6.66843 0.000203875 8.27695C0.000203875 8.27695 -0.0248991 8.54443 0.481999 8.64571C0.481999 8.64571 2.0349 9.00013 3.88878 9.00013C5.74285 9.00013 7.29574 8.64571 7.29574 8.64571C7.80255 8.54443 7.77719 8.27695 7.77719 8.27695Z" fill="var(--main)"/>
                <path d="M1.6561 4.19037H1.81038V2.37827C1.81075 2.37376 1.81182 2.36942 1.81182 2.36482V2.09724C1.81182 1.62023 1.95906 1.23358 2.24947 0.947963C2.85017 0.356933 3.87623 0.364977 3.89355 0.367403C3.90574 0.366506 4.92323 0.351874 5.52661 0.942448C5.81901 1.22863 5.96733 1.61707 5.96733 2.09724V2.38017C5.96733 2.38297 5.96805 2.38549 5.96805 2.3882V4.19035H6.12233C6.50202 4.19035 6.80978 3.8826 6.80978 3.503V2.84236C6.80978 2.53697 6.61036 2.27842 6.33466 2.18895V2.09732C6.33466 1.51468 6.14914 1.03786 5.78363 0.680007C5.07102 -0.0174356 3.93274 0.000623194 3.89293 7.90753e-05C3.84509 -0.000376808 2.70572 -0.0143621 1.99346 0.68436C1.62921 1.04185 1.44441 1.51723 1.44441 2.09724V2.18851C1.16835 2.27797 0.96875 2.5367 0.96875 2.84228V3.50291C0.968765 3.88262 1.27659 4.19037 1.6561 4.19037Z" fill="var(--main)"/>
                </svg> &nbsp;&nbsp;
                    
                <span>Ask here</span>
            </div>
            <div class="close-ai-agent-chat">
                <svg xmlns="http://www.w3.org/2000/svg" width="17px" height="17px" viewBox="0 0 64 64" fill="none" stroke="var(--fg)"><line x1="16" y1="16" x2="48" y2="48"/><line x1="48" y1="16" x2="16" y2="48"/></svg>
            </div>
        </div>
        <div class="ai-agent-chat">
            <div>
                <div class="aagnt-message agent-message aggnt-typing aggnt-d-none">
                    <div class="agent-icon">
                        <svg width="15" height="15" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.77719 8.27695C7.69251 6.66843 6.24685 6.00302 6.24685 6.00302C5.90145 5.84152 5.27523 5.52537 4.86465 5.31638C5.39068 4.74088 5.54605 3.80257 5.57024 3.66906C5.68002 3.06494 5.62477 2.3172 5.62477 2.3172C5.52439 0.863157 4.05634 0.840319 3.90261 0.841848C3.89412 0.841848 3.88861 0.841936 3.88861 0.841936C3.88861 0.841936 3.88392 0.841848 3.87696 0.841936C3.73758 0.840128 2.25337 0.854848 2.15244 2.3172C2.15244 2.3172 2.09719 3.06485 2.20697 3.66906C2.2141 3.70797 2.23271 3.81638 2.268 3.96299C2.54452 4.32599 2.97141 4.504 3.32178 4.59112C3.36584 4.54832 3.42587 4.52169 3.4924 4.52169H4.131C4.26615 4.52169 4.37556 4.63119 4.37556 4.76634C4.37556 4.90158 4.26615 5.01116 4.131 5.01116H3.4924C3.39156 5.01116 3.30536 4.95033 3.26771 4.86356C3.00637 4.8 2.70394 4.68933 2.43402 4.49894C2.54171 4.77852 2.69518 5.07841 2.91274 5.31647C2.50216 5.52546 1.87621 5.8415 1.53054 6.00302C1.53054 6.00302 0.0850717 6.66843 0.000203875 8.27695C0.000203875 8.27695 -0.0248991 8.54443 0.481999 8.64571C0.481999 8.64571 2.0349 9.00013 3.88878 9.00013C5.74285 9.00013 7.29574 8.64571 7.29574 8.64571C7.80255 8.54443 7.77719 8.27695 7.77719 8.27695Z" fill="var(--main)"/>
                            <path d="M1.6561 4.19037H1.81038V2.37827C1.81075 2.37376 1.81182 2.36942 1.81182 2.36482V2.09724C1.81182 1.62023 1.95906 1.23358 2.24947 0.947963C2.85017 0.356933 3.87623 0.364977 3.89355 0.367403C3.90574 0.366506 4.92323 0.351874 5.52661 0.942448C5.81901 1.22863 5.96733 1.61707 5.96733 2.09724V2.38017C5.96733 2.38297 5.96805 2.38549 5.96805 2.3882V4.19035H6.12233C6.50202 4.19035 6.80978 3.8826 6.80978 3.503V2.84236C6.80978 2.53697 6.61036 2.27842 6.33466 2.18895V2.09732C6.33466 1.51468 6.14914 1.03786 5.78363 0.680007C5.07102 -0.0174356 3.93274 0.000623194 3.89293 7.90753e-05C3.84509 -0.000376808 2.70572 -0.0143621 1.99346 0.68436C1.62921 1.04185 1.44441 1.51723 1.44441 2.09724V2.18851C1.16835 2.27797 0.96875 2.5367 0.96875 2.84228V3.50291C0.968765 3.88262 1.27659 4.19037 1.6561 4.19037Z" fill="var(--main)"/>
                        </svg>
                    </div>
                    <div class="mssg">
                        <div class="loader-aggnt">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="user-input-wrapper ">
            <div class="input-counter"><span>0</span><span>/1000</span></div>
            <input type="text" autocomplete="off" name="usr-query" placeholder="Type something.."/>
            <div class="pointer send-aggnt-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" viewBox="0 0 48 48">
                <g id="Layer_2" data-name="Layer 2">
                    <g id="invisible_box" data-name="invisible box">
                    <rect width="48" height="48" fill="none"/>
                    </g>
                    <g id="icons_Q2" data-name="icons Q2">
                    <path fill="var(--main)" d="M44.9,23.2l-38-18L6,5A2,2,0,0,0,4,7L9.3,23H24a2.1,2.1,0,0,1,2,2,2,2,0,0,1-2,2H9.3L4,43a2,2,0,0,0,2,2l.9-.2,38-18A2,2,0,0,0,44.9,23.2Z"/>
                    </g>
                </g>
                </svg>
            </div>
        </div>
    </div>
    <div class="ai-agent-chat-icon pointer">
        <div class="ai-aggnt-intro ai-agent-greeting aggnt-d-none">Hello there! How can I help you?</div>
        <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24" fill="none">
        <path d="M20 6.75C21.5188 6.75 22.75 5.51878 22.75 4C22.75 2.48122 21.5188 1.25 20 1.25C18.4812 1.25 17.25 2.48122 17.25 4C17.25 5.51878 18.4812 6.75 20 6.75Z" fill="var(--main)"/>
        <path opacity="0.4" d="M20 8C17.79 8 16 6.21 16 4C16 3.27 16.21 2.59 16.56 2H7C4.24 2 2 4.23 2 6.98V12.96V13.96C2 16.71 4.24 18.94 7 18.94H8.5C8.77 18.94 9.13 19.12 9.3 19.34L10.8 21.33C11.46 22.21 12.54 22.21 13.2 21.33L14.7 19.34C14.89 19.09 15.19 18.94 15.5 18.94H17C19.76 18.94 22 16.71 22 13.96V7.44C21.41 7.79 20.73 8 20 8Z" fill="var(--main)"/>
        <path d="M12 12C11.44 12 11 11.55 11 11C11 10.45 11.45 10 12 10C12.55 10 13 10.45 13 11C13 11.55 12.56 12 12 12Z" fill="var(--main)"/>
        <path d="M16 12C15.44 12 15 11.55 15 11C15 10.45 15.45 10 16 10C16.55 10 17 10.45 17 11C17 11.55 16.56 12 16 12Z" fill="var(--main)"/>
        <path d="M8 12C7.44 12 7 11.55 7 11C7 10.45 7.45 10 8 10C8.55 10 9 10.45 9 11C9 11.55 8.56 12 8 12Z" fill="var(--main)"/>
        </svg>
    </div>
</div>`);

document.querySelector("input[name='usr-query']").addEventListener("input", function(e){
    document.querySelector(".input-counter span:nth-child(1)").textContent = countUserInput(this.value);
});

function countUserInput(input){
    return input.length;
}

greetTO = setTimeout(() => {
    thread.push({ role: "system", content: "Hello there! How can I help you?" });
    document.querySelector(".ai-agent-greeting").classList.remove("aggnt-d-none");
    document.querySelector(".ai-agent-chat .aggnt-typing").insertAdjacentHTML("beforebegin", `
    <div class="aagnt-message agent-message">
        <div class="agent-icon">
            <svg width="15" height="15" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.77719 8.27695C7.69251 6.66843 6.24685 6.00302 6.24685 6.00302C5.90145 5.84152 5.27523 5.52537 4.86465 5.31638C5.39068 4.74088 5.54605 3.80257 5.57024 3.66906C5.68002 3.06494 5.62477 2.3172 5.62477 2.3172C5.52439 0.863157 4.05634 0.840319 3.90261 0.841848C3.89412 0.841848 3.88861 0.841936 3.88861 0.841936C3.88861 0.841936 3.88392 0.841848 3.87696 0.841936C3.73758 0.840128 2.25337 0.854848 2.15244 2.3172C2.15244 2.3172 2.09719 3.06485 2.20697 3.66906C2.2141 3.70797 2.23271 3.81638 2.268 3.96299C2.54452 4.32599 2.97141 4.504 3.32178 4.59112C3.36584 4.54832 3.42587 4.52169 3.4924 4.52169H4.131C4.26615 4.52169 4.37556 4.63119 4.37556 4.76634C4.37556 4.90158 4.26615 5.01116 4.131 5.01116H3.4924C3.39156 5.01116 3.30536 4.95033 3.26771 4.86356C3.00637 4.8 2.70394 4.68933 2.43402 4.49894C2.54171 4.77852 2.69518 5.07841 2.91274 5.31647C2.50216 5.52546 1.87621 5.8415 1.53054 6.00302C1.53054 6.00302 0.0850717 6.66843 0.000203875 8.27695C0.000203875 8.27695 -0.0248991 8.54443 0.481999 8.64571C0.481999 8.64571 2.0349 9.00013 3.88878 9.00013C5.74285 9.00013 7.29574 8.64571 7.29574 8.64571C7.80255 8.54443 7.77719 8.27695 7.77719 8.27695Z" fill="var(--main)"/>
                <path d="M1.6561 4.19037H1.81038V2.37827C1.81075 2.37376 1.81182 2.36942 1.81182 2.36482V2.09724C1.81182 1.62023 1.95906 1.23358 2.24947 0.947963C2.85017 0.356933 3.87623 0.364977 3.89355 0.367403C3.90574 0.366506 4.92323 0.351874 5.52661 0.942448C5.81901 1.22863 5.96733 1.61707 5.96733 2.09724V2.38017C5.96733 2.38297 5.96805 2.38549 5.96805 2.3882V4.19035H6.12233C6.50202 4.19035 6.80978 3.8826 6.80978 3.503V2.84236C6.80978 2.53697 6.61036 2.27842 6.33466 2.18895V2.09732C6.33466 1.51468 6.14914 1.03786 5.78363 0.680007C5.07102 -0.0174356 3.93274 0.000623194 3.89293 7.90753e-05C3.84509 -0.000376808 2.70572 -0.0143621 1.99346 0.68436C1.62921 1.04185 1.44441 1.51723 1.44441 2.09724V2.18851C1.16835 2.27797 0.96875 2.5367 0.96875 2.84228V3.50291C0.968765 3.88262 1.27659 4.19037 1.6561 4.19037Z" fill="var(--main)"/>
            </svg>
        </div>
        <div class="mssg">
            Hello there! How can I help you?
        </div>
    </div>
    `);
    setTimeout(() => {
        document.querySelector(".ai-agent-greeting").classList.add("aggnt-d-none"); 
    }, 9000)
}, 5000);


document.querySelector(".ai-agent-chat-icon").addEventListener("click", function(){
    this.classList.add("aggnt-d-none");
    document.querySelector(".ai-agent-chat-wrapper").classList.remove("aggnt-d-none");

    if (!document.querySelector(".ai-agent-greeting").classList.contains("aggnt-d-none")) {
        document.querySelector(".ai-agent-greeting").classList.add("aggnt-d-none"); 
    }
});

document.addEventListener("keydown", function(e){
    if (e.keyCode == 27) {
        document.querySelector(".ai-agent-chat-wrapper").classList.add("aggnt-d-none");
        document.querySelector(".ai-agent-chat-icon").classList.remove("aggnt-d-none");
    }
})

document.querySelector(".close-ai-agent-chat").addEventListener("click", function(){
    document.querySelector(".ai-agent-chat-wrapper").classList.add("aggnt-d-none");
    document.querySelector(".ai-agent-chat-icon").classList.remove("aggnt-d-none");
})

document.querySelector("input[name='usr-query']").addEventListener("keydown", async function(e){
    if (e.keyCode === 13) {
        if (this.value.length > 0) {
            if (!canSendMessage("user")) {
                return
            }
            if (this.value.length > 1000) {
                return
            }
            if (this.value.length > 400 && thread.includes(this.value)) {
                return
            }
            clearTimeout(greetTO);
            let val = escapeHTML(this.value);
            this.value = "";
            insertMessage(val, "user");
            const data = await sendMessage(val);
            insertMessage(data, "system");
        }
    }
});

document.querySelector(".send-aggnt-message").addEventListener("click", async function(){
    let $this = document.querySelector("input[name='usr-query']")
    if ($this.value.length > 0) {
        if (!canSendMessage("user")) {
            return
        }
        if ($this.value.length > 1000) {
            return
        }
        if ($this.value.length > 200 && thread.includes($this.value)) {
            return
        }

        clearTimeout(greetTO);
        let val = escapeHTML($this.value);
        $this.value = "";
        insertMessage(val, "user");
        let data = await sendMessage(val);
        insertMessage(data, "system");
    }
})

async function callModel(messages) {
    const response = await fetch('https://jmcadev.site/api/ask-assistant', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messages: messages,
        })
    });

    let result;
    try {
        result = await response.json();
        return result.choices[0].message.content;
    } catch (jsonErr) {
        return "<div>Sorry, we couldn't read the server response. Please try again.</div>";
    }
}


async function summarizeHistory(oldMessages) {
    const prompt = [
        { 
        role: "user",
        content: `
        Summarize the following conversation into a compact memory (2–5 sentences):

        Keep:
        - User goals  
        - Important facts  
        - Decisions made  
        - Preferences  
        - Ongoing tasks  

        Do NOT include unimportant chit-chat.
        Do NOT quote exact text.

        Conversation:
        ${JSON.stringify(oldMessages, null, 2)}
            `
        }
    ];

    return await callModel(prompt);
}

async function sendMessage(txt){
    thread.push({ role: "user", content: txt });
    
    if (thread.length > MAX_MESSAGES) {
        const old = thread.slice(0, -MAX_MESSAGES);

    
        const newSummary = await summarizeHistory(old);

        summaryMemory = newSummary;

        
        thread = [
        { role: "system", content: "Conversation summary: " + summaryMemory },
        ...thread.slice(-MAX_MESSAGES)
        ];

    }

    if (document.querySelector(".ai-agent-chat .aggnt-typing").classList.contains("aggnt-d-none")) {
        document.querySelector(".ai-agent-chat .aggnt-typing").classList.remove("aggnt-d-none");
    }

    document.querySelector(".ai-agent-chat .aggnt-typing").scrollIntoView({behavior: 'smooth'})


    const reply = await callModel(thread);


    thread.push({ role: "assistant", content: reply });



    return reply;
}


function scrollToBottom(){
    let chat = document.querySelector(".ai-agent-chat > div");
    chat.scrollTop = chat.scrollHeight;
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, c => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#39;"
  }[c]));
}

async function insertMessage(msg, role){
    if (role == 'system') {
        document.querySelector(".ai-agent-chat .aggnt-typing").insertAdjacentHTML("beforebegin", `
        <div class="aagnt-message agent-message">
            <div class="agent-icon">
                <svg width="15" height="15" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.77719 8.27695C7.69251 6.66843 6.24685 6.00302 6.24685 6.00302C5.90145 5.84152 5.27523 5.52537 4.86465 5.31638C5.39068 4.74088 5.54605 3.80257 5.57024 3.66906C5.68002 3.06494 5.62477 2.3172 5.62477 2.3172C5.52439 0.863157 4.05634 0.840319 3.90261 0.841848C3.89412 0.841848 3.88861 0.841936 3.88861 0.841936C3.88861 0.841936 3.88392 0.841848 3.87696 0.841936C3.73758 0.840128 2.25337 0.854848 2.15244 2.3172C2.15244 2.3172 2.09719 3.06485 2.20697 3.66906C2.2141 3.70797 2.23271 3.81638 2.268 3.96299C2.54452 4.32599 2.97141 4.504 3.32178 4.59112C3.36584 4.54832 3.42587 4.52169 3.4924 4.52169H4.131C4.26615 4.52169 4.37556 4.63119 4.37556 4.76634C4.37556 4.90158 4.26615 5.01116 4.131 5.01116H3.4924C3.39156 5.01116 3.30536 4.95033 3.26771 4.86356C3.00637 4.8 2.70394 4.68933 2.43402 4.49894C2.54171 4.77852 2.69518 5.07841 2.91274 5.31647C2.50216 5.52546 1.87621 5.8415 1.53054 6.00302C1.53054 6.00302 0.0850717 6.66843 0.000203875 8.27695C0.000203875 8.27695 -0.0248991 8.54443 0.481999 8.64571C0.481999 8.64571 2.0349 9.00013 3.88878 9.00013C5.74285 9.00013 7.29574 8.64571 7.29574 8.64571C7.80255 8.54443 7.77719 8.27695 7.77719 8.27695Z" fill="var(--main)"/>
                    <path d="M1.6561 4.19037H1.81038V2.37827C1.81075 2.37376 1.81182 2.36942 1.81182 2.36482V2.09724C1.81182 1.62023 1.95906 1.23358 2.24947 0.947963C2.85017 0.356933 3.87623 0.364977 3.89355 0.367403C3.90574 0.366506 4.92323 0.351874 5.52661 0.942448C5.81901 1.22863 5.96733 1.61707 5.96733 2.09724V2.38017C5.96733 2.38297 5.96805 2.38549 5.96805 2.3882V4.19035H6.12233C6.50202 4.19035 6.80978 3.8826 6.80978 3.503V2.84236C6.80978 2.53697 6.61036 2.27842 6.33466 2.18895V2.09732C6.33466 1.51468 6.14914 1.03786 5.78363 0.680007C5.07102 -0.0174356 3.93274 0.000623194 3.89293 7.90753e-05C3.84509 -0.000376808 2.70572 -0.0143621 1.99346 0.68436C1.62921 1.04185 1.44441 1.51723 1.44441 2.09724V2.18851C1.16835 2.27797 0.96875 2.5367 0.96875 2.84228V3.50291C0.968765 3.88262 1.27659 4.19037 1.6561 4.19037Z" fill="var(--main)"/>
                </svg>
            </div>
            <div class="mssg">
                ${msg}
            </div>
        </div>
        `);
        if (!document.querySelector(".ai-agent-chat .aggnt-typing").classList.contains("aggnt-d-none")) {
            document.querySelector(".ai-agent-chat .aggnt-typing").classList.add("aggnt-d-none");
        }
    }
    else {
        document.querySelector(".ai-agent-chat .aggnt-typing").insertAdjacentHTML("beforebegin", `
        <div class="aagnt-message usr-message">
            <div class="mssg">
                ${msg}
            </div>
        </div>
        `)
    }

    scrollToBottom();
}