package com.example.controller;

import com.example.common.Result;
import com.example.entity.Cart;
import com.example.service.CartService;
import com.github.pagehelper.PageInfo;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Resource
    CartService cartService;
    /*新增接口*/
    @PostMapping("/add")
    public Result add(@RequestBody Cart cart){
        cartService.add(cart);
        return Result.success();
    }

    /*删除*/
    @DeleteMapping("/delete/{id}")
    public Result delete(@PathVariable Integer id){
        cartService.deleteById(id);
        return Result.success();
    }

    /*批量删除*/
    @DeleteMapping("/delete/batch")
    public Result delete(@RequestBody List<Integer> ids){
        cartService.deleteBatch(ids);
        return Result.success();
    }

    /*修改*/
    @PutMapping("/update")
    public Result update(@RequestBody Cart cart){
        cartService.updateById(cart);
        return Result.success();
    }


    /*单个查询*/
    @GetMapping("/selectById/{id}")
    public Result selectById(@PathVariable Integer id){
        Cart cart =cartService.selectById(id);
        return Result.success(cart);
    }


    /*全部查询*/
    @GetMapping("/selectAll/{name}")
    public Result selectAll(@PathVariable String name){
        System.out.println(name);
        List<Cart> list =cartService.selectAll(name);
        return Result.success(list);
    }

    /*分页查询*/
    @GetMapping("/selectPage")
    public Result selectPage(
            String name,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize){
        PageInfo<Cart> pageInfo=cartService.selectPage(name,pageNum,pageSize);
        return Result.success(pageInfo);
    }
}
