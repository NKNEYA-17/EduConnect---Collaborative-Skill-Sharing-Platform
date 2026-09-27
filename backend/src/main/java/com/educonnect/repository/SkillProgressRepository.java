package com.educonnect.repository;

import com.educonnect.model.SkillProgress;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface SkillProgressRepository
        extends MongoRepository<SkillProgress, String> {


    // =========================================
    // FIND PROGRESS FOR A STUDENT AND SKILL
    // =========================================

    Optional<SkillProgress> findByStudentIdAndSkill(
            String studentId,
            String skill
    );


    // =========================================
    // GET ALL SKILL PROGRESS FOR A STUDENT
    // =========================================

    List<SkillProgress> findByStudentId(
            String studentId
    );


    // =========================================
    // GET ONLY MASTERED SKILLS
    // =========================================

    List<SkillProgress> findByStudentIdAndStatus(
            String studentId,
            String status
    );


    // =========================================
    // CHECK WHETHER PROGRESS EXISTS
    // =========================================

    boolean existsByStudentIdAndSkill(
            String studentId,
            String skill
    );
}