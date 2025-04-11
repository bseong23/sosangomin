package com.ssafy.sosangomin.api.news.mapper;

import com.ssafy.sosangomin.api.news.domain.entity.News;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;

@Mapper
public interface NewsMapper {

    @Results({
            @Result(property = "newsId", column = "news_id"),
            @Result(property = "pubDate", column = "pub_date"),
            @Result(property = "imageUrl", column = "image_url"),
            @Result(property = "likesCount", column = "likes_count"),
            @Result(property = "commentsCount", column = "commnets_count")
    })
    @Select(
            "SELECT * " +
            "FROM news " +
            "ORDER BY news_id DESC " +
            "LIMIT 8 " +
            "OFFSET ${offset}"
    )
    List<News> findAllNewsByPageNum(@Param("offset") int offset);

    @Select(
            "SELECT " +
            "CEIL(COUNT(*) / 8.0) " +
            "AS total_pages " +
            "FROM news"
    )
    int getAllNewsPageCount();

    @Results({
            @Result(property = "newsId", column = "news_id"),
            @Result(property = "pubDate", column = "pub_date"),
            @Result(property = "imageUrl", column = "image_url"),
            @Result(property = "likesCount", column = "likes_count"),
            @Result(property = "commentsCount", column = "commnets_count")
    })
    @Select(
            "SELECT * " +
                    "FROM news " +
                    "WHERE category = #{category} " +
                    "ORDER BY news_id DESC " +
                    "LIMIT 8 " +
                    "OFFSET #{offset}"
    )
    List<News> findCategoryNewsByPageNum(
            @Param("offset") int offset,
            @Param("category") String category
    );

    @Select(
            "SELECT " +
            "CEIL(COUNT(*) / 8.0) " +
            "AS total_pages " +
            "FROM news " +
            "WHERE category = #{category}"
    )
    int getCategoryNewsPageCount(
            @Param("category") String category
    );
}
