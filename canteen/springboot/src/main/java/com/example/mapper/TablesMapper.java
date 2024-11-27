package com.example.mapper;

import com.example.entity.Tables;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

public interface TablesMapper {
    
    void insert(Tables tables);

    void deleteById(Integer id);

    void updateById(Tables tables);

    @Select("select * from tables where id = #{id}")
    Tables selectById(Integer id);

    List<Tables> selectAll(String no);

    @Select("select * from tables where user_id = #{userId}")
    Tables selectByUserId(Integer userId);

    @Update("update tables set user_id = null, free = '是' where id= #{id}")
    void removeOrder(Integer id);

}
