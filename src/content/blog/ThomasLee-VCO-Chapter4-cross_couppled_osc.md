---
title: "Thomas H. Lee - 压控振荡器 - Chapter 4 负阻谐振器"
description: "很有用的振荡器理论'"
date: 2026-9-2
tags:
  - 控制
  - 物理
  - 集成电路
draft: false

typora-root-url: E:/play_work/personal-site/public
---

## 负阻谐振器

负阻谐振器这个概念大致是这么发展而来的：假设LC是无损的，那么只要给这个tank一个顺时的电压或电流变化，那它只靠电感跟电容之间的能量交换就能维持较为稳定的震荡。

也就是说想要产生一个震荡并没有那么困难，只要把LC产生的损耗抵消就好了，于是就产生了“负阻振荡器”这个概念，即用有源器件产生一个负电阻来起振。

<img
  src="/image/blog/Thomas_Lee/Chapter4/NRO.jpg"
  alt="NRO"
  style="width: 40%; display: block; margin: 1.5rem auto;"
/>

观察上面这个振荡器，从resonator看进去的阻抗是Z_in，简单分析输入阻抗大小：
$$
\begin{aligned}
&虚短：V_{out}=AV_{in}
\\&I_f = \frac{V_{in}-V_{out}}{Z_f}=\frac{(1-A)V_{in}}{Z_f}
\\&Z_{in}=\frac{V_{in}}{I_f}=\frac{Z_f}{1-A}
\end{aligned}
$$
这时候只要A大于1就能实现所谓的负阻抗。

然而这种结构实际上一点也不实用，因为运放存在压摆率这个问题，假如压摆率过低大信号的变化速度会被局限住，因此做不了太高频率的振荡电路。

比较实用的思路还是管子比较少的，因为到了射频管子越多寄生就越多，就越容易出现压摆率这样的问题，这里比较有效的思路是利用共栅极在栅极串联电感能产生一个实部来制造负阻：

<img
  src="/image/blog/Thomas_Lee/Chapter4/CRFNR.jpg"
  alt="CRFNR"
  style="width: 40%; display: block; margin: 1.5rem auto;"
/>

首先要考虑到前馈电容C_gs，这样才能有一个反馈通路，这里只给出Z_in的算法而不详细分析了：
$$
\begin{aligned}
&Z_{in} = \frac{V_s}{I_s}
\\&I_s =(V_s-V_g)(sC_{gs}+g_m)
\\G端KCL：&(V_s-V_g)sC_{gs}=\frac{V_g}{sL}→V_g = \frac{s^2LC_{gs}}{1+s^2LC_{gs}}V_s
\\代入：&I_s = \frac{sC_{gs}+g_m}{1+s^2LC_{gs}}V_s
\\代入：&Z_{in}=\frac{1+s^2LC_{gs}}{sC_{gs}+g_m}=\frac{1-ω^2LC_{gs}}{jωC_{gs}+g_m}
\\上下乘分母共轭算实部：&R_{in}=\frac{g_m(1-ω^2LC_{gs})}{g_m^2+ω^2C_{gs}^2}
\end{aligned}
$$
可以发现当频率大于L与C_gs的谐振频率时阻抗是负数。

<img
  src="/image/blog/Thomas_Lee/Chapter4/Cross_coupled.jpg"
  alt="Cross_coupled"
  style="width: 40%; display: block; margin: 1.5rem auto;"
/>

比较常用的手段会采取这种被称为交叉耦合对（Cross-coupled）的结构，老规矩还是先分析电路，很显然上面的LC是构成谐振腔的，分析震荡主要分析下方的差分耦合对

由于是差分电路，先做差模等效：

<div style="text-align: center;">
在差分对两端接一个电压源，假设电压左端为正记为1，右端为负记为2
</div>

$$
\begin{aligned}
\\令左侧：&v_1=\frac{v_d}{2}
\\右侧：&v_2=\frac{-v_d}{2}
\\故：&v_{g1} = v_2 = \frac{-v_d}{2}
\\&v_{g2} = v_1 = \frac{v_d}{2}
\\因此&i_{d1}=g_mv_{gs1}=g_m(v_{g1}-v_{s1})=\frac{-g_mv_d}{2}
\\同理&i_{d2}=g_mv_{gs2}=g_m(v_{g2}-v_{s2})=\frac{g_mv_d}{2}
\\则&Z_{out}=\frac{v_1-v_2}{i_t}=\frac{v_{d}}{i_{d1}}=-\frac{2}{g_m}
\\半边等效的话就是&Z=-\frac{1}{g_m}
\end{aligned}
$$

非常漂亮的结论，只要改晶体管的跨导就可以调控负阻大小，极为方便，与此同时由于是差分电路，天生不包含偶次谐波，频谱的纯净度也很好，

<img
  src="/image/blog/Thomas_Lee/Chapter4/CLPCross_coupled.jpg"
  alt="CLPCross_coupled.jpg"
  style="width: 40%; display: block; margin: 1.5rem auto;"
/>

基于差分耦合对跟Clap电路还能改造出如上图这样子的摆幅更大的电路，原理已经在上一章介绍过，看半边电路等效图倒是能看出来是Clap结构。它原文中说这是个抽头结构，但我怎么想也想不出来要怎么在差分电路中做这个抽头电感，问AI得到的答案是他就这么一说，实际上还是用两个电感两个电容实现的，如果真是这样似乎有些不值，比较电感占据面积还挺大的。

只要把电容换成可变电容，这就是一个VCO了，也就是可以调谐的振荡器，不过由于可变电容的Q值较低，一般只做5%-10%的范围（但我上次做达到了25%左右Q值也还可以，应该是技术进步了）。

最后实际上任何振荡器本质上都是“负阻振荡器”，它只是一个概念，只不过前面以前章节那些电路的来源并不是根据这个负阻理论设计的罢了。
