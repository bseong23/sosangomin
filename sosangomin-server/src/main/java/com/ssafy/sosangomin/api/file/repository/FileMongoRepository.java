package com.ssafy.sosangomin.api.file.repository;

import com.ssafy.sosangomin.api.file.domain.entity.DataSource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileMongoRepository extends MongoRepository<DataSource, String> {
}
