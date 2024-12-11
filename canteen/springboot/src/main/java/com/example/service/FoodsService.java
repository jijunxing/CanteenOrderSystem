package com.example.service;

import com.example.entity.Foods;
import com.example.entity.FoodsType;
import com.example.mapper.FoodsMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodsService {

    @Resource
    FoodsMapper foodsMapper;

    public void add(Foods foods) {
//        Foods dbFoods = foodsMapper.selectByFoodsNo(foods.getNo());
//        if(dbFoods != null) {
//            throw new CustomException("餐桌已存在");
//        }
        foodsMapper.insert(foods);
    }

    public void deleteById(Integer id) {
        foodsMapper.deleteById(id);
    }

    public void deleteBatch(List<Integer> ids) {
        for (Integer id : ids) {
            this.deleteById(id);
        }
    }

    public void updateById(Foods foods) {
        foodsMapper.updateById(foods);
    }

    public Foods selectById(Integer id) {
        return foodsMapper.selectById(id);
    }

    public List<Foods> selectAll(String name, String type) {
        return foodsMapper.selectAll(name,type);
    }

    public PageInfo<Foods> selectPage(String name, String type, Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<Foods> list=this.selectAll(name,type);
        return PageInfo.of(list);
    }

    public void addType(FoodsType type) {
        foodsMapper.insertType(type);
    }

    public List<FoodsType> getType() {
        return foodsMapper.getType();
    }

    public void deleteType(Integer id) {
        foodsMapper.deleteType(id);
    }
}
