package com.example.controller;

import com.example.common.Result;
import com.example.entity.Foods;
import com.example.service.FoodsService;
import com.github.pagehelper.PageInfo;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/foods")
public class FoodsController {

    @Resource
    FoodsService foodsService;
    /*新增接口*/
    @PostMapping("/add")
    public Result add(@RequestBody Foods foods){
        foodsService.add(foods);
        return Result.success();
    }

    /*删除*/
    @DeleteMapping("/delete/{id}")
    public Result delete(@PathVariable Integer id){
        foodsService.deleteById(id);
        return Result.success();
    }

    /*批量删除*/
    @DeleteMapping("/delete/batch")
    public Result delete(@RequestBody List<Integer> ids){
        foodsService.deleteBatch(ids);
        return Result.success();
    }

    /*修改*/
    @PutMapping("/update")
    public Result update(@RequestBody Foods foods){
        foodsService.updateById(foods);
        return Result.success();
    }


    /*单个查询*/
    @GetMapping("/selectById/{id}")
    public Result selectById(@PathVariable Integer id){
        Foods foods =foodsService.selectById(id);
        return Result.success(foods);
    }


    /*全部查询*/
    @GetMapping("/selectAll")
    public Result selectAll(String name){
        List<Foods> list =foodsService.selectAll(name);
        return Result.success(list);
    }

    /*分页查询*/
    @GetMapping("/selectPage")
    public Result selectPage(
            String name,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize){
        PageInfo<Foods> pageInfo=foodsService.selectPage(name,pageNum,pageSize);
        return Result.success(pageInfo);
    }
}
