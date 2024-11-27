package com.example.service;

import cn.hutool.core.date.DateUtil;
import com.example.entity.Orders;
import com.example.mapper.OrdersMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Random;

@Service
public class OrdersService {

    @Resource
    OrdersMapper ordersMapper;

    public void add(Orders orders) {
        String curTime = DateUtil.format(new Date(),"yyyyMMddHHmmss");
        Random random = new Random();
        int x = random.nextInt(10);
        int y = random.nextInt(10);
        String orderNo = "80" + x + y + curTime;
        orders.setOrderNo(orderNo);
        orders.setTime(DateUtil.format(new Date(),"yyyy-MM-dd HH:mm:ss"));
        ordersMapper.insert(orders);
    }

    public void deleteById(Integer id) {
        ordersMapper.deleteById(id);
    }

    public void deleteBatch(List<Integer> ids) {
        for (Integer id : ids) {
            this.deleteById(id);
        }
    }

    public void updateById(Orders orders) {
        ordersMapper.updateById(orders);
    }

    public Orders selectById(Integer id) {
        return ordersMapper.selectById(id);
    }

    public List<Orders> selectAll(String name) {
        return ordersMapper.selectAll(name);
    }

    public PageInfo<Orders> selectPage(String name, Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<Orders> list=this.selectAll(name);
        return PageInfo.of(list);
    }

}