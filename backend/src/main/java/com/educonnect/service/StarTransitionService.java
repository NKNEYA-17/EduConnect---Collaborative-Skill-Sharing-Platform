package com.educonnect.service;

import com.educonnect.model.MentorProfile;
import com.educonnect.model.StarTransaction;
import com.educonnect.repository.MentorProfileRepository;
import com.educonnect.repository.StarTransactionRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class StarTransitionService {

    private final StarTransactionRepository starTransactionRepository;
    private final MentorProfileRepository mentorProfileRepository;


    // =========================================
    // CONSTRUCTOR
    // =========================================

    public StarTransitionService(
            StarTransactionRepository starTransactionRepository,
            MentorProfileRepository mentorProfileRepository
    ) {

        this.starTransactionRepository =
                starTransactionRepository;

        this.mentorProfileRepository =
                mentorProfileRepository;
    }


    // =========================================
    // ADD DEFAULT STARS
    // =========================================
    //
    // New user = +10 stars
    //
    // =========================================

    public StarTransaction addDefaultStars(
            String userId
    ) {

        if (userId == null
                || userId.trim().isEmpty()) {

            return null;
        }


        List<StarTransaction> existingTransactions =
                starTransactionRepository
                        .findByUserId(userId);


        // Prevent duplicate DEFAULT stars

        if (existingTransactions != null) {

            for (StarTransaction transaction
                    : existingTransactions) {

                if (transaction != null
                        && "DEFAULT".equalsIgnoreCase(
                        transaction.getType()
                )) {

                    return null;
                }
            }
        }


        StarTransaction transaction =
                new StarTransaction();

        transaction.setUserId(userId);

        transaction.setStars(10);

        transaction.setType("DEFAULT");

        transaction.setDescription(
                "Welcome bonus"
        );

        transaction.setCreatedAt(
                LocalDateTime.now()
        );


        return starTransactionRepository.save(
                transaction
        );
    }


    // =========================================
    // AWARD LEARNING SESSION STARS
    // =========================================
    //
    // Completed learning session = +10
    //
    // =========================================

    public StarTransaction awardLearningSessionStars(
            String userId,
            String skill,
            String sessionId
    ) {

        if (userId == null
                || userId.trim().isEmpty()) {

            return null;
        }


        // Prevent duplicate reward

        if (sessionId != null
                && !sessionId.trim().isEmpty()
                && hasTransactionForSession(
                userId,
                sessionId,
                "LEARNING"
        )) {

            return null;
        }


        StarTransaction transaction =
                new StarTransaction();

        transaction.setUserId(userId);

        transaction.setStars(10);

        transaction.setType("LEARNING");


        if (skill != null
                && !skill.trim().isEmpty()) {

            transaction.setDescription(
                    "Completed learning session for "
                            + skill
            );

        } else {

            transaction.setDescription(
                    "Completed learning session"
            );
        }


        transaction.setSkill(skill);

        transaction.setSessionId(sessionId);

        transaction.setCreatedAt(
                LocalDateTime.now()
        );


        return starTransactionRepository.save(
                transaction
        );
    }


    // =========================================
    // AWARD TEACHING SESSION STARS
    // =========================================
    //
    // Completed teaching session = +15
    //
    // =========================================

    public StarTransaction awardTeachingSessionStars(
            String userId,
            String skill,
            String sessionId
    ) {

        if (userId == null
                || userId.trim().isEmpty()) {

            return null;
        }


        // Prevent duplicate reward

        if (sessionId != null
                && !sessionId.trim().isEmpty()
                && hasTransactionForSession(
                userId,
                sessionId,
                "TEACHING"
        )) {

            return null;
        }


        StarTransaction transaction =
                new StarTransaction();

        transaction.setUserId(userId);

        transaction.setStars(15);

        transaction.setType("TEACHING");


        if (skill != null
                && !skill.trim().isEmpty()) {

            transaction.setDescription(
                    "Completed teaching session for "
                            + skill
            );

        } else {

            transaction.setDescription(
                    "Completed teaching session"
            );
        }


        transaction.setSkill(skill);

        transaction.setSessionId(sessionId);

        transaction.setCreatedAt(
                LocalDateTime.now()
        );


        return starTransactionRepository.save(
                transaction
        );
    }


    // =========================================
    // AWARD SKILL COMPLETION STARS
    // =========================================
    //
    // Completed skill = +25
    //
    // =========================================

    public StarTransaction awardSkillCompletionStars(
            String userId,
            String skill
    ) {

        if (userId == null
                || userId.trim().isEmpty()) {

            return null;
        }


        List<StarTransaction> existingTransactions =
                starTransactionRepository
                        .findByUserId(userId);


        // Prevent duplicate skill reward

        if (existingTransactions != null) {

            for (StarTransaction transaction
                    : existingTransactions) {

                if (transaction != null
                        && "SKILL_COMPLETION"
                        .equalsIgnoreCase(
                                transaction.getType()
                        )
                        && skill != null
                        && skill.equalsIgnoreCase(
                                transaction.getSkill()
                        )) {

                    return null;
                }
            }
        }


        StarTransaction transaction =
                new StarTransaction();

        transaction.setUserId(userId);

        transaction.setStars(25);

        transaction.setType(
                "SKILL_COMPLETION"
        );


        if (skill != null
                && !skill.trim().isEmpty()) {

            transaction.setDescription(
                    "Completed skill: "
                            + skill
            );

        } else {

            transaction.setDescription(
                    "Completed a skill"
            );
        }


        transaction.setSkill(skill);

        transaction.setCreatedAt(
                LocalDateTime.now()
        );


        return starTransactionRepository.save(
                transaction
        );
    }


    // =========================================
    // AWARD FEEDBACK STARS
    // =========================================
    //
    // Rating itself becomes stars.
    //
    // 1 star rating = +1
    // 2 star rating = +2
    // 3 star rating = +3
    // 4 star rating = +4
    // 5 star rating = +5
    //
    // mentorId here is the MentorProfile ID
    // because MentorBooking stores that ID.
    //
    // =========================================

    public StarTransaction awardFeedbackStars(
            String mentorId,
            String skill,
            String bookingId,
            int rating
    ) {

        if (mentorId == null
                || mentorId.trim().isEmpty()) {

            return null;
        }


        if (rating < 1 || rating > 5) {

            return null;
        }


        // Prevent duplicate feedback reward

        if (bookingId != null
                && !bookingId.trim().isEmpty()
                && hasTransactionForSession(
                mentorId,
                bookingId,
                "FEEDBACK"
        )) {

            return null;
        }


        StarTransaction transaction =
                new StarTransaction();


        // MentorProfile ID
        transaction.setUserId(
                mentorId
        );


        // Rating = stars
        transaction.setStars(
                rating
        );

        transaction.setType(
                "FEEDBACK"
        );


        if (skill != null
                && !skill.trim().isEmpty()) {

            transaction.setDescription(
                    "Received "
                            + rating
                            + "/5 feedback for "
                            + skill
            );

        } else {

            transaction.setDescription(
                    "Received "
                            + rating
                            + "/5 feedback"
            );
        }


        transaction.setSkill(skill);

        transaction.setSessionId(
                bookingId
        );

        transaction.setCreatedAt(
                LocalDateTime.now()
        );


        return starTransactionRepository.save(
                transaction
        );
    }


    // =========================================
    // GET STAR HISTORY
    // =========================================
    //
    // IMPORTANT:
    //
    // Normal user transactions are stored using
    // USER ID.
    //
    // Mentor feedback transactions are stored
    // using MENTOR PROFILE ID.
    //
    // Therefore we combine both histories.
    //
    // =========================================

    public List<StarTransaction> getStarHistory(
            String userId
    ) {

        if (userId == null
                || userId.trim().isEmpty()) {

            return List.of();
        }


        // =====================================
        // STEP 1
        // =====================================
        // Get transactions for USER ID
        // =====================================

        List<StarTransaction> history =
                starTransactionRepository
                        .findByUserIdOrderByCreatedAtDesc(
                                userId
                        );


        // Create a mutable list

        if (history == null) {

            history =
                    new ArrayList<>();

        } else {

            history =
                    new ArrayList<>(
                            history
                    );
        }


        // =====================================
        // STEP 2
        // =====================================
        // Find MentorProfile using USER ID
        // =====================================

        Optional<MentorProfile> mentorProfileOptional =
                mentorProfileRepository
                        .findByUserId(userId);


        // =====================================
        // STEP 3
        // =====================================
        // If user is not a mentor,
        // return normal history.
        // =====================================

        if (mentorProfileOptional.isEmpty()) {

            return history;
        }


        MentorProfile mentorProfile =
                mentorProfileOptional.get();


        // =====================================
        // STEP 4
        // =====================================
        // Get MentorProfile ID
        // =====================================

        String mentorProfileId =
                mentorProfile.getId();


        if (mentorProfileId == null
                || mentorProfileId.trim().isEmpty()) {

            return history;
        }


        // =====================================
        // STEP 5
        // =====================================
        // Avoid duplicate history if User ID
        // and MentorProfile ID are the same.
        // =====================================

        if (mentorProfileId.equals(userId)) {

            return history;
        }


        // =====================================
        // STEP 6
        // =====================================
        // Get transactions stored using
        // MentorProfile ID.
        // =====================================

        List<StarTransaction> mentorHistory =
                starTransactionRepository
                        .findByUserIdOrderByCreatedAtDesc(
                                mentorProfileId
                        );


        if (mentorHistory != null) {

            history.addAll(
                    mentorHistory
            );
        }


        // =====================================
        // STEP 7
        // =====================================
        // Sort combined history by newest first.
        // =====================================

        history.sort(
                (a, b) -> {

                    if (a.getCreatedAt() == null
                            && b.getCreatedAt() == null) {

                        return 0;
                    }


                    if (a.getCreatedAt() == null) {

                        return 1;
                    }


                    if (b.getCreatedAt() == null) {

                        return -1;
                    }


                    return b.getCreatedAt()
                            .compareTo(
                                    a.getCreatedAt()
                            );
                }
        );


        return history;
    }


    // =========================================
    // GET TOTAL STARS
    // =========================================
    //
    // User ID transactions
    // +
    // Mentor Profile ID transactions
    // =
    // Total Stars
    //
    // =========================================

    public int getTotalStars(
            String userId
    ) {

        if (userId == null
                || userId.trim().isEmpty()) {

            return 0;
        }


        int totalStars = 0;


        // =====================================
        // STEP 1
        // =====================================
        // Get transactions for USER ID
        // =====================================

        List<StarTransaction> userTransactions =
                starTransactionRepository
                        .findByUserId(userId);


        if (userTransactions != null) {

            for (StarTransaction transaction
                    : userTransactions) {

                if (transaction != null) {

                    totalStars +=
                            transaction.getStars();
                }
            }
        }


        // =====================================
        // STEP 2
        // =====================================
        // Find MentorProfile using USER ID
        // =====================================

        Optional<MentorProfile> mentorProfileOptional =
                mentorProfileRepository
                        .findByUserId(userId);


        // User is not a mentor

        if (mentorProfileOptional.isEmpty()) {

            return totalStars;
        }


        MentorProfile mentorProfile =
                mentorProfileOptional.get();


        // =====================================
        // STEP 3
        // =====================================

        String mentorProfileId =
                mentorProfile.getId();


        if (mentorProfileId == null
                || mentorProfileId.trim().isEmpty()) {

            return totalStars;
        }


        // =====================================
        // STEP 4
        // =====================================
        // Avoid duplicate counting
        // =====================================

        if (mentorProfileId.equals(userId)) {

            return totalStars;
        }


        // =====================================
        // STEP 5
        // =====================================
        // Get transactions for MentorProfile ID
        // =====================================

        List<StarTransaction> mentorTransactions =
                starTransactionRepository
                        .findByUserId(
                                mentorProfileId
                        );


        if (mentorTransactions != null) {

            for (StarTransaction transaction
                    : mentorTransactions) {

                if (transaction != null) {

                    totalStars +=
                            transaction.getStars();
                }
            }
        }


        return totalStars;
    }


    // =========================================
    // CHECK DUPLICATE TRANSACTION
    // =========================================

    private boolean hasTransactionForSession(
            String userId,
            String sessionId,
            String type
    ) {

        if (userId == null
                || userId.trim().isEmpty()
                || sessionId == null
                || sessionId.trim().isEmpty()
                || type == null
                || type.trim().isEmpty()) {

            return false;
        }


        List<StarTransaction> transactions =
                starTransactionRepository
                        .findByUserId(userId);


        if (transactions == null) {

            return false;
        }


        for (StarTransaction transaction
                : transactions) {

            if (transaction == null) {

                continue;
            }


            boolean sameType =
                    type.equalsIgnoreCase(
                            transaction.getType()
                    );


            boolean sameSession =
                    sessionId.equals(
                            transaction.getSessionId()
                    );


            if (sameType && sameSession) {

                return true;
            }
        }


        return false;
    }
}