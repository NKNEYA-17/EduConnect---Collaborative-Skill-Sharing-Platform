package com.educonnect.repository;

import com.educonnect.model.TestUser;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TestUserRepository extends MongoRepository<TestUser, String> {

}