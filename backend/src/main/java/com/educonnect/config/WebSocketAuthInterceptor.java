package com.educonnect.config;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Component;

@Component
public class WebSocketAuthInterceptor
        implements ChannelInterceptor {

    private final JwtDecoder jwtDecoder;

    public WebSocketAuthInterceptor(
            JwtDecoder jwtDecoder
    ) {
        this.jwtDecoder = jwtDecoder;
    }

    @Override
    public Message<?> preSend(
            Message<?> message,
            MessageChannel channel
    ) {

        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(message);

        /*
         * ==========================================
         * CONNECT
         * ==========================================
         */
        if (
                StompCommand.CONNECT
                        .equals(accessor.getCommand())
        ) {

            String authorization =
                    accessor.getFirstNativeHeader(
                            "Authorization"
                    );

            if (
                    authorization == null
                            ||
                    !authorization.startsWith(
                            "Bearer "
                    )
            ) {

                throw new IllegalArgumentException(
                        "Missing JWT token"
                );
            }

            String token =
                    authorization.substring(7);

            try {

                Jwt jwt =
                        jwtDecoder.decode(token);

                String userId =
                        jwt.getSubject();

                if (
                        userId == null
                                ||
                        userId.isBlank()
                ) {

                    throw new IllegalArgumentException(
                            "Invalid JWT subject"
                    );
                }

                WebSocketPrincipal principal =
                        new WebSocketPrincipal(userId);

                accessor.setUser(principal);

                if (
                        accessor.getSessionAttributes()
                                != null
                ) {

                    accessor.getSessionAttributes()
                            .put(
                                    "authenticatedUserId",
                                    userId
                            );
                }

                System.out.println(
                        "🔐 WebSocket JWT authenticated: "
                                + userId
                );

                /*
                 * IMPORTANT:
                 * Return a rebuilt message so that the
                 * Principal is actually present in the
                 * message headers.
                 */
                return MessageBuilder
                        .fromMessage(message)
                        .setHeader(
                                "simpUser",
                                principal
                        )
                        .build();

            } catch (Exception e) {

                System.out.println(
                        "❌ WebSocket JWT authentication failed"
                );

                throw new IllegalArgumentException(
                        "Invalid or expired JWT token"
                );
            }
        }

        /*
         * ==========================================
         * SUBSCRIBE / SEND / OTHER MESSAGES
         * ==========================================
         */
        String authenticatedUserId = null;

        if (
                accessor.getSessionAttributes()
                        != null
        ) {

            Object storedUserId =
                    accessor
                            .getSessionAttributes()
                            .get(
                                    "authenticatedUserId"
                            );

            if (storedUserId != null) {

                authenticatedUserId =
                        storedUserId.toString();
            }
        }

        if (
                authenticatedUserId != null
                        &&
                !authenticatedUserId.isBlank()
        ) {

            WebSocketPrincipal principal =
                    new WebSocketPrincipal(
                            authenticatedUserId
                    );

            System.out.println(
                    "🔐 WebSocket Principal restored: "
                            + authenticatedUserId
            );

            /*
             * IMPORTANT:
             * Attach the Principal directly to the
             * actual message returned by the interceptor.
             */
            return MessageBuilder
                    .fromMessage(message)
                    .setHeader(
                            "simpUser",
                            principal
                    )
                    .build();
        }

        return message;
    }
}