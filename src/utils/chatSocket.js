import { Client } from "@stomp/stompjs";

const WS_URL = "ws://localhost:8080/ws";

let stompClient = null;

export const connectChatSocket = (
    onMessageReceived
) => {

    const token =
        localStorage.getItem("token");

    if (!token) {
        console.error(
            "JWT token not found. Cannot connect to chat."
        );
        return null;
    }

    stompClient = new Client({

        brokerURL: WS_URL,

        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },

        reconnectDelay: 5000,

        debug: (message) => {
            console.log(
                "STOMP:",
                message
            );
        },

        onConnect: () => {

            console.log(
                "WebSocket connected successfully"
            );

            const user =
                JSON.parse(
                    localStorage.getItem("user")
                );

            if (!user || !user.id) {
                console.error(
                    "User information not found."
                );
                return;
            }

            stompClient.subscribe(
                "/user/queue/messages",
                (message) => {

                    const chatMessage =
                        JSON.parse(
                            message.body
                        );

                    console.log(
                        "Chat message received:",
                        chatMessage
                    );

                    if (onMessageReceived) {
                        onMessageReceived(
                            chatMessage
                        );
                    }
                }
            );
        },

        onStompError: (frame) => {

            console.error(
                "STOMP error:",
                frame
            );
        },

        onWebSocketError: (error) => {

            console.error(
                "WebSocket error:",
                error
            );
        },
    });

    stompClient.activate();

    return stompClient;
};


export const sendChatMessage = (
    chatMessage
) => {

    if (
        !stompClient ||
        !stompClient.connected
    ) {
        console.error(
            "WebSocket is not connected."
        );
        return;
    }

    stompClient.publish({

        destination: "/app/chat.send",

        body: JSON.stringify(
            chatMessage
        ),
    });
};


export const disconnectChatSocket = () => {

    if (stompClient) {

        stompClient.deactivate();

        stompClient = null;

        console.log(
            "WebSocket disconnected"
        );
    }
};