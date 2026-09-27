package com.educonnect.service;

import com.educonnect.model.Feedback;
import com.educonnect.model.MentorBooking;
import com.educonnect.model.Recommendation;
import com.educonnect.model.User;
import com.educonnect.repository.FeedbackRepository;
import com.educonnect.repository.MentorBookingRepository;
import com.educonnect.repository.RecommendationRepository;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;

    private final FeedbackRepository feedbackRepository;

    private final MentorBookingRepository mentorBookingRepository;

    private final MongoTemplate mongoTemplate;


    // =========================================================
    // AVAILABLE SKILLS
    // =========================================================

    private final List<String> availableSkills = Arrays.asList(

            // Programming
            "Java",
            "Python",
            "JavaScript",

            // Frontend
            "React",
            "Redux",
            "HTML",
            "CSS",

            // Backend
            "Spring Boot",
            "Hibernate",
            "REST API",
            "API Integration",

            // Database
            "MongoDB",
            "MySQL",
            "SQL",

            // Programming Concepts
            "OOP",

            // Data / AI
            "Machine Learning",
            "Artificial Intelligence",
            "Data Science",
            "Statistics",
            "Pandas",
            "NumPy",
            "Data Visualization",

            // Cloud
            "Cloud Computing",
            "AWS",

            // UI/UX
            "UI Design",
            "UX Research",
            "Wireframing",
            "Figma",
            "Prototyping",
            "Design Thinking",
            "UI/UX Design",

            // Cyber Security
            "Cyber Security",
            "Networking",
            "Ethical Hacking",
            "Cryptography",
            "Security Tools",
            "Linux",

            // Data Analytics
            "Excel",
            "Power BI",

            // Version Control
            "Git",
            "GitHub"
    );


    // =========================================================
    // HYBRID WEIGHTS
    // =========================================================

    private static final double CONTENT_WEIGHT = 0.60;

    private static final double COLLABORATIVE_WEIGHT = 0.40;


    // =========================================================
    // CONTENT-BASED WEIGHTS
    // =========================================================

    private static final double SKILL_GAP_WEIGHT = 50.0;

    private static final double RELATED_GAP_WEIGHT = 30.0;

    private static final double INTEREST_WEIGHT = 10.0;

    private static final double GOAL_WEIGHT = 10.0;

    private static final double RELATED_SKILL_WEIGHT = 10.0;


    // =========================================================
    // COLLABORATIVE FILTERING SETTINGS
    // =========================================================

    private static final double MINIMUM_SIMILARITY = 0.10;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public RecommendationService(
            RecommendationRepository recommendationRepository,
            FeedbackRepository feedbackRepository,
            MentorBookingRepository mentorBookingRepository,
            MongoTemplate mongoTemplate
    ) {

        this.recommendationRepository =
                recommendationRepository;

        this.feedbackRepository =
                feedbackRepository;

        this.mentorBookingRepository =
                mentorBookingRepository;

        this.mongoTemplate =
                mongoTemplate;
    }


    // =========================================================
    // GENERATE CONTENT + COLLABORATIVE RECOMMENDATIONS
    // =========================================================

    public List<Recommendation> generateContentRecommendations(
            User user,
            List<String> missingSkills,
            String targetRole
    ) {

        List<Recommendation> recommendations =
                new ArrayList<>();


        if (user == null) {

            return recommendations;
        }


        // -----------------------------------------------------
        // USER SKILLS
        // -----------------------------------------------------

        Set<String> userSkills =
                convertToLowercaseSet(
                        user.getSkills()
                );


        // -----------------------------------------------------
        // USER INTERESTS
        // -----------------------------------------------------

        Set<String> userInterests =
                convertToLowercaseSet(
                        user.getInterests()
                );


        // -----------------------------------------------------
        // USER LEARNING GOALS
        // -----------------------------------------------------

        Set<String> learningGoals =
                convertToLowercaseSet(
                        user.getLearningGoals()
                );


        // -----------------------------------------------------
        // MISSING SKILLS
        // -----------------------------------------------------

        Set<String> normalizedMissingSkills =
                convertToLowercaseSet(
                        missingSkills
                );


        // =====================================================
        // COLLABORATIVE SCORES
        // =====================================================

        Map<String, Double> collaborativeScores =
                calculateCollaborativeScores(
                        user
                );


        // =====================================================
        // 1. SKILL RECOMMENDATIONS
        // =====================================================

        for (String skill : availableSkills) {

            String normalizedSkill =
                    skill.trim().toLowerCase();


            /*
             * Do not recommend a skill that the
             * user already has.
             */
            if (userSkills.contains(
                    normalizedSkill
            )) {

                continue;
            }


            double contentScore =
                    calculateContentScore(
                            normalizedSkill,
                            userSkills,
                            userInterests,
                            learningGoals,
                            normalizedMissingSkills
                    );


            double collaborativeScore =
                    collaborativeScores.getOrDefault(
                            normalizedSkill,
                            0.0
                    );


            /*
             * Ignore skills that have no signal.
             */
            if (contentScore <= 0
                    && collaborativeScore <= 0) {

                continue;
            }


            Recommendation recommendation =
                    new Recommendation();


            recommendation.setUserId(
                    user.getId()
            );


            recommendation.setItemType(
                    "SKILL"
            );


            recommendation.setItemId(
                    skill
            );


            recommendation.setItemName(
                    skill
            );


            recommendation.setContentScore(
                    roundScore(
                            contentScore
                    )
            );


            recommendation.setCollaborativeScore(
                    roundScore(
                            collaborativeScore
                    )
            );


            recommendation.setHybridScore(
                    calculateHybridScore(
                            contentScore,
                            collaborativeScore
                    )
            );


            recommendation.setReason(
                    generateReason(
                            normalizedSkill,
                            userSkills,
                            userInterests,
                            learningGoals,
                            normalizedMissingSkills,
                            collaborativeScore,
                            targetRole
                    )
            );


            recommendations.add(
                    recommendation
            );
        }


        // =====================================================
        // 2. MENTOR RECOMMENDATIONS
        // =====================================================

        recommendations.addAll(
                generateMentorRecommendations(
                        user,
                        missingSkills
                )
        );


        // =====================================================
        // 3. RESOURCE RECOMMENDATIONS
        // =====================================================

        recommendations.addAll(
                generateResourceRecommendations(
                        user,
                        missingSkills,
                        collaborativeScores
                )
        );


        // =====================================================
        // SORT ALL RECOMMENDATIONS
        // =====================================================

        recommendations.sort(
                new Comparator<Recommendation>() {

                    @Override
                    public int compare(
                            Recommendation r1,
                            Recommendation r2
                    ) {

                        return Double.compare(
                                r2.getHybridScore(),
                                r1.getHybridScore()
                        );
                    }
                }
        );


        return recommendations;
    }


    // =========================================================
    // MENTOR RECOMMENDATIONS
    // =========================================================

    private List<Recommendation> generateMentorRecommendations(
            User currentUser,
            List<String> missingSkills
    ) {

        List<Recommendation> recommendations =
                new ArrayList<>();


        if (currentUser == null
                || currentUser.getId() == null
                || missingSkills == null
                || missingSkills.isEmpty()) {

            return recommendations;
        }


        Set<String> normalizedMissingSkills =
                convertToLowercaseSet(
                        missingSkills
                );


        /*
         * Get all users.
         *
         * A mentor is recommended only when:
         *
         * mentorStatus = APPROVED
         *
         * and the mentor teaches at least one
         * skill that the current user is missing.
         */
        List<User> allUsers =
                mongoTemplate.findAll(
                        User.class
                );


        if (allUsers == null
                || allUsers.isEmpty()) {

            return recommendations;
        }


        for (User mentor : allUsers) {

            if (mentor == null
                    || mentor.getId() == null) {

                continue;
            }


            /*
             * Don't recommend current user.
             */
            if (mentor.getId().equals(
                    currentUser.getId()
            )) {

                continue;
            }


            /*
             * Only APPROVED mentors.
             */
            if (mentor.getMentorStatus() == null
                    || !mentor.getMentorStatus()
                    .equalsIgnoreCase(
                            "APPROVED"
                    )) {

                continue;
            }


            Set<String> mentorSkills =
                    convertToLowercaseSet(
                            mentor.getSkills()
                    );


            if (mentorSkills.isEmpty()) {

                continue;
            }


            /*
             * Find skills this mentor can teach
             * that the user needs.
             */
            Set<String> matchingSkills =
                    new HashSet<>();


            for (String missingSkill :
                    normalizedMissingSkills) {

                if (mentorSkills.contains(
                        missingSkill
                )) {

                    matchingSkills.add(
                            missingSkill
                    );

                    continue;
                }


                /*
                 * Also allow related skills.
                 */
                for (String mentorSkill :
                        mentorSkills) {

                    if (areSkillsRelated(
                            mentorSkill,
                            missingSkill
                    )) {

                        matchingSkills.add(
                                missingSkill
                        );

                        break;
                    }
                }
            }


            /*
             * This mentor does not help with
             * any current skill gap.
             */
            if (matchingSkills.isEmpty()) {

                continue;
            }


            /*
             * Content score:
             *
             * More matching skills =
             * higher mentor relevance.
             */
            double contentScore =
                    (
                            (double)
                                    matchingSkills.size()
                                    /
                            normalizedMissingSkills.size()
                    ) * 100.0;


            contentScore =
                    Math.min(
                            contentScore,
                            100.0
                    );


            /*
             * Collaborative score:
             *
             * If the current user has previously
             * interacted with this mentor,
             * increase the score.
             *
             * Otherwise use skill similarity
             * from previous learning activity.
             */
            double collaborativeScore =
                    calculateMentorCollaborativeScore(
                            currentUser,
                            mentor
                    );


            Recommendation recommendation =
                    new Recommendation();


            recommendation.setUserId(
                    currentUser.getId()
            );


            recommendation.setItemType(
                    "MENTOR"
            );


            /*
             * VERY IMPORTANT:
             *
             * itemId = mentor's MongoDB user ID.
             *
             * StudentDashboard will use this
             * ID when opening the mentor flow.
             */
            recommendation.setItemId(
                    mentor.getId()
            );


            recommendation.setItemName(
                    mentor.getName()
            );


            recommendation.setContentScore(
                    roundScore(
                            contentScore
                    )
            );


            recommendation.setCollaborativeScore(
                    roundScore(
                            collaborativeScore
                    )
            );


            recommendation.setHybridScore(
                    calculateHybridScore(
                            contentScore,
                            collaborativeScore
                    )
            );


            recommendation.setReason(
                    "Recommended because this mentor can help you with "
                            + formatSkills(
                                    matchingSkills
                            )
                            + "."
            );


            recommendations.add(
                    recommendation
            );
        }


        /*
         * Highest scoring mentors first.
         */
        recommendations.sort(
                new Comparator<Recommendation>() {

                    @Override
                    public int compare(
                            Recommendation r1,
                            Recommendation r2
                    ) {

                        return Double.compare(
                                r2.getHybridScore(),
                                r1.getHybridScore()
                        );
                    }
                }
        );


        /*
         * Maximum 5 mentors.
         */
        if (recommendations.size() > 5) {

            return new ArrayList<>(
                    recommendations.subList(
                            0,
                            5
                    )
            );
        }


        return recommendations;
    }


    // =========================================================
    // MENTOR COLLABORATIVE SCORE
    // =========================================================

    private double calculateMentorCollaborativeScore(
            User currentUser,
            User mentor
    ) {

        if (currentUser == null
                || mentor == null) {

            return 0.0;
        }


        try {

            List<MentorBooking> bookings =
                    mentorBookingRepository.findByStudentId(
                            currentUser.getId()
                    );


            if (bookings == null
                    || bookings.isEmpty()) {

                return 0.0;
            }


            /*
             * Previously booked this mentor.
             */
            for (MentorBooking booking :
                    bookings) {

                if (booking == null) {

                    continue;
                }


                if (mentor.getId().equals(
                        booking.getMentorId()
                )) {

                    return 100.0;
                }
            }


            /*
             * Compare mentor skills with
             * skills from previous bookings.
             */
            Set<String> previousSkills =
                    extractBookedSkills(
                            bookings
                    );


            Set<String> mentorSkills =
                    convertToLowercaseSet(
                            mentor.getSkills()
                    );


            if (previousSkills.isEmpty()
                    || mentorSkills.isEmpty()) {

                return 0.0;
            }


            Set<String> intersection =
                    new HashSet<>(
                            previousSkills
                    );


            intersection.retainAll(
                    mentorSkills
            );


            Set<String> union =
                    new HashSet<>(
                            previousSkills
                    );


            union.addAll(
                    mentorSkills
            );


            if (union.isEmpty()) {

                return 0.0;
            }


            return (
                    (double)
                            intersection.size()
                            /
                    union.size()
            ) * 100.0;

        }
        catch (Exception e) {

            return 0.0;
        }
    }


    // =========================================================
    // RESOURCE RECOMMENDATIONS
    // =========================================================

    private List<Recommendation> generateResourceRecommendations(
            User user,
            List<String> missingSkills,
            Map<String, Double> collaborativeScores
    ) {

        List<Recommendation> recommendations =
                new ArrayList<>();


        if (user == null
                || missingSkills == null
                || missingSkills.isEmpty()) {

            return recommendations;
        }


        Set<String> alreadyAdded =
                new HashSet<>();


        for (String missingSkill :
                missingSkills) {

            if (missingSkill == null
                    || missingSkill.trim().isEmpty()) {

                continue;
            }


            String cleanSkill =
                    missingSkill.trim();


            String normalizedSkill =
                    cleanSkill.toLowerCase();


            /*
             * Prevent duplicate resources.
             */
            if (alreadyAdded.contains(
                    normalizedSkill
            )) {

                continue;
            }


            alreadyAdded.add(
                    normalizedSkill
            );


            String resourceUrl =
                    getResourceUrl(
                            cleanSkill
                    );


            if (resourceUrl == null
                    || resourceUrl.trim().isEmpty()) {

                continue;
            }


            /*
             * Resources are directly connected
             * to the user's skill gap.
             */
            double contentScore = 90.0;


            /*
             * Use collaborative score of the
             * corresponding skill if available.
             */
            double collaborativeScore =
                    collaborativeScores.getOrDefault(
                            normalizedSkill,
                            0.0
                    );


            Recommendation recommendation =
                    new Recommendation();


            recommendation.setUserId(
                    user.getId()
            );


            recommendation.setItemType(
                    "RESOURCE"
            );


            /*
             * itemId = URL
             *
             * Frontend will open this URL.
             */
            recommendation.setItemId(
                    resourceUrl
            );


            recommendation.setItemName(
                    "Learn "
                            + cleanSkill
            );


            recommendation.setContentScore(
                    contentScore
            );


            recommendation.setCollaborativeScore(
                    roundScore(
                            collaborativeScore
                    )
            );


            recommendation.setHybridScore(
                    calculateHybridScore(
                            contentScore,
                            collaborativeScore
                    )
            );


            recommendation.setReason(
                    "Recommended resource to help you improve "
                            + cleanSkill
                            + ", which is part of your current skill gap."
            );


            recommendations.add(
                    recommendation
            );
        }


        return recommendations;
    }


    // =========================================================
    // RESOURCE URL
    // =========================================================

    private String getResourceUrl(
            String skill
    ) {

        if (skill == null) {

            return null;
        }


        String normalizedSkill =
                skill.trim().toLowerCase();


        switch (normalizedSkill) {

            case "java":

                return "https://dev.java/learn/";


            case "python":

                return "https://docs.python.org/3/tutorial/";


            case "javascript":

                return "https://developer.mozilla.org/en-US/docs/Web/JavaScript";


            case "react":

                return "https://react.dev/learn";


            case "html":

                return "https://developer.mozilla.org/en-US/docs/Learn/HTML";


            case "css":

                return "https://developer.mozilla.org/en-US/docs/Learn/CSS";


            case "spring boot":

                return "https://spring.io/guides";


            case "hibernate":

                return "https://hibernate.org/orm/documentation/";


            case "rest api":

                return "https://developer.mozilla.org/en-US/docs/Glossary/REST";


            case "api integration":

                return "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Network_requests";


            case "mongodb":

                return "https://www.mongodb.com/docs/manual/tutorial/";


            case "mysql":

                return "https://dev.mysql.com/doc/mysql-tutorial-excerpt/8.0/en/";


            case "sql":

                return "https://www.w3schools.com/sql/";


            case "oop":

                return "https://docs.oracle.com/javase/tutorial/java/concepts/";


            case "machine learning":

                return "https://developers.google.com/machine-learning/crash-course";


            case "artificial intelligence":

                return "https://www.ibm.com/think/topics/artificial-intelligence";


            case "data science":

                return "https://www.ibm.com/think/topics/data-science";


            case "statistics":

                return "https://www.khanacademy.org/math/statistics-probability";


            case "pandas":

                return "https://pandas.pydata.org/docs/getting_started/intro_tutorials/";


            case "numpy":

                return "https://numpy.org/learn/";


            case "data visualization":

                return "https://www.tableau.com/learn/training";


            case "cloud computing":

                return "https://aws.amazon.com/training/cloud-practitioner/";


            case "aws":

                return "https://aws.amazon.com/training/";


            case "ui design":

                return "https://www.figma.com/resource-library/";


            case "ux research":

                return "https://www.nngroup.com/articles/";


            case "wireframing":

                return "https://www.figma.com/resource-library/wireframing-guide/";


            case "figma":

                return "https://help.figma.com/hc/en-us";


            case "prototyping":

                return "https://www.figma.com/resource-library/";


            case "design thinking":

                return "https://www.ideou.com/pages/design-thinking";


            case "cyber security":

                return "https://www.cisa.gov/topics/cybersecurity-best-practices";


            case "networking":

                return "https://www.cisco.com/c/en/us/training-events/training-certifications/training.html";


            case "ethical hacking":

                return "https://www.coursera.org/articles/ethical-hacking";


            case "linux":

                return "https://linuxjourney.com/";


            case "git":

                return "https://git-scm.com/doc";


            case "github":

                return "https://docs.github.com/en/get-started";


            case "excel":

                return "https://support.microsoft.com/en-us/excel";


            case "power bi":

                return "https://learn.microsoft.com/en-us/training/powerplatform/power-bi/";


            default:

                /*
                 * Generic fallback.
                 *
                 * This guarantees that a missing skill
                 * can still have a resource.
                 */
                return "https://www.google.com/search?q="
                        + skill.replace(
                                " ",
                                "+"
                        )
                        + "+tutorial";
        }
    }


    // =========================================================
    // COLLABORATIVE FILTERING
    // =========================================================

    private Map<String, Double> calculateCollaborativeScores(
            User currentUser
    ) {

        Map<String, Double> collaborativeScores =
                new HashMap<>();


        if (currentUser == null
                || currentUser.getId() == null) {

            return collaborativeScores;
        }


        List<MentorBooking> currentUserBookings =
                mentorBookingRepository.findByStudentId(
                        currentUser.getId()
                );


        List<Feedback> currentUserFeedback =
                feedbackRepository.findByStudentId(
                        currentUser.getId()
                );


        Set<String> currentUserInteractions =
                buildInteractionSet(
                        currentUserBookings,
                        currentUserFeedback
                );


        /*
         * No activity means no collaborative signal.
         */
        if (currentUserInteractions.isEmpty()) {

            return collaborativeScores;
        }


        List<MentorBooking> allBookings =
                mentorBookingRepository.findAll();


        List<Feedback> allFeedback =
                feedbackRepository.findAll();


        Map<String, List<MentorBooking>> bookingsByStudent =
                new HashMap<>();


        if (allBookings != null) {

            for (MentorBooking booking :
                    allBookings) {

                if (booking == null
                        || booking.getStudentId() == null
                        || booking.getStudentId()
                        .trim()
                        .isEmpty()) {

                    continue;
                }


                bookingsByStudent
                        .computeIfAbsent(
                                booking.getStudentId(),
                                key -> new ArrayList<>()
                        )
                        .add(booking);
            }
        }


        Map<String, List<Feedback>> feedbackByStudent =
                new HashMap<>();


        if (allFeedback != null) {

            for (Feedback feedback :
                    allFeedback) {

                if (feedback == null
                        || feedback.getStudentId() == null
                        || feedback.getStudentId()
                        .trim()
                        .isEmpty()) {

                    continue;
                }


                feedbackByStudent
                        .computeIfAbsent(
                                feedback.getStudentId(),
                                key -> new ArrayList<>()
                        )
                        .add(feedback);
            }
        }


        Set<String> allStudentIds =
                new HashSet<>();


        allStudentIds.addAll(
                bookingsByStudent.keySet()
        );


        allStudentIds.addAll(
                feedbackByStudent.keySet()
        );


        Map<String, Double> weightedSkillScores =
                new HashMap<>();


        double totalSimilarity = 0.0;


        for (String otherUserId :
                allStudentIds) {

            if (otherUserId.equals(
                    currentUser.getId()
            )) {

                continue;
            }


            List<MentorBooking> otherUserBookings =
                    bookingsByStudent.getOrDefault(
                            otherUserId,
                            new ArrayList<>()
                    );


            List<Feedback> otherUserFeedback =
                    feedbackByStudent.getOrDefault(
                            otherUserId,
                            new ArrayList<>()
                    );


            Set<String> otherUserInteractions =
                    buildInteractionSet(
                            otherUserBookings,
                            otherUserFeedback
                    );


            double similarity =
                    calculateJaccardSimilarity(
                            currentUserInteractions,
                            otherUserInteractions
                    );


            if (similarity < MINIMUM_SIMILARITY) {

                continue;
            }


            User similarUser =
                    mongoTemplate.findById(
                            otherUserId,
                            User.class
                    );


            if (similarUser == null) {

                continue;
            }


            Set<String> similarUserSkills =
                    convertToLowercaseSet(
                            similarUser.getSkills()
                    );


            Set<String> similarUserInterests =
                    convertToLowercaseSet(
                            similarUser.getInterests()
                    );


            Set<String> similarUserGoals =
                    convertToLowercaseSet(
                            similarUser.getLearningGoals()
                    );


            Set<String> bookedSkills =
                    extractBookedSkills(
                            otherUserBookings
                    );


            Set<String> similarUserProfile =
                    new HashSet<>();


            similarUserProfile.addAll(
                    similarUserSkills
            );


            similarUserProfile.addAll(
                    similarUserInterests
            );


            similarUserProfile.addAll(
                    similarUserGoals
            );


            similarUserProfile.addAll(
                    bookedSkills
            );


            for (String skill :
                    availableSkills) {

                String normalizedSkill =
                        skill.trim().toLowerCase();


                if (userHasSkill(
                        currentUser,
                        normalizedSkill
                )) {

                    continue;
                }


                if (similarUserProfile.contains(
                        normalizedSkill
                )) {

                    double existingScore =
                            weightedSkillScores
                                    .getOrDefault(
                                            normalizedSkill,
                                            0.0
                                    );


                    weightedSkillScores.put(
                            normalizedSkill,
                            existingScore
                                    + similarity
                    );
                }
            }


            totalSimilarity += similarity;
        }


        if (totalSimilarity <= 0.0) {

            return collaborativeScores;
        }


        for (Map.Entry<String, Double> entry :
                weightedSkillScores.entrySet()) {

            double normalizedScore =
                    (
                            entry.getValue()
                                    /
                            totalSimilarity
                    ) * 100.0;


            collaborativeScores.put(
                    entry.getKey(),
                    Math.min(
                            normalizedScore,
                            100.0
                    )
            );
        }


        return collaborativeScores;
    }


    // =========================================================
    // BUILD USER INTERACTION SET
    // =========================================================

    private Set<String> buildInteractionSet(
            List<MentorBooking> bookingList,
            List<Feedback> feedbackList
    ) {

        Set<String> interactions =
                new HashSet<>();


        if (bookingList != null) {

            for (MentorBooking booking :
                    bookingList) {

                if (booking == null) {

                    continue;
                }


                String status =
                        booking.getStatus();


                if (status == null
                        || (
                        !status.equalsIgnoreCase(
                                "APPROVED"
                        )
                                &&
                        !status.equalsIgnoreCase(
                                "COMPLETED"
                        )
                )) {

                    continue;
                }


                if (booking.getMentorId() != null
                        && !booking.getMentorId()
                        .trim()
                        .isEmpty()) {

                    interactions.add(
                            "MENTOR:"
                                    + booking.getMentorId()
                                    .trim()
                    );
                }


                if (booking.getSessionId() != null
                        && !booking.getSessionId()
                        .trim()
                        .isEmpty()) {

                    interactions.add(
                            "SESSION:"
                                    + booking.getSessionId()
                                    .trim()
                    );
                }


                if (booking.getSkill() != null
                        && !booking.getSkill()
                        .trim()
                        .isEmpty()) {

                    interactions.add(
                            "SKILL:"
                                    + booking.getSkill()
                                    .trim()
                                    .toLowerCase()
                    );
                }
            }
        }


        if (feedbackList != null) {

            for (Feedback feedback :
                    feedbackList) {

                if (feedback == null) {

                    continue;
                }


                if (feedback.getMentorId() != null
                        && !feedback.getMentorId()
                        .trim()
                        .isEmpty()) {

                    interactions.add(
                            "MENTOR:"
                                    + feedback.getMentorId()
                                    .trim()
                    );
                }


                if (feedback.getSessionId() != null
                        && !feedback.getSessionId()
                        .trim()
                        .isEmpty()) {

                    interactions.add(
                            "SESSION:"
                                    + feedback.getSessionId()
                                    .trim()
                    );
                }
            }
        }


        return interactions;
    }


    // =========================================================
    // EXTRACT BOOKED SKILLS
    // =========================================================

    private Set<String> extractBookedSkills(
            List<MentorBooking> bookings
    ) {

        Set<String> skills =
                new HashSet<>();


        if (bookings == null) {

            return skills;
        }


        for (MentorBooking booking :
                bookings) {

            if (booking == null) {

                continue;
            }


            String status =
                    booking.getStatus();


            if (status == null
                    || (
                    !status.equalsIgnoreCase(
                            "APPROVED"
                    )
                            &&
                    !status.equalsIgnoreCase(
                            "COMPLETED"
                    )
            )) {

                continue;
            }


            if (booking.getSkill() != null
                    && !booking.getSkill()
                    .trim()
                    .isEmpty()) {

                skills.add(
                        booking.getSkill()
                                .trim()
                                .toLowerCase()
                );
            }
        }


        return skills;
    }


    // =========================================================
    // JACCARD SIMILARITY
    // =========================================================

    private double calculateJaccardSimilarity(
            Set<String> firstSet,
            Set<String> secondSet
    ) {

        if (firstSet == null
                || secondSet == null
                || firstSet.isEmpty()
                || secondSet.isEmpty()) {

            return 0.0;
        }


        Set<String> intersection =
                new HashSet<>(
                        firstSet
                );


        intersection.retainAll(
                secondSet
        );


        Set<String> union =
                new HashSet<>(
                        firstSet
                );


        union.addAll(
                secondSet
        );


        if (union.isEmpty()) {

            return 0.0;
        }


        return (
                (double)
                        intersection.size()
                        /
                union.size()
        );
    }


    // =========================================================
    // CALCULATE CONTENT SCORE
    // =========================================================

    private double calculateContentScore(
            String skill,
            Set<String> userSkills,
            Set<String> userInterests,
            Set<String> learningGoals,
            Set<String> missingSkills
    ) {

        double score = 0.0;


        // -----------------------------------------------------
        // DIRECT SKILL GAP
        // -----------------------------------------------------

        if (missingSkills.contains(
                skill
        )) {

            score += SKILL_GAP_WEIGHT;
        }


        // -----------------------------------------------------
        // RELATED SKILL GAP
        // -----------------------------------------------------

        else if (isRelatedToSkillGap(
                skill,
                missingSkills
        )) {

            score += RELATED_GAP_WEIGHT;
        }


        // -----------------------------------------------------
        // INTEREST
        // -----------------------------------------------------

        if (isInterestRelated(
                skill,
                userInterests
        )) {

            score += INTEREST_WEIGHT;
        }


        // -----------------------------------------------------
        // LEARNING GOAL
        // -----------------------------------------------------

        if (userGoalsContainSkill(
                skill,
                learningGoals
        )) {

            score += GOAL_WEIGHT;
        }


        // -----------------------------------------------------
        // EXISTING RELATED SKILL
        // -----------------------------------------------------

        if (isRelatedSkill(
                skill,
                userSkills
        )) {

            score += RELATED_SKILL_WEIGHT;
        }


        return Math.min(
                score,
                100.0
        );
    }


    // =========================================================
    // CHECK SKILL GAP RELATIONSHIP
    // =========================================================

    private boolean isRelatedToSkillGap(
            String recommendedSkill,
            Set<String> missingSkills
    ) {

        if (missingSkills == null
                || missingSkills.isEmpty()) {

            return false;
        }


        for (String missingSkill :
                missingSkills) {

            if (missingSkill == null
                    || missingSkill.trim().isEmpty()) {

                continue;
            }


            if (areSkillsRelated(
                    recommendedSkill,
                    missingSkill
            )) {

                return true;
            }
        }


        return false;
    }


    // =========================================================
    // INTEREST RELATIONSHIP
    // =========================================================

    private boolean isInterestRelated(
            String recommendedSkill,
            Set<String> userInterests
    ) {

        if (userInterests == null
                || userInterests.isEmpty()) {

            return false;
        }


        for (String interest :
                userInterests) {

            if (interest == null
                    || interest.trim().isEmpty()) {

                continue;
            }


            String normalizedInterest =
                    interest.trim().toLowerCase();


            if (normalizedInterest.equals(
                    recommendedSkill
            )) {

                return true;
            }


            if (normalizedInterest.contains(
                    recommendedSkill
            )) {

                return true;
            }


            if (isCategoryRelated(
                    recommendedSkill,
                    normalizedInterest
            )) {

                return true;
            }
        }


        return false;
    }


    // =========================================================
    // EXISTING SKILL RELATIONSHIP
    // =========================================================

    private boolean isRelatedSkill(
            String recommendedSkill,
            Set<String> userSkills
    ) {

        if (userSkills == null
                || userSkills.isEmpty()) {

            return false;
        }


        for (String userSkill :
                userSkills) {

            if (userSkill == null
                    || userSkill.trim().isEmpty()) {

                continue;
            }


            if (areSkillsRelated(
                    recommendedSkill,
                    userSkill
            )) {

                return true;
            }
        }


        return false;
    }


    // =========================================================
    // SKILL RELATIONSHIP
    // =========================================================

    private boolean areSkillsRelated(
            String first,
            String second
    ) {

        if (first == null
                || second == null) {

            return false;
        }


        String skill1 =
                first.trim().toLowerCase();

        String skill2 =
                second.trim().toLowerCase();


        if (skill1.equals(
                skill2
        )) {

            return true;
        }


        Map<String, List<String>> relationships =
                buildSkillRelationshipMap();


        List<String> firstRelated =
                relationships.get(
                        skill1
                );


        if (firstRelated != null
                && firstRelated.contains(
                skill2
        )) {

            return true;
        }


        List<String> secondRelated =
                relationships.get(
                        skill2
                );


        if (secondRelated != null
                && secondRelated.contains(
                skill1
        )) {

            return true;
        }


        return isCategoryRelated(
                skill1,
                skill2
        );
    }


    // =========================================================
    // SKILL RELATIONSHIP MAP
    // =========================================================

    private Map<String, List<String>>
    buildSkillRelationshipMap() {

        Map<String, List<String>> relationships =
                new HashMap<>();


        relationships.put(
                "web development",
                Arrays.asList(
                        "react",
                        "javascript",
                        "html",
                        "css"
                )
        );


        relationships.put(
                "frontend development",
                Arrays.asList(
                        "react",
                        "javascript",
                        "html",
                        "css"
                )
        );


        relationships.put(
                "front end",
                Arrays.asList(
                        "react",
                        "javascript",
                        "html",
                        "css"
                )
        );


        relationships.put(
                "backend development",
                Arrays.asList(
                        "java",
                        "spring boot",
                        "mongodb",
                        "sql"
                )
        );


        relationships.put(
                "back end",
                Arrays.asList(
                        "java",
                        "spring boot",
                        "mongodb",
                        "sql"
                )
        );


        relationships.put(
                "full stack development",
                Arrays.asList(
                        "java",
                        "spring boot",
                        "javascript",
                        "react",
                        "html",
                        "css",
                        "mongodb",
                        "sql"
                )
        );


        relationships.put(
                "full stack",
                Arrays.asList(
                        "java",
                        "spring boot",
                        "javascript",
                        "react",
                        "html",
                        "css",
                        "mongodb",
                        "sql"
                )
        );


        relationships.put(
                "java development",
                Arrays.asList(
                        "java",
                        "spring boot",
                        "hibernate",
                        "rest api",
                        "oop"
                )
        );


        relationships.put(
                "java",
                Arrays.asList(
                        "spring boot",
                        "hibernate",
                        "rest api",
                        "oop"
                )
        );


        relationships.put(
                "python development",
                Arrays.asList(
                        "python",
                        "machine learning",
                        "data science",
                        "artificial intelligence"
                )
        );


        relationships.put(
                "python",
                Arrays.asList(
                        "machine learning",
                        "data science",
                        "artificial intelligence",
                        "pandas",
                        "numpy"
                )
        );


        relationships.put(
                "data science",
                Arrays.asList(
                        "python",
                        "sql",
                        "machine learning",
                        "statistics",
                        "pandas",
                        "numpy",
                        "data visualization"
                )
        );


        relationships.put(
                "machine learning",
                Arrays.asList(
                        "python",
                        "data science",
                        "artificial intelligence",
                        "statistics",
                        "pandas",
                        "numpy",
                        "data visualization"
                )
        );


        relationships.put(
                "artificial intelligence",
                Arrays.asList(
                        "python",
                        "machine learning",
                        "data science"
                )
        );


        relationships.put(
                "ai",
                Arrays.asList(
                        "python",
                        "machine learning",
                        "data science",
                        "artificial intelligence"
                )
        );


        relationships.put(
                "data analysis",
                Arrays.asList(
                        "python",
                        "sql",
                        "excel",
                        "power bi",
                        "statistics",
                        "data visualization"
                )
        );


        relationships.put(
                "data analyst",
                Arrays.asList(
                        "python",
                        "sql",
                        "excel",
                        "power bi",
                        "statistics",
                        "data visualization"
                )
        );


        relationships.put(
                "cloud",
                Arrays.asList(
                        "aws",
                        "cloud computing"
                )
        );


        relationships.put(
                "cloud computing",
                Arrays.asList(
                        "aws"
                )
        );


        relationships.put(
                "aws",
                Arrays.asList(
                        "cloud",
                        "cloud computing"
                )
        );


        relationships.put(
                "database",
                Arrays.asList(
                        "mongodb",
                        "mysql",
                        "sql"
                )
        );


        relationships.put(
                "database management",
                Arrays.asList(
                        "mongodb",
                        "mysql",
                        "sql"
                )
        );


        relationships.put(
                "cyber security",
                Arrays.asList(
                        "networking",
                        "ethical hacking",
                        "cryptography",
                        "security tools",
                        "linux"
                )
        );


        relationships.put(
                "ui/ux",
                Arrays.asList(
                        "ui/ux design",
                        "ui design",
                        "ux research",
                        "wireframing",
                        "figma",
                        "prototyping"
                )
        );


        relationships.put(
                "ui/ux design",
                Arrays.asList(
                        "ui design",
                        "ux research",
                        "wireframing",
                        "figma",
                        "prototyping",
                        "design thinking"
                )
        );


        relationships.put(
                "ui design",
                Arrays.asList(
                        "ui/ux design",
                        "figma",
                        "wireframing",
                        "prototyping"
                )
        );


        relationships.put(
                "ux design",
                Arrays.asList(
                        "ui/ux design",
                        "ux research",
                        "wireframing",
                        "prototyping"
                )
        );


        relationships.put(
                "version control",
                Arrays.asList(
                        "git",
                        "github"
                )
        );


        relationships.put(
                "git",
                Arrays.asList(
                        "github",
                        "version control"
                )
        );


        relationships.put(
                "github",
                Arrays.asList(
                        "git",
                        "version control"
                )
        );


        return relationships;
    }


    // =========================================================
    // CATEGORY RELATIONSHIP
    // =========================================================

    private boolean isCategoryRelated(
            String recommendedSkill,
            String category
    ) {

        if (recommendedSkill == null
                || category == null) {

            return false;
        }


        String skill =
                recommendedSkill.trim().toLowerCase();


        String normalizedCategory =
                category.trim().toLowerCase();


        Map<String, List<String>> relationships =
                buildSkillRelationshipMap();


        List<String> relatedSkills =
                relationships.get(
                        normalizedCategory
                );


        if (relatedSkills != null
                && relatedSkills.contains(
                skill
        )) {

            return true;
        }


        List<String> skillRelations =
                relationships.get(
                        skill
                );


        if (skillRelations != null
                && skillRelations.contains(
                normalizedCategory
        )) {

            return true;
        }


        return false;
    }


    // =========================================================
    // LEARNING GOAL MATCH
    // =========================================================

    private boolean userGoalsContainSkill(
            String skill,
            Set<String> learningGoals
    ) {

        if (learningGoals == null
                || learningGoals.isEmpty()) {

            return false;
        }


        for (String goal :
                learningGoals) {

            if (goal == null
                    || goal.trim().isEmpty()) {

                continue;
            }


            String normalizedGoal =
                    goal.trim().toLowerCase();


            if (normalizedGoal.contains(
                    skill
            )
                    || skill.contains(
                    normalizedGoal
            )) {

                return true;
            }


            if (isCategoryRelated(
                    skill,
                    normalizedGoal
            )) {

                return true;
            }
        }


        return false;
    }


    // =========================================================
    // GENERATE REASON
    // =========================================================

    private String generateReason(
            String skill,
            Set<String> userSkills,
            Set<String> userInterests,
            Set<String> learningGoals,
            Set<String> missingSkills,
            double collaborativeScore,
            String targetRole
    ) {

        boolean directGap =
                missingSkills.contains(
                        skill
                );


        boolean relatedGap =
                isRelatedToSkillGap(
                        skill,
                        missingSkills
                );


        boolean interestMatch =
                isInterestRelated(
                        skill,
                        userInterests
                );


        boolean goalMatch =
                userGoalsContainSkill(
                        skill,
                        learningGoals
                );


        boolean relatedSkillMatch =
                isRelatedSkill(
                        skill,
                        userSkills
                );


        if (directGap
                && collaborativeScore > 0) {

            return "Recommended because it is a skill gap for your "
                    + targetRole
                    + " goal and is also associated with learners with similar learning activity.";
        }


        if (directGap) {

            return "Recommended because it is one of the skills missing from your "
                    + targetRole
                    + " skill profile.";
        }


        if (relatedGap
                && collaborativeScore > 0) {

            return "Recommended because it is related to a skill gap in your "
                    + targetRole
                    + " learning path and is associated with similar learners.";
        }


        if (relatedGap) {

            return "Recommended because it is related to one of the skills you need to improve for your "
                    + targetRole
                    + " learning path.";
        }


        if (collaborativeScore > 0
                && interestMatch) {

            return "Recommended because it matches your interests and is associated with learners with similar learning activity.";
        }


        if (collaborativeScore > 0
                && goalMatch) {

            return "Recommended because it matches your learning goals and is associated with learners with similar learning activity.";
        }


        if (collaborativeScore > 0
                && relatedSkillMatch) {

            return "Recommended because it builds on your existing skills and is associated with learners with similar learning activity.";
        }


        if (collaborativeScore > 0) {

            return "Recommended based on learning activity from similar learners.";
        }


        if (interestMatch) {

            return "Recommended because it matches your interests.";
        }


        if (goalMatch) {

            return "Recommended because it matches your learning goals.";
        }


        if (relatedSkillMatch) {

            return "Recommended because it builds on your existing skills.";
        }


        return "Recommended based on your skill profile.";
    }


    // =========================================================
    // HYBRID SCORE
    // =========================================================

    public double calculateHybridScore(
            double contentScore,
            double collaborativeScore
    ) {

        contentScore =
                Math.max(
                        0.0,
                        Math.min(
                                contentScore,
                                100.0
                        )
                );


        collaborativeScore =
                Math.max(
                        0.0,
                        Math.min(
                                collaborativeScore,
                                100.0
                        )
                );


        double hybridScore =
                (
                        contentScore
                                * CONTENT_WEIGHT
                )
                        +
                (
                        collaborativeScore
                                * COLLABORATIVE_WEIGHT
                );


        return roundScore(
                Math.min(
                        hybridScore,
                        100.0
                )
        );
    }


    // =========================================================
    // SAVE RECOMMENDATION
    // =========================================================

    public Recommendation saveRecommendation(
            Recommendation recommendation
    ) {

        return recommendationRepository.save(
                recommendation
        );
    }


    // =========================================================
    // GET USER RECOMMENDATIONS
    // =========================================================

    public List<Recommendation> getUserRecommendations(
            String userId
    ) {

        if (userId == null
                || userId.trim().isEmpty()) {

            return new ArrayList<>();
        }


        return recommendationRepository
                .findByUserIdOrderByHybridScoreDesc(
                        userId
                );
    }


    // =========================================================
    // DELETE USER RECOMMENDATIONS
    // =========================================================

    public void deleteUserRecommendations(
            String userId
    ) {

        if (userId == null
                || userId.trim().isEmpty()) {

            return;
        }


        recommendationRepository.deleteByUserId(
                userId
        );
    }


    // =========================================================
    // GENERATE AND SAVE RECOMMENDATIONS
    // =========================================================

    public List<Recommendation> generateAndSaveRecommendations(
            User user,
            List<String> missingSkills,
            String targetRole
    ) {

        if (user == null
                || user.getId() == null
                || user.getId().trim().isEmpty()) {

            return new ArrayList<>();
        }


        if (missingSkills == null) {

            missingSkills =
                    new ArrayList<>();
        }


        if (targetRole == null) {

            targetRole = "";
        }


        /*
         * Delete old recommendations first.
         */
        deleteUserRecommendations(
                user.getId()
        );


        /*
         * Generate new recommendations.
         */
        List<Recommendation> recommendations =
                generateContentRecommendations(
                        user,
                        missingSkills,
                        targetRole
                );


        /*
         * Keep top 10 overall.
         *
         * Since we now have three types,
         * the top 10 can contain SKILL,
         * MENTOR and RESOURCE recommendations.
         */
        if (recommendations.size() > 10) {

            recommendations =
                    new ArrayList<>(
                            recommendations.subList(
                                    0,
                                    10
                            )
                    );
        }


        List<Recommendation> savedRecommendations =
                new ArrayList<>();


        for (Recommendation recommendation :
                recommendations) {

            Recommendation savedRecommendation =
                    saveRecommendation(
                            recommendation
                    );


            savedRecommendations.add(
                    savedRecommendation
            );
        }


        return savedRecommendations;
    }


    // =========================================================
    // CHECK USER SKILL
    // =========================================================

    private boolean userHasSkill(
            User user,
            String skill
    ) {

        if (user == null
                || skill == null) {

            return false;
        }


        return convertToLowercaseSet(
                user.getSkills()
        ).contains(
                skill
        );
    }


    // =========================================================
    // FORMAT SKILLS
    // =========================================================

    private String formatSkills(
            Set<String> skills
    ) {

        if (skills == null
                || skills.isEmpty()) {

            return "the required skills";
        }


        List<String> formattedSkills =
                new ArrayList<>();


        for (String skill : skills) {

            if (skill == null
                    || skill.trim().isEmpty()) {

                continue;
            }


            String formatted =
                    skill.substring(
                            0,
                            1
                    ).toUpperCase()
                    +
                    skill.substring(
                            1
                    );


            formattedSkills.add(
                    formatted
            );
        }


        return String.join(
                ", ",
                formattedSkills
        );
    }


    // =========================================================
    // CONVERT LIST TO LOWERCASE SET
    // =========================================================

    private Set<String> convertToLowercaseSet(
            List<String> values
    ) {

        Set<String> result =
                new HashSet<>();


        if (values == null) {

            return result;
        }


        for (String value : values) {

            if (value != null
                    && !value.trim().isEmpty()) {

                result.add(
                        value.trim().toLowerCase()
                );
            }
        }


        return result;
    }


    // =========================================================
    // ROUND SCORE
    // =========================================================

    private double roundScore(
            double score
    ) {

        return Math.round(
                score * 100.0
        ) / 100.0;
    }
}

