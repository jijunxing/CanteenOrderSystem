package com.example.service;

import cn.hutool.core.util.ObjectUtil;
import com.example.common.RoleEnum;
import com.example.entity.Account;
import com.example.entity.Admin;
import com.example.exception.CustomException;
import com.example.mapper.AdminMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService {

    @Resource
    AdminMapper adminMapper;

    public Account login(Account account) {
        String username = account.getUsername();
        //根据账号查询数据
        Admin dbAdmin = adminMapper.selectByUsername(username);
        if(dbAdmin == null) {
            throw new CustomException("账号不存在");
        }
        //校验密码
        if(!dbAdmin.getPassword().equals(account.getPassword())){
            throw new CustomException("账号或密码错误");
        }
        return dbAdmin;
    }

    public void add(Admin admin) {
        Admin dbAdmin = adminMapper.selectByUsername(admin.getUsername());
        if(dbAdmin != null) {
            throw new CustomException("账号已存在");
        }
        if(ObjectUtil.isEmpty(admin.getPassword())) {
            admin.setPassword("admin"); //默认密码
        }
        if(ObjectUtil.isEmpty(admin.getName())) {
            admin.setName(admin.getUsername());
        }
        admin.setRole(RoleEnum.ADMIN.name());
        adminMapper.insert(admin);
    }

    public void deleteById(Integer id) {
        adminMapper.deleteById(id);
    }

    public void deleteBatch(List<Integer> ids) {
        for (Integer id : ids) {
            this.deleteById(id);
        }
    }

    public void updateById(Admin admin) {
        adminMapper.updateById(admin);
    }

    public Admin selectById(Integer id) {
        return adminMapper.selectById(id);
    }

    public List<Admin> selectAll(String name) {
        return adminMapper.selectAll(name);
    }

    public PageInfo<Admin> selectPage(String name, Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<Admin> list=this.selectAll(name);
        return PageInfo.of(list);
    }
}
