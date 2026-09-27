package com.educonnect.controller;

import com.educonnect.model.MentorBooking;
import com.educonnect.model.Notification;
import com.educonnect.service.MentorBookingService;
import com.educonnect.service.NotificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentor-bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class MentorBookingController {

    private final MentorBookingService mentorBookingService;

    private final NotificationService notificationService;


    // =========================================
    // CONSTRUCTOR
    // =========================================

    public MentorBookingController(
            MentorBookingService mentorBookingService,
            NotificationService notificationService
    ) {

        this.mentorBookingService =
                mentorBookingService;

        this.notificationService =
                notificationService;
    }


    // =========================================
    // CREATE BOOKING REQUEST
    // =========================================
    //
    // POST:
    // /api/mentor-bookings
    //
    // =========================================

    @PostMapping
    public ResponseEntity<MentorBooking> createBooking(
            @RequestBody MentorBooking booking
    ) {

        try {

            MentorBooking savedBooking =
                    mentorBookingService.createBooking(
                            booking
                    );


            // =====================================
            // CREATE MENTOR NOTIFICATION
            // =====================================

            try {

                Notification notification =
                        notificationService
                                .createBookingRequestNotification(
                                        savedBooking
                                );

                System.out.println(
                        "Mentor notification created: "
                                + notification.getId()
                );

            } catch (Exception notificationError) {

                /*
                 * Booking is already saved.
                 * Do not delete the booking if
                 * notification creation fails.
                 */

                System.err.println(
                        "Booking saved, but mentor notification creation failed: "
                                + notificationError.getMessage()
                );
            }


            return ResponseEntity.ok(
                    savedBooking
            );

        } catch (IllegalArgumentException error) {

            return ResponseEntity
                    .badRequest()
                    .build();

        } catch (IllegalStateException error) {

            return ResponseEntity
                    .badRequest()
                    .build();

        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }


    // =========================================
    // GET BOOKING BY ID
    // =========================================
    //
    // GET:
    // /api/mentor-bookings/{bookingId}
    //
    // =========================================

    @GetMapping("/{bookingId}")
    public ResponseEntity<MentorBooking> getBookingById(
            @PathVariable String bookingId
    ) {

        try {

            MentorBooking booking =
                    mentorBookingService.getBookingById(
                            bookingId
                    );

            return ResponseEntity.ok(
                    booking
            );

        } catch (RuntimeException error) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }


    // =========================================
    // GET ALL BOOKINGS
    // =========================================
    //
    // GET:
    // /api/mentor-bookings
    //
    // =========================================

    @GetMapping
    public ResponseEntity<List<MentorBooking>> getAllBookings() {

        List<MentorBooking> bookings =
                mentorBookingService.getAllBookings();

        return ResponseEntity.ok(
                bookings
        );
    }


    // =========================================
    // GET ALL MENTOR BOOKINGS
    // =========================================
    //
    // GET:
    // /api/mentor-bookings/mentor/{mentorId}
    //
    // =========================================

    @GetMapping("/mentor/{mentorId}")
    public ResponseEntity<List<MentorBooking>> getMentorBookings(
            @PathVariable String mentorId
    ) {

        List<MentorBooking> bookings =
                mentorBookingService.getMentorBookings(
                        mentorId
                );

        return ResponseEntity.ok(
                bookings
        );
    }


    // =========================================
    // GET PENDING MENTOR BOOKING REQUESTS
    // =========================================
    //
    // GET:
    // /api/mentor-bookings/mentor/{mentorId}/pending
    //
    // =========================================

    @GetMapping("/mentor/{mentorId}/pending")
    public ResponseEntity<List<MentorBooking>> getPendingMentorBookings(
            @PathVariable String mentorId
    ) {

        List<MentorBooking> bookings =
                mentorBookingService.getPendingMentorBookings(
                        mentorId
                );

        return ResponseEntity.ok(
                bookings
        );
    }


    // =========================================
    // GET ALL STUDENT BOOKINGS
    // =========================================
    //
    // GET:
    // /api/mentor-bookings/student/{studentId}
    //
    // =========================================

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<MentorBooking>> getStudentBookings(
            @PathVariable String studentId
    ) {

        List<MentorBooking> bookings =
                mentorBookingService.getStudentBookings(
                        studentId
                );

        return ResponseEntity.ok(
                bookings
        );
    }


    // =========================================
    // GET APPROVED STUDENT BOOKINGS
    // =========================================
    //
    // GET:
    // /api/mentor-bookings/student/{studentId}/approved
    //
    // =========================================

    @GetMapping("/student/{studentId}/approved")
    public ResponseEntity<List<MentorBooking>> getApprovedStudentBookings(
            @PathVariable String studentId
    ) {

        List<MentorBooking> bookings =
                mentorBookingService
                        .getApprovedStudentBookings(
                                studentId
                        );

        return ResponseEntity.ok(
                bookings
        );
    }


    // =========================================
    // GET REJECTED STUDENT BOOKINGS
    // =========================================
    //
    // GET:
    // /api/mentor-bookings/student/{studentId}/rejected
    //
    // =========================================

    @GetMapping("/student/{studentId}/rejected")
    public ResponseEntity<List<MentorBooking>> getRejectedStudentBookings(
            @PathVariable String studentId
    ) {

        List<MentorBooking> bookings =
                mentorBookingService
                        .getRejectedStudentBookings(
                                studentId
                        );

        return ResponseEntity.ok(
                bookings
        );
    }


    // =========================================
    // ACCEPT BOOKING
    // =========================================
    //
    // PUT:
    // /api/mentor-bookings/{bookingId}/accept
    //
    // =========================================

    @PutMapping("/{bookingId}/accept")
    public ResponseEntity<MentorBooking> acceptBooking(
            @PathVariable String bookingId,
            @RequestBody(required = false)
            MentorResponseRequest request
    ) {

        try {

            String mentorResponse = null;


            if (request != null) {

                mentorResponse =
                        request.getMentorResponse();
            }


            // =====================================
            // SERVICE HANDLES:
            //
            // 1. Booking status
            // 2. Student count
            // 3. Mentor response
            // 4. Mentor notification
            // 5. Student notification
            // =====================================

            MentorBooking booking =
                    mentorBookingService.acceptBooking(
                            bookingId,
                            mentorResponse
                    );


            return ResponseEntity.ok(
                    booking
            );

        } catch (IllegalStateException error) {

            return ResponseEntity
                    .badRequest()
                    .build();

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
    // REJECT BOOKING
    // =========================================
    //
    // PUT:
    // /api/mentor-bookings/{bookingId}/reject
    //
    // =========================================

    @PutMapping("/{bookingId}/reject")
    public ResponseEntity<MentorBooking> rejectBooking(
            @PathVariable String bookingId,
            @RequestBody(required = false)
            MentorResponseRequest request
    ) {

        try {

            String mentorResponse = null;


            if (request != null) {

                mentorResponse =
                        request.getMentorResponse();
            }


            // =====================================
            // SERVICE HANDLES:
            //
            // 1. Booking status
            // 2. Mentor response
            // 3. Mentor notification
            // 4. Student notification
            // =====================================

            MentorBooking booking =
                    mentorBookingService.rejectBooking(
                            bookingId,
                            mentorResponse
                    );


            return ResponseEntity.ok(
                    booking
            );

        } catch (IllegalStateException error) {

            return ResponseEntity
                    .badRequest()
                    .build();

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
    // COMPLETE BOOKING
    // =========================================
    //
    // PUT:
    // /api/mentor-bookings/{bookingId}/complete
    //
    // Flow:
    //
    // APPROVED
    //     ↓
    // COMPLETED
    //
    // =========================================

    @PutMapping("/{bookingId}/complete")
    public ResponseEntity<MentorBooking> completeBooking(
            @PathVariable String bookingId
    ) {

        try {

            MentorBooking booking =
                    mentorBookingService.completeBooking(
                            bookingId
                    );


            return ResponseEntity.ok(
                    booking
            );

        } catch (IllegalStateException error) {

            return ResponseEntity
                    .badRequest()
                    .build();

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
    // MENTOR RESPONSE DTO
    // =========================================
    //
    // Used for Accept / Reject requests.
    //
    // =========================================

    public static class MentorResponseRequest {

        private String mentorResponse;


        public MentorResponseRequest() {
        }


        public String getMentorResponse() {

            return mentorResponse;
        }


        public void setMentorResponse(
                String mentorResponse
        ) {

            this.mentorResponse =
                    mentorResponse;
        }
    }

}