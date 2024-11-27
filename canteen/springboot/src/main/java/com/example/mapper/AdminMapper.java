package com.example.mapper;

import com.example.entity.Admin;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface AdminMapper {

    @Select("select * from admin where username = #{username}")
    Admin selectByUsername(String username);


    void insert(Admin admin);

    void deleteById(Integer id);

    void updateById(Admin admin);

    @Select("select * from admin where id = #{id}")
    Admin selectById(Integer id);

    List<Admin> selectAll(String name);
}
