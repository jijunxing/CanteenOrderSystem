package com.example.mapper;

import com.example.entity.Cart;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

public interface CartMapper {
    
    void insert(Cart cart);

    void deleteById(Integer id);

    void updateById(Cart cart);

    @Select("select * from cart where id = #{id}")
    Cart selectById(Integer id);

    List<Cart> selectAll(String name);

    @Select("select * from cart where user_id = #{userId}")
    Cart selectByUserId(Integer userId);

}
