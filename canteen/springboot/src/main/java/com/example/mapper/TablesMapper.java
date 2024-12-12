package com.example.mapper;

import com.example.entity.FoodsType;
import com.example.entity.Tables;
import com.example.entity.TablesUnit;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

public interface TablesMapper {
    
    void insert(Tables tables);

    void deleteById(Integer id);

    void updateById(Tables tables);

    @Select("select * from tables where id = #{id}")
    Tables selectById(Integer id);

    List<Tables> selectAll(String no, String unit);

    @Select("select * from tables where user_id = #{userId}")
    Tables selectByUserId(Integer userId);

    @Update("update tables set user_id = null, free = '是' where id= #{id}")
    void removeOrder(Integer id);

    @Select("select * from unit order by unit")
    List<TablesUnit> getUnit();

    @Delete("delete from unit where id = #{id}")
    void deleteUnit(Integer id);

    @Insert("insert into unit (unit) values (#{unit})")
    void addUnit(TablesUnit unit);
}
