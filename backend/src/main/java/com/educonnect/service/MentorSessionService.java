package com.educonnect.service;

import com.educonnect.model.MentorSession;
import com.educonnect.repository.MentorSessionRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MentorSessionService {

    private final MentorSessionRepository mentorSessionRepository;


    // =========================================
    // CONSTRUCTOR
    // =========================================

    public MentorSessionService(
            MentorSessionRepository mentorSessionRepository
    ) {

        this.mentorSessionRepository =
                mentorSessionRepository;
    }


    // =========================================
    // CREATE OR UPDATE SESSION
    // =========================================

    public MentorSession saveSession(
            MentorSession session
    ) {

        if (session.getMentorId() == null ||
                session.getMentorId().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Mentor ID is required."
            );
        }


        // =====================================
        // DEFAULT VALUES
        // =====================================

        if (session.getMaxStudents() == null) {

            session.setMaxStudents(10);
        }


        if (session.getBookedStudents() == null) {

            session.setBookedStudents(0);
        }


        if (session.getStatus() == null ||
                session.getStatus().trim().isEmpty()) {

            session.setStatus("AVAILABLE");
        }


        session.setUpdatedAt(
                LocalDateTime.now()
        );


        // =====================================
        // CHECK EXISTING SESSION
        // =====================================

        Optional<MentorSession> existingSession =
                mentorSessionRepository
                        .findByMentorId(
                                session.getMentorId()
                        );


        if (existingSession.isPresent()) {

            MentorSession existing =
                    existingSession.get();


            session.setId(
                    existing.getId()
            );


            // Keep booked student count
            // when mentor updates session.

            if (
                session.getBookedStudents() == null
            ) {

                session.setBookedStudents(
                        existing.getBookedStudents()
                );

            }

        }


        return mentorSessionRepository.save(
                session
        );
    }


    // =========================================
    // GET SESSION BY MENTOR ID
    // =========================================

    public MentorSession getSessionByMentorId(
            String mentorId
    ) {

        return mentorSessionRepository
                .findByMentorId(mentorId)
                .orElse(null);
    }


    // =========================================
    // GET SESSION BY ID
    // =========================================

    public MentorSession getSessionById(
            String id
    ) {

        return mentorSessionRepository
                .findById(id)
                .orElse(null);
    }


    // =========================================
    // GET ALL SESSIONS
    // =========================================

    public List<MentorSession> getAllSessions() {

        return mentorSessionRepository.findAll();
    }


    // =========================================
    // DELETE SESSION
    // =========================================

    public void deleteSession(
            String mentorId
    ) {

        Optional<MentorSession> session =
                mentorSessionRepository
                        .findByMentorId(mentorId);

        session.ifPresent(
                mentorSessionRepository::delete
        );
    }
}