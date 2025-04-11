package com.ssafy.sosangomin.api.file.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Getter
@Document(collection = "DataSources")
@NoArgsConstructor
public class DataSource {
    @Id
    private String id;

    @Field("store_id")
    private Long storeId;

    @Field("source_name")
    private String sourceName;

    @Field("original_filename")
    private String originalFilename;

    @Field("file_path")
    private String filePath;

    @Field("file_size")
    private Long fileSize;

    @Field("file_type")
    private String fileType;

    @Field("content_type")
    private String contentType;

    @Field("upload_date")
    private LocalDateTime uploadDate;

    @Field("status")
    private String status;

    @Field("date_range")
    private DateRange dateRange;

    @Field("last_accessed")
    private LocalDateTime lastAccessed;

    @Builder
    public DataSource(Long storeId, String sourceName, String originalFilename,
                      String filePath, Long fileSize, String fileType, String contentType,
                      LocalDateTime uploadDate, String status, String startMonth, String endMonth, LocalDateTime lastAccessed) {
        this.storeId = storeId;
        this.sourceName = sourceName;
        this.originalFilename = originalFilename;
        this.filePath = filePath;
        this.fileSize = fileSize;
        this.fileType = fileType;
        this.contentType = contentType;
        this.uploadDate = uploadDate;
        this.status = status;
        this.dateRange = new DateRange(startMonth, endMonth);
        this.lastAccessed = lastAccessed;
    }

    @AllArgsConstructor
    private static class DateRange {
        @Field("start_month")
        private String startMonth;
        @Field("end_month")
        private String endMonth;
    }
}
