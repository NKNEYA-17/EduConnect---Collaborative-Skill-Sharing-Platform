package com.educonnect.controller;

import com.educonnect.model.MentorSession;
import com.educonnect.service.MentorSessionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentor-sessions")
@CrossOrigin(origins = "http://localhost:5173")
public class MentorSessionController {

    private final MentorSessionService mentorSessionService;


    // =========================================
    // CONSTRUCTOR
    // =========================================

    public MentorSessionController(
            MentorSessionService mentorSessionService
    ) {

        this.mentorSessionService =
                mentorSessionService;
    }


    // =========================================
    // CREATE / UPDATE SESSION
    // =========================================

    @PostMapping
    public ResponseEntity<?> saveSession(
            @RequestBody MentorSession session
    ) {

        try {

            MentorSession savedSession =
                    mentorSessionService
                            .saveSession(session);

            return ResponseEntity.ok(
                    savedSession
            );

        } catch (IllegalArgumentException error) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            error.getMessage()
                    );

        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Failed to save mentor session."
                    );
        }
    }


    // =========================================
    // GET SESSION BY MENTOR ID
    // =========================================

    @GetMapping("/mentor/{mentorId}")
    public ResponseEntity<?> getSessionByMentorId(
            @PathVariable String mentorId
    ) {

        try {

            MentorSession session =
                    mentorSessionService
                            .getSessionByMentorId(
                                    mentorId
                            );

            if (session == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            return ResponseEntity.ok(
                    session
            );

        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Failed to load mentor session."
                    );
        }
    }


    // =========================================
    // GET SESSION BY SESSION ID
    // =========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getSessionById(
            @PathVariable String id
    ) {

        try {

            MentorSession session =
                    mentorSessionService
                            .getSessionById(id);

            if (session == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            return ResponseEntity.ok(
                    session
            );

        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Failed to load session."
                    );
        }
    }


    // =========================================
    // GET ALL SESSIONS
    // =========================================

    @GetMapping
    public ResponseEntity<List<MentorSession>>
    getAllSessions() {

        return ResponseEntity.ok(
                mentorSessionService
                        .getAllSessions()
        );
    }


    // =========================================
    // DELETE SESSION
    // =========================================

    @DeleteMapping("/mentor/{mentorId}")
    public ResponseEntity<?> deleteSession(
            @PathVariable String mentorId
    ) {

        try {

            mentorSessionService
                    .deleteSession(mentorId);

            return ResponseEntity.ok(
                    "Mentor session deleted successfully."
            );

        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Failed to delete mentor session."
                    );
        }
    }
}