---
title: "Thomas H. Lee - 压控振荡器 - Chapter 3 其它谐振器"
description: "很奇妙但没什么用的'过去式振荡器'"
date: 2026-08-31
tags:
  - 控制
  - 物理
  - 集成电路
draft: false

typora-root-url: E:/play_work/personal-site/public
---

## Colpitts振荡器的衍生

上一章讲了Colpitts振荡器，结构实际上非常简单，就是靠电容分压引入正反馈，也因此在历史上产生了不少衍生。不过纵观下来我感觉都是没什么用的结构，就随便写写吧。

<img
  src="/image/blog/Thomas_Lee/Chapter3/co_gate_Colpitts.jpg"
  alt="co_gate_Colpitts"
  style="width: 40%; display: block; margin: 1.5rem auto;"
/>

本图展示的是共栅结构（源极跟随器）的Colpitts振荡器，另外理所当然地，共漏结构也是允许的。

<img
  src="/image/blog/Thomas_Lee/Chapter3/Hartley_osc.jpg"
  alt="Hartley_osc"
  style="width: 40%; display: block; margin: 1.5rem auto;"
/>

本图是Hartley振荡器，这种振荡器喜欢用人名来命名真的ex（），这个结构其实就是把分压结构由电容换成了电感，抽头电感在RFIC领域还是比较常用的，其实这个结构据说应用要比Colpitts还要早；此外还出现过抽头电阻的结构，但不太实用因此也没有人宣称自己发明了这玩意。

<img
  src="/image/blog/Thomas_Lee/Chapter3/Clap_osc.jpg"
  alt="Clap_osc"
  style="width: 40%; display: block; margin: 1.5rem auto;"
/>

这个结构叫做Clapp振荡器，我觉得实用性要比前面两个强多了（），它看上去是在电感支路加了个电容，然而这样做可以让电感两侧的电压摆幅比mos管两端电压摆幅更高。我们都知道，MOS管的电压摆幅是很需要设计的，它决定着v_dsat，g_m，i_d等等，然而摆幅大了功耗等等也会跟着变差，这是折中设计的一环，而为了驱动后级，输出摆幅一般是有要求的，所以说电感两侧的摆幅提高真的很重要。

那它是怎么做到的呢？其实这个设计需要让LC串联支路的C（简记为C_3）远大于并联的电容分压支路的总电容，因此在谐振的时候能近似等效成L与C_3谐振，这样的好处是L与C_3相位近似相反，所以在外部看是二者两侧电压相互抵消的值，即：
$$
V_{MOS} = V_{C3}-V_{L}
$$
发现没有，这个公式意味着只要V_C3与V_L接近，它们想多大就能多大，然而实际上要遵循物理规则，最大值差不多是：
$$
|V_{L}|\sim{QV_{MOS}}
$$
当然一般也达不到这么大，不过确实能把输出的电压摆幅提高很多。

<img
  src="/image/blog/Thomas_Lee/Chapter3/TITO_osc.jpg"
  alt="TITO_osc"
  style="width: 40%; display: block; margin: 1.5rem auto;"
/>

上图是TITO（Tuned input-tuned output）振荡器（总算不是用人名命名的了），如其名称所示，其输入端与输出端各有一个谐振腔。这个振荡器不会震荡在两个谐振腔的任何一个谐振频率上，而是会在产生总共90°的相移的频率上（这个频率在谐振点以下，从而使谐振腔呈感性产生正相移），这是因为反馈路径的电容输出的电流相对于电压有90°的相移，所以为了满足正反馈两个谐振腔就自适应到了这个频率点上。

那可能就有人要问了，为什么colpitts不用考虑这个呢？这是因为colpitts的反馈支路本质上里用的是电容分压比，跟电流没关系，而电容的作用是让电流滞后于电压90°。

这个结构的作用其实是为了抵抗某些寄生产生的前馈路径（G-D），或者是一些结构可能会需要输入端跟输出端有其他的反馈通路，自由度比较高。然而我感觉这个真的很得不偿失，一方面面积会很大，因为用了两个电感，另一方面效果也不好，因为谐振腔如果不在谐振频率上震荡的话，谐振腔的等效阻抗会降低，也就是负载电阻降低，这会降低MOS的电压放大倍数。

<img
  src="/image/blog/Thomas_Lee/Chapter3/Pierce_osc.jpg"
  alt="Pierce_osc"
  style="width: 40%; display: block; margin: 1.5rem auto;"
/>

上图是皮尔斯晶体振荡器，这是这个系列文章第一次出现晶振，因为在我的领域应用的确不多，就大致说一下好了，晶振大致等效于一个电容C0并联上一个RLC串联支路，当谐振点略高于晶振的谐振频率时，晶振呈现感性，从而在实现电压的反馈为电路起到了电感的作用。

这个结构最大的优点就是没有电感，特别省地方，但是晶振最高好像只有50MHz的，频率太低了，一般还是用在模拟领域。

书上剩下的结构我感觉实用性跟说头都有点少，下面就只展示电路图而不分析了，本文也就到此为止：

<img
  src="/image/blog/Thomas_Lee/Chapter3/CC_osc.jpg"
  alt="CC_osc"
  style="width: 40%; display: block; margin: 1.5rem auto;"
/>

<img
  src="/image/blog/Thomas_Lee/Chapter3/MCC_osc.jpg"
  alt="MCC_osc"
  style="width: 40%; display: block; margin: 1.5rem auto;"
/>

<img
  src="/image/blog/Thomas_Lee/Chapter3/Quadrature_osc.jpg"
  alt="Quadrature_osc"
  style="width: 40%; display: block; margin: 1.5rem auto;"
/>