package com.educonnect.service;

import com.educonnect.model.MentorBooking;
import com.educonnect.model.SkillProgress;
import com.educonnect.model.StarTransaction;
import com.educonnect.repository.MentorBookingRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MentorBookingService {

    private final MentorBookingRepository mentorBookingRepository;

    private final NotificationService notificationService;

    private final StarTransitionService starTransitionService;

    private final SkillProgressService skillProgressService;


    // =========================================
    // CONSTRUCTOR
    // =========================================

    public MentorBookingService(
            MentorBookingRepository mentorBookingRepository,
            NotificationService notificationService,
            StarTransitionService starTransitionService,
            SkillProgressService skillProgressService
    ) {

        this.mentorBookingRepository = mentorBookingRepository;

        this.notificationService = notificationService;

        this.starTransitionService = starTransitionService;

        this.skillProgressService = skillProgressService;
    }


    // =========================================
    // CREATE BOOKING REQUEST
    // =========================================

    public MentorBooking createBooking(
            MentorBooking booking
    ) {

        if (booking == null) {

            throw new IllegalArgumentException(
                    "Booking cannot be null."
            );
        }


        if (
                booking.getMentorId() == null ||
                booking.getMentorId().trim().isEmpty()
        ) {

            throw new IllegalArgumentException(
                    "Mentor ID is required."
            );
        }


        if (
                booking.getStudentId() == null ||
                booking.getStudentId().trim().isEmpty()
        ) {

            throw new IllegalArgumentException(
                    "Student ID is required."
            );
        }


        if (
                booking.getSlot() == null ||
                booking.getSlot().trim().isEmpty()
        ) {

            throw new IllegalArgumentException(
                    "Session slot is required."
            );
        }


        // =====================================
        // CHECK DUPLICATE PENDING REQUEST
        // =====================================

        boolean duplicatePendingBooking =
                mentorBookingRepository
                        .existsByMentorIdAndStudentIdAndSessionIdAndSlotAndStatus(
                                booking.getMentorId(),
                                booking.getStudentId(),
                                booking.getSessionId(),
                                booking.getSlot(),
                                "PENDING"
                        );


        if (duplicatePendingBooking) {

            throw new IllegalStateException(
                    "You already have a pending booking request for this session and time slot."
            );
        }


        // =====================================
        // DEFAULT BOOKING STATUS
        // =====================================

        booking.setStatus("PENDING");


        // =====================================
        // INITIAL BOOKED STUDENTS
        // =====================================

        if (booking.getBookedStudents() == null) {

            booking.setBookedStudents(0);
        }


        // =====================================
        // REQUESTED TIME
        // =====================================

        booking.setRequestedAt(
                LocalDateTime.now()
        );


        // =====================================
        // CLEAR RESPONSE INFORMATION
        // =====================================

        booking.setMentorResponse(null);

        booking.setRespondedAt(null);


        // =====================================
        // SAVE TO MONGODB
        // =====================================

        return mentorBookingRepository.save(booking);
    }


    // =========================================
    // GET BOOKING BY ID
    // =========================================

    public MentorBooking getBookingById(
            String bookingId
    ) {

        return mentorBookingRepository
                .findById(bookingId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Booking not found."
                        )
                );
    }


    // =========================================
    // GET ALL BOOKINGS
    // =========================================

    public List<MentorBooking> getAllBookings() {

        return mentorBookingRepository.findAll();
    }


    // =========================================
    // GET MENTOR BOOKINGS
    // =========================================

    public List<MentorBooking> getMentorBookings(
            String mentorId
    ) {

        return mentorBookingRepository
                .findByMentorId(mentorId);
    }


    // =========================================
    // GET PENDING MENTOR REQUESTS
    // =========================================

    public List<MentorBooking> getPendingMentorBookings(
            String mentorId
    ) {

        return mentorBookingRepository
                .findByMentorIdAndStatus(
                        mentorId,
                        "PENDING"
                );
    }


    // =========================================
    // GET STUDENT BOOKINGS
    // =========================================

    public List<MentorBooking> getStudentBookings(
            String studentId
    ) {

        return mentorBookingRepository
                .findByStudentId(studentId);
    }


    // =========================================
    // GET APPROVED STUDENT BOOKINGS
    // =========================================

    public List<MentorBooking> getApprovedStudentBookings(
            String studentId
    ) {

        return mentorBookingRepository
                .findByStudentIdAndStatus(
                        studentId,
                        "APPROVED"
                );
    }


    // =========================================
    // GET REJECTED STUDENT BOOKINGS
    // =========================================

    public List<MentorBooking> getRejectedStudentBookings(
            String studentId
    ) {

        return mentorBookingRepository
                .findByStudentIdAndStatus(
                        studentId,
                        "REJECTED"
                );
    }


    // =========================================
    // ACCEPT BOOKING
    // =========================================

    public MentorBooking acceptBooking(
            String bookingId,
            String mentorResponse
    ) {

        MentorBooking booking =
                getBookingById(bookingId);


        if (
                !"PENDING".equalsIgnoreCase(
                        booking.getStatus()
                )
        ) {

            throw new IllegalStateException(
                    "Only pending bookings can be accepted."
            );
        }


        // =====================================
        // CHECK MAXIMUM STUDENTS
        // =====================================

        Integer maxStudents =
                booking.getMaxStudents();

        Integer bookedStudents =
                booking.getBookedStudents();


        if (bookedStudents == null) {

            bookedStudents = 0;
        }


        if (
                maxStudents != null &&
                bookedStudents >= maxStudents
        ) {

            throw new IllegalStateException(
                    "This session is already full."
            );
        }


        // =====================================
        // UPDATE STATUS
        // =====================================

        booking.setStatus("APPROVED");


        // =====================================
        // UPDATE BOOKED STUDENT COUNT
        // =====================================

        booking.setBookedStudents(
                bookedStudents + 1
        );


        // =====================================
        // SAVE MENTOR RESPONSE
        // =====================================

        if (
                mentorResponse != null &&
                !mentorResponse.trim().isEmpty()
        ) {

            booking.setMentorResponse(
                    mentorResponse.trim()
            );

        } else {

            booking.setMentorResponse(
                    "Booking request accepted."
            );
        }


        // =====================================
        // RESPONSE TIME
        // =====================================

        booking.setRespondedAt(
                LocalDateTime.now()
        );


        // =====================================
        // SAVE BOOKING
        // =====================================

        MentorBooking savedBooking =
                mentorBookingRepository.save(booking);


        // =====================================
        // UPDATE MENTOR NOTIFICATION
        // =====================================

        try {

            notificationService
                    .updateBookingRequestNotificationAsAccepted(
                            savedBooking
                    );

        } catch (Exception error) {

            System.err.println(
                    "Could not update mentor notification: "
                            + error.getMessage()
            );
        }


        // =====================================
        // CREATE STUDENT APPROVAL NOTIFICATION
        // =====================================

        try {

            notificationService
                    .createBookingApprovedNotification(
                            savedBooking
                    );

        } catch (Exception error) {

            System.err.println(
                    "Could not create student approval notification: "
                            + error.getMessage()
            );
        }


        return savedBooking;
    }


    // =========================================
    // REJECT BOOKING
    // =========================================

    public MentorBooking rejectBooking(
            String bookingId,
            String mentorResponse
    ) {

        MentorBooking booking =
                getBookingById(bookingId);


        if (
                !"PENDING".equalsIgnoreCase(
                        booking.getStatus()
                )
        ) {

            throw new IllegalStateException(
                    "Only pending bookings can be rejected."
            );
        }


        // =====================================
        // UPDATE STATUS
        // =====================================

        booking.setStatus("REJECTED");


        // =====================================
        // SAVE MENTOR RESPONSE
        // =====================================

        if (
                mentorResponse != null &&
                !mentorResponse.trim().isEmpty()
        ) {

            booking.setMentorResponse(
                    mentorResponse.trim()
            );

        } else {

            booking.setMentorResponse(
                    "Booking request rejected."
            );
        }


        // =====================================
        // RESPONSE TIME
        // =====================================

        booking.setRespondedAt(
                LocalDateTime.now()
        );


        // =====================================
        // SAVE BOOKING
        // =====================================

        MentorBooking savedBooking =
                mentorBookingRepository.save(booking);


        // =====================================
        // UPDATE MENTOR NOTIFICATION
        // =====================================

        try {

            notificationService
                    .updateBookingRequestNotificationAsRejected(
                            savedBooking
                    );

        } catch (Exception error) {

            System.err.println(
                    "Could not update mentor notification: "
                            + error.getMessage()
            );
        }


        // =====================================
        // CREATE STUDENT REJECTION NOTIFICATION
        // =====================================

        try {

            notificationService
                    .createBookingRejectedNotification(
                            savedBooking
                    );

        } catch (Exception error) {

            System.err.println(
                    "Could not create student rejection notification: "
                            + error.getMessage()
            );
        }


        return savedBooking;
    }


    // =========================================
    // COMPLETE BOOKING
    // =========================================
    //
    // APPROVED
    //     ↓
    // COMPLETED
    //
    // STUDENT
    //     ↓
    // +10 STARS
    //
    // SKILL PROGRESS
    //     ↓
    // UPDATED
    //
    // 100%
    //     ↓
    // MASTERED
    //     ↓
    // CAN TEACH = TRUE
    //
    // =========================================

    public MentorBooking completeBooking(
            String bookingId
    ) {

        // =====================================
        // FIND BOOKING
        // =====================================

        MentorBooking booking =
                getBookingById(bookingId);


        // =====================================
        // ONLY APPROVED BOOKINGS CAN COMPLETE
        // =====================================

        if (
                !"APPROVED".equalsIgnoreCase(
                        booking.getStatus()
                )
        ) {

            throw new IllegalStateException(
                    "Only approved bookings can be completed."
            );
        }


        // =====================================
        // UPDATE STATUS
        // =====================================

        booking.setStatus("COMPLETED");


        // =====================================
        // STORE COMPLETION TIME
        // =====================================

        booking.setRespondedAt(
                LocalDateTime.now()
        );


        // =====================================
        // SAVE COMPLETED BOOKING
        // =====================================

        MentorBooking savedBooking =
                mentorBookingRepository.save(booking);


        // =====================================
        // AWARD STUDENT LEARNING STARS
        // =====================================

        try {

            StarTransaction studentStars =
                    starTransitionService
                            .awardLearningSessionStars(
                                    savedBooking.getStudentId(),
                                    savedBooking.getSkill(),
                                    savedBooking.getId()
                            );


            if (studentStars != null) {

                System.out.println(
                        "⭐ Student awarded +"
                                + studentStars.getStars()
                                + " stars for completing learning session."
                                + " Student ID: "
                                + savedBooking.getStudentId()
                );

            } else {

                System.out.println(
                        "⭐ Student learning stars were already awarded "
                                + "or the reward could not be created."
                                + " Booking ID: "
                                + savedBooking.getId()
                );
            }

        } catch (Exception error) {

            System.err.println(
                    "Could not award student learning stars: "
                            + error.getMessage()
            );
        }


        // =====================================
        // UPDATE SKILL PROGRESS
        // =====================================
        //
        // Example:
        //
        // Total sessions     = 5
        // Completed sessions = 5
        //
        // Progress =
        // (5 / 5) * 100
        // = 100%
        //
        // 100%
        //   ↓
        // MASTERED
        //   ↓
        // canTeach = true
        //
        // =====================================

        try {

            SkillProgress updatedProgress =
                    skillProgressService.updateSkillProgress(
                            savedBooking.getStudentId(),
                            savedBooking.getSkill()
                    );


            System.out.println(
                    "📊 Skill progress updated."
                            + " Student ID: "
                            + savedBooking.getStudentId()
                            + ", Skill: "
                            + savedBooking.getSkill()
                            + ", Progress: "
                            + updatedProgress.getProgressPercentage()
                            + "%"
                            + ", Status: "
                            + updatedProgress.getStatus()
                            + ", Can Teach: "
                            + updatedProgress.isCanTeach()
            );

        } catch (Exception error) {

            System.err.println(
                    "Could not update skill progress: "
                            + error.getMessage()
            );
        }


        // =====================================
        // RETURN COMPLETED BOOKING
        // =====================================

        return savedBooking;
    }
}