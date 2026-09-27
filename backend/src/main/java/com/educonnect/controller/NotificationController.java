
package com.educonnect.controller;

import com.educonnect.model.Notification;
import com.educonnect.service.NotificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService notificationService;

    // =========================================
    // CONSTRUCTOR
    // =========================================

    public NotificationController(
            NotificationService notificationService
    ) {

        this.notificationService =
                notificationService;

    }


    // =========================================
    // GET ALL NOTIFICATIONS FOR USER
    // =========================================
    //
    // GET:
    // /api/notifications/user/{userId}
    //
    // =========================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(
            @PathVariable String userId
    ) {

        try {

            if (userId == null || userId.trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .build();

            }

            List<Notification> notifications =
                    notificationService.getUserNotifications(
                            userId
                    );

            return ResponseEntity.ok(
                    notifications
            );

        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();

        }

    }


    // =========================================
    // GET UNREAD NOTIFICATIONS
    // =========================================
    //
    // GET:
    // /api/notifications/user/{userId}/unread
    //
    // =========================================

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(
            @PathVariable String userId
    ) {

        try {

            if (userId == null || userId.trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .build();

            }

            List<Notification> notifications =
                    notificationService.getUnreadNotifications(
                            userId
                    );

            return ResponseEntity.ok(
                    notifications
            );

        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();

        }

    }


    // =========================================
    // GET UNREAD NOTIFICATION COUNT
    // =========================================
    //
    // GET:
    // /api/notifications/user/{userId}/count
    //
    // =========================================

    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> getUnreadCount(
            @PathVariable String userId
    ) {

        try {

            if (userId == null || userId.trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .build();

            }

            long count =
                    notificationService.getUnreadCount(
                            userId
                    );

            return ResponseEntity.ok(
                    count
            );

        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();

        }

    }


    // =========================================
    // MARK ONE NOTIFICATION AS READ
    // =========================================
    //
    // PUT:
    // /api/notifications/{notificationId}/read
    //
    // =========================================

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Notification> markAsRead(
            @PathVariable String notificationId
    ) {

        try {

            if (
                    notificationId == null ||
                    notificationId.trim().isEmpty()
            ) {

                return ResponseEntity
                        .badRequest()
                        .build();

            }

            Notification notification =
                    notificationService.markAsRead(
                            notificationId
                    );

            return ResponseEntity.ok(
                    notification
            );

        } catch (RuntimeException error) {

            return ResponseEntity
                    .notFound()
                    .build();

        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();

        }

    }


    // =========================================
    // MARK ALL USER NOTIFICATIONS AS READ
    // =========================================
    //
    // PUT:
    // /api/notifications/user/{userId}/read-all
    //
    // =========================================

    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @PathVariable String userId
    ) {

        try {

            if (userId == null || userId.trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .build();

            }

            notificationService.markAllAsRead(
                    userId
            );

            return ResponseEntity
                    .ok()
                    .build();

        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();

        }

    }

}

