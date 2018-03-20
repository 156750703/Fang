# Fang
棋类游戏：五方棋。
=====
棋局5个纵横，黑白两方。
    
游戏分三步：
----

1、落子
----
双方交替落子，直到25个位置落满。
落子过程如果成型(五通，四斜，斜，方，匹林共5种类型)，就可以相应多落若干子。
五通就是最大的两个对角线都是一样的子，四斜四个斜方向同样的子，斜就是三个。五通、四斜又叫大道、二道。
五通、四斜、斜两头都必须是在最边上的，所以五通最多会出现两个，四斜最多4个，斜最多4个。
方就是任意一个方块的四个子是同样的，这个就多了。
匹林就是连着一条横线或竖线5个同样的子。
五通可多下3个子，匹林和四斜可以多下2个子，方和斜可以多下1个子。
举例：<br>
五通（一代表空）<br>
黑一一一一&nbsp;&nbsp;&nbsp;&nbsp;一一一一黑<br>
一黑一一一&nbsp;&nbsp;&nbsp;&nbsp;一一一黑一<br>
一一黑一一&nbsp;&nbsp;&nbsp;&nbsp;一一黑一一<br>
一一一黑一&nbsp;&nbsp;&nbsp;&nbsp;一黑一一一<br>
一一一一黑&nbsp;&nbsp;&nbsp;&nbsp;黑一一一一<br>

四斜<br>
一黑一一一&nbsp;&nbsp;&nbsp;&nbsp;一一一黑一&nbsp;&nbsp;&nbsp;&nbsp;一一一一一&nbsp;&nbsp;&nbsp;&nbsp;一一一一一<br>
一一黑一一&nbsp;&nbsp;&nbsp;&nbsp;一一黑一一&nbsp;&nbsp;&nbsp;&nbsp;黑一一一一&nbsp;&nbsp;&nbsp;&nbsp;一一一一黑<br>
一一一黑一&nbsp;&nbsp;&nbsp;&nbsp;一黑一一一&nbsp;&nbsp;&nbsp;&nbsp;一黑一一一&nbsp;&nbsp;&nbsp;&nbsp;一一一黑一<br>
一一一一黑&nbsp;&nbsp;&nbsp;&nbsp;黑一一一一&nbsp;&nbsp;&nbsp;&nbsp;一一黑一一&nbsp;&nbsp;&nbsp;&nbsp;一一黑一一<br>
一一一一一&nbsp;&nbsp;&nbsp;&nbsp;一一一一一&nbsp;&nbsp;&nbsp;&nbsp;一一一黑一&nbsp;&nbsp;&nbsp;&nbsp;一黑一一一<br>

斜<br>
一一黑一一&nbsp;&nbsp;&nbsp;&nbsp;一一黑一一&nbsp;&nbsp;&nbsp;&nbsp;一一一一一&nbsp;&nbsp;&nbsp;&nbsp;一一一一一<br>
一一一黑一&nbsp;&nbsp;&nbsp;&nbsp;一黑一一一&nbsp;&nbsp;&nbsp;&nbsp;一一一一一&nbsp;&nbsp;&nbsp;&nbsp;一一一一一<br>
一一一一黑&nbsp;&nbsp;&nbsp;&nbsp;黑一一一一&nbsp;&nbsp;&nbsp;&nbsp;黑一一一一&nbsp;&nbsp;&nbsp;&nbsp;一一一一黑<br>
一一一一一&nbsp;&nbsp;&nbsp;&nbsp;一一一一一&nbsp;&nbsp;&nbsp;&nbsp;一黑一一一&nbsp;&nbsp;&nbsp;&nbsp;一一一黑一<br>
一一一一一&nbsp;&nbsp;&nbsp;&nbsp;一一一一一&nbsp;&nbsp;&nbsp;&nbsp;一一黑一一&nbsp;&nbsp;&nbsp;&nbsp;一一黑一一<br>

方（这个太多，只举一例）<br>
一黑黑一一<br>
一黑黑一一<br>
一一一一一<br>
一一一一一<br>
一一一一一<br>

匹林（只举两例）<br>
一一一一一&nbsp;&nbsp;&nbsp;&nbsp;一一一黑一<br>
一一一一一&nbsp;&nbsp;&nbsp;&nbsp;一一一黑一<br>
黑黑黑黑黑&nbsp;&nbsp;&nbsp;&nbsp;一一一黑一<br>
一一一一一&nbsp;&nbsp;&nbsp;&nbsp;一一一黑一<br>
一一一一一&nbsp;&nbsp;&nbsp;&nbsp;一一一黑一<br>

2、吃子
---
每人吃对方一个子，最后一个落子者后吃。<br>


3、走棋
---
吃子后就空出来两个位置，就可以拿棋盘上的其他子往这些空的位置上走，如果走到空的位置上与自己的其他子成型了（成型规则如上）。<br>
那么就可以吃对方相应数量的子，吃完后，轮到对方走子，这样依次交替。<br>
某一方不能连续在一个位置成同一种型（就是不要拿一个子在一个位置来回晃来成型）。<br>


4、如果某一方没有子了，则这一方就输了 
---
一方没有子可用，游戏结束，对方胜利。
