package com.educonnect.controller;

import com.educonnect.model.Feedback;
import com.educonnect.service.FeedbackService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:5173")
public class FeedbackController {

    private final FeedbackService feedbackService;


    // =========================================
    // CONSTRUCTOR
    // =========================================

    public FeedbackController(
            FeedbackService feedbackService
    ) {
        this.feedbackService = feedbackService;
    }


    // =========================================
    // SUBMIT FEEDBACK
    // =========================================

    @PostMapping
    public ResponseEntity<Feedback> submitFeedback(
            @RequestBody Feedback feedback
    ) {

        try {

            Feedback savedFeedback =
                    feedbackService.submitFeedback(
                            feedback
                    );

            return ResponseEntity.ok(
                    savedFeedback
            );

        } catch (IllegalArgumentException error) {

            return ResponseEntity
                    .badRequest()
                    .build();

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
    // GET FEEDBACK BY ID
    // =========================================

    @GetMapping("/{feedbackId}")
    public ResponseEntity<Feedback> getFeedbackById(
            @PathVariable String feedbackId
    ) {

        try {

            Feedback feedback =
                    feedbackService.getFeedbackById(
                            feedbackId
                    );

            return ResponseEntity.ok(
                    feedback
            );

        } catch (RuntimeException error) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }


    // =========================================
    // GET FEEDBACK BY BOOKING ID
    // =========================================

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<Feedback> getFeedbackByBookingId(
            @PathVariable String bookingId
    ) {

        try {

            Feedback feedback =
                    feedbackService
                            .getFeedbackByBookingId(
                                    bookingId
                            );

            return ResponseEntity.ok(
                    feedback
            );

        } catch (RuntimeException error) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }


    // =========================================
    // GET ALL FEEDBACK BY STUDENT
    // =========================================

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Feedback>> getStudentFeedback(
            @PathVariable String studentId
    ) {

        try {

            List<Feedback> feedbackList =
                    feedbackService
                            .getStudentFeedback(
                                    studentId
                            );

            return ResponseEntity.ok(
                    feedbackList
            );

        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }


    // =========================================
    // GET ALL FEEDBACK FOR MENTOR
    // =========================================

    @GetMapping("/mentor/{mentorId}")
    public ResponseEntity<List<Feedback>> getMentorFeedback(
            @PathVariable String mentorId
    ) {

        try {

            List<Feedback> feedbackList =
                    feedbackService
                            .getMentorFeedback(
                                    mentorId
                            );

            return ResponseEntity.ok(
                    feedbackList
            );

        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }


    // =========================================
    // CHECK WHETHER FEEDBACK EXISTS
    // =========================================

    @GetMapping("/booking/{bookingId}/exists")
    public ResponseEntity<Boolean> hasFeedback(
            @PathVariable String bookingId
    ) {

        try {

            boolean exists =
                    feedbackService.hasFeedback(
                            bookingId
                    );

            return ResponseEntity.ok(
                    exists
            );

        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }
}