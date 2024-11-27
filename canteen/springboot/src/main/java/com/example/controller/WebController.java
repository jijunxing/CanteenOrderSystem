package com.example.controller;

import com.example.common.Result;
import com.example.common.RoleEnum;
import com.example.entity.Account;
import com.example.entity.Admin;
import com.example.entity.User;
import com.example.service.AdminService;
import com.example.service.UserService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

@RestController
public class WebController {

    @Resource
    AdminService adminService;

    @Resource
    UserService userService;
    /**
     * 默认请求接口
     */
    @GetMapping("/")
    public Result hello() {
        return Result.success();
    }

    @PostMapping("/login")
    public Result login(@RequestBody Account account) {
        if(RoleEnum.ADMIN.name().equals(account.getRole())) {
            account = adminService.login(account);
        } else if (RoleEnum.USER.name().equals(account.getRole())) {
            account = userService.login(account);
        }else{
            return Result.error("您的参数输入错误");
        }
        return Result.success(account);
    }

    @PostMapping("/register")
    public Result register(@RequestBody User user) {
        if(RoleEnum.USER.name().equals(user.getRole())) {
            userService.register(user);
        } else {
            return Result.error("您的参数输入错误");
        }
        return Result.success();
    }
}
