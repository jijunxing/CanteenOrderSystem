package com.example.mapper;

import com.example.entity.Orders;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.math.BigDecimal;
import java.util.List;

public interface OrdersMapper {
    
    void insert(Orders orders);

    void deleteById(Integer id);

    void updateById(Orders orders);

    @Select("select * from orders where id = #{id}")
    Orders selectById(Integer id);

    List<Orders> selectAll(String name, String status);

    @Select("select * from orders where user_id = #{userId}")
    Orders selectByUserId(Integer userId);

    Integer getNumByDate(String date);

    Integer getUnfinishedNum();

    BigDecimal getIncomeByDate(String date);
}
