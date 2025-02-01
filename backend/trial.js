async function sendMessage() {
    const input = "you're an interviewer. Generate a question for the role of python developer, ask questions about python of easy level.";

    const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
    });
    const data = await response.json();
    //document.getElementById("chat-output").innerText = data.response;
    console.log(data);
}