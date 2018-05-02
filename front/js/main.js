//"use strict";

function send_message() {
    clean_output();
    let msg_input = document.getElementById("msg_input");
    let msg_out = document.getElementById("msg_out");
    let msg_text = msg_input.value;

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            add_hmsg(this.responseText);
        }
        if (this.readyState == 4 && this.status == 404) {
            add_hmsg("Connection lost")
        }
        
    };
    xhttp.open("POST", "sendmsg?" + "msg_input=" + encodeURIComponent(msg_text), true);
    xhttp.send();
    
//    add_hmsg(msg_input.value);
    msg_out.focus();
}

function add_hmsg(text) {
    if (text.length < 1)
        return;
    let text_area = document.getElementById("msg_out");
    text_area.value += text + ";";
}

function clean_output() {
    let msg_input = document.getElementById("msg_out");
    msg_input.value = '';
}

send_button.onclick = send_message;
