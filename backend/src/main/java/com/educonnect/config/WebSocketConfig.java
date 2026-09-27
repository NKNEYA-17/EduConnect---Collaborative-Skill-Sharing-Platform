package com.educonnect.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig
        implements WebSocketMessageBrokerConfigurer {

    private final WebSocketAuthInterceptor
            webSocketAuthInterceptor;

    public WebSocketConfig(
            WebSocketAuthInterceptor webSocketAuthInterceptor
    ) {
        this.webSocketAuthInterceptor =
                webSocketAuthInterceptor;
    }

    @Override
    public void configureMessageBroker(
            MessageBrokerRegistry config
    ) {

        System.out.println(
                "✅ Configuring STOMP message broker..."
        );

        config.enableSimpleBroker(
                "/topic",
                "/queue"
        );

        config.setApplicationDestinationPrefixes(
                "/app"
        );

        config.setUserDestinationPrefix(
                "/user"
        );

        System.out.println(
                "✅ STOMP broker configured"
        );
    }

    @Override
    public void registerStompEndpoints(
            StompEndpointRegistry registry
    ) {

        System.out.println(
                "✅ Registering WebSocket endpoint /ws"
        );

        registry
                .addEndpoint("/ws")
                .setAllowedOrigins(
                        "http://localhost:5173"
                );
    }

    @Override
    public void configureClientInboundChannel(
            ChannelRegistration registration
    ) {

        registration.interceptors(
                webSocketAuthInterceptor
        );

        registration.interceptors(
                new org.springframework.messaging.support.ChannelInterceptor() {

                    @Override
                    public Message<?> preSend(
                            Message<?> message,
                            MessageChannel channel
                    ) {

                        System.out.println(
                                "📨 STOMP INBOUND MESSAGE: "
                                        + message
                        );

                        return message;
                    }
                }
        );
    }
}