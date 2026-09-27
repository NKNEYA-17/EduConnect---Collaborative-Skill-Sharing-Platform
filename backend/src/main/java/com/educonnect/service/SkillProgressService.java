package com.educonnect.service;

import com.educonnect.model.MentorBooking;
import com.educonnect.model.SkillProgress;
import com.educonnect.repository.MentorBookingRepository;
import com.educonnect.repository.SkillProgressRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SkillProgressService {

    private final SkillProgressRepository skillProgressRepository;
    private final MentorBookingRepository mentorBookingRepository;

    // =========================================
    // CONSTRUCTOR
    // =========================================

    public SkillProgressService(
            SkillProgressRepository skillProgressRepository,
            MentorBookingRepository mentorBookingRepository
    ) {
        this.skillProgressRepository = skillProgressRepository;
        this.mentorBookingRepository = mentorBookingRepository;
    }


    // =========================================
    // UPDATE PROGRESS FOR ONE SKILL
    // =========================================

    public SkillProgress updateSkillProgress(
            String studentId,
            String skill
    ) {

        if (studentId == null || studentId.trim().isEmpty()) {
            throw new IllegalArgumentException("Student ID cannot be empty");
        }

        if (skill == null || skill.trim().isEmpty()) {
            throw new IllegalArgumentException("Skill cannot be empty");
        }

        String cleanSkill = skill.trim();

        // -----------------------------------------
        // Find existing progress record
        // -----------------------------------------

        Optional<SkillProgress> existingProgress =
                skillProgressRepository.findByStudentIdAndSkill(
                        studentId,
                        cleanSkill
                );

        SkillProgress progress;

        if (existingProgress.isPresent()) {

            progress = existingProgress.get();

        } else {

            progress = new SkillProgress(
                    studentId,
                    cleanSkill
            );
        }


        // -----------------------------------------
        // Get all bookings
        // -----------------------------------------

        List<MentorBooking> allBookings =
                mentorBookingRepository.findAll();


        // -----------------------------------------
        // Filter bookings for this student + skill
        // -----------------------------------------

        int totalSessions = 0;
        int completedSessions = 0;

        for (MentorBooking booking : allBookings) {

            if (booking == null) {
                continue;
            }

            String bookingStudentId = booking.getStudentId();
            String bookingSkill = booking.getSkill();

            // Check student
            boolean sameStudent =
                    bookingStudentId != null
                            && bookingStudentId.equals(studentId);

            // Check skill (case-insensitive)
            boolean sameSkill =
                    bookingSkill != null
                            && bookingSkill.trim()
                            .equalsIgnoreCase(cleanSkill);

            if (!sameStudent || !sameSkill) {
                continue;
            }

            totalSessions++;

            // -----------------------------------------
            // Count completed sessions
            // -----------------------------------------

            if (booking.getStatus() != null
                    && booking.getStatus()
                    .equalsIgnoreCase("COMPLETED")) {

                completedSessions++;
            }
        }


        // -----------------------------------------
        // Calculate percentage
        // -----------------------------------------

        int progressPercentage = 0;

        if (totalSessions > 0) {

            progressPercentage =
                    (int) Math.round(
                            ((double) completedSessions
                                    / totalSessions) * 100
                    );
        }


        // -----------------------------------------
        // Determine learning status
        // -----------------------------------------

        String status;
        boolean canTeach;

        if (totalSessions == 0) {

            status = "NOT_STARTED";
            canTeach = false;

        } else if (progressPercentage < 100) {

            status = "LEARNING";
            canTeach = false;

        } else {

            status = "MASTERED";
            canTeach = true;
        }


        // -----------------------------------------
        // Update progress object
        // -----------------------------------------

        progress.setTotalSessions(totalSessions);

        progress.setCompletedSessions(completedSessions);

        progress.setProgressPercentage(progressPercentage);

        progress.setStatus(status);

        progress.setCanTeach(canTeach);

        progress.setUpdatedAt(LocalDateTime.now());


        // -----------------------------------------
        // Save to MongoDB
        // -----------------------------------------

        return skillProgressRepository.save(progress);
    }


    // =========================================
    // UPDATE ALL SKILLS FOR A STUDENT
    // =========================================

    public List<SkillProgress> updateAllSkillProgress(
            String studentId
    ) {

        if (studentId == null || studentId.trim().isEmpty()) {
            throw new IllegalArgumentException("Student ID cannot be empty");
        }

        List<MentorBooking> allBookings =
                mentorBookingRepository.findAll();

        List<String> skills = new ArrayList<>();


        // -----------------------------------------
        // Find all skills booked by this student
        // -----------------------------------------

        for (MentorBooking booking : allBookings) {

            if (booking == null) {
                continue;
            }

            if (booking.getStudentId() == null
                    || !booking.getStudentId().equals(studentId)) {
                continue;
            }

            String skill = booking.getSkill();

            if (skill == null || skill.trim().isEmpty()) {
                continue;
            }

            String cleanSkill = skill.trim();

            // Avoid duplicate skills
            boolean alreadyExists = false;

            for (String existingSkill : skills) {

                if (existingSkill.equalsIgnoreCase(cleanSkill)) {
                    alreadyExists = true;
                    break;
                }
            }

            if (!alreadyExists) {
                skills.add(cleanSkill);
            }
        }


        // -----------------------------------------
        // Calculate progress for every skill
        // -----------------------------------------

        List<SkillProgress> result = new ArrayList<>();

        for (String skill : skills) {

            SkillProgress progress =
                    updateSkillProgress(
                            studentId,
                            skill
                    );

            result.add(progress);
        }

        return result;
    }


    // =========================================
    // GET ALL SKILL PROGRESS
    // =========================================

    public List<SkillProgress> getStudentSkillProgress(
            String studentId
    ) {

        return skillProgressRepository.findByStudentId(
                studentId
        );
    }


    // =========================================
    // GET ONE SKILL PROGRESS
    // =========================================

    public Optional<SkillProgress> getSkillProgress(
            String studentId,
            String skill
    ) {

        return skillProgressRepository.findByStudentIdAndSkill(
                studentId,
                skill
        );
    }


    // =========================================
    // GET MASTERED SKILLS
    // =========================================

    public List<SkillProgress> getMasteredSkills(
            String studentId
    ) {

        return skillProgressRepository.findByStudentIdAndStatus(
                studentId,
                "MASTERED"
        );
    }


    // =========================================
    // CHECK IF STUDENT CAN TEACH A SKILL
    // =========================================

    public boolean canTeachSkill(
            String studentId,
            String skill
    ) {

        Optional<SkillProgress> progress =
                skillProgressRepository.findByStudentIdAndSkill(
                        studentId,
                        skill
                );

        if (progress.isEmpty()) {
            return false;
        }

        SkillProgress skillProgress = progress.get();

        return skillProgress.isCanTeach();
    }
}