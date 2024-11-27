package com.example.service;

import cn.hutool.core.util.ObjectUtil;
import com.example.common.RoleEnum;
import com.example.entity.Account;
import com.example.entity.Admin;
import com.example.entity.User;
import com.example.exception.CustomException;
import com.example.mapper.UserMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Resource
    UserMapper userMapper;

    public Account login(Account account) {
        String username = account.getUsername();
        //根据账号查询数据
        User dbUser = userMapper.selectByUsername(username);
        if(dbUser == null) {
            throw new CustomException("账号不存在");
        }
        //校验密码
        if(!dbUser.getPassword().equals(account.getPassword())){
            throw new CustomException("账号或密码错误");
        }
        return dbUser;
    }

    //往数据库添加数据
    public void register(User user) {
        //校验用户账号是否存在
        User dbUser = userMapper.selectByUsername(user.getUsername());
        if(dbUser != null) {
            throw new CustomException("账号已存在");
        }
        //校验密码是否为空
        if(ObjectUtil.isEmpty(user.getPassword())) {
            throw new CustomException("密码不能为空");
        }
        if(ObjectUtil.isEmpty(user.getName())) {
            user.setName(user.getUsername()); //设置用户的名称为账号名称
        }
        user.setRole(RoleEnum.USER.name());
        userMapper.insert(user);
    }

    public void add(User user) {
        User dbUser = userMapper.selectByUsername(user.getUsername());
        if(dbUser != null) {
            throw new CustomException("账号已存在");
        }
        if(ObjectUtil.isEmpty(user.getPassword())) {
            user.setPassword("123"); //默认密码
        }
        if(ObjectUtil.isEmpty(user.getName())) {
            user.setName(user.getUsername());
        }
        user.setRole(RoleEnum.USER.name());
        userMapper.insert(user);
    }

    public void deleteById(Integer id) {
        userMapper.deleteById(id);
    }

    public void deleteBatch(List<Integer> ids) {
        for (Integer id : ids) {
            this.deleteById(id);
        }
    }

    public void updateById(User user) {
        userMapper.updateById(user);
    }

    public User selectById(Integer id) {
        return userMapper.selectById(id);
    }

    public List<User> selectAll(String name) {
        return userMapper.selectAll(name);
    }

    public PageInfo<User> selectPage(String name, Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<User> list=this.selectAll(name);
        return PageInfo.of(list);
    }
}
