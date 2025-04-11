package com.ssafy.sosangomin.api.news.controller;

import com.ssafy.sosangomin.api.news.docs.NewsSwagger;
import com.ssafy.sosangomin.api.news.domain.dto.response.NewsResponseDto;
import com.ssafy.sosangomin.api.news.domain.dto.response.PageCountResponseDto;
import com.ssafy.sosangomin.api.news.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController implements NewsSwagger {

    private final NewsService newsService;

    @GetMapping("/page/{pageNum}")
    public ResponseEntity<List<NewsResponseDto>> getNews(
            @PathVariable int pageNum,
            @RequestParam(required = true) String category) {

        if (category.equals("all")) {
            return ResponseEntity.ok().body(newsService.getAllNewsByPageNum(pageNum));
        }

        return ResponseEntity.ok().body(newsService.getCategoryNewsByPageNum(pageNum, category));
    }

    @GetMapping("/page_count")
    public ResponseEntity<PageCountResponseDto> getPageCount(
            @RequestParam(required = true) String category
    ) {
        if (category.equals("all")) {
            return ResponseEntity.ok().body(newsService.getAllNewsPageCount());
        }

        return ResponseEntity.ok().body(newsService.getCategoryNewsPageCount(category));
    }

}
