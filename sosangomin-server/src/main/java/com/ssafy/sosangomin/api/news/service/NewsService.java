package com.ssafy.sosangomin.api.news.service;

import com.ssafy.sosangomin.api.news.domain.dto.response.NewsResponseDto;
import com.ssafy.sosangomin.api.news.domain.dto.response.PageCountResponseDto;
import com.ssafy.sosangomin.api.news.domain.entity.News;
import com.ssafy.sosangomin.api.news.mapper.NewsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NewsService {

    private final NewsMapper newsMapper;

    public List<NewsResponseDto> getAllNewsByPageNum(int pageNum) {
        int offset = (pageNum - 1) * 8;
        List<News> newsList = newsMapper.findAllNewsByPageNum(offset);

        List<NewsResponseDto> result = new ArrayList<>();
        for (News news : newsList) {
            result.add(NewsResponseDto.of(news));
        }
        return result;
    }

    public PageCountResponseDto getAllNewsPageCount() {
        return new PageCountResponseDto(newsMapper.getAllNewsPageCount());
    }

    public List<NewsResponseDto> getCategoryNewsByPageNum(int pageNum, String category) {
        int offset = (pageNum - 1) * 8;
        List<News> newsList = newsMapper.findCategoryNewsByPageNum(offset, category);

        List<NewsResponseDto> result = new ArrayList<>();
        for (News news : newsList) {
            result.add(NewsResponseDto.of(news));
        }
        return result;
    }

    public PageCountResponseDto getCategoryNewsPageCount(String category) {
        return new PageCountResponseDto(newsMapper.getCategoryNewsPageCount(category));
    }
}
