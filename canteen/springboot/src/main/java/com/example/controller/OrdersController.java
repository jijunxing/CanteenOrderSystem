package com.example.controller;

import com.example.common.Result;
import com.example.entity.Orders;
import com.example.service.OrdersService;
import com.github.pagehelper.PageInfo;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrdersController {

    @Resource
    OrdersService ordersService;
    /*新增接口*/
    @PostMapping("/add")
    public Result add(@RequestBody Orders orders){
        ordersService.add(orders);
        return Result.success();
    }

    /*删除*/
    @DeleteMapping("/delete/{id}")
    public Result delete(@PathVariable Integer id){
        ordersService.deleteById(id);
        return Result.success();
    }

    /*批量删除*/
    @DeleteMapping("/delete/batch")
    public Result delete(@RequestBody List<Integer> ids){
        ordersService.deleteBatch(ids);
        return Result.success();
    }

    /*修改*/
    @PutMapping("/update")
    public Result update(@RequestBody Orders orders){
        ordersService.updateById(orders);
        return Result.success();
    }


    /*单个查询*/
    @GetMapping("/selectById/{id}")
    public Result selectById(@PathVariable Integer id){
        Orders orders =ordersService.selectById(id);
        return Result.success(orders);
    }


    /*全部查询*/
    @GetMapping("/selectAll")
    public Result selectAll(String name, String status){
        if(name==""){name=null;}
        if(status==""){status=null;}
        List<Orders> list =ordersService.selectAll(name,status);
        return Result.success(list);
    }

    /*分页查询*/
    @GetMapping("/selectPage")
    public Result selectPage(
            String name,
            String status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize){
        System.out.println(name);
        System.out.println(status);
        if(name==""){name=null;}
        if(status==""){status=null;}
        PageInfo<Orders> pageInfo=ordersService.selectPage(name,status,pageNum,pageSize);
        return Result.success(pageInfo);
    }

    @GetMapping("/getNumByDate")
    public Result getNumByDate(@RequestParam String date){
        System.out.println("controller"+date);
        Integer todayNum = ordersService.getNumByDate(date);
        return Result.success(todayNum);
    }

    @GetMapping("/getUnfinishedNum")
    public Result getUnfinishedNum(){
        Integer UnfinishedNum = ordersService.getUnfinishedNum();
        return Result.success(UnfinishedNum);
    }

    @GetMapping("/getIncomeByDate")
    public Result getIncomeByDate(@RequestParam String date){
        System.out.println("controller"+date);
        BigDecimal todayIncome = ordersService.getIncomeByDate(date);
        return Result.success(todayIncome);
    }
}
