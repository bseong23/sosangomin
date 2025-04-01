package com.ssafy.sosangomin.api.file.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface FileMapper {

    @Select("SELECT user_id FROM stores WHERE store_id = #{storeId}")
    Long findUserIdByStoreId(@Param("storeId") Long storeId);
}
