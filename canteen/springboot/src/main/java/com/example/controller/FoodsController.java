package com.example.controller;

import com.example.common.Result;
import com.example.entity.Foods;
import com.example.entity.FoodsType;
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
    public Result selectAll(String name, String type){
        if(name==""){name=null;}
        if(type==""){type=null;}
        List<Foods> list =foodsService.selectAll(name,type);
        return Result.success(list);
    }

    /*分页查询*/
    @GetMapping("/selectPage")
    public Result selectPage(
            String name,
            String type,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize){
        if(name==""){name=null;}
        if(type==""){type=null;}
        PageInfo<Foods> pageInfo=foodsService.selectPage(name,type,pageNum,pageSize);
        return Result.success(pageInfo);
    }

    @PostMapping("/addType")
    public Result addType(@RequestBody FoodsType type){
        foodsService.addType(type);
        return Result.success();
    }

    @GetMapping("/getType")
    public Result getType(){
        List<FoodsType> type = foodsService.getType();
        return Result.success(type);
    }

    @DeleteMapping("/deleteType/{id}")
    public Result deleteType(@PathVariable Integer id){
        foodsService.deleteType(id);
        return Result.success();
    }
}
