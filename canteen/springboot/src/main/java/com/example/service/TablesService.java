package com.example.service;

import com.example.entity.FoodsType;
import com.example.entity.Tables;
import com.example.entity.TablesUnit;
import com.example.exception.CustomException;
import com.example.mapper.TablesMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TablesService {

    @Resource
    TablesMapper tablesMapper;

    public void add(Tables tables) {
//        Tables dbTables = tablesMapper.selectByTablesNo(tables.getNo());
//        if(dbTables != null) {
//            throw new CustomException("餐桌已存在");
//        }
        tablesMapper.insert(tables);
    }

    public void deleteById(Integer id) {
        tablesMapper.deleteById(id);
    }

    public void deleteBatch(List<Integer> ids) {
        for (Integer id : ids) {
            this.deleteById(id);
        }
    }

    public void updateById(Tables tables) {
        //当管理员设置餐桌空闲时，设置user_id=null
        if("是".equals(tables.getFree()))
            tables.setUserId(null);
        tablesMapper.updateById(tables);
    }

    public Tables selectById(Integer id) {
        return tablesMapper.selectById(id);
    }

    public List<Tables> selectAll(String no, String unit) {
        return tablesMapper.selectAll(no,unit);
    }

    public PageInfo<Tables> selectPage(String no, String unit, Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<Tables> list=this.selectAll(no, unit);
        return PageInfo.of(list);
    }

    public void addOrder(Tables tables) {
        //先查询当前用户是否占用餐桌
        Tables daTables = tablesMapper.selectByUserId(tables.getUserId());
        if (daTables != null && !daTables.getId().equals(tables.getId())) {
            throw new CustomException("您已经预定了其他餐桌");
        }
        tables.setFree("否");
        this.updateById(tables);
    }

    public Tables selectByUserId(Integer userId) {
        return tablesMapper.selectByUserId(userId);
    }

    public void removeOrder(Tables tables) {
        tablesMapper.removeOrder(tables.getId());
    }

    public List<TablesUnit> getUnit() {
        return tablesMapper.getUnit();
    }

    public void deleteUnit(Integer id) {
        tablesMapper.deleteUnit(id);
    }

    public void addUnit(TablesUnit unit) { tablesMapper.addUnit(unit);
    }
}
