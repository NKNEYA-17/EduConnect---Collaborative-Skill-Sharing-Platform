package com.educonnect.service;

import com.educonnect.model.MentorBooking;
import com.educonnect.model.Notification;
import com.educonnect.model.User;
import com.educonnect.repository.NotificationRepository;
import com.educonnect.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    private final UserRepository userRepository;


    // =========================================
    // CONSTRUCTOR
    // =========================================

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository
    ) {

        this.notificationRepository =
                notificationRepository;

        this.userRepository =
                userRepository;

    }


    // =========================================
    // CREATE NOTIFICATION
    // =========================================

    public Notification createNotification(
            Notification notification
    ) {

        if (notification == null) {

            throw new IllegalArgumentException(
                    "Notification cannot be null."
            );

        }


        // =====================================
        // DEFAULT VALUES
        // =====================================

        notification.setRead(false);


        if (notification.getCreatedAt() == null) {

            notification.setCreatedAt(
                    LocalDateTime.now()
            );

        }


        // =====================================
        // SAVE
        // =====================================

        return notificationRepository.save(
                notification
        );

    }


    // =========================================
    // FIND ACTUAL USER ID
    // =========================================
    //
    // IMPORTANT:
    //
    // mentorId/studentId inside MentorBooking
    // may represent a mentor profile ID rather
    // than the actual User ID.
    //
    // Notifications are fetched using the
    // actual User ID.
    //
    // Therefore we resolve the User ID using
    // the email address.
    //
    // =========================================

    private String resolveUserId(
            String currentId,
            String email
    ) {

        // =====================================
        // FIRST TRY EMAIL
        // =====================================

        if (
                email != null &&
                !email.trim().isEmpty()
        ) {

            Optional<User> user =
                    userRepository.findByEmail(
                            email
                    );


            if (user.isPresent()) {

                System.out.println(
                        "Notification receiver resolved by email: "
                                + email
                                + " -> User ID: "
                                + user.get().getId()
                );


                return user.get().getId();

            }

        }


        // =====================================
        // FALLBACK TO PROVIDED ID
        // =====================================

        System.out.println(
                "Could not resolve User ID using email. "
                        + "Using provided ID: "
                        + currentId
        );


        return currentId;

    }


    // =========================================
    // BOOKING REQUEST → MENTOR
    // =========================================

    public Notification createBookingRequestNotification(
            MentorBooking booking
    ) {

        Notification notification =
                new Notification();


        // =====================================
        // RESOLVE ACTUAL MENTOR USER ID
        // =====================================

        String actualMentorUserId =
                resolveUserId(
                        booking.getMentorId(),
                        booking.getMentorEmail()
                );


        // =====================================
        // RECEIVER
        // =====================================

        notification.setUserId(
                actualMentorUserId
        );

        notification.setUserName(
                booking.getMentorName()
        );

        notification.setUserEmail(
                booking.getMentorEmail()
        );

        notification.setUserRole(
                "MENTOR"
        );


        // =====================================
        // TYPE
        // =====================================

        notification.setType(
                "BOOKING_REQUEST"
        );


        // =====================================
        // TITLE
        // =====================================

        notification.setTitle(
                "New Booking Request"
        );


        // =====================================
        // MESSAGE
        // =====================================

        notification.setMessage(
                booking.getStudentName()
                        + " requested to book your "
                        + booking.getSessionTitle()
                        + " session."
        );


        // =====================================
        // BOOKING DETAILS
        // =====================================

        notification.setBookingId(
                booking.getId()
        );


        // =====================================
        // MENTOR DETAILS
        // =====================================

        notification.setMentorId(
                booking.getMentorId()
        );

        notification.setMentorName(
                booking.getMentorName()
        );


        // =====================================
        // STUDENT DETAILS
        // =====================================

        notification.setStudentId(
                booking.getStudentId()
        );

        notification.setStudentName(
                booking.getStudentName()
        );


        // =====================================
        // SESSION DETAILS
        // =====================================

        notification.setSessionTitle(
                booking.getSessionTitle()
        );

        notification.setSlot(
                booking.getSlot()
        );


        // =====================================
        // SAVE
        // =====================================

        return createNotification(
                notification
        );

    }


    // =========================================
    // UPDATE MENTOR NOTIFICATION
    // BOOKING REQUEST → ACCEPTED
    // =========================================

    public Notification updateBookingRequestNotificationAsAccepted(
            MentorBooking booking
    ) {

        if (
                booking == null ||
                booking.getId() == null
        ) {

            throw new IllegalArgumentException(
                    "Booking or booking ID cannot be null."
            );

        }


        // =====================================
        // FIND ALL NOTIFICATIONS FOR BOOKING
        // =====================================

        List<Notification> notifications =
                notificationRepository
                        .findByBookingIdOrderByCreatedAtDesc(
                                booking.getId()
                        );


        // =====================================
        // FIND ORIGINAL BOOKING REQUEST
        // =====================================

        for (
                Notification notification :
                notifications
        ) {

            if (
                    "BOOKING_REQUEST".equals(
                            notification.getType()
                    )
            ) {

                // =============================
                // CHANGE TYPE
                // =============================

                notification.setType(
                        "BOOKING_ACCEPTED"
                );


                // =============================
                // CHANGE TITLE
                // =============================

                notification.setTitle(
                        "Booking Accepted"
                );


                // =============================
                // CHANGE MESSAGE
                // =============================

                notification.setMessage(
                        "You accepted "
                                + booking.getStudentName()
                                + "'s booking for "
                                + booking.getSessionTitle()
                                + " session."
                );


                // =============================
                // UPDATE BOOKING DETAILS
                // =============================

                notification.setBookingId(
                        booking.getId()
                );


                notification.setMentorId(
                        booking.getMentorId()
                );


                notification.setMentorName(
                        booking.getMentorName()
                );


                notification.setStudentId(
                        booking.getStudentId()
                );


                notification.setStudentName(
                        booking.getStudentName()
                );


                notification.setSessionTitle(
                        booking.getSessionTitle()
                );


                notification.setSlot(
                        booking.getSlot()
                );


                // =============================
                // SAVE UPDATED NOTIFICATION
                // =============================

                return notificationRepository.save(
                        notification
                );

            }

        }


        // =====================================
        // NO NOTIFICATION FOUND
        // =====================================

        System.out.println(
                "No BOOKING_REQUEST notification found "
                        + "for booking ID: "
                        + booking.getId()
        );


        return null;

    }


    // =========================================
    // BOOKING APPROVED → STUDENT
    // =========================================

    public Notification createBookingApprovedNotification(
            MentorBooking booking
    ) {

        Notification notification =
                new Notification();


        // =====================================
        // RESOLVE ACTUAL STUDENT USER ID
        // =====================================

        String actualStudentUserId =
                resolveUserId(
                        booking.getStudentId(),
                        booking.getStudentEmail()
                );


        // =====================================
        // RECEIVER
        // =====================================

        notification.setUserId(
                actualStudentUserId
        );

        notification.setUserName(
                booking.getStudentName()
        );

        notification.setUserEmail(
                booking.getStudentEmail()
        );

        notification.setUserRole(
                "STUDENT"
        );


        // =====================================
        // TYPE
        // =====================================

        notification.setType(
                "BOOKING_APPROVED"
        );


        // =====================================
        // TITLE
        // =====================================

        notification.setTitle(
                "Booking Accepted"
        );


        // =====================================
        // MESSAGE
        // =====================================

        notification.setMessage(
                "Your booking for "
                        + booking.getSessionTitle()
                        + " with "
                        + booking.getMentorName()
                        + " has been accepted."
        );


        // =====================================
        // BOOKING DETAILS
        // =====================================

        notification.setBookingId(
                booking.getId()
        );


        // =====================================
        // MENTOR DETAILS
        // =====================================

        notification.setMentorId(
                booking.getMentorId()
        );

        notification.setMentorName(
                booking.getMentorName()
        );


        // =====================================
        // STUDENT DETAILS
        // =====================================

        notification.setStudentId(
                booking.getStudentId()
        );

        notification.setStudentName(
                booking.getStudentName()
        );


        // =====================================
        // SESSION DETAILS
        // =====================================

        notification.setSessionTitle(
                booking.getSessionTitle()
        );

        notification.setSlot(
                booking.getSlot()
        );


        // =====================================
        // SAVE
        // =====================================

        return createNotification(
                notification
        );

    }


    // =========================================
    // UPDATE MENTOR NOTIFICATION
    // BOOKING REQUEST → REJECTED
    // =========================================

    public Notification updateBookingRequestNotificationAsRejected(
            MentorBooking booking
    ) {

        if (
                booking == null ||
                booking.getId() == null
        ) {

            throw new IllegalArgumentException(
                    "Booking or booking ID cannot be null."
            );

        }


        // =====================================
        // FIND ALL NOTIFICATIONS FOR BOOKING
        // =====================================

        List<Notification> notifications =
                notificationRepository
                        .findByBookingIdOrderByCreatedAtDesc(
                                booking.getId()
                        );


        // =====================================
        // FIND ORIGINAL BOOKING REQUEST
        // =====================================

        for (
                Notification notification :
                notifications
        ) {

            if (
                    "BOOKING_REQUEST".equals(
                            notification.getType()
                    )
            ) {

                // =============================
                // CHANGE TYPE
                // =============================

                notification.setType(
                        "BOOKING_REJECTED"
                );


                // =============================
                // CHANGE TITLE
                // =============================

                notification.setTitle(
                        "Booking Rejected"
                );


                // =============================
                // RESPONSE
                // =============================

                String response =
                        booking.getMentorResponse();


                // =============================
                // CHANGE MESSAGE
                // =============================

                if (
                        response != null &&
                        !response.trim().isEmpty()
                ) {

                    notification.setMessage(
                            "You rejected "
                                    + booking.getStudentName()
                                    + "'s booking for "
                                    + booking.getSessionTitle()
                                    + " session. "
                                    + "Reason: "
                                    + response
                    );

                } else {

                    notification.setMessage(
                            "You rejected "
                                    + booking.getStudentName()
                                    + "'s booking for "
                                    + booking.getSessionTitle()
                                    + " session."
                    );

                }


                // =============================
                // UPDATE BOOKING DETAILS
                // =============================

                notification.setBookingId(
                        booking.getId()
                );


                notification.setMentorId(
                        booking.getMentorId()
                );


                notification.setMentorName(
                        booking.getMentorName()
                );


                notification.setStudentId(
                        booking.getStudentId()
                );


                notification.setStudentName(
                        booking.getStudentName()
                );


                notification.setSessionTitle(
                        booking.getSessionTitle()
                );


                notification.setSlot(
                        booking.getSlot()
                );


                // =============================
                // SAVE
                // =============================

                return notificationRepository.save(
                        notification
                );

            }

        }


        // =====================================
        // NO NOTIFICATION FOUND
        // =====================================

        System.out.println(
                "No BOOKING_REQUEST notification found "
                        + "for booking ID: "
                        + booking.getId()
        );


        return null;

    }


    // =========================================
    // BOOKING REJECTED → STUDENT
    // =========================================

    public Notification createBookingRejectedNotification(
            MentorBooking booking
    ) {

        Notification notification =
                new Notification();


        // =====================================
        // RESOLVE ACTUAL STUDENT USER ID
        // =====================================

        String actualStudentUserId =
                resolveUserId(
                        booking.getStudentId(),
                        booking.getStudentEmail()
                );


        // =====================================
        // RECEIVER
        // =====================================

        notification.setUserId(
                actualStudentUserId
        );

        notification.setUserName(
                booking.getStudentName()
        );

        notification.setUserEmail(
                booking.getStudentEmail()
        );

        notification.setUserRole(
                "STUDENT"
        );


        // =====================================
        // TYPE
        // =====================================

        notification.setType(
                "BOOKING_REJECTED"
        );


        // =====================================
        // TITLE
        // =====================================

        notification.setTitle(
                "Booking Rejected"
        );


        // =====================================
        // MESSAGE
        // =====================================

        String response =
                booking.getMentorResponse();


        if (
                response != null &&
                !response.trim().isEmpty()
        ) {

            notification.setMessage(
                    "Your booking for "
                            + booking.getSessionTitle()
                            + " with "
                            + booking.getMentorName()
                            + " was rejected. "
                            + "Reason: "
                            + response
            );

        } else {

            notification.setMessage(
                    "Your booking for "
                            + booking.getSessionTitle()
                            + " with "
                            + booking.getMentorName()
                            + " was rejected."
            );

        }


        // =====================================
        // BOOKING DETAILS
        // =====================================

        notification.setBookingId(
                booking.getId()
        );


        // =====================================
        // MENTOR DETAILS
        // =====================================

        notification.setMentorId(
                booking.getMentorId()
        );

        notification.setMentorName(
                booking.getMentorName()
        );


        // =====================================
        // STUDENT DETAILS
        // =====================================

        notification.setStudentId(
                booking.getStudentId()
        );

        notification.setStudentName(
                booking.getStudentName()
        );


        // =====================================
        // SESSION DETAILS
        // =====================================

        notification.setSessionTitle(
                booking.getSessionTitle()
        );

        notification.setSlot(
                booking.getSlot()
        );


        // =====================================
        // SAVE
        // =====================================

        return createNotification(
                notification
        );

    }


    // =========================================
    // GET ALL USER NOTIFICATIONS
    // =========================================

    public List<Notification> getUserNotifications(
            String userId
    ) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(
                        userId
                );

    }


    // =========================================
    // GET UNREAD NOTIFICATIONS
    // =========================================

    public List<Notification> getUnreadNotifications(
            String userId
    ) {

        return notificationRepository
                .findByUserIdAndReadFalseOrderByCreatedAtDesc(
                        userId
                );

    }


    // =========================================
    // COUNT UNREAD NOTIFICATIONS
    // =========================================

    public long getUnreadCount(
            String userId
    ) {

        return notificationRepository
                .countByUserIdAndReadFalse(
                        userId
                );

    }


    // =========================================
    // MARK ONE NOTIFICATION AS READ
    // =========================================

    public Notification markAsRead(
            String notificationId
    ) {

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Notification not found."
                                        )
                        );


        notification.setRead(true);


        return notificationRepository.save(
                notification
        );

    }


    // =========================================
    // MARK ALL USER NOTIFICATIONS AS READ
    // =========================================

    public void markAllAsRead(
            String userId
    ) {

        List<Notification> notifications =
                notificationRepository
                        .findByUserIdOrderByCreatedAtDesc(
                                userId
                        );


        for (
                Notification notification :
                notifications
        ) {

            if (!notification.isRead()) {

                notification.setRead(true);

                notificationRepository.save(
                        notification
                );

            }

        }

    }

}