package com.example.mapper;

import com.example.entity.Foods;
import com.example.entity.FoodsType;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

public interface FoodsMapper {
    
    void insert(Foods foods);

    void deleteById(Integer id);

    void updateById(Foods foods);

    @Select("select * from foods where id = #{id}")
    Foods selectById(Integer id);

    List<Foods> selectAll(String name, String type);

    @Select("select * from foods where user_id = #{userId}")
    Foods selectByUserId(Integer userId);

    @Insert("insert into type (type) values (#{type})")
    void insertType(FoodsType type);

    @Select("select * from type")
    List<FoodsType> getType();

    @Delete("delete from type where id = #{id}")
    void deleteType(Integer id);
}
