package com.example.mapper;

import com.example.entity.Admin;
import com.example.entity.User;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface UserMapper {

    @Select("select * from user where username = #{username}")
    User selectByUsername(String username);

    void insert(User user);

    void deleteById(Integer id);

    void updateById(User user);

    @Select("select * from user where id = #{id}")
    User selectById(Integer id);

    List<User> selectAll(String name);
}
