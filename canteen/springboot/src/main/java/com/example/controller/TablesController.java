package com.example.controller;

import com.example.common.Result;
import com.example.entity.FoodsType;
import com.example.entity.Tables;
import com.example.entity.TablesUnit;
import com.example.service.TablesService;
import com.github.pagehelper.PageInfo;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tables")
public class TablesController {

    @Resource
    TablesService tablesService;
    /*新增接口*/
    @PostMapping("/add")
    public Result add(@RequestBody Tables tables){
        tablesService.add(tables);
        return Result.success();
    }

    /*删除*/
    @DeleteMapping("/delete/{id}")
    public Result delete(@PathVariable Integer id){
        tablesService.deleteById(id);
        return Result.success();
    }

    /*批量删除*/
    @DeleteMapping("/delete/batch")
    public Result delete(@RequestBody List<Integer> ids){
        tablesService.deleteBatch(ids);
        return Result.success();
    }

    /*修改*/
    @PutMapping("/update")
    public Result update(@RequestBody Tables tables){
        tablesService.updateById(tables);
        return Result.success();
    }

    @PutMapping("/addOrder")
    public Result addOrder(@RequestBody Tables tables){
        tablesService.addOrder(tables);
        return Result.success();
    }

    @PutMapping("/removeOrder")
    public Result removeOrder(@RequestBody Tables tables){
        tablesService.removeOrder(tables);
        return Result.success();
    }

    /*单个查询*/
    @GetMapping("/selectById/{id}")
    public Result selectById(@PathVariable Integer id){
        Tables tables =tablesService.selectById(id);
        return Result.success(tables);
    }

    @GetMapping("/selectByUserId/{userId}")
    public Result selectByUserId(@PathVariable Integer userId){
        Tables tables =tablesService.selectByUserId(userId);
        return Result.success(tables);
    }

    /*全部查询*/
    @GetMapping("/selectAll")
    public Result selectAll(String no, String unit){
        if(no == "") no = null;
        if(unit == "") unit = null;
        List<Tables> list =tablesService.selectAll(no, unit);
        return Result.success(list);
    }

    /*分页查询*/
    @GetMapping("/selectPage")
    public Result selectPage(
            String no,
            String unit,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize){
        if(no == "") no = null;
        if(unit == "") unit = null;
        PageInfo<Tables> pageInfo=tablesService.selectPage(no,unit,pageNum,pageSize);
        return Result.success(pageInfo);
    }

    @PostMapping("/addUnit")
    public Result addType(@RequestBody TablesUnit unit){
        tablesService.addUnit(unit);
        return Result.success();
    }

    @GetMapping("/getUnit")
    public Result getType(){
        List<TablesUnit> unit = tablesService.getUnit();
        return Result.success(unit);
    }

    @DeleteMapping("/deleteUnit/{id}")
    public Result deleteType(@PathVariable Integer id){
        tablesService.deleteUnit(id);
        return Result.success();
    }
}
