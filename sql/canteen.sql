/*
 Navicat Premium Data Transfer

 Source Server         :  local
 Source Server Type    : MySQL
 Source Server Version : 50724
 Source Host           : localhost:3306
 Source Schema         : canteen

 Target Server Type    : MySQL
 Target Server Version : 50724
 File Encoding         : 65001

 Date: 14/12/2024 21:12:35
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '账号',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '密码',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '名称',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '头像',
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '角色',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '管理员' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES (1, 'admin', '123', 'Mike Delfino', 'http://localhost:9090/files/download/dlam.jpg', 'ADMIN');
INSERT INTO `admin` VALUES (2, 'admin1', 'admin', '管理员1', 'http://localhost:9090/files/download/pkq.jpg', 'ADMIN');
INSERT INTO `admin` VALUES (3, 'admin2', 'admin', '管理员2', 'http://localhost:9090/files/download/pet.jpg', 'ADMIN');
INSERT INTO `admin` VALUES (4, 'admin3', 'admin', '管理员3', 'http://localhost:9090/files/download/cat.jpg', 'ADMIN');
INSERT INTO `admin` VALUES (5, 'admin4', 'admin', '管理员4', 'http://localhost:9090/files/download/girl.jpg', 'ADMIN');
INSERT INTO `admin` VALUES (6, 'admin5', 'admin', '管理员5', 'http://localhost:9090/files/download/sunset.jpg', 'ADMIN');
INSERT INTO `admin` VALUES (10, 'admin6', 'admin', 'hhh', 'http://localhost:9090/files/download/rose.jpg', 'ADMIN');

-- ----------------------------
-- Table structure for cart
-- ----------------------------
DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` int(11) NULL DEFAULT NULL COMMENT '用户ID',
  `foods_id` int(11) NULL DEFAULT NULL COMMENT '菜品ID',
  `quantity` int(11) NULL DEFAULT NULL COMMENT '菜品数量',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `cart_user`(`user_id`) USING BTREE,
  INDEX `cart_dish`(`foods_id`) USING BTREE,
  CONSTRAINT `cart_dish` FOREIGN KEY (`foods_id`) REFERENCES `foods` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `cart_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 142 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cart
-- ----------------------------
INSERT INTO `cart` VALUES (135, 1, 1, 1);
INSERT INTO `cart` VALUES (136, 1, 2, 1);
INSERT INTO `cart` VALUES (137, 1, 3, 3);

-- ----------------------------
-- Table structure for foods
-- ----------------------------
DROP TABLE IF EXISTS `foods`;
CREATE TABLE `foods`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '名称',
  `descr` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '餐品简介',
  `price` decimal(10, 2) NULL DEFAULT NULL COMMENT '价格',
  `img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '图片',
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '菜品类别',
  `sales` int(11) UNSIGNED NULL DEFAULT NULL COMMENT '销售量',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of foods
-- ----------------------------
INSERT INTO `foods` VALUES (1, '番茄滑肉煲', '冬天最爱这样有肉有菜的一锅煮🍲， 浓郁的番茄🍅汤汁，肉片超级嫩滑，好鲜美， 热乎乎炖上一锅，酸爽开胃，吃完浑身都暖了~', 29.00, 'http://localhost:9090/files/download/联想截图_20241124020528.png', '汤菜', 16);
INSERT INTO `foods` VALUES (2, '米饭', '香香糯糯的白米饭🍚', 2.00, 'http://localhost:9090/files/download/rice.jpg', '主食', 43);
INSERT INTO `foods` VALUES (3, '糖醋排骨', '餐桌至爱当属这经典糖醋排骨🥩， 鲜亮的糖醋酱汁，排骨外酥里嫩，好诱人， 美滋滋盛上一盘，酸甜可口，尝罢唇齿皆香。', 35.00, 'http://localhost:9090/files/download/3.jpg', '炖菜', 8);
INSERT INTO `foods` VALUES (4, '酸辣土豆丝', '酸辣的调味汁水，土豆丝根根分明且爽利，好过瘾， 热腾腾端上一碟，酸辣劲爽，入口味蕾欢腾。', 12.00, 'http://localhost:9090/files/download/4.png', '炒菜', 5);
INSERT INTO `foods` VALUES (5, '鱼香肉丝', '川菜经典当属这风味独特的鱼香肉丝🥗， 浓郁的鱼香酱汁，肉丝软嫩配菜爽脆，好下饭， 热腾腾端上一盘，咸甜酸辣，入口滋味交融。', 22.00, 'http://localhost:9090/files/download/5.png', '炒菜', 13);
INSERT INTO `foods` VALUES (6, '仔姜焖鸭', '选用鲜嫩肥美的鸭肉，与足量的仔姜一同焖制。鸭肉在锅中煸炒至表皮微微金黄，锁住肉香，随后与仔姜的辛香相互交融。仔姜那独特的鲜辣气息渗透进鸭肉的每一丝纹理，每一口鸭肉都紧实有嚼劲，伴随着恰到好处的辣味刺激，让味蕾瞬间被激活。', 32.00, 'http://localhost:9090/files/download/4.jpg', '炒菜', 12);
INSERT INTO `foods` VALUES (9, '红烧肉', '一道著名的大众菜肴，肥瘦相间，肥而不腻，香甜松软，营养丰富，入口即化。', 40.00, 'http://localhost:9090/files/download/th.jpg', '炖菜', 0);
INSERT INTO `foods` VALUES (10, '烧白', '烧白，四川地区（四川省、重庆市）的一道特色菜，是具有浓郁乡土特色的民间四川菜，有咸和甜两种口味。烧白里的干菜吸收了猪肉的油脂 ，变得柔软又好吃 ，五花肉则变得香而不腻 。', 40.00, 'http://localhost:9090/files/download/ak.jpg', '炖菜', 0);
INSERT INTO `foods` VALUES (11, '豆角茄子', '豆角烧茄子是一道非常受欢迎的家常菜，其鲜香的口感和丰富的营养使其成为了餐桌上的常客。', 18.00, 'http://localhost:9090/files/download/OIP-C.jpg', '炒菜', 0);
INSERT INTO `foods` VALUES (12, '炒白菜', '富含维生素的健康新鲜的时蔬', 12.00, 'http://localhost:9090/files/download/th_1734173692051.jpg', '炒菜', 1);
INSERT INTO `foods` VALUES (13, '肉丝炒面', '炒面是流行于大江南北的中国传统小吃，制作原料主要有面条、鸡蛋、肉丝、小油菜、葱段等，口味鲜美，营养丰富。', 14.00, 'http://localhost:9090/files/download/111.jpg', '主食', 1);
INSERT INTO `foods` VALUES (14, '蘸饺', '传统美食，当天手工制作的鲜肉饺', 15.00, 'http://localhost:9090/files/download/th_1734173916011.jpg', '主食', 0);
INSERT INTO `foods` VALUES (15, '鲜榨橙汁', '健康营养的鲜榨果汁', 10.00, 'http://localhost:9090/files/download/juice_1734173962084.jpg', '饮料', 1);

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `content` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '菜单内容',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `total` decimal(10, 0) NULL DEFAULT NULL COMMENT '总价',
  `user_id` int(11) NULL DEFAULT NULL COMMENT '点餐人',
  `time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '点餐时间',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '订单状态',
  `order_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '订单编号',
  `table_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '桌号',
  `comments` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL COMMENT '用户评价',
  `response` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '商家回复',
  `score` double(2, 1) NULL DEFAULT NULL COMMENT '评分',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `order_user`(`user_id`) USING BTREE,
  INDEX `order_tables`(`table_no`) USING BTREE,
  CONSTRAINT `order_tables` FOREIGN KEY (`table_no`) REFERENCES `tables` (`no`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `order_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 42 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '订单信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of orders
-- ----------------------------
INSERT INTO `orders` VALUES (2, '番茄滑肉煲x1, 米饭x2, 酸辣土豆丝x1, 鱼香肉丝x1', '无', 67, 1, '2024-11-25 00:02:19', '待评价', '808520241125000219', 'A101', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (5, '番茄滑肉煲x1，米饭x3，酸辣土豆丝x1，鱼香肉丝x1', '不要辣椒', 69, 1, '2024-11-28 00:35:33', '待评价', '809820241128003533', 'A103', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (6, '番茄滑肉煲x5，米饭x3，糖醋排骨x2', '无', 221, 1, '2024-11-28 10:38:35', '待评价', '806320241128103835', 'A103', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (7, '番茄滑肉煲x5，米饭x3，糖醋排骨x1', '不要放葱', 186, 1, '2024-11-28 10:41:56', '待评价', '803020241128104156', 'A103', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (8, '番茄滑肉煲x1', '无', 29, 1, '2024-11-28 10:46:10', '待评价', '802920241128104610', 'A103', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (9, '番茄滑肉煲x1', '无', 29, 1, '2024-11-28 10:50:21', '待评价', '808120241128105021', 'A103', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (10, '番茄滑肉煲x1，米饭x4', '无', 37, 1, '2024-11-28 10:50:28', '待评价', '803420241128105028', 'A103', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (11, '米饭x3，糖醋排骨x1，鱼香肉丝x1，酸辣土豆丝x1', '无', 75, 2, '2024-11-30 15:08:44', '待评价', '808120241130150844', 'B103', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (12, '番茄滑肉煲x1，糖醋排骨x1，米饭x2', '无', 68, 3, '2024-11-30 15:54:26', '待评价', '804120241130155426', 'C101', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (13, '米饭x3，糖醋排骨x1，鱼香肉丝x1，酸辣土豆丝x1', '无', 75, 2, '2024-12-04 17:17:55', '待评价', '808220241204171755', 'A104', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (14, '鱼香肉丝x1，酸辣土豆丝x1，米饭x1', '多放辣椒', 36, 2, '2024-12-04 20:29:45', '待出餐', '803020241204202945', 'A104', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (15, '酸辣土豆丝x1，米饭x1，糖醋排骨x1', '无', 49, 2, '2024-12-04 20:36:05', '待出餐', '809120241204203605', 'A104', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (16, '酸辣土豆丝x1，米饭x1，糖醋排骨x1，番茄滑肉煲x1', '多加点醋', 78, 2, '2024-12-04 21:17:09', '已完成', '807420241204211709', 'D101', '好好好', NULL, 5.0);
INSERT INTO `orders` VALUES (17, '米饭x2', '无', 4, 2, '2024-12-05 19:22:20', '待出餐', '809620241205192220', 'D101', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (18, '番茄滑肉煲x1，酸辣土豆丝x1，米饭x2', '无', 45, 4, '2024-12-06 15:04:48', '待出餐', '805220241206150448', 'B103', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (19, '糖醋排骨x2，米饭x2', '无', 74, 4, '2024-12-06 15:11:43', '待出餐', '806620241206151143', 'B103', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (20, '番茄滑肉煲x1', '无', 29, 2, '2024-12-06 18:05:05', '待出餐', '808320241206180505', 'D101', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (21, '番茄滑肉煲x1', '无', 29, 2, '2024-12-06 18:06:03', '待出餐', '802420241206180603', 'D101', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (22, '米饭x1', '无', 2, 2, '2024-12-06 18:08:25', '待出餐', '808120241206180825', 'D101', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (23, '米饭x1', '无', 2, 2, '2024-12-06 18:08:31', '待出餐', '809120241206180831', 'D101', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (24, '番茄滑肉煲x1，米饭x1', '不要放蒜', 31, 3, '2024-12-06 18:38:30', '待出餐', '809620241206183830', 'C101', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (25, '米饭x1，糖醋排骨x1，酸辣土豆丝x1', '无', 49, 3, '2024-12-06 18:39:40', '待出餐', '801220241206183940', 'C101', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (26, '仔姜焖鸭x1，米饭x2，鱼香肉丝x1，酸辣土豆丝x1', '无', 70, 1, '2024-12-07 15:21:38', '待出餐', '800220241207152138', 'A103', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (27, '糖醋排骨x1，酸辣土豆丝x1，仔姜焖鸭x1，米饭x2', '无', 83, 4, '2024-12-07 15:35:18', '待出餐', '803620241207153518', 'B104', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (28, '番茄滑肉煲x1，米饭x2，糖醋排骨x1', '无', 68, 4, '2024-12-07 15:38:16', '待出餐', '808020241207153816', 'B104', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (29, '番茄滑肉煲x1，米饭x2，仔姜焖鸭x1，鱼香肉丝x1', '多打一点米饭谢谢', 87, 4, '2024-12-07 15:39:45', '待出餐', '806220241207153945', 'C104', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (30, '仔姜焖鸭x1，糖醋排骨x1，米饭x2', '无', 71, 1, '2024-12-07 15:45:10', '已完成', '803520241207154510', 'A103', '一般般', NULL, 2.0);
INSERT INTO `orders` VALUES (31, '仔姜焖鸭x1，鱼香肉丝x1，米饭x2', '鱼香肉丝多放调料', 58, 1, '2024-12-07 17:02:40', '待评价', '808220241207170240', 'A103', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (32, '番茄滑肉煲x1，米饭x2，仔姜焖鸭x1，酸辣土豆丝x1', '多放辣椒', 77, 1, '2024-12-09 21:52:52', '待评价', '803620241209215252', 'B104', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (35, '番茄滑肉煲x1，酸辣土豆丝x1，米饭x1', '土豆丝不要放葱花', 43, 2, '2024-12-11 14:19:17', '待评价', '808120241211141917', 'D101', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (36, '糖醋排骨x1，仔姜焖鸭x1，鱼香肉丝x1，米饭x2', '无', 93, 2, '2024-12-11 14:24:58', '待评价', '802820241211142458', 'D101', NULL, NULL, NULL);
INSERT INTO `orders` VALUES (37, '米饭x1，糖醋排骨x1，仔姜焖鸭x1', '无', 69, 3, '2024-12-11 14:26:59', '已完成', '800420241211142659', 'C101', '味道还可以', '谢谢支持，以后常来', 4.0);
INSERT INTO `orders` VALUES (38, '番茄滑肉煲x1，糖醋排骨x1，米饭x1', '无', 66, 3, '2024-12-11 14:29:04', '已完成', '808720241211142904', 'C101', '很难吃', '', 1.0);
INSERT INTO `orders` VALUES (39, '仔姜焖鸭x1，鱼香肉丝x1，米饭x1', '无', 56, 3, '2024-12-11 14:55:29', '待出餐', '802020241211145529', 'C101', NULL, NULL, 0.0);
INSERT INTO `orders` VALUES (41, '炒白菜x1，肉丝炒面x1，鲜榨橙汁x1，仔姜焖鸭x1', '无', 68, 2, '2024-12-14 19:02:14', '待出餐', '808020241214190214', 'D101', NULL, NULL, NULL);

-- ----------------------------
-- Table structure for tables
-- ----------------------------
DROP TABLE IF EXISTS `tables`;
CREATE TABLE `tables`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '餐桌号',
  `unit` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '规格',
  `free` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '是否空闲',
  `user_id` int(11) NULL DEFAULT NULL COMMENT '使用人ID',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `table_user`(`user_id`) USING BTREE,
  INDEX `no`(`no`) USING BTREE,
  CONSTRAINT `table_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '餐桌信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tables
-- ----------------------------
INSERT INTO `tables` VALUES (1, 'A101', '4人', '是', NULL);
INSERT INTO `tables` VALUES (2, 'A102', '4人', '是', NULL);
INSERT INTO `tables` VALUES (3, 'A103', '8人', '是', NULL);
INSERT INTO `tables` VALUES (4, 'A104', '8人', '否', 1);
INSERT INTO `tables` VALUES (5, 'B101', '2人', '是', NULL);
INSERT INTO `tables` VALUES (6, 'B102', '2人', '是', NULL);
INSERT INTO `tables` VALUES (7, 'B103', '4人', '是', NULL);
INSERT INTO `tables` VALUES (8, 'B104', '1人', '是', NULL);
INSERT INTO `tables` VALUES (9, 'B105', '4人', '是', NULL);
INSERT INTO `tables` VALUES (10, 'C101', '12人', '否', 3);
INSERT INTO `tables` VALUES (11, 'C102', '12人', '是', NULL);
INSERT INTO `tables` VALUES (12, 'C103', '8人', '是', NULL);
INSERT INTO `tables` VALUES (13, 'C104', '6人', '否', 4);
INSERT INTO `tables` VALUES (14, 'C105', '2人', '是', NULL);
INSERT INTO `tables` VALUES (15, 'D101', '1人', '否', 2);

-- ----------------------------
-- Table structure for type
-- ----------------------------
DROP TABLE IF EXISTS `type`;
CREATE TABLE `type`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `type`(`type`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of type
-- ----------------------------
INSERT INTO `type` VALUES (1, '主食');
INSERT INTO `type` VALUES (2, '汤菜');
INSERT INTO `type` VALUES (3, '炒菜');
INSERT INTO `type` VALUES (4, '炖菜');
INSERT INTO `type` VALUES (7, '饮料');

-- ----------------------------
-- Table structure for unit
-- ----------------------------
DROP TABLE IF EXISTS `unit`;
CREATE TABLE `unit`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unit` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of unit
-- ----------------------------
INSERT INTO `unit` VALUES (1, '1人');
INSERT INTO `unit` VALUES (2, '2人');
INSERT INTO `unit` VALUES (3, '4人');
INSERT INTO `unit` VALUES (4, '6人');
INSERT INTO `unit` VALUES (5, '8人');
INSERT INTO `unit` VALUES (6, '10人');
INSERT INTO `unit` VALUES (7, '12人');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '账号',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '密码',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '名称',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '头像',
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '角色',
  `sex` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '性别',
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '手机号',
  `account` decimal(10, 2) UNSIGNED ZEROFILL NULL DEFAULT 00000000.00 COMMENT '账户余额',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'zhoujuncai', '123', '周俊材', 'http://localhost:9090/files/download/afox.jpg', 'USER', '男', '15310633632', 00000252.00);
INSERT INTO `user` VALUES (2, 'wangjiarui', '250', '王佳睿', 'http://localhost:9090/files/download/haizeiwang.jpg', 'USER', '男', '12345678901', 00468953.00);
INSERT INTO `user` VALUES (3, 'libowen', '123', '李博文', 'http://localhost:9090/files/download/hmbb.jpg', 'USER', '女', '19950388137', 00000007.00);
INSERT INTO `user` VALUES (4, 'bvv', '123', '小白', 'http://localhost:9090/files/download/kenan_1732356218863.jpg', 'USER', '女', '1123', 00000188.00);

SET FOREIGN_KEY_CHECKS = 1;
