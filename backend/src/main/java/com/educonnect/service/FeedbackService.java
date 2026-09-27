
package com.educonnect.service;

import com.educonnect.model.Feedback;
import com.educonnect.model.MentorBooking;
import com.educonnect.model.StarTransaction;

import com.educonnect.repository.FeedbackRepository;
import com.educonnect.repository.MentorBookingRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    private final MentorBookingRepository mentorBookingRepository;

    private final StarTransitionService starTransitionService;


    // =========================================
    // CONSTRUCTOR
    // =========================================

    public FeedbackService(
            FeedbackRepository feedbackRepository,
            MentorBookingRepository mentorBookingRepository,
            StarTransitionService starTransitionService
    ) {

        this.feedbackRepository =
                feedbackRepository;

        this.mentorBookingRepository =
                mentorBookingRepository;

        this.starTransitionService =
                starTransitionService;
    }


    // =========================================
    // SUBMIT FEEDBACK
    // =========================================

    public Feedback submitFeedback(
            Feedback feedback
    ) {

        if (feedback == null) {

            throw new IllegalArgumentException(
                    "Feedback cannot be null."
            );
        }


        // =========================================
        // BOOKING ID VALIDATION
        // =========================================

        if (feedback.getBookingId() == null
                || feedback.getBookingId()
                .trim()
                .isEmpty()) {

            throw new IllegalArgumentException(
                    "Booking ID is required."
            );
        }


        // =========================================
        // FIND BOOKING
        // =========================================

        MentorBooking booking =
                mentorBookingRepository
                        .findById(
                                feedback.getBookingId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found."
                                )
                        );


        // =========================================
        // ONLY COMPLETED BOOKINGS CAN BE RATED
        // =========================================

        if (!"COMPLETED".equalsIgnoreCase(
                booking.getStatus()
        )) {

            throw new IllegalStateException(
                    "Feedback can only be submitted after completing the session."
            );
        }


        // =========================================
        // PREVENT DUPLICATE FEEDBACK
        // =========================================

        if (feedbackRepository.existsByBookingId(
                feedback.getBookingId()
        )) {

            throw new IllegalStateException(
                    "Feedback has already been submitted for this session."
            );
        }


        // =========================================
        // RATING VALIDATION
        // =========================================

        if (feedback.getRating() == null) {

            throw new IllegalArgumentException(
                    "Rating is required."
            );
        }


        if (feedback.getRating() < 1
                || feedback.getRating() > 5) {

            throw new IllegalArgumentException(
                    "Rating must be between 1 and 5."
            );
        }


        // =========================================
        // FEEDBACK TEXT VALIDATION
        // =========================================

        if (feedback.getFeedback() == null
                || feedback.getFeedback()
                .trim()
                .isEmpty()) {

            throw new IllegalArgumentException(
                    "Feedback message is required."
            );
        }


        // =========================================
        // TAKE DETAILS FROM BOOKING
        // =========================================

        feedback.setSessionId(
                booking.getSessionId()
        );

        feedback.setSessionTitle(
                booking.getSessionTitle()
        );

        feedback.setMentorId(
                booking.getMentorId()
        );

        feedback.setMentorName(
                booking.getMentorName()
        );

        feedback.setStudentId(
                booking.getStudentId()
        );

        feedback.setStudentName(
                booking.getStudentName()
        );


        // =========================================
        // SET SUBMISSION TIME
        // =========================================

        feedback.setSubmittedAt(
                LocalDateTime.now()
        );


        // =========================================
        // SAVE FEEDBACK
        // =========================================

        Feedback savedFeedback =
                feedbackRepository.save(
                        feedback
                );


        // =========================================
        // ⭐ AWARD STARS TO MENTOR
        // =========================================
        //
        // Student gives rating.
        //
        // 5/5 → Mentor +5 stars
        // 4/5 → Mentor +4 stars
        // 3/5 → Mentor +3 stars
        // 2/5 → Mentor +2 stars
        // 1/5 → Mentor +1 star
        //
        // =========================================

        try {

            StarTransaction starTransaction =
                    starTransitionService
                            .awardFeedbackStars(
                                    booking.getMentorId(),
                                    booking.getSkill(),
                                    booking.getId(),
                                    feedback.getRating()
                            );


            if (starTransaction != null) {

                System.out.println(
                        "⭐ Feedback stars awarded successfully."
                );

                System.out.println(
                        "Mentor ID: "
                                + booking.getMentorId()
                );

                System.out.println(
                        "Stars awarded: "
                                + starTransaction.getStars()
                );

            } else {

                System.out.println(
                        "⭐ Feedback stars were not awarded. "
                                + "Reward may already exist."
                );
            }

        } catch (Exception error) {

            /*
             * Feedback has already been saved.
             *
             * We don't want a star-reward problem
             * to make the student's feedback fail.
             */

            System.err.println(
                    "Error awarding feedback stars: "
                            + error.getMessage()
            );
        }


        // =========================================
        // RETURN SAVED FEEDBACK
        // =========================================

        return savedFeedback;
    }


    // =========================================
    // GET FEEDBACK BY ID
    // =========================================

    public Feedback getFeedbackById(
            String feedbackId
    ) {

        return feedbackRepository
                .findById(feedbackId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Feedback not found."
                        )
                );
    }


    // =========================================
    // GET FEEDBACK FOR A BOOKING
    // =========================================

    public Feedback getFeedbackByBookingId(
            String bookingId
    ) {

        return feedbackRepository
                .findByBookingId(bookingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Feedback not found for this booking."
                        )
                );
    }


    // =========================================
    // GET ALL FEEDBACK BY STUDENT
    // =========================================

    public List<Feedback> getStudentFeedback(
            String studentId
    ) {

        return feedbackRepository
                .findByStudentId(studentId);
    }


    // =========================================
    // GET ALL FEEDBACK FOR MENTOR
    // =========================================

    public List<Feedback> getMentorFeedback(
            String mentorId
    ) {

        return feedbackRepository
                .findByMentorId(mentorId);
    }


    // =========================================
    // CHECK WHETHER BOOKING HAS FEEDBACK
    // =========================================

    public boolean hasFeedback(
            String bookingId
    ) {

        return feedbackRepository
                .existsByBookingId(bookingId);
    }
}

