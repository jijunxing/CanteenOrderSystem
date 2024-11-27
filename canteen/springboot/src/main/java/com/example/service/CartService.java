package com.example.service;

import com.example.entity.Cart;
import com.example.mapper.CartMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Resource
    CartMapper cartMapper;

    public void add(Cart cart) {
//        Cart dbCart = cartMapper.selectByCartNo(cart.getNo());
//        if(dbCart != null) {
//            throw new CustomException("餐桌已存在");
//        }
        cartMapper.insert(cart);
    }

    public void deleteById(Integer id) {
        cartMapper.deleteById(id);
    }

    public void deleteBatch(List<Integer> ids) {
        for (Integer id : ids) {
            this.deleteById(id);
        }
    }

    public void updateById(Cart cart) {
        cartMapper.updateById(cart);
    }

    public Cart selectById(Integer id) {
        return cartMapper.selectById(id);
    }

    public List<Cart> selectAll(String name) {
        return cartMapper.selectAll(name);
    }

    public PageInfo<Cart> selectPage(String name, Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<Cart> list=this.selectAll(name);
        return PageInfo.of(list);
    }

}
